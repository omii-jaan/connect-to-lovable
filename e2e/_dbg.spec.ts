import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";
import fs from "fs";
test("dump", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("shipyard-theme", "dark"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const r = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  fs.writeFileSync("/tmp/light.json", JSON.stringify(r.violations.flatMap(v=>v.nodes.map(n=>({h:n.html.slice(0,110),m:n.failureSummary?.replace(/\s+/g," ")}))),null,1));
});
