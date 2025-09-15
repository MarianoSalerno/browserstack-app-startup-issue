const IOS_ALLOW = 'Allow While Using App';
const IOS_DENY = 'Don’t Allow';
const ANDROID_ALLOW = 'While using the app';
const ANDROID_DENY = "Don't allow";

export const androidSelector = selector => {
  return `android=new UiSelector().${selector}`;
};

export const iosSelector = selector => {
  return `-ios predicate string:${selector}`;
};

export const accessibilityIDSelector = selector => {
  return `~${selector}`;
};

export const findElement = async locator => {
  const element = $(locator);
  await element.waitForExist();
  return element;
};

export const clickElement = async locator => {
  const element = await findElement(locator);
  await element.waitForDisplayed();
  await element.click();
};

const commonSelectors = () => {
  return {
    location_permission_allow: accessibilityIDSelector(IOS_ALLOW),
    location_permission_deny: accessibilityIDSelector(IOS_DENY),
    push_notification_allow: accessibilityIDSelector('Allow'),
  };
};

export const skipOnboarding = async (
  options = { rejectLocationPermission: false, selectLocation: undefined }
) => {
  try {
    const allowTrackingButton = $(accessibilityIDSelector('Allow'));
    await allowTrackingButton.waitForDisplayed({ timeout: 40000 });
    await allowTrackingButton.click();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No allow tracking button found');
  }

  const selectors = commonSelectors();
  const skipButton = await findElement(accessibilityIDSelector('Skip'));
  await skipButton.click();

  const notificationsPermissionButton = await findElement(accessibilityIDSelector('Allow'));
  await notificationsPermissionButton.click();

  const locationPermissionSelector = options.rejectLocationPermission
    ? selectors.location_permission_deny
    : selectors.location_permission_allow;
  const acceptLocationPermissionsPopup = await findElement(locationPermissionSelector);
  await acceptLocationPermissionsPopup.click();

  const pushNotificationsPermissionButton = await findElement(accessibilityIDSelector('Enable'));
  await pushNotificationsPermissionButton.click();

  try {
    const pushNotificationsPermissionPopUp = await findElement(selectors.push_notification_allow);
    await pushNotificationsPermissionPopUp.click();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No push notifications permission pop-up found');
  }

  try {
    const addPopupButton = $(accessibilityIDSelector('Close'));
    await addPopupButton.click();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No add popup button found');
  }
};

export const deepLinkRedirect = async url => {
  await browser.navigateTo(`groupon:///dispatch/us/${url}`);
};

export const homeScreenRedirect = async () => {
  await deepLinkRedirect('cardsearch');
  await clickElement(accessibilityIDSelector('Explore'));
};

export const clickIfDisplayed = async selector => {
  const el = await $(selector);
  const isDisplayed = await el.waitForDisplayed().catch(() => false);

  if (isDisplayed) {
    await el.click();
  }
};

export const appRelaunch = async () => {
  await browser.relaunchActiveApp();
  // TODO: Remove "Enabled" block when MBNXT-22320 is fixed.
  try {
    await clickElement(accessibilityIDSelector('Enable'));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No tracking pop-up found');
  }
  try {
    await clickElement(accessibilityIDSelector('Allow'));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No tracking pop-up found');
  }

  try {
    const addPopupButton = $(accessibilityIDSelector('Close'));
    await addPopupButton.click();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('No add popup button found');
  }
};
