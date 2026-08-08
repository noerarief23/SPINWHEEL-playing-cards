const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Serve the page using local python server just in case
    await page.goto('http://localhost:8000');

    // Wait for everything to load and layout to stabilize
    await page.waitForLoadState('networkidle');

    // Interact with card select dropdown to verify options populate
    const cardSelect = await page.$('#cardSelect');
    const customDeckSelect = await page.$('#customDeckSelect');

    if (cardSelect && customDeckSelect) {
        console.log('Dropdowns exist');
    }

    // Start recording video
    await context.tracing.start({ screenshots: true, snapshots: true });

    // Ensure the card count select works (click dropdown, select 26, custom list)
    await page.selectOption('#cardCount', '26');
    await page.waitForTimeout(500); // Wait for reset to finish
    await page.selectOption('#cardCount', 'custom-list');
    await page.waitForTimeout(500); // Wait for custom list container to show up

    // Add a custom card
    await page.selectOption('#customDeckSelect', '0');
    await page.click('#addCustomCardBtn');

    await page.waitForTimeout(1000); // Give time for fireworks/sounds theoretically, although spin is reduced

    // Take screenshot
    await page.screenshot({ path: '/home/jules/verification/screenshot.png' });

    await context.tracing.stop({ path: '/home/jules/verification/trace.zip' });

    await browser.close();
    console.log('Verification complete');
})();
