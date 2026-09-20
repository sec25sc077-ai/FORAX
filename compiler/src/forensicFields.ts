export type ForensicFieldType =
  | "STRING"
  | "INTEGER"
  | "FLOAT"
  | "BOOLEAN"
  | "TIMESTAMP"
  | "IP_ADDRESS"
  | "MAC_ADDRESS"
  | "PORT"
  | "PROTOCOL"
  | "PACKET"
  | "PROCESS"
  | "FILE"
  | "USER"
  | "DEVICE"
  | "NETWORK_CONNECTION"
  | "FLOW"
  | "PCAP"
  | "HASH"
  | "EVIDENCE"
  | "TIMELINE"
  | "REPORT";

export interface ForensicFieldDefinition {
  field: string;
  type: ForensicFieldType;
  objects: string[];
  description: string;
}

export const FORENSIC_FIELDS: ForensicFieldDefinition[] = [
  {
    field: "INDEX",
    type: "INTEGER",
    objects: ["PACKET"],
    description: "Sequential packet index."
  },
  {
    field: "TIMESTAMP",
    type: "TIMESTAMP",
    objects: [
      "PACKET",
      "NETWORK_CONNECTION",
      "PROCESS",
      "FILE",
      "TIMELINE"
    ],
    description: "Evidence event timestamp."
  },
  {
    field: "CAPTURED_LENGTH",
    type: "INTEGER",
    objects: ["PACKET"],
    description: "Number of bytes captured for the packet."
  },
  {
    field: "ORIGINAL_LENGTH",
    type: "INTEGER",
    objects: ["PACKET"],
    description: "Original packet length reported by the capture."
  },
  {
    field: "PACKET_LENGTH",
    type: "INTEGER",
    objects: ["PACKET"],
    description: "Captured packet length."
  },
  {
    field: "DESTINATION_MAC",
    type: "MAC_ADDRESS",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Destination Ethernet MAC address."
  },
  {
    field: "SOURCE_MAC",
    type: "MAC_ADDRESS",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Source Ethernet MAC address."
  },
  {
    field: "ETHER_TYPE",
    type: "STRING",
    objects: ["PACKET"],
    description: "Ethernet frame type."
  },
  {
    field: "SOURCE_IP",
    type: "IP_ADDRESS",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Source IP address."
  },
  {
    field: "DESTINATION_IP",
    type: "IP_ADDRESS",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Destination IP address."
  },
  {
    field: "IP_VERSION",
    type: "INTEGER",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Internet Protocol version."
  },
  {
    field: "PROTOCOL",
    type: "PROTOCOL",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Network transport or control protocol."
  },
  {
    field: "SOURCE_PORT",
    type: "PORT",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Source transport-layer port."
  },
  {
    field: "DESTINATION_PORT",
    type: "PORT",
    objects: ["PACKET", "NETWORK_CONNECTION"],
    description: "Destination transport-layer port."
  },
  {
    field: "PID",
    type: "INTEGER",
    objects: ["PROCESS"],
    description: "Operating-system process identifier."
  },
  {
    field: "PARENT_PID",
    type: "INTEGER",
    objects: ["PROCESS"],
    description: "Parent operating-system process identifier."
  },
  {
    field: "PROCESS_NAME",
    type: "STRING",
    objects: ["PROCESS"],
    description: "Process executable or display name."
  },
  {
    field: "COMMAND_LINE",
    type: "STRING",
    objects: ["PROCESS"],
    description: "Process command line."
  },
  {
    field: "EXECUTABLE_PATH",
    type: "STRING",
    objects: ["PROCESS", "FILE"],
    description: "Executable or file path."
  },
  {
    field: "USERNAME",
    type: "STRING",
    objects: ["PROCESS", "USER"],
    description: "Associated operating-system username."
  },
  {
    field: "FILE_PATH",
    type: "STRING",
    objects: ["FILE"],
    description: "Filesystem path."
  },
  {
    field: "FILE_SIZE",
    type: "INTEGER",
    objects: ["FILE"],
    description: "File size in bytes."
  },
  {
    field: "SHA256",
    type: "HASH",
    objects: ["FILE", "EVIDENCE", "PCAP"],
    description: "SHA-256 cryptographic hash."
  },
  {
    field: "HOSTNAME",
    type: "STRING",
    objects: ["DEVICE", "NETWORK_CONNECTION"],
    description: "Host or device name."
  },
  {
    field: "STATUS",
    type: "STRING",
    objects: [
      "PROCESS",
      "FILE",
      "NETWORK_CONNECTION",
      "DEVICE"
    ],
    description: "Current or observed status."
  },
  {
    field: "SOURCE",
    type: "STRING",
    objects: ["TIMELINE"],
    description: "Evidence source that produced the timeline event."
  },
  {
    field: "EVENT_TYPE",
    type: "STRING",
    objects: ["TIMELINE"],
    description: "Canonical type of timeline event."
  }
];
export function getForensicField(
  field: string
): ForensicFieldDefinition | undefined {
  const normalized = field.toUpperCase();

  return FORENSIC_FIELDS.find(
    (definition) =>
      definition.field === normalized
  );
}

export function getFieldsForObject(
  object: string
): ForensicFieldDefinition[] {
  const normalized = object.toUpperCase();

  return FORENSIC_FIELDS.filter(
    (definition) =>
      definition.objects.includes(normalized)
  );
}



