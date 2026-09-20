import assert from "node:assert/strict";
import { forensicRuntime } from "../runtime/src/forensicRuntime";

async function run(): Promise<void> {
  const result = await forensicRuntime.summarizeProcess();

  assert.equal(result.operation, "SUMMARIZE");
  assert.equal(result.object, "PROCESS");

  const data = result.data as {
    status?: string;
    totalProcesses?: unknown;
    uniqueProcessNames?: unknown;
    processNames?: unknown;
    parentProcessIds?: unknown;
  };

  assert.equal(data.status, "COMPLETED");

  assert.equal(
    typeof data.totalProcesses,
    "number"
  );

  assert.equal(
    typeof data.uniqueProcessNames,
    "number"
  );

  assert.ok(
    Array.isArray(data.processNames)
  );

  assert.ok(
    Array.isArray(data.parentProcessIds)
  );

  console.log("FORAX process summary runtime test passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
