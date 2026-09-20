import fs from "fs";
import crypto from "crypto";
import { lex } from "../compiler/src/lexer";
import { loadAliases } from "../compiler/src/dictionary";
import { Parser } from "../compiler/src/parser";
import { checkProgram } from "../compiler/src/typeChecker";
import { generateTypeScript } from "../compiler/src/generator";
import { forensicRuntime } from "../runtime/src/forensicRuntime";

async function main(): Promise<void> {
  const testFile = "tests/hash-test.txt";
  const testContent = "FORAX HASH FILE TEST";

  fs.writeFileSync(testFile, testContent, "utf8");

  const source = `HASH FILE "${testFile}"`;

  const aliases = loadAliases("english");
  const tokens = lex(source, aliases);
  const program = new Parser(tokens).parse();

  checkProgram(program);

  const generated = generateTypeScript(program);

  if (!generated.includes("forensicRuntime.hashFile")) {
    throw new Error(
      "Generated TypeScript does not contain forensicRuntime.hashFile()."
    );
  }

  const expectedHash = crypto
    .createHash("sha256")
    .update(testContent, "utf8")
    .digest("hex");

  const result = await forensicRuntime.hashFile(testFile);

  const data = result.data as {
    sha256: string;
    sizeBytes: number;
    filePath: string;
  };

  if (data.sha256 !== expectedHash) {
    throw new Error(
      `SHA-256 mismatch. Expected ${expectedHash}, received ${data.sha256}`
    );
  }

  if (data.filePath !== testFile) {
    throw new Error(
      `File path mismatch. Expected ${testFile}, received ${data.filePath}`
    );
  }

  if (data.sizeBytes !== Buffer.byteLength(testContent, "utf8")) {
    throw new Error("File size mismatch.");
  }

  fs.unlinkSync(testFile);

  console.log("PASS: HASH FILE parsed successfully.");
  console.log("PASS: HASH_FILE operation validated.");
  console.log("PASS: TypeScript generator emitted forensicRuntime.hashFile().");
  console.log(`PASS: SHA-256 verified: ${data.sha256}`);
  console.log("FORAX HASH FILE end-to-end test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
