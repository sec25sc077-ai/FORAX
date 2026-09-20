import fs from "fs";
import path from "path";
import { searchFile } from "../runtime/src/evidence/searchFile";

async function main(): Promise<void> {
  const testDirectory = path.join(process.cwd(), "search-file-test-dir");

  await fs.promises.mkdir(testDirectory, { recursive: true });

  const matchingFile = path.join(
    testDirectory,
    "forax-search-test.txt"
  );

  const nonMatchingFile = path.join(
    testDirectory,
    "other-file.txt"
  );

  await fs.promises.writeFile(
    matchingFile,
    "FORAX SEARCH FILE TEST",
    "utf8"
  );

  await fs.promises.writeFile(
    nonMatchingFile,
    "DO NOT MATCH",
    "utf8"
  );

  try {
    const result = await searchFile(
      testDirectory,
      "forax-search"
    );

    if (result.matchCount !== 1) {
      throw new Error(
        `Expected 1 matching file, got ${result.matchCount}`
      );
    }

    if (result.files.length !== 1) {
      throw new Error(
        `Expected 1 file result, got ${result.files.length}`
      );
    }

    if (result.files[0].fileName !== "forax-search-test.txt") {
      throw new Error(
        `Unexpected file: ${result.files[0].fileName}`
      );
    }

    if (!result.files[0].sha256) {
      throw new Error(
        "Expected SHA-256 hash to be present."
      );
    }

    console.log("SEARCH_FILE test passed.");
  } finally {
    await fs.promises.rm(
      testDirectory,
      {
        recursive: true,
        force: true
      }
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
