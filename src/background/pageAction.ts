export type PageActionEventListenerCallback = (tab: browser.tabs.Tab, info: browser.pageAction.OnClickData | undefined) => void;

export const initializePageAction = (tab: browser.tabs.Tab): void => {
  if (tab.id === undefined) {
    return;
  }

  browser
    .pageAction
    .show(tab.id)
    .catch((reason: unknown) => {
      console.error("failed to show page action button:", reason);
    });
};

export const listenPageActionEvents = (callback: PageActionEventListenerCallback): void => {
  browser.pageAction.onClicked.addListener((tab, info) => {
    callback(tab, info);
  });
};

export const setupPageAction = (callback: PageActionEventListenerCallback): void => {
  listenPageActionEvents(callback);
};
