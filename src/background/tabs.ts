interface TabInfo {
  url: string;
  title: string;
}

export type TabEventListenerCallback = (tab: browser.tabs.Tab) => void;

export const getTabInfo = (tab: browser.tabs.Tab): TabInfo => {
  const tabInfo = {
    url: tab.url ?? "",
    title: tab.title ?? "",
  } satisfies TabInfo;

  return tabInfo;
};

export const listenTabsEvents = (callback: TabEventListenerCallback): void => {
  browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    callback(tab);
  });
};

export const setupTabs = (callback: TabEventListenerCallback): void => {
  listenTabsEvents(callback);
};
