import { renderHook, act } from '@testing-library/react-hooks';

import { useNotificationStore, Notification } from '../notifications';

test('should add and remove notifications', () => {
  const { result } = renderHook(() => useNotificationStore());

  expect(result.current.notifications.length).toBe(0);

  const notification: Notification = {
    id: '123',
    title: 'Hello World',
    type: 'info',
    message: 'This is a notification',
  };

  act(() => {
    result.current.addNotification(notification);
  });

  expect(result.current.notifications).toContainEqual(notification);

  act(() => {
    result.current.dismissNotification(notification.id);
  });

  expect(result.current.notifications).not.toContainEqual(notification);
});
