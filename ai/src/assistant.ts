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
    .filter(op => text.includes(op.name.toLowerCase().replaceAll("_", " ")))
    .map(op => op.name);

  return {
    input,
    forax: "",
    operations,
    explanation: "AI suggestions must be validated by the FORAX compiler before execution."
  };
}

