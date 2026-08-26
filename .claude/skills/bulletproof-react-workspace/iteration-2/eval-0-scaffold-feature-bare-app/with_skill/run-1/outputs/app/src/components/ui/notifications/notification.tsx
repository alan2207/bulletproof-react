import { Notification as NotificationType } from './notifications-store';
import styles from './notifications.module.css';

type NotificationProps = {
  notification: NotificationType;
  onDismiss: (id: string) => void;
};

export const Notification = ({
  notification,
  onDismiss,
}: NotificationProps) => {
  const { id, type, title, message } = notification;

  return (
    <div className={`${styles.notification} ${styles[type]}`} role="alert">
      <div>
        <p className={styles.title}>{title}</p>
        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className={styles.dismiss}
        onClick={() => onDismiss(id)}
      >
        &times;
      </button>
    </div>
  );
};
