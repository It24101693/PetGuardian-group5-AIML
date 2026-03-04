import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group'; // Replaced with custom buttons for better UI
import { Heart, PawPrint, Shield, Star, Sparkles, ArrowRight, User as UserIcon, Stethoscope, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginRole, setLoginRole] = useState<'owner' | 'vet'>('owner');

    // Register state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regRole, setRegRole] = useState<'owner' | 'vet'>('owner');
    const [regClinicId, setRegClinicId] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // ── Predefined admin credentials (checked client-side for auto-routing)
    const ADMIN_EMAIL = 'admin@petguardian.com';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // If email matches admin, override role to 'admin'
            const effectiveRole = loginEmail.toLowerCase() === ADMIN_EMAIL ? 'admin' : loginRole;
            await login(loginEmail, loginPassword, effectiveRole);
            if (effectiveRole === 'admin') {
                navigate('/');
            } else {
                navigate(loginRole === 'owner' ? '/owner/dashboard' : '/vet/dashboard');
            }
        } catch (error: any) {
            alert(error?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (regPassword !== regConfirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            await register(regName, regEmail, regPassword, regRole, regClinicId || undefined);

            // Switch to login tab and pre-fill details after successful registration
            setLoginEmail(regEmail);
            setLoginRole(regRole);
            setLoginPassword('');
            setRegPassword('');
            setRegConfirmPassword('');
            setActiveTab('login');
            setRegistrationSuccess(true);

        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden selection:bg-primary/30 font-sans">
            {/* Left Side: Branding & Animations (hidden on mobile) */}
            <div className="hidden lg:flex relative bg-primary items-center justify-center p-12 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply blur-3xl animate-blob" />
                    <div className="absolute top-1/3 -right-20 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Floating Icons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-white/10"
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                                scale: Math.random() * 0.5 + 0.5,
                                rotate: Math.random() * 360
                            }}
                            animate={{
                                y: ["-10%", "110%"],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <PawPrint className="size-12" />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="relative z-10 w-full max-w-lg text-white font-sans">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/" className="inline-flex items-center gap-2 mb-12 hover:scale-105 transition-transform group">
                            <Heart className="size-12 text-accent group-hover:animate-pulse" fill="currentColor" />
                            <span className="text-4xl font-black tracking-tighter">PetGuardian</span>
                        </Link>

                        <h1 className="text-6xl font-bold leading-tight mb-8 font-sans">
                            Your pet's health, <br />
                            <span className="text-accent">reimagined.</span>
                        </h1>

                        <div className="space-y-6">
                            {[
                                { icon: Shield, text: "Secure medical history for every pet" },
                                { icon: Star, text: "Direct connection with top veterinarians" },
                                { icon: Sparkles, text: "AI-powered health insights and reminders" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-4 text-xl font-medium"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                >
                                    <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                        <item.icon className="size-6 text-accent" />
                                    </div>
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom branding */}
                <div className="absolute bottom-8 left-12 text-white/40 text-sm font-medium">
                    © 2024 PetGuardian Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:bg-accent/5 font-sans">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[440px]"
                >
                    {/* Header for mobile */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
                        <Heart className="size-10 text-primary" fill="currentColor" />
                        <span className="text-3xl font-black tracking-tighter text-primary">PetGuardian</span>
                    </div>

                    <div className="glass p-8 sm:p-10 rounded-3xl shadow-2xl border border-white dark:border-white/10 relative overflow-hidden font-sans">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent" />

                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-foreground mb-2">
                                {activeTab === 'login' ? 'Welcome back!' : 'Join our pack'}
                            </h2>
                            <p className="text-muted-foreground font-medium">
                                {activeTab === 'login' ? 'Access your pet\'s health dashboard' : 'Start managing your pet\'s wellness journey'}
                            </p>
                        </div>

                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => {
                                setActiveTab(v as any);
                                setRegistrationSuccess(false);
                            }}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-2xl mb-8">
                                <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Login</TabsTrigger>
                                <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Sign Up</TabsTrigger>
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Login Tab Content */}
                                    {activeTab === 'login' && (
                                        <form onSubmit={handleLogin} className="space-y-6">
                                            {registrationSuccess && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-100 flex items-start gap-4 shadow-sm"
                                                >
                                                    <div className="bg-teal-500/10 p-2 rounded-xl">
                                                        <Sparkles className="size-5 text-teal-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-teal-900">Sign up successful!</h4>
                                                        <p className="text-xs font-medium text-teal-700/80 leading-relaxed mt-0.5">
                                                            Welcome to the pack. We've pre-filled your email.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 gap-3 mb-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setLoginRole('owner')}
                                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${loginRole === 'owner' && loginEmail.toLowerCase() !== 'admin@petguardian.com'
                                                            ? 'border-primary bg-primary/5 shadow-inner'
                                                            : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                                            }`}
                                                    >
                                                        <UserIcon className={`size-5 ${loginRole === 'owner' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        <span className={`text-xs font-bold ${loginRole === 'owner' ? 'text-primary' : 'text-muted-foreground'}`}>Owner</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLoginRole('vet')}
                                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${loginRole === 'vet' && loginEmail.toLowerCase() !== 'admin@petguardian.com'
                                                            ? 'border-primary bg-primary/5 shadow-inner'
                                                            : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                                            }`}
                                                    >
                                                        <Stethoscope className={`size-5 ${loginRole === 'vet' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        <span className={`text-xs font-bold ${loginRole === 'vet' ? 'text-primary' : 'text-muted-foreground'}`}>Vet</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLoginEmail('admin@petguardian.com')}
                                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${loginEmail.toLowerCase() === 'admin@petguardian.com'
                                                            ? 'border-violet-500 bg-violet-50 shadow-inner'
                                                            : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                                            }`}
                                                    >
                                                        <ShieldCheck className={`size-5 ${loginEmail.toLowerCase() === 'admin@petguardian.com' ? 'text-violet-600' : 'text-muted-foreground'}`} />
                                                        <span className={`text-xs font-bold ${loginEmail.toLowerCase() === 'admin@petguardian.com' ? 'text-violet-600' : 'text-muted-foreground'}`}>Admin</span>
                                                    </button>
                                                </div>


                                                <div className="space-y-2">
                                                    <Label htmlFor="login-email" className="font-bold text-sm ml-1">Email Address</Label>
                                                    <Input
                                                        id="login-email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        value={loginEmail}
                                                        onChange={(e) => setLoginEmail(e.target.value)}
                                                        className="h-12 bg-white/50 backdrop-blur-sm border-2 border-transparent focus:border-primary/20 transition-all rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between ml-1">
                                                        <Label htmlFor="login-password" name="login-password-label" className="font-bold text-sm">Password</Label>
                                                        <button type="button" className="text-xs font-black text-primary hover:underline uppercase tracking-wider">Forgot Password?</button>
                                                    </div>
                                                    <Input
                                                        id="login-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={loginPassword}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                        className="h-12 bg-white/50 backdrop-blur-sm border-2 border-transparent focus:border-primary/20 transition-all rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full h-14 text-lg font-black rounded-xl shadow-xl transition-all active:scale-[0.98] group bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
                                                {isLoading ? 'Processing...' : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        Sign In <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    )}

                                    {/* Register Tab Content */}
                                    {activeTab === 'register' && (
                                        <form onSubmit={handleRegister} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setRegRole('owner')}
                                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${regRole === 'owner' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/30'}`}
                                                >
                                                    <UserIcon className="size-4" />
                                                    <span className="text-xs font-bold">Owner</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRegRole('vet')}
                                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${regRole === 'vet' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/30'}`}
                                                >
                                                    <Stethoscope className="size-4" />
                                                    <span className="text-xs font-bold">Vet</span>
                                                </button>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-name" className="font-bold text-sm ml-1">Full Name</Label>
                                                    <Input
                                                        id="reg-name"
                                                        placeholder="John Doe"
                                                        value={regName}
                                                        onChange={(e) => setRegName(e.target.value)}
                                                        className="h-12 bg-white/50 border-2 border-transparent focus:border-primary/20 rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-email" className="font-bold text-sm ml-1">Email</Label>
                                                    <Input
                                                        id="reg-email"
                                                        type="email"
                                                        placeholder="john@doe.com"
                                                        value={regEmail}
                                                        onChange={(e) => setRegEmail(e.target.value)}
                                                        className="h-12 bg-white/50 border-2 border-transparent focus:border-primary/20 rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {regRole === 'vet' && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2">
                                                    <Label htmlFor="reg-clinic" className="font-bold text-sm ml-1">Clinic ID / License</Label>
                                                    <Input
                                                        id="reg-clinic"
                                                        placeholder="VET-XXXXX"
                                                        value={regClinicId}
                                                        onChange={(e) => setRegClinicId(e.target.value)}
                                                        className="h-12 bg-white/50 border-2 border-transparent focus:border-primary/20 rounded-xl font-medium"
                                                    />
                                                </motion.div>
                                            )}

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-password" name="reg-password-label" className="font-bold text-sm ml-1">Password</Label>
                                                    <Input
                                                        id="reg-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={regPassword}
                                                        onChange={(e) => setRegPassword(e.target.value)}
                                                        className="h-12 bg-white/50 border-2 border-transparent focus:border-primary/20 rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-confirm-password" name="reg-confirm-label" className="font-bold text-sm ml-1">Confirm</Label>
                                                    <Input
                                                        id="reg-confirm-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={regConfirmPassword}
                                                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                                                        className="h-12 bg-white/50 border-2 border-transparent focus:border-primary/20 rounded-xl font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full h-14 text-lg font-black rounded-xl shadow-xl mt-2 group bg-primary hover:bg-primary/90 text-white transition-all active:scale-[0.98]" disabled={isLoading}>
                                                {isLoading ? 'Creating Account...' : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        Get Started <Sparkles className="size-5 group-hover:scale-110 transition-transform text-accent" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-muted-foreground font-medium">
                            {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                                className="ml-2 font-black text-primary hover:underline uppercase tracking-tight"
                            >
                                {activeTab === 'login' ? 'Create one for free' : 'Sign in here'}
                            </button>
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
