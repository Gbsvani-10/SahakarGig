import { NotificationItem, UserRole } from '../types';
import { apiRequest } from './apiClient';

export const notificationService = {
  async getNotifications(_role?: UserRole): Promise<NotificationItem[]> {
    const response = await apiRequest<NotificationItem[]>('/notifications');
    return response.data || [];
  },

  async markAsRead(id: string): Promise<void> {
    await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
  },

  async markAllAsRead(_role?: UserRole): Promise<void> {
    await apiRequest('/notifications/read-all', { method: 'PATCH' });
  },

  async addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): Promise<NotificationItem> {
    const response = await apiRequest<NotificationItem>('/notifications', {
      method: 'POST',
      body: JSON.stringify({
        recipientUserId: (notification as any).recipientUserId,
        recipientRole: notification.recipientRole,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        linkTo: notification.linkTo
      })
    });
    return response.data;
  }
};
