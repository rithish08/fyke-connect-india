# Playwright Tests for Fyke Connect India

This folder contains end-to-end (E2E) test automation code for the Fyke Connect India app, written using [Playwright](https://playwright.dev/).

**Important:** These tests are fully separate from the app code and do not import or link with any application logic. They interact with the app only through the browser, simulating real user behavior.

## How to Run Tests

1. Make sure your app is running locally (default: `http://localhost:5173`).
2. In a separate terminal, run:

```sh
npx playwright test playwright-tests/
```

- You can change the base URL in each test file if your app runs on a different port or address.
- For more Playwright CLI options, see [Playwright docs](https://playwright.dev/docs/cli).

## Adding More Tests
- Create new `.spec.ts` files in this folder for each feature or page.
- Keep all test code in this folder to ensure separation from the app codebase. 