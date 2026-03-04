import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import {
    Bell, Check, Trash2, AlertTriangle, Info,
    Calendar, Syringe, Clock, ChevronRight,
    Search, Filter, Inbox, MoreHorizontal,
    ArrowLeft, Calendar as CalendarIcon,
    ShieldAlert, Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router';

export default function NotificationHistoryPage() {
    const {
        notifications, markAsRead, markAllAsRead,
        deleteNotification, isLoading
    } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');
    const navigate = useNavigate();

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'alerts') return n.type === 'EMERGENCY' || n.type === 'ALERT';
        return true;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'EMERGENCY': return <ShieldAlert className="size-5 text-rose-500" />;
            case 'ALERT': return <AlertTriangle className="size-5 text-amber-500" />;
            case 'VACCINATION': return <Syringe className="size-5 text-teal-500" />;
            case 'APPOINTMENT': return <CalendarIcon className="size-5 text-primary" />;
            default: return <Info className="size-5 text-blue-500" />;
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'EMERGENCY': return 'bg-rose-50 border-rose-100 text-rose-700';
            case 'ALERT': return 'bg-amber-50 border-amber-100 text-amber-700';
            case 'VACCINATION': return 'bg-teal-50 border-teal-100 text-teal-700';
            case 'APPOINTMENT': return 'bg-blue-50 border-blue-100 text-blue-700';
            default: return 'bg-slate-50 border-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-2xl bg-white shadow-sm border group">
                            <ArrowLeft className="size-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                Notification Center
                                <Sparkles className="size-6 text-primary animate-pulse" />
                            </h1>
                            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest mt-1">
                                Manage your alerts and activity history
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {notifications.some(n => !n.isRead) && (
                            <Button variant="outline" onClick={markAllAsRead} className="rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                                <Check className="mr-2 size-4 text-emerald-500" />
                                Mark All Read
                            </Button>
                        )}
                        <Button className="rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                            Clear Inbox
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={`rounded-2xl font-bold h-10 px-6 ${filter === 'all' ? 'shadow-lg shadow-primary/20' : 'bg-white border-slate-200'}`}
                    >
                        All History
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        onClick={() => setFilter('unread')}
                        className={`rounded-2xl font-bold h-10 px-6 ${filter === 'unread' ? 'shadow-lg shadow-primary/20' : 'bg-white border-slate-200'}`}
                    >
                        Unread
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <Badge className="ml-2 bg-rose-500">{notifications.filter(n => !n.isRead).length}</Badge>
                        )}
                    </Button>
                    <Button
                        variant={filter === 'alerts' ? 'default' : 'outline'}
                        onClick={() => setFilter('alerts')}
                        className={`rounded-2xl font-bold h-10 px-6 ${filter === 'alerts' ? 'shadow-lg shadow-primary/20' : 'bg-white border-slate-200'}`}
                    >
                        Critical Alerts
                    </Button>
                </div>

                {/* Notification List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                <p className="font-bold text-slate-400 uppercase tracking-widest text-[11px]">Loading Archives...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border border-dashed rounded-3xl p-20 text-center flex flex-col items-center"
                            >
                                <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                    <Inbox className="size-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Your archive is empty</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">
                                    We didn't find any notifications matching your current filter.
                                </p>
                            </motion.div>
                        ) : (
                            filteredNotifications.map((notification, i) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className={`group border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden ${!notification.isRead ? 'ring-2 ring-primary/10' : ''}`}>
                                        <CardContent className="p-0">
                                            <div className="flex items-stretch min-h-[100px]">
                                                {/* Left Indicator */}
                                                <div className={`w-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-primary' : 'bg-slate-200'}`} />

                                                {/* Content Area */}
                                                <div className="flex-1 p-6 flex gap-6">
                                                    <div className={`mt-1 size-14 rounded-2xl flex items-center justify-center border-2 border-white shadow-xl flex-shrink-0 ${getTypeStyles(notification.type)}`}>
                                                        {getIcon(notification.type)}
                                                    </div>

                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className={`text-lg tracking-tight truncate pr-4 ${!notification.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                                                                    {notification.title}
                                                                </h4>
                                                                {!notification.isRead && (
                                                                    <Badge className="bg-primary text-[10px] font-black uppercase tracking-tighter px-1.5 h-4">NEW</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className={`text-sm leading-relaxed max-w-2xl ${!notification.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                                            {notification.message}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!notification.isRead && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="size-10 rounded-xl hover:bg-primary/10 text-primary"
                                                                title="Mark as Read"
                                                            >
                                                                <Check className="size-5" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="size-10 rounded-xl hover:bg-rose-50 text-rose-400 hover:text-rose-600"
                                                            title="Delete Forever"
                                                        >
                                                            <Trash2 className="size-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Insight */}
                <div className="mt-12 text-center p-8 bg-white/50 border border-white rounded-3xl backdrop-blur-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Notification Insights</p>
                    <div className="flex justify-center gap-12">
                        <div className="text-center">
                            <p className="text-3xl font-black text-slate-900">{notifications.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Logs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-emerald-500">{notifications.filter(n => n.isRead).length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Archived</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-primary">{notifications.filter(n => !n.isRead).length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
