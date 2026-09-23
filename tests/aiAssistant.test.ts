import assert from "node:assert/strict";
import { suggestForax, validateForax } from "../ai/src/assistant";

const result = suggestForax(
  "collect process evidence and create timeline"
);

assert.equal(result.input, "collect process evidence and create timeline");
assert.deepEqual(result.operations, [
  "COLLECT_PROCESS",
  "CREATE_TIMELINE"
]);
assert.equal(
  result.forax,
  "COLLECT PROCESS\nCREATE TIMELINE"
);
assert.equal(result.valid, true);

const analysis = suggestForax(
  "find processes and count network connections"
);

assert.deepEqual(analysis.operations, [
  "FIND_PROCESS",
  "COUNT_NETWORK_CONNECTION"
]);
assert.equal(
  analysis.forax,
  "FIND PROCESS\nCOUNT NETWORK_CONNECTION"
);
assert.equal(analysis.valid, true);

assert.equal(validateForax("COLLECT PROCESS"), true);
assert.equal(validateForax("INVALID FORAX COMMAND"), false);

console.log("AI natural-language validation test passed.");
