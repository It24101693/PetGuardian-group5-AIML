import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { communityApi, chatApi } from '../../services/api';
import { useAuth } from './AuthContext';

export interface CommunityPost {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    timestamp: string;
    likes: number;
    comments: number;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp: string;
    isAi: boolean;
}

interface ChatContextType {
    posts: CommunityPost[];
    aiMessages: Message[];
    loading: boolean;

    // Community
    fetchPosts: () => Promise<void>;
    addPost: (content: string) => Promise<void>;
    deletePost: (id: string) => Promise<void>;

    // AI Chat
    fetchAiHistory: () => Promise<void>;
    sendAiQuery: (query: string) => Promise<void>;

    // Knowledge Base (Admin)
    addKnowledge: (keyword: string, response: string, category: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [aiMessages, setAiMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await communityApi.getAll();
            setPosts(data.map((p: any) => ({ ...p, id: p.id.toString() })));
        } catch (e) {
            console.error('Error fetching posts:', e);
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (content: string) => {
        if (!user) return;
        try {
            const newPost = await communityApi.create({
                content,
                authorId: Number(user.id)
            });
            setPosts(prev => [{ ...newPost, id: newPost.id.toString() }, ...prev]);
        } catch (e) {
            console.error('Error adding post:', e);
        }
    };

    const deletePost = async (id: string) => {
        try {
            await communityApi.delete(Number(id));
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.error('Error deleting post:', e);
        }
    };

    const fetchAiHistory = async () => {
        if (!user) return;
        try {
            const data = await chatApi.getAiHistory(user.id.toString());
            setAiMessages(data.map((m: any) => ({ ...m, id: m.id.toString() })));
        } catch (e) {
            console.error('Error fetching AI history:', e);
        }
    };

    const sendAiQuery = async (query: string) => {
        if (!user) return;
        try {
            // Add user message locally first
            const userMsg: Message = {
                id: `temp-${Date.now()}`,
                content: query,
                senderId: user.id.toString(),
                receiverId: 'assistant',
                timestamp: new Date().toISOString(),
                isAi: false
            };
            setAiMessages(prev => [...prev, userMsg]);

            const aiResponse = await chatApi.queryAi(user.id.toString(), query);
            setAiMessages(prev => [...prev.filter(m => !m.id.startsWith('temp-')), { ...aiResponse, id: aiResponse.id.toString() }]);
        } catch (e) {
            console.error('Error querying AI:', e);
        }
    };

    const addKnowledge = async (keyword: string, response: string, category: string) => {
        try {
            await chatApi.addAdminKnowledge({ keyword, response, category });
        } catch (e) {
            console.error('Error adding knowledge:', e);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPosts();
            fetchAiHistory();
        }
    }, [user]);

    return (
        <ChatContext.Provider value={{
            posts,
            aiMessages,
            loading,
            fetchPosts,
            addPost,
            deletePost,
            fetchAiHistory,
            sendAiQuery,
            addKnowledge
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
