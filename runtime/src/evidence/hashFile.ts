import fs from "fs";
import crypto from "crypto";

export interface FileHashEvidence {
  filePath: string;
  sizeBytes: number;
  sha256: string;
  timestamp: string;
}

export async function hashFile(filePath: string): Promise<FileHashEvidence> {
  const stats = await fs.promises.stat(filePath);

  if (!stats.isFile()) {
    throw new Error(`HASH_FILE target is not a regular file: ${filePath}`);
  }

  const hash = crypto.createHash("sha256");

  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk: string | Buffer) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      resolve();
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });

  return {
    filePath,
    sizeBytes: stats.size,
    sha256: hash.digest("hex"),
    timestamp: new Date().toISOString()
  };
}

