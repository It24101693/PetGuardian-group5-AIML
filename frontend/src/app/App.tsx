import { RouterProvider } from 'react-router';
import { AuthProvider } from './components/contexts/AuthContext';
import { PetProvider } from './components/contexts/PetContext';
import { router } from './routes';
import './styles/animations.css';

export default function App() {
    return (
        <AuthProvider>
            <PetProvider>
                <RouterProvider router={router} />
            </PetProvider>
        </AuthProvider>
    );
}