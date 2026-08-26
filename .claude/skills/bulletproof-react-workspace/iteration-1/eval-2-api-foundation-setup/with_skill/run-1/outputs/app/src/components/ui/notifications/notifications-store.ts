import * as React from 'react';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
};

type NotificationsState = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  dismissNotification: (id: string) => void;
};

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const listeners = new Set<() => void>();

const setState = (partial: Partial<NotificationsState>) => {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
};

let state: NotificationsState = {
  notifications: [],
  addNotification: (notification) => {
    const id = generateId();
    setState({ notifications: [...state.notifications, { id, ...notification }] });
    return id;
  },
  dismissNotification: (id) => {
    setState({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    });
  },
};

const getState = () => state;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function useNotificationsStore() {
  return React.useSyncExternalStore(subscribe, getState, getState);
}

/**
 * Notifications are application state, not server cache — a tiny external
 * store keeps them out of React context so non-React code (the API client's
 * error interceptor) can push a notification via `useNotifications.getState()`.
 */
export const useNotifications = Object.assign(useNotificationsStore, {
  getState,
  subscribe,
});
