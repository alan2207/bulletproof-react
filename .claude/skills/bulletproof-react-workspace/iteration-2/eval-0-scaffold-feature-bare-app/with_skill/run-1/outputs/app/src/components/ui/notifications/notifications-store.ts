import { useSyncExternalStore } from 'react';

export type Notification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

type NotificationsState = {
  notifications: Notification[];
};

/**
 * Tiny external store so non-React code (the API client's error interceptor)
 * can push notifications without a hook. Swap for zustand/jotai if the app
 * grows more application state — only this file changes.
 */
let state: NotificationsState = { notifications: [] };

const listeners = new Set<() => void>();

const setState = (next: NotificationsState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const createId = () => Math.random().toString(36).slice(2);

export const notificationsStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = createId();
    setState({
      notifications: [...state.notifications, { id, ...notification }],
    });
    return id;
  },
  dismissNotification: (id: string) => {
    setState({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    });
  },
};

export const useNotifications = () =>
  useSyncExternalStore(
    notificationsStore.subscribe,
    notificationsStore.getState,
  );
