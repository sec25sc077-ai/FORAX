import { FORAX_OPERATIONS } from "../../compiler/src/operationRegistry";

export interface AiSuggestion {
  input: string;
  forax: string;
  operations: string[];
  explanation: string;
}

export function suggestForax(input: string): AiSuggestion {
  const text = input.trim().toLowerCase();

  const operations = FORAX_OPERATIONS
    .filter(op => {
      const name = op.name.toLowerCase().replaceAll("_", " ");
      return text.includes(name);
    })
    .map(op => op.name);

  const forax = buildSuggestion(operations);

  return {
    input,
    forax,
    operations,
    explanation:
      "FORAX AI suggests constructs from the registered operation set. " +
      "The compiler remains the authoritative validator before execution."
  };
}

function buildSuggestion(operations: string[]): string {
  if (operations.length === 0) {
    return "";
  }

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

  return lines.join("\\n");
}
