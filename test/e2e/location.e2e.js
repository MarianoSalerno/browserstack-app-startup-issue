import { browser, expect } from '@wdio/globals';

import {
  accessibilityIDSelector,
  appRelaunch,
  skipOnboarding,
} from './helpers/common';

describe('Location', () => {
  before(async () => {
    await skipOnboarding();
  });

  describe('City change tests', () => {
    // The below test is working propperly, should be fine after BS fixes.
    it('returning guest user with saved address accepting location permission', async () => {
      // mark this with custom testID on MBNXT-21850
      await expect($(accessibilityIDSelector('New York City'))).toBeDisplayed();
      await appRelaunch();
      await expect($(accessibilityIDSelector('New York City'))).toBeDisplayed();
    });
  });
});
