import { Mode } from "./copyMode";

export type MenusEventListenerCallback = (info: browser.menus.OnClickData, tab: browser.tabs.Tab | undefined) => void;

export const createMenus = (): void => {
  browser.menus.create({
    id: Mode.Normal,
    type: "normal",
    title: "タイトルと URL をコピー(Click)",
    contexts: ["page_action"],
  });

  browser.menus.create({
    id: Mode.Markdown,
    type: "normal",
    title: "タイトルと URL を Markdown としてコピー(Shift+Click)",
    contexts: ["page_action"],
  });
};

export const listenMenuCreateEvents = (callback: MenusEventListenerCallback): void => {
  browser.menus.onClicked.addListener((info, tab) => {
    callback(info, tab);
  });
};

export const setupMenus = (callback: MenusEventListenerCallback): void => {
  void browser.menus.removeAll();
  createMenus();
  listenMenuCreateEvents(callback);
};
