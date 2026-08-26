import { useSyncExternalStore } from 'react';

/**
 * A tiny notification store that lives outside React.
 *
 * It is deliberately not a context: the API layer needs to raise a notification
 * from an axios interceptor, which has no component to hook into. Keeping the
 * state in a module-level store lets non-React code call `showNotification`
 * while components subscribe through `useNotifications`.
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  /** Auto-dismiss delay in ms. `0` keeps it up until dismissed by hand. */
  duration: number;
};

export type ShowNotificationOptions = {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
};

const DEFAULT_DURATION: Record<NotificationType, number> = {
  info: 5_000,
  success: 4_000,
  warning: 8_000,
  error: 10_000,
};

let notifications: Notification[] = [];
let idCounter = 0;

const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const emit = () => {
  for (const listener of listeners) listener();
};

const commit = (next: Notification[]) => {
  notifications = next;
  emit();
};

const clearTimer = (id: string) => {
  const timer = timers.get(id);
  if (timer === undefined) return;

  clearTimeout(timer);
  timers.delete(id);
};

const scheduleDismiss = (notification: Notification) => {
  clearTimer(notification.id);
  if (notification.duration <= 0) return;

  timers.set(
    notification.id,
    setTimeout(() => dismissNotification(notification.id), notification.duration),
  );
};

/**
 * Shows a notification and returns its id.
 *
 * Identical notifications collapse into one with a refreshed timer. Without
 * this, a page that fires five queries against a backend that is down would
 * stack five copies of the same message.
 */
export const showNotification = (options: ShowNotificationOptions): string => {
  const duplicate = notifications.find(
    (notification) =>
      notification.type === options.type &&
      notification.title === options.title &&
      notification.message === options.message,
  );

  if (duplicate) {
    scheduleDismiss(duplicate);
    return duplicate.id;
  }

  idCounter += 1;

  const notification: Notification = {
    id: `notification-${idCounter}`,
    type: options.type,
    title: options.title,
    message: options.message,
    duration: options.duration ?? DEFAULT_DURATION[options.type],
  };

  commit([...notifications, notification]);
  scheduleDismiss(notification);

  return notification.id;
};

export const dismissNotification = (id: string) => {
  clearTimer(id);

  const next = notifications.filter((notification) => notification.id !== id);
  if (next.length === notifications.length) return;

  commit(next);
};

export const dismissAllNotifications = () => {
  for (const id of timers.keys()) clearTimer(id);
  if (notifications.length === 0) return;

  commit([]);
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

/** The same array reference is returned until something actually changes. */
const getSnapshot = () => notifications;

export const useNotifications = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
