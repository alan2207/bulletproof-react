import {
  dismissNotification,
  useNotifications,
} from './notifications-store';

import './notifications.css';

/**
 * Renders the notification stack. Mounted once, near the root, by `AppProvider`.
 *
 * Intentionally plain: swap the markup for your design system's toast when one
 * exists. The store in `notifications-store.ts` is the part callers depend on.
 */
export const Notifications = () => {
  const notifications = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="notifications" role="region" aria-label="Notifications">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
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
            aria-label={`Dismiss: ${notification.title}`}
            onClick={() => dismissNotification(notification.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
