import { execSync } from "child_process";

const suites = [
  { name: "Phase 02 Foundation", file: "tests/phase02-foundation.test.ts" },
  { name: "Phase 03 Admin", file: "tests/phase03-admin.test.ts" },
  { name: "Phase 04 CMS", file: "tests/phase04-cms.test.ts" },
  { name: "Phase 05 Checkout", file: "tests/phase05-checkout.test.ts" },
  { name: "Phase 06 Payments", file: "tests/phase06-payments.test.ts" },
  { name: "Phase 07 Orders", file: "tests/phase07-orders.test.ts" },
  { name: "Audit Auth & Checkout", file: "tests/audit-checkout-auth.test.ts" },
  { name: "Password Recovery & Session Revocation", file: "tests/password-reset.test.ts" },
  { name: "E2E Customer Journey", file: "tests/e2e-customer-journey.test.ts" },
];

console.log("===============================================================");
console.log("🧪 MASTER TEST RUNNER — ALL 9 TEST SUITES");
console.log("===============================================================\n");

let passedSuites = 0;
let failedSuites = 0;

for (const suite of suites) {
  process.stdout.write(`Executing ${suite.name} (${suite.file})... `);
  try {
    const output = execSync(`npx tsx ${suite.file}`, {
      encoding: "utf-8",
      env: { ...process.env },
    });
    console.log("✅ PASSED");
    passedSuites++;
  } catch (err: unknown) {
    console.log("❌ FAILED");
    failedSuites++;
    const execErr = err as { stdout?: string; stderr?: string };
    if (execErr.stdout) console.log(execErr.stdout);
    if (execErr.stderr) console.error(execErr.stderr);
  }
}

console.log("\n===============================================================");
console.log(`TOTAL SUITES: ${suites.length} | PASSED: ${passedSuites} | FAILED: ${failedSuites}`);
console.log("===============================================================\n");

if (failedSuites > 0) {
  process.exit(1);
}
