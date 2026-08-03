import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";
import fs from "fs";

test("dump", async ({ page }) => {
  for (const p of ["/", "/profile-preview"]) {
    await page.goto(p, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"]).analyze();
    const out = r.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ t: n.target.join(" "), msg: n.failureSummary?.replace(/\n/g," ") })) }));
    fs.writeFileSync(`/tmp/dbg${p.replace(/\//g,"_")}.json`, JSON.stringify(out, null, 1));
  }
});
