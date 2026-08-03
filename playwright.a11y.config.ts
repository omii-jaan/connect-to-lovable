import { defineConfig, devices } from "@playwright/test";

/**
 * Accessibility + keyboard suite. Self-contained so it runs identically in CI
 * and locally: it boots the production preview server on a fixed port and
 * scans every route declared in e2e/routes.ts.
 */
const PORT = Number(process.env.A11Y_PORT ?? 4173);
const baseURL = process.env.A11Y_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  timeout: 60_000,
  use: {
    baseURL,
    viewport: { width: 1280, height: 900 },
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Allow pinning a preinstalled Chromium (CI images, sandboxes).
        launchOptions: process.env.CHROMIUM_PATH
          ? { executablePath: process.env.CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: process.env.A11Y_BASE_URL
    ? undefined
    : {
        command: `bunx vite preview --port ${PORT} --strictPort`,
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});
