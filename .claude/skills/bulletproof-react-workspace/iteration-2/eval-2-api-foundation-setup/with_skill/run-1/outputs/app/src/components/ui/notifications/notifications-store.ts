import * as React from 'react';

export type Notification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

export type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  dismissNotification: (id: string) => void;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const listeners = new Set<() => void>();

function setNotifications(
  updater: (notifications: Notification[]) => Notification[],
) {
  state = { ...state, notifications: updater(state.notifications) };
  listeners.forEach((listener) => listener());
}

function addNotification(notification: Omit<Notification, 'id'>) {
  const id = createId();
  setNotifications((notifications) => [
    ...notifications,
    { id, ...notification },
  ]);
  return id;
}

function dismissNotification(id: string) {
  setNotifications((notifications) => notifications.filter((n) => n.id !== id));
}

let state: NotificationsStore = {
  notifications: [],
  addNotification,
  dismissNotification,
};

const getState = () => state;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Notifications are application state, not server cache — they live in a tiny
 * external store rather than react-query or a context, because they have to be
 * writable from outside React (the api-client's response interceptor).
 *
 * The surface deliberately mirrors zustand (`useNotifications()` inside
 * components, `useNotifications.getState()` outside), so swapping in zustand
 * later is a one-file change.
 */
const useNotificationsStore = () =>
  React.useSyncExternalStore(subscribe, getState, getState);

export const useNotifications = Object.assign(useNotificationsStore, {
  getState,
  subscribe,
});
