import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'INFO' | 'ALERT' | 'EMERGENCY' | 'VACCINATION' | 'APPOINTMENT';
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
    isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                const count = data.filter((n: Notification) => !n.isRead).length;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    const checkReminders = useCallback(async () => {
        if (!user?.id) return;
        try {
            await fetch(`http://localhost:8080/api/notifications/user/${user.id}/check-reminders`);
            // Refresh notifications after checking reminders
            fetchNotifications();
        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }, [user?.id, fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
        checkReminders();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications, checkReminders]);

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, { method: 'PUT' });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${user.id}/read-all`, { method: 'PUT' });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                const n = notifications.find(notif => notif.id === id);
                if (n && !n.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            isLoading
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
