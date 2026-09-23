import { FORAX_OPERATIONS } from "../../compiler/src/operationRegistry";
import { loadAliases } from "../../compiler/src/dictionary";
import { lex } from "../../compiler/src/lexer";
import { Parser } from "../../compiler/src/parser";
import { checkProgram } from "../../compiler/src/typeChecker";

export interface AiSuggestion {
  input: string;
  forax: string;
  operations: string[];
  explanation: string;
  valid: boolean;
}

export function suggestForax(input: string): AiSuggestion {
  const text = input.trim().toLowerCase();

  const operations = FORAX_OPERATIONS
    .filter(op => text.includes(op.name.toLowerCase().replaceAll("_", " ")))
    .map(op => op.name);

  const forax = buildSuggestion(operations);

  return {
    input,
    forax,
    operations,
    explanation:
      "FORAX AI suggestions must be validated by the FORAX compiler before execution.",
    valid: forax ? validateForax(forax) : false
  };
}

export function validateForax(source: string): boolean {
  try {
    const aliases = loadAliases("english");
    const tokens = lex(source, aliases);
    const ast = new Parser(tokens).parse();

    checkProgram(ast);

    return true;
  } catch {
    return false;
  }
}

function buildSuggestion(operations: string[]): string {
  const lines: string[] = [];

  for (const operation of operations) {
    switch (operation) {
      case "COLLECT_PROCESS":
        lines.push("COLLECT PROCESS");
        break;

      case "COLLECT_NETWORK_CONNECTION":
        lines.push("COLLECT NETWORK_CONNECTION");
        break;

      case "COLLECT_FILE":
        lines.push("COLLECT FILE");
        break;

      case "COLLECT_USER":
        lines.push("COLLECT USER");
        break;

      case "COLLECT_DEVICE":
        lines.push("COLLECT DEVICE");
        break;

      case "COLLECT_MEMORY":
        lines.push("COLLECT MEMORY");
        break;

      case "CREATE_TIMELINE":
        lines.push("CREATE TIMELINE");
        break;

      case "REPORT":
      case "GENERATE_REPORT":
        lines.push("REPORT");
        break;

      default:
        break;
    }
  }

  return lines.join("\n");
}
