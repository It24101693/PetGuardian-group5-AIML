import React, { useState } from 'react';
import { useNotifications } from './contexts/NotificationContext';
import {
    Bell, Check, Trash2, AlertTriangle, Info,
    Stethoscope, Syringe, Clock, X, ChevronRight,
    Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

export const NotificationCenter: React.FC = () => {
    const {
        notifications, unreadCount, markAsRead,
        markAllAsRead, deleteNotification, isLoading
    } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'EMERGENCY': return <AlertTriangle className="size-4 text-rose-500" />;
            case 'ALERT': return <AlertTriangle className="size-4 text-amber-500" />;
            case 'VACCINATION': return <Syringe className="size-4 text-teal-500" />;
            case 'APPOINTMENT': return <CalendarIcon className="size-4 text-primary" />;
            default: return <Info className="size-4 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'EMERGENCY': return 'bg-rose-50 border-rose-100';
            case 'ALERT': return 'bg-amber-50 border-amber-100';
            case 'VACCINATION': return 'bg-teal-50 border-teal-100';
            case 'APPOINTMENT': return 'bg-blue-50 border-blue-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="relative group cursor-pointer transition-all active:scale-95">
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-all border border-transparent group-hover:border-slate-300">
                        <Bell className="size-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                    </div>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 border-none shadow-2xl rounded-3xl" align="end" sideOffset={12}>
                <div className="flex items-center justify-between p-5 border-b bg-white rounded-t-3xl">
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Notifications</h3>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                            {unreadCount} UNREAD MESSAGES
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-[11px] font-black uppercase text-primary hover:bg-primary/5 rounded-xl h-8">
                                <Check className="mr-1.5 size-3" /> Mark all read
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl size-8">
                            <X className="size-4 text-slate-400" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[400px]">
                    <div className="py-2">
                        <AnimatePresence initial={false}>
                            {notifications.length === 0 ? (
                                <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
                                    <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                                        <Bell className="size-8 text-slate-200" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">All caught up!</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        No new notifications at the moment. We'll alert you here when something important happens.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification, i) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`group relative p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 ${notification.isRead ? 'border-transparent' : 'border-primary bg-primary/[0.02]'}`}
                                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                                    >
                                        <div className={`mt-1 size-10 flex-shrink-0 rounded-2xl flex items-center justify-center border shadow-sm ${getTypeColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className={`text-sm tracking-tight truncate pr-4 ${notification.isRead ? 'font-bold text-slate-600' : 'font-black text-slate-900'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pt-0.5">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                                                {notification.message}
                                            </p>
                                            <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.isRead && (
                                                    <button onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }} className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Mark as Read</button>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} className="text-[10px] font-black uppercase text-rose-500 tracking-widest hover:underline">Delete</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-slate-50/50 rounded-b-3xl">
                    <Link to="/notifications" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full rounded-2xl font-black text-[11px] uppercase tracking-widest border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                            View All History
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const CalendarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);
