import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";
import fs from "fs";
test("dump", async ({ page }) => {
  for (const theme of ["dark", "light"] as const) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate((t) => window.localStorage.setItem("shipyard-theme", t), theme);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1400);
    const cls = await page.evaluate(() => document.documentElement.className);
    const r = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    fs.writeFileSync(`/tmp/c-${theme}.json`, JSON.stringify({cls, nodes: r.violations.flatMap(v=>v.nodes.map(n=>({h:n.html.slice(0,110),m:n.failureSummary?.replace(/\s+/g," ")})))},null,1));
  }
});
