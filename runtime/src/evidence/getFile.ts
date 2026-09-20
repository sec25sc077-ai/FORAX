import fs from "fs";
import crypto from "crypto";

export interface FileMetadataEvidence {
  filePath: string;
  fileName: string;
  sizeBytes: number;
  createdTime: string;
  modifiedTime: string;
  accessedTime: string;
  sha256: string;
  timestamp: string;
}

export async function getFileMetadata(
  filePath: string
): Promise<FileMetadataEvidence> {
  const stats = await fs.promises.stat(filePath);

  if (!stats.isFile()) {
    throw new Error(`GET_FILE target is not a regular file: ${filePath}`);
  }

  const hash = crypto.createHash("sha256");

  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk: string | Buffer) => {
      hash.update(chunk);
    });

    stream.on("end", resolve);
    stream.on("error", reject);
  });

  return {
    filePath,
    fileName: filePath.split(/[\\/]/).pop() ?? filePath,
    sizeBytes: stats.size,
    createdTime: stats.birthtime.toISOString(),
    modifiedTime: stats.mtime.toISOString(),
    accessedTime: stats.atime.toISOString(),
    sha256: hash.digest("hex"),
    timestamp: new Date().toISOString()
  };
}
