import { Notification } from './notification';
import { useNotifications } from './notifications-store';

/**
 * Renders every queued notification. Mounted once, at the app provider level.
 */
export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      style={{
        position: 'fixed',
        insetBlockEnd: '1rem',
        insetInlineEnd: '1rem',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'none',
      }}
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
