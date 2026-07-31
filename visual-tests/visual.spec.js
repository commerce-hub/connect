import {expect, test} from 'playwright/test';

const desktopScenarios = [
  ['loading', 'loading'],
  ['payment method list', 'list'],
  ['payment method delete confirmation', 'delete-confirmation'],
  ['confirmed payment method', 'confirmed'],
  ['add payment method sheet', 'add-launcher'],
  ['add card form', 'add-card'],
  ['add bank provider', 'add-bank-provider'],
  ['manual bank form', 'add-bank-manual'],
  ['transfer review', 'transfer'],
  ['OTP entry', 'otp'],
  ['required information', 'required-info'],
  ['under review outcome', 'outcome'],
  ['card error', 'error'],
];

const openScenario = async (page, scenario) => {
  await page.goto(`/visual-tests/fixture.html?scenario=${scenario}`);
  await page.waitForFunction(
    () => document.documentElement.dataset.visualFixtureReady === 'true'
  );
  await page.locator('commerce-hub-connect').waitFor({state: 'visible'});
};

test.describe('CommerceHub Connect visual states', () => {
  for (const [label, scenario] of desktopScenarios) {
    test(label, async ({page}) => {
      await openScenario(page, scenario);

      await expect(page.locator('commerce-hub-connect')).toHaveScreenshot(
        `${scenario}.png`
      );
    });
  }

  test('payment method list at a narrow viewport', async ({page}) => {
    await page.setViewportSize({width: 320, height: 480});
    await openScenario(page, 'list');

    await expect(page.locator('commerce-hub-connect')).toHaveScreenshot(
      'list-narrow.png'
    );
  });
});
