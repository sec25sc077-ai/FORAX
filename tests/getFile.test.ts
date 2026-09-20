import fs from "fs";
import crypto from "crypto";
import { lex } from "../compiler/src/lexer";
import { loadAliases } from "../compiler/src/dictionary";
import { Parser } from "../compiler/src/parser";
import { checkProgram } from "../compiler/src/typeChecker";
import { generateTypeScript } from "../compiler/src/generator";
import { forensicRuntime } from "../runtime/src/forensicRuntime";

async function main(): Promise<void> {
  const testFile = "tests/get-file-test.txt";
  const testContent = "FORAX GET FILE TEST";

  fs.writeFileSync(testFile, testContent, "utf8");

  try {
    const source = `GET FILE "${testFile}"`;

    const aliases = loadAliases("english");
    const tokens = lex(source, aliases);
    const program = new Parser(tokens).parse();

    checkProgram(program);

    const generated = generateTypeScript(program);

    if (!generated.includes("forensicRuntime.getFile")) {
      throw new Error(
        "Generated TypeScript does not contain forensicRuntime.getFile()."
      );
    }

    const expectedHash = crypto
      .createHash("sha256")
      .update(testContent, "utf8")
      .digest("hex");

    const result = await forensicRuntime.getFile(testFile);

    const data = result.data as {
      filePath: string;
      fileName: string;
      sizeBytes: number;
      createdTime: string;
      modifiedTime: string;
      accessedTime: string;
      sha256: string;
    };

    if (data.filePath !== testFile) {
      throw new Error(
        `File path mismatch. Expected ${testFile}, received ${data.filePath}`
      );
    }

    if (data.fileName !== "get-file-test.txt") {
      throw new Error(
        `File name mismatch. Expected get-file-test.txt, received ${data.fileName}`
      );
    }

    if (data.sizeBytes !== Buffer.byteLength(testContent, "utf8")) {
      throw new Error("File size mismatch.");
    }

    if (data.sha256 !== expectedHash) {
      throw new Error(
        `SHA-256 mismatch. Expected ${expectedHash}, received ${data.sha256}`
      );
    }

    if (!data.createdTime) {
      throw new Error("Created time was not returned.");
    }

    if (!data.modifiedTime) {
      throw new Error("Modified time was not returned.");
    }

    if (!data.accessedTime) {
      throw new Error("Accessed time was not returned.");
    }

    console.log("PASS: GET FILE parsed successfully.");
    console.log("PASS: GET_FILE operation validated.");
    console.log("PASS: TypeScript generator emitted forensicRuntime.getFile().");
    console.log(`PASS: File name verified: ${data.fileName}`);
    console.log(`PASS: File size verified: ${data.sizeBytes} bytes`);
    console.log(`PASS: SHA-256 verified: ${data.sha256}`);
    console.log("PASS: File timestamps returned.");
    console.log("FORAX GET FILE end-to-end test passed.");
  } finally {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
