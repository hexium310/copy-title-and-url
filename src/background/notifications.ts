export interface NotificationOptions {
  title: string;
  message: string;
}

export const notify = (options: NotificationOptions): void => {
  void browser.notifications.create({ type: "basic", ...options });
};
