import assert from "node:assert/strict";
import { forensicRuntime } from "../runtime/src/forensicRuntime";

async function main(): Promise<void> {
  await forensicRuntime.openCase("TEST-001");

  await forensicRuntime.collect("PROCESS");

  await forensicRuntime.find("NETWORK_CONNECTION", {
    conditions: [
      {
        field: "DESTINATION_PORT",
        operator: "==",
        value: 443
      }
    ],
    operators: []
  });

  await forensicRuntime.createTimeline();

  const report = await forensicRuntime.report();

  assert.equal(report.operation, "REPORT");

  const results = forensicRuntime.getResults();

  assert.equal(results.length, 5);

  console.log("FORAX runtime test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});