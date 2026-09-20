import fs from "fs";
import path from "path";
import { getFileMetadata, FileMetadataEvidence } from "./getFile";

export interface SearchFileEvidence {
  pattern: string;
  directory: string;
  matchCount: number;
  files: FileMetadataEvidence[];
  timestamp: string;
}

export async function searchFile(
  directory: string,
  pattern: string
): Promise<SearchFileEvidence> {
  const entries = await fs.promises.readdir(directory, {
    withFileTypes: true
  });

  const normalizedPattern = pattern.toLowerCase();

  const matchingFiles = entries
    .filter((entry) => entry.isFile())
    .filter((entry) =>
      entry.name.toLowerCase().includes(normalizedPattern)
    )
    .map((entry) => path.join(directory, entry.name))
    .sort((a, b) => a.localeCompare(b));

  const files: FileMetadataEvidence[] = [];

  for (const filePath of matchingFiles) {
    files.push(await getFileMetadata(filePath));
  }

  return {
    pattern,
    directory,
    matchCount: files.length,
    files,
    timestamp: new Date().toISOString()
  };
}
