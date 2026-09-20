import fs from "fs";
import crypto from "crypto";
import { lex } from "../compiler/src/lexer";
import { loadAliases } from "../compiler/src/dictionary";
import { Parser } from "../compiler/src/parser";
import { checkProgram } from "../compiler/src/typeChecker";
import { generateTypeScript } from "../compiler/src/generator";
import { forensicRuntime } from "../runtime/src/forensicRuntime";

async function main(): Promise<void> {
  const testFile = "tests/verify-test.txt";
  const testContent = "FORAX VERIFY FILE TEST";

  fs.writeFileSync(testFile, testContent, "utf8");

  const expectedHash = crypto
    .createHash("sha256")
    .update(testContent, "utf8")
    .digest("hex");

  const source = `VERIFY FILE "${testFile}" "${expectedHash}"`;

  const aliases = loadAliases("english");
  const tokens = lex(source, aliases);
  const program = new Parser(tokens).parse();

  checkProgram(program);

  const generated = generateTypeScript(program);

  if (!generated.includes("forensicRuntime.verifyFile")) {
    throw new Error(
      "Generated TypeScript does not contain forensicRuntime.verifyFile()."
    );
  }

  const result = await forensicRuntime.verifyFile(
    testFile,
    expectedHash
  );

  const data = result.data as {
    status: string;
    filePath: string;
    expectedHash: string;
    actualHash: string;
    verified: boolean;
  };

  if (data.status !== "VERIFIED") {
    throw new Error(
      `Verification status mismatch. Received ${data.status}`
    );
  }

  if (!data.verified) {
    throw new Error("File verification returned verified=false.");
  }

  if (data.filePath !== testFile) {
    throw new Error(
      `File path mismatch. Expected ${testFile}, received ${data.filePath}`
    );
  }

  if (data.expectedHash !== expectedHash) {
    throw new Error("Expected hash mismatch.");
  }

  if (data.actualHash !== expectedHash) {
    throw new Error(
      `Actual hash mismatch. Expected ${expectedHash}, received ${data.actualHash}`
    );
  }

  const wrongHash = "0000000000000000000000000000000000000000000000000000000000000000";

  const mismatchResult = await forensicRuntime.verifyFile(
    testFile,
    wrongHash
  );

  const mismatchData = mismatchResult.data as {
    status: string;
    actualHash: string;
    verified: boolean;
  };

  if (mismatchData.status !== "MISMATCH") {
    throw new Error(
      `Mismatch test failed. Expected MISMATCH, received ${mismatchData.status}`
    );
  }

  if (mismatchData.verified) {
    throw new Error("Mismatch test incorrectly returned verified=true.");
  }
  fs.unlinkSync(testFile);

  console.log("PASS: VERIFY FILE parsed successfully.");
  console.log("PASS: VERIFY_FILE operation validated.");
  console.log(
    "PASS: TypeScript generator emitted forensicRuntime.verifyFile()."
  );
  console.log(`PASS: SHA-256 verification confirmed: ${data.actualHash}`);
  console.log("FORAX VERIFY FILE end-to-end test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
