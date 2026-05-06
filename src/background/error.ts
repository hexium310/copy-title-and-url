import { notify } from "./notifications";

export const handleClipboardError = (reason: unknown, messageBuilder: (error: DOMException) => string): void => {
  if (reason instanceof DOMException && reason.name === "NotAllowedError") {
    const message = messageBuilder(reason);

    console.error(message);
    notify({
      title: "Copy Error",
      message,
    });
  } else {
    console.error("unexpected error:", reason);
  }
};
