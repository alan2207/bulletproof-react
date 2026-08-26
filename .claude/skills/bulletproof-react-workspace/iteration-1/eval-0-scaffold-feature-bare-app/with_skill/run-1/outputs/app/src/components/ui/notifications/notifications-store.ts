import * as React from 'react';

/**
 * Application state (not server cache), kept in a tiny external store so it can
 * be written to from outside React — the api-client's error interceptor needs
 * `useNotifications.getState().addNotification(...)`.
 *
 * Built on `useSyncExternalStore` to avoid a dependency; swapping this file for
 * zustand/jotai later keeps the same public surface.
 */
export type Notification = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
};

type NotificationsState = {
  notifications: Notification[];
};

let state: NotificationsState = { notifications: [] };
const listeners = new Set<() => void>();

const setState = (
  updater: (current: NotificationsState) => NotificationsState,
) => {
  state = updater(state);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => state.notifications;

let nextId = 0;

const addNotification = (notification: Omit<Notification, 'id'>) => {
  nextId += 1;
  const id = `notification-${nextId}`;
  setState((current) => ({
    notifications: [...current.notifications, { id, ...notification }],
  }));
  return id;
};

const dismissNotification = (id: string) => {
  setState((current) => ({
    notifications: current.notifications.filter(
      (notification) => notification.id !== id,
    ),
  }));
};

const useNotificationsStore = () => {
  const notifications = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  return { notifications, addNotification, dismissNotification };
};

export const useNotifications = Object.assign(useNotificationsStore, {
  getState: () => ({
    notifications: state.notifications,
    addNotification,
    dismissNotification,
  }),
});
