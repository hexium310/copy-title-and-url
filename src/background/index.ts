import { match } from "ts-pattern";

import { copy } from "./clipboard";
import { convertModifiersToMode, isMode, Mode } from "./copyMode";
import { handleClipboardError } from "./error";
import { setupMenus } from "./menus";
import { initializePageAction, setupPageAction } from "./pageAction";
import { getTabInfo, setupTabs } from "./tabs";

import type { MenusEventListenerCallback } from "./menus";
import type { PageActionEventListenerCallback } from "./pageAction";

export const buildText = (title: string, url: string, mode: Mode): string => {
  const text = match(mode)
    .with(Mode.Normal, () => `${title} ${url}`)
    .with(Mode.Markdown, () => `[${title}](${url})`)
    .exhaustive();

  return text;
};

export const handlePageActionEvent: PageActionEventListenerCallback = (tab, info): void => {
  const { title, url } = getTabInfo(tab);

  const mode = convertModifiersToMode(info?.modifiers ?? []);

  const text = buildText(title, url, mode);

  copy(text)
    .catch((reason: unknown) => {
      handleClipboardError(reason, (error) => `failed to copy to clipboard by button:\n${text}\nError: ${error}`);
    });
};

export const handleMenusEvent: MenusEventListenerCallback = (info, tab): void => {
  if (tab === undefined) {
    return;
  }

  if (!isMode(info.menuItemId)) {
    console.error("unexpected menuItemId:", info.menuItemId);
    return;
  }

  const { title, url } = getTabInfo(tab);

  const text = buildText(title, url, info.menuItemId);

  copy(text)
    .catch((reason: unknown) => {
      handleClipboardError(reason, (error) => `failed to copy to clipboard by context menu:\n${text}\nError: ${error}`);
    });
};

setupTabs(initializePageAction);
setupPageAction(handlePageActionEvent);
setupMenus(handleMenusEvent);
