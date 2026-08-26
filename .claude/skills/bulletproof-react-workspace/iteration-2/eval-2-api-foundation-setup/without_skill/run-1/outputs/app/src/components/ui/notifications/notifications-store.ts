import { useSyncExternalStore } from 'react';

/**
 * A tiny external store for toast notifications.
 *
 * It lives outside React on purpose: the API layer's axios interceptor is not a
 * component and cannot call hooks, but it still needs to raise a notification
 * when a request fails. Components subscribe through `useSyncExternalStore`.
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  /** Auto-dismiss delay in ms. `null` keeps the notification until dismissed. */
  duration?: number | null;
};

export type NotificationInput = Omit<Notification, 'id'>;

const DEFAULT_DURATION = 5000;

let notifications: Notification[] = [];
let idCounter = 0;

const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const setNotifications = (next: Notification[]) => {
  notifications = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Returns a stable reference between updates (state is replaced, never mutated),
// which is what `useSyncExternalStore` requires to avoid infinite re-renders.
const getSnapshot = () => notifications;

const clearTimer = (id: string) => {
  const timer = timers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    timers.delete(id);
  }
};

const dismiss = (id: string) => {
  clearTimer(id);
  if (!notifications.some((notification) => notification.id === id)) return;
  setNotifications(notifications.filter((notification) => notification.id !== id));
};

const scheduleDismiss = (id: string, duration: number | null | undefined) => {
  if (duration === null) return;
  clearTimer(id);
  timers.set(
    id,
    setTimeout(() => dismiss(id), duration ?? DEFAULT_DURATION),
  );
};

const dismissAll = () => {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  if (notifications.length === 0) return;
  setNotifications([]);
};

const add = (input: NotificationInput): string => {
  // A single user action can fan out into several requests that all fail the
  // same way. Collapse identical notifications into one instead of stacking
  // five copies of "Network error".
  const duplicate = notifications.find(
    (notification) =>
      notification.type === input.type &&
      notification.title === input.title &&
      notification.message === input.message,
  );

  if (duplicate) {
    scheduleDismiss(duplicate.id, input.duration);
    return duplicate.id;
  }

  const id = `notification-${idCounter++}`;
  const notification: Notification = { ...input, id };

  setNotifications([...notifications, notification]);
  scheduleDismiss(id, input.duration);

  return id;
};

const withType =
  (type: NotificationType) =>
  (input: Omit<NotificationInput, 'type'>): string =>
    add({ ...input, type });

/**
 * Imperative API, callable from anywhere - components, event handlers, and
 * non-React code such as the axios interceptor.
 */
export const notify = {
  add,
  dismiss,
  dismissAll,
  info: withType('info'),
  success: withType('success'),
  warning: withType('warning'),
  error: withType('error'),
};

/** Subscribe a component to the current notification list. */
export const useNotifications = (): Notification[] =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
