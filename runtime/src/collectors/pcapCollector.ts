import fs from "node:fs";

export interface PcapPacketEvidence {
  index: number;
  timestamp: string;
  capturedLength: number;
  originalLength: number;

  DESTINATION_MAC?: string;
  SOURCE_MAC?: string;
  ETHER_TYPE?: string;

  SOURCE_IP?: string;
  DESTINATION_IP?: string;
  IP_VERSION?: number;
  PROTOCOL?: string;

  SOURCE_PORT?: number;
  DESTINATION_PORT?: number;

  PACKET_LENGTH?: number;
}

export interface PcapEvidence {
  filePath: string;
  sizeBytes: number;
  sha256: string;
  packetCount: number;
  packets: PcapPacketEvidence[];
}

function readUInt16BE(
  buffer: Buffer,
  offset: number
): number {
  return buffer.readUInt16BE(offset);
}

function readUInt32BE(
  buffer: Buffer,
  offset: number
): number {
  return buffer.readUInt32BE(offset);
}

function readUInt32LE(
  buffer: Buffer,
  offset: number
): number {
  return buffer.readUInt32LE(offset);
}

function formatMac(
  buffer: Buffer,
  offset: number
): string {
  return Array.from(
    buffer.subarray(offset, offset + 6)
  )
    .map((value) =>
      value.toString(16).padStart(2, "0")
    )
    .join(":");
}

function formatIPv4(
  buffer: Buffer,
  offset: number
): string {
  return Array.from(
    buffer.subarray(offset, offset + 4)
  ).join(".");
}

function decodePacket(
  buffer: Buffer,
  offset: number,
  length: number
): Partial<PcapPacketEvidence> {
  const decoded: Partial<PcapPacketEvidence> = {
    PACKET_LENGTH: length
  };

  // Ethernet header requires at least 14 bytes.
  if (length < 14) {
    return decoded;
  }

  decoded.DESTINATION_MAC =
    formatMac(buffer, offset);

  decoded.SOURCE_MAC =
    formatMac(buffer, offset + 6);

  const etherType =
    readUInt16BE(buffer, offset + 12);

  decoded.ETHER_TYPE =
    `0x${etherType.toString(16).padStart(4, "0")}`;

  // IPv4
  if (etherType !== 0x0800) {
    return decoded;
  }

  const ipOffset = offset + 14;

  if (length < 34) {
    return decoded;
  }

  const versionAndHeader =
    buffer[ipOffset];

  const version =
    versionAndHeader >> 4;

  const headerLength =
    (versionAndHeader & 0x0f) * 4;

  decoded.IP_VERSION = version;

  if (
    version !== 4 ||
    headerLength < 20 ||
    length < 14 + headerLength
  ) {
    return decoded;
  }

  decoded.SOURCE_IP =
    formatIPv4(
      buffer,
      ipOffset + 12
    );

  decoded.DESTINATION_IP =
    formatIPv4(
      buffer,
      ipOffset + 16
    );

  const protocol =
    buffer[ipOffset + 9];

  if (protocol === 6) {
    decoded.PROTOCOL = "TCP";
  } else if (protocol === 17) {
    decoded.PROTOCOL = "UDP";
  } else if (protocol === 1) {
    decoded.PROTOCOL = "ICMP";
  } else {
    decoded.PROTOCOL =
      `IP_${protocol}`;
  }

  // TCP / UDP ports
  if (
    (protocol === 6 || protocol === 17) &&
    length >= 14 + headerLength + 4
  ) {
    const transportOffset =
      ipOffset + headerLength;

    decoded.SOURCE_PORT =
      readUInt16BE(
        buffer,
        transportOffset
      );

    decoded.DESTINATION_PORT =
      readUInt16BE(
        buffer,
        transportOffset + 2
      );
  }

  return decoded;
}

export async function collectPcap(
  filePath: string
): Promise<PcapEvidence> {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `PCAP file not found: ${filePath}`
    );
  }

  const buffer =
    await fs.promises.readFile(filePath);

  if (buffer.length < 24) {
    throw new Error(
      "Invalid PCAP file: header is incomplete."
    );
  }

  const magicBE =
    readUInt32BE(buffer, 0);

  const magicLE =
    readUInt32LE(buffer, 0);

  let littleEndian = false;

  if (
    magicBE === 0xa1b2c3d4 ||
    magicBE === 0xa1b23c4d
  ) {
    littleEndian = false;
  } else if (
    magicLE === 0xa1b2c3d4 ||
    magicLE === 0xa1b23c4d
  ) {
    littleEndian = true;
  } else {
    throw new Error(
      "Unsupported PCAP format. Expected a classic PCAP file."
    );
  }

  const read32 = (
    offset: number
  ): number =>
    littleEndian
      ? readUInt32LE(buffer, offset)
      : readUInt32BE(buffer, offset);

  const packets: PcapPacketEvidence[] = [];

  let offset = 24;

  while (
    offset + 16 <= buffer.length
  ) {
    const tsSec =
      read32(offset);

    const tsUsec =
      read32(offset + 4);

    const capturedLength =
      read32(offset + 8);

    const originalLength =
      read32(offset + 12);

    offset += 16;

    if (
      offset + capturedLength >
      buffer.length
    ) {
      throw new Error(
        "Invalid PCAP file: packet record exceeds file size."
      );
    }

    const packet: PcapPacketEvidence = {
      index: packets.length + 1,

      timestamp:
        new Date(
          tsSec * 1000 +
          Math.floor(
            tsUsec / 1000
          )
        ).toISOString(),

      capturedLength,

      originalLength,

      ...decodePacket(
        buffer,
        offset,
        capturedLength
      )
    };

    packets.push(packet);

    offset += capturedLength;
  }

  const crypto =
    await import("node:crypto");

  const sha256 =
    crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");

  return {
    filePath,
    sizeBytes: buffer.length,
    sha256,
    packetCount: packets.length,
    packets
  };
}
