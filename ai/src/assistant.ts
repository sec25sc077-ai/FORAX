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
  "find process": "FIND_PROCESS",
  "find processes": "FIND_PROCESS",
  "search process": "FIND_PROCESS",
  "find network connection": "FIND_NETWORK_CONNECTION",
  "find network connections": "FIND_NETWORK_CONNECTION",
  "search network connection": "FIND_NETWORK_CONNECTION",
  "find file": "FIND_FILE",
  "find files": "FIND_FILE",
  "find user": "FIND_USER",
  "find users": "FIND_USER",
  "find device": "FIND_DEVICE",
  "find devices": "FIND_DEVICE",
  "count process": "COUNT_PROCESS",
  "count processes": "COUNT_PROCESS",
  "count files": "COUNT_FILE",
  "count users": "COUNT_USER",
  "count devices": "COUNT_DEVICE",
  "count network connections": "COUNT_NETWORK_CONNECTION",
  "count packets": "COUNT_PACKET",
  "filter process": "FILTER_PROCESS",
  "filter processes": "FILTER_PROCESS",
  "filter files": "FILTER_FILE",
  "filter users": "FILTER_USER",
  "filter devices": "FILTER_DEVICE",
  "filter network connections": "FILTER_NETWORK_CONNECTION",
  "search files": "SEARCH_FILE",
  "search file": "SEARCH_FILE",
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

      case "FIND_PROCESS":
        lines.push("FIND PROCESS");
        break;

      case "FIND_NETWORK_CONNECTION":
        lines.push("FIND NETWORK_CONNECTION");
        break;

      case "FIND_FILE":
        lines.push("FIND FILE");
        break;

      case "FIND_USER":
        lines.push("FIND USER");
        break;

      case "FIND_DEVICE":
        lines.push("FIND DEVICE");
        break;

      case "COUNT_PROCESS":
        lines.push("COUNT PROCESS");
        break;

      case "COUNT_FILE":
        lines.push("COUNT FILE");
        break;

      case "COUNT_USER":
        lines.push("COUNT USER");
        break;

      case "COUNT_DEVICE":
        lines.push("COUNT DEVICE");
        break;

      case "COUNT_NETWORK_CONNECTION":
        lines.push("COUNT NETWORK_CONNECTION");
        break;

      case "COUNT_PACKET":
        lines.push("COUNT PACKET");
        break;

      case "FILTER_PROCESS":
        lines.push("FILTER PROCESS");
        break;

      case "FILTER_FILE":
        lines.push("FILTER FILE");
        break;

      case "FILTER_USER":
        lines.push("FILTER USER");
        break;

      case "FILTER_DEVICE":
        lines.push("FILTER DEVICE");
        break;

      case "FILTER_NETWORK_CONNECTION":
        lines.push("FILTER NETWORK_CONNECTION");
        break;

      case "SEARCH_FILE":
        lines.push("SEARCH FILE");
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
