import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

for (const route of ROUTES) {
  test(`${route.name} has no axe violations`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    // Let entrance animations settle so nothing is scanned mid-transition.
    await page.waitForTimeout(600);

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`,
    );
    expect(summary, `axe violations on ${route.path}`).toEqual([]);
  });
}

test("dark and light themes both pass color contrast", async ({ page }) => {
  for (const theme of ["dark", "light"] as const) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate((t) => window.localStorage.setItem("shipyard-theme", t), theme);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    expect(
      results.violations.flatMap((v) => v.nodes.map((n) => n.target.join(" "))),
      `color contrast failures in ${theme} theme`,
    ).toEqual([]);
  }
});
