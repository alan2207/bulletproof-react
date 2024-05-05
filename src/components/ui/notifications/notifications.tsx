import { useNotificationStore } from '@/stores/notifications';

import { Notification } from './notification';

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end space-y-4 px-4 py-6 sm:items-start sm:p-6"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};
