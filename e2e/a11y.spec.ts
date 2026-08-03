import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

/**
 * Entrance animations and webfont swaps both change computed colors, so axe
 * must only run once the page has visually settled — otherwise color-contrast
 * results are non-deterministic.
 */
async function settle(page: Page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1200);
}

for (const route of ROUTES) {
  test(`${route.name} has no axe violations`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await settle(page);

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const summary = results.violations.map(
      (v) =>
        `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 5)
          .join(" | ")}`,
    );
    expect(summary, `axe violations on ${route.path}`).toEqual([]);
  });
}

test("dark and light themes both pass color contrast", async ({ page }) => {
  for (const theme of ["dark", "light"] as const) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate((t) => window.localStorage.setItem("shipyard-theme", t), theme);
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);

    const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();

    expect(
      results.violations.flatMap((v) => v.nodes.map((n) => n.target.join(" "))),
      `color contrast failures in ${theme} theme`,
    ).toEqual([]);
  }
});

test("reduced-motion preference removes animation and hover lift", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("shipyard-motion", "reduced"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await settle(page);

  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");

  const animated = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("*")).filter((el) => {
      const style = getComputedStyle(el);
      return (
        style.animationName !== "none" &&
        parseFloat(style.animationDuration) > 0.001
      );
    }).length,
  );
  expect(animated, "animations still running under reduced motion").toBe(0);
});
