import { Notification } from './notification';
import { notificationsStore, useNotifications } from './notifications-store';
import styles from './notifications.module.css';

export const Notifications = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.region} aria-live="polite">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={notificationsStore.dismissNotification}
        />
      ))}
    </div>
  );
};
