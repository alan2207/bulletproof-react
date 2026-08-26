import type { Notification as NotificationType } from './notifications-store';

const colors: Record<NotificationType['type'], string> = {
  info: '#2563eb',
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
};

export type NotificationProps = {
  notification: NotificationType;
  onDismiss: (id: string) => void;
};

export const Notification = ({ notification, onDismiss }: NotificationProps) => {
  const { id, type, title, message } = notification;

  return (
    <div
      role="alert"
      aria-label={title}
      style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        borderLeft: `4px solid ${colors[type]}`,
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        maxWidth: '24rem',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, color: colors[type] }}>{title}</p>
        {message ? (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#374151' }}>
            {message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={() => onDismiss(id)}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '1rem',
          lineHeight: 1,
          color: '#6b7280',
        }}
      >
        &times;
      </button>
    </div>
  );
};
