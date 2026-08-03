import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

/** Reads the focused element's tag, accessible-ish label and focus ring. */
const focusInfo = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      label:
        el.getAttribute("aria-label") ||
        el.textContent?.trim().slice(0, 40) ||
        el.getAttribute("title") ||
        "",
      ring: `${style.outlineWidth} ${style.boxShadow}`,
      visible: rect.width > 0 && rect.height > 0,
      hidden: el.closest("[aria-hidden='true']") !== null,
    };
  });

for (const route of ROUTES) {
  test(`${route.name}: tab order is sane and every stop has a visible focus ring`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const stops: NonNullable<Awaited<ReturnType<typeof focusInfo>>>[] = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const info = await focusInfo(page);
      if (!info) continue;
      stops.push(info);
    }

    expect(stops.length, "route exposes keyboard-reachable controls").toBeGreaterThan(3);

    // No focus stop may live inside an aria-hidden subtree or be zero-sized.
    expect(stops.filter((s) => s.hidden).map((s) => s.label)).toEqual([]);
    expect(stops.filter((s) => !s.visible).map((s) => s.label)).toEqual([]);

    // Every stop must render a focus indicator (outline or the token ring shadow).
    const unringed = stops.filter((s) => s.ring.trim() === "0px none" || s.ring.includes("none none"));
    expect(unringed.map((s) => `${s.tag}:${s.label}`), "controls without focus ring").toEqual([]);
  });
}

test("skip link is the first tab stop on home and jumps to main", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.keyboard.press("Tab");

  const first = await focusInfo(page);
  expect(first?.label.toLowerCase()).toContain("skip");

  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toHaveCount(1);
});

test("no positive tabindex anywhere in the app shell", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    const positives = await page.$$eval("[tabindex]", (els) =>
      els
        .map((el) => Number(el.getAttribute("tabindex")))
        .filter((v) => Number.isFinite(v) && v > 0),
    );
    expect(positives, `positive tabindex on ${route.path}`).toEqual([]);
  }
});
