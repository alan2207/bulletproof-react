import styles from './notifications.module.css';
import { notify, useNotifications } from './notifications-store';

/**
 * Renders the active notifications. Mounted once, near the root of the tree
 * (see `src/app/provider.tsx`) - nothing else needs to render it.
 */
export const Notifications = () => {
  const notifications = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container} aria-label="Notifications">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
        >
          <div className={styles.content}>
            <div className={styles.title}>{notification.title}</div>
            {notification.message ? (
              <div className={styles.message}>{notification.message}</div>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => notify.dismiss(notification.id)}
            aria-label={`Dismiss notification: ${notification.title}`}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
