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

const NATURAL_LANGUAGE_MAP: Record<string, string> = {
  "collect process": "COLLECT_PROCESS",
  "collect processes": "COLLECT_PROCESS",
  "process evidence": "COLLECT_PROCESS",
  "collect network": "COLLECT_NETWORK_CONNECTION",
  "collect network connections": "COLLECT_NETWORK_CONNECTION",
  "network evidence": "COLLECT_NETWORK_CONNECTION",
  "collect file": "COLLECT_FILE",
  "collect files": "COLLECT_FILE",
  "file evidence": "COLLECT_FILE",
  "collect user": "COLLECT_USER",
  "collect users": "COLLECT_USER",
  "user evidence": "COLLECT_USER",
  "collect device": "COLLECT_DEVICE",
  "collect devices": "COLLECT_DEVICE",
  "device evidence": "COLLECT_DEVICE",
  "collect memory": "COLLECT_MEMORY",
  "memory evidence": "COLLECT_MEMORY",
  "create timeline": "CREATE_TIMELINE",
  "generate timeline": "CREATE_TIMELINE",
  "timeline": "CREATE_TIMELINE",
  "generate report": "GENERATE_REPORT",
  "create report": "GENERATE_REPORT",
  "report": "GENERATE_REPORT"
};

export function suggestForax(input: string): AiSuggestion {
  const text = input.trim().toLowerCase();
  const operations = new Set<string>();

  for (const operation of FORAX_OPERATIONS) {
    const phrase = operation.name.toLowerCase().replaceAll("_", " ");

    if (text.includes(phrase)) {
      operations.add(operation.name);
    }
  }

  for (const [phrase, operation] of Object.entries(NATURAL_LANGUAGE_MAP)) {
    if (text.includes(phrase)) {
      operations.add(operation);
    }
  }

  const detectedOperations = Array.from(operations);
  const forax = buildSuggestion(detectedOperations);

  return {
    input,
    forax,
    operations: detectedOperations,
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

      case "GENERATE_REPORT":
      case "REPORT":
        lines.push("REPORT");
        break;

      default:
        break;
    }
  }

  return lines.join("\n");
}
