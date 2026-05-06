import { match } from "ts-pattern";

export type Mode = typeof Mode[keyof typeof Mode];

export const Mode = {
  Normal: "Normal",
  Markdown: "Markdown",
} as const;

export const isMode = (mode: unknown): mode is Mode => {
  return typeof mode === "string" && Object.values(Mode).includes(mode as Mode);
};

export const convertModifiersToMode = (modifiers: browser.pageAction.OnClickData["modifiers"]): Mode => {
  const sortedModifiers = modifiers.toSorted();

  const mode = match(sortedModifiers)
    .with(["Shift"], () => Mode.Markdown)
    .otherwise(() => Mode.Normal);

  return mode;
};
