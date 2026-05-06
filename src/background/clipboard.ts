export const copy = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};
