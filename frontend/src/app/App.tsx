import { RouterProvider } from 'react-router';
import { AuthProvider } from './components/contexts/AuthContext';
import { PetProvider } from './components/contexts/PetContext';
import { ChatProvider } from './components/contexts/ChatContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import { router } from './routes';
import { FloatingAIChatbot } from './components/FloatingAIChatbot';
import './styles/animations.css';

export default function App() {
    return (
        <AuthProvider>
            <PetProvider>
                <NotificationProvider>
                    <ChatProvider>
                        <RouterProvider router={router} />
                        <FloatingAIChatbot />
                    </ChatProvider>
                </NotificationProvider>
            </PetProvider>
        </AuthProvider>
    );
}