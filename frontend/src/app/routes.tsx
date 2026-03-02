import { createBrowserRouter } from 'react-router';
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import OwnerDashboard from './components/pages/OwnerDashboard';
import PetPassport from './components/pages/PetPassport';
import AIChatbot from './components/pages/AIChatbot';
import VetDashboard from './components/pages/VetDashboard';
import CommunityPage from './components/pages/CommunityPage';
import VetSearchPage from './components/pages/VetSearchPage';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: LandingPage,
    },
    {
        path: '/search',
        Component: VetSearchPage,
    },
    {
        path: '/auth',
        Component: AuthPage,
    },
    {
        path: '/owner/dashboard',
        Component: OwnerDashboard,
    },
    {
        path: '/owner/pet/:petId',
        Component: PetPassport,
    },
    {
        path: '/owner/ai-chat',
        Component: AIChatbot,
    },
    {
        path: '/owner/community',
        Component: CommunityPage,
    },
    {
        path: '/vet/dashboard',
        Component: VetDashboard,
    },
    {
        path: '/vet/appointments',
        Component: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Appointments</h1>
                    <p className="text-muted-foreground">Full appointments page coming soon...</p>
                </div>
            </div>
        ),
    },
    {
        path: '/vet/patients',
        Component: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Patient Directory</h1>
                    <p className="text-muted-foreground">Full patient directory coming soon...</p>
                </div>
            </div>
        ),
    },
    {
        path: '*',
        Component: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-4">Page not found</p>
                    <a href="/" className="text-primary hover:underline">Go back home</a>
                </div>
            </div>
        ),
    },
]);