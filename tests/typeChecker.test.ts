import { lex } from "../compiler/src/lexer";
import { Parser } from "../compiler/src/parser";
import { checkProgram } from "../compiler/src/typeChecker";
import { loadAliases } from "../compiler/src/dictionary";

function compile(source: string): void {
  const aliases = loadAliases("english");
  const tokens = lex(source, aliases);
  const parser = new Parser(tokens);
  const program = parser.parse();
  checkProgram(program);
}

function expectSuccess(
  name: string,
  source: string
): void {
  try {
    compile(source);
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    throw error;
  }
}

function expectFailure(
  name: string,
  source: string,
  expectedMessage: string
): void {
  try {
    compile(source);
    console.error(`FAIL: ${name}`);
    throw new Error(
      `Expected compilation to fail with: ${expectedMessage}`
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (!message.includes(expectedMessage)) {
      console.error(`FAIL: ${name}`);
      throw error;
    }

    console.log(`PASS: ${name}`);
  }
}

expectSuccess(
  "SOURCE_IP is valid for PACKET",
  'FIND PACKET WHERE SOURCE_IP == "192.168.1.10"'
);

expectSuccess(
  "DESTINATION_PORT is valid for PACKET",
  "FIND PACKET WHERE DESTINATION_PORT == 443"
);

expectFailure(
  "SOURCE_IP is invalid for PROCESS",
  'FIND PROCESS WHERE SOURCE_IP == "192.168.1.10"',
  "Field 'SOURCE_IP' is not valid for forensic object 'PROCESS'"
);

expectFailure(
  "Unknown forensic field is rejected",
  'FIND PACKET WHERE UNKNOWN_FIELD == "test"',
  "Unknown forensic field 'UNKNOWN_FIELD'"
);

console.log("");
console.log("FORAX semantic validation tests passed.");
