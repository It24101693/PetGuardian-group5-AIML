import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useChat, Message } from '../contexts/ChatContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { ArrowLeft, Send, User, Heart, PawPrint } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { chatApi } from '../../services/api';

export default function DirectChat() {
    const { userId } = useParams<{ userId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [recipientName, setRecipientName] = useState('User');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchHistory = async () => {
        if (!user || !userId) return;
        try {
            const history = await chatApi.getHistory(user.id.toString(), userId);
            setMessages(history);
        } catch (e) {
            console.error('Error fetching chat history:', e);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000); // Poll for new messages every 5s
        return () => clearInterval(interval);
    }, [userId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || !user || !userId) return;

        try {
            const newMessage = await chatApi.sendMessage({
                content: input,
                senderId: user.id.toString(),
                receiverId: userId,
                isAi: false
            });
            setMessages(prev => [...prev, newMessage]);
            setInput('');
        } catch (e) {
            console.error('Error sending message:', e);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/owner/dashboard" className="flex items-center gap-1 group">
                        <div className="relative flex items-center">
                            <Heart className="size-8 text-primary" fill="currentColor" />
                            <div className="absolute -right-2 -top-1 flex">
                                <PawPrint className="size-4 text-accent rotate-12" fill="currentColor" />
                                <PawPrint className="size-4 text-accent -rotate-12 mt-2 -ml-1" fill="currentColor" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-primary ml-2">PetGuardian Chat</span>
                    </Link>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
                <div className="container mx-auto max-w-2xl space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.senderId === user?.id.toString() ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.senderId !== user?.id.toString() && (
                                <Avatar className="size-8">
                                    <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.senderId === user?.id.toString()
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-white border'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-[10px] mt-1 opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <div className="container mx-auto max-w-2xl flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!input.trim()}>
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
