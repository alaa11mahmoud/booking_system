import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data.data ?? res.data;
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount(
        (Array.isArray(data) ? data : []).filter((n) => !n.read_at).length
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY || 'clinic-key',
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
      wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
      wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
      forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
      disableStats: true,
    });

    const channel = window.Echo.channel(`appointments.${user.id}`);
    channel.listen('.AppointmentStatusUpdated', (e) => {
      fetchNotifications();
    });

    return () => {
      window.Echo?.leaveChannel(`appointments.${user.id}`);
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await api.post('/notifications/mark-all-read');
    fetchNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
