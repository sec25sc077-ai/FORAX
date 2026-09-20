import fs from "node:fs";
import { loadAliases } from "./dictionary";
import { lex } from "./lexer";
import { Parser } from "./parser";
import { checkProgram } from "./typeChecker";
import { generateTypeScript } from "./generator";
import { executeProgram } from "./execute";

const file = process.argv[2];
const languageArg = process.argv[3];

function detectLanguage(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();

  for (const candidate of ["tamil", "hindi", "marathi", "english"]) {
    if (
      normalized.includes(`/examples/${candidate}/`) ||
      normalized.includes(`/keywords/${candidate}.json`)
    ) {
      return candidate;
    }
  }

  return "english";
}

const language = languageArg ?? detectLanguage(file);
const output = process.argv[4];

if (!file) {
  console.error(
    "Usage: npm start -- <file.forax> [language] [output.ts]"
  );
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    const source = fs.readFileSync(file, "utf8");

    const aliases = loadAliases(language);
    const tokens = lex(source, aliases);
    const ast = new Parser(tokens).parse();

    checkProgram(ast);

    const generated = generateTypeScript(ast);

    if (output) {
      fs.writeFileSync(output, generated, "utf8");
      console.log(
        `FORAX compilation successful. Generated ${output}`
      );
      return;
    }

    console.log("FORAX compilation successful.");
    console.log("");

    await executeProgram(ast);

console.log("");
console.log("========== FORAX FORENSIC RESULTS ==========");

const { forensicRuntime } = await import("../../runtime/src/forensicRuntime");

console.log(
  JSON.stringify(forensicRuntime.getResults(), null, 2)
);

console.log("=============================================");
console.log("FORAX execution completed.");
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

void main();
