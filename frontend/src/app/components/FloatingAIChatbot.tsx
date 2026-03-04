import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, Bot, User,
    Sparkles, Zap, ChevronRight, PawPrint,
    Stethoscope, Activity, ShieldAlert
} from 'lucide-react';
import { useChat } from './contexts/ChatContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export const FloatingAIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { aiMessages: messages, sendAiQuery } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (text?: string) => {
        const query = text || inputMessage;
        if (!query.trim()) return;

        setInputMessage('');
        setIsTyping(true);
        await sendAiQuery(query);
        setIsTyping(false);
    };

    const quickActions = [
        { label: 'Schedule Checkup', icon: <Stethoscope className="size-3" />, query: 'How do I schedule a vet checkup?' },
        { label: 'Health Risk', icon: <Activity className="size-3" />, query: 'How can I assess my pet\'s health risk?' },
        { label: 'Emergency Info', icon: <ShieldAlert className="size-3" />, query: 'What should I do in a pet emergency?' },
    ];

    const displayMessages = messages.length > 0 ? messages : [
        {
            id: 'welcome',
            role: 'assistant',
            senderId: 'assistant',
            content: "Hi! I am Looper. Happy to chat with you! 😊\nHow can I help you today?",
            timestamp: new Date().toISOString(),
            isAi: true
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[380px] sm:w-[420px] h-[600px] max-h-[80vh] flex flex-col shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 bg-white/95 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-br from-primary via-primary/90 to-accent text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Bot className="size-32 rotate-12" />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                        <Bot className="size-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">Looper</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Assistant Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50">
                            {displayMessages.map((msg, idx) => {
                                const isAi = msg.isAi || msg.senderId === 'assistant';
                                return (
                                    <motion.div
                                        key={msg.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                                    >
                                        {isAi && (
                                            <div className="size-8 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 flex-shrink-0 mt-1">
                                                <Bot className="size-4 text-accent" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isAi
                                                ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                                : 'bg-primary text-white rounded-tr-none font-medium'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1.5 px-1 uppercase tracking-tighter">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {isTyping && (
                                <div className="flex gap-3 justify-start">
                                    <div className="size-8 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 flex-shrink-0 animate-bounce">
                                        <Bot className="size-4 text-accent" />
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                        <div className="flex gap-1">
                                            <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="size-1 bg-accent/40 rounded-full" />
                                            <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="size-1 bg-accent/40 rounded-full" />
                                            <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="size-1 bg-accent/40 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions & Input */}
                        <div className="p-6 bg-white border-t space-y-4">
                            {displayMessages.length < 3 && (
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSendMessage(action.query)}
                                            className="h-9 rounded-xl border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-2"
                                        >
                                            <div className="text-primary">{action.icon}</div>
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <div className="flex-1 relative group">
                                    <Input
                                        placeholder="Type a message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="h-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus-visible:ring-primary/20 focus-visible:border-primary/40 font-medium px-4 pr-10"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-40 transition-opacity">
                                        <Sparkles className="size-4 text-primary" />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputMessage.trim()}
                                    className="size-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-95 transition-all p-0 flex items-center justify-center"
                                >
                                    <Send className="size-5 -mr-0.5" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="size-3" /> Secure
                                </div>
                                <div className="size-1 bg-slate-200 rounded-full" />
                                <div className="flex items-center gap-1">
                                    <Bot className="size-3" /> AI Powered
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all relative group ${isOpen
                    ? 'bg-white text-primary border border-slate-100'
                    : 'bg-primary text-white'
                    }`}
            >
                <div className="absolute inset-0 rounded-[2rem] bg-primary animate-ping opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
                {isOpen ? <X className="size-7" /> : <Bot className="size-8" />}

                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-1 -right-1 size-5 bg-accent border-2 border-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Sparkles className="size-3 text-white fill-white" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
};

const ShieldCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
    </svg>
);
