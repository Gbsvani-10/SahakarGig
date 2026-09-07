import { NotificationItem, UserRole } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

let notificationsStore: NotificationItem[] = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(role?: UserRole): Promise<NotificationItem[]> {
    if (!role) return simulatedLatency([...notificationsStore], 150);
    const filtered = notificationsStore.filter((n) => n.recipientRole === role);
    return simulatedLatency(filtered, 150);
  },

  async markAsRead(id: string): Promise<void> {
    notificationsStore = notificationsStore.map((n) => 
      n.id === id ? { ...n, isRead: true } : n
    );
  },

  async markAllAsRead(role: UserRole): Promise<void> {
    notificationsStore = notificationsStore.map((n) => 
      n.recipientRole === role ? { ...n, isRead: true } : n
    );
  },

  async addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    notificationsStore = [newNotif, ...notificationsStore];
    return simulatedLatency(newNotif, 100);
  }
};
