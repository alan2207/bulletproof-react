import { Notification as NotificationType } from './notifications-store';

type NotificationProps = {
  notification: NotificationType;
  onDismiss: (id: string) => void;
};

export const Notification = ({ notification, onDismiss }: NotificationProps) => {
  return (
    <div
      role="alert"
      aria-label={notification.title}
      className={`notification notification--${notification.type}`}
    >
      <div className="notification__body">
        <p className="notification__title">{notification.title}</p>
        {notification.message ? (
          <p className="notification__message">{notification.message}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="notification__dismiss"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(notification.id)}
      >
        &times;
      </button>
    </div>
  );
};
