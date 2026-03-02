import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { QrCode, Bot, Users, Shield, Heart, Calendar, PawPrint } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function LandingPage() {
    const heroAnimation = useScrollAnimation();
    const featuresAnimation = useScrollAnimation();
    const vetsAnimation = useScrollAnimation();

    return (
        <div className="min-h-screen bg-background">
            {/* Header/Navbar */}
            <header className="border-b bg-white sticky top-0 z-50 animate-fade-in-down">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Heart className="size-8 text-primary" fill="currentColor" />
                        <span className="text-2xl font-bold text-primary">PetGuardian 🐾</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/auth" className="hover:text-primary transition-colors">Pet Owner</Link>
                        <Link to="/search" className="hover:text-primary transition-colors font-medium">Find a Vet</Link>
                        <a href="#for-vets" className="hover:text-primary transition-colors">For Vets</a>
                        <Link to="/auth">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link to="/auth">
                            <Button>Sign Up</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/10">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in-left">
                            <h1 className="text-5xl font-bold mb-4 leading-tight animate-fade-in-up">
                                Your Pet's Complete Health Passport
                            </h1>
                            <img
                                src="https://www.petvet.lk/wp-content/uploads/2017/09/sitting-dog_1.5x-1.gif"
                                alt="Cute sitting dog"
                                className="w-24 md:w-32 mb-6 animate-bounce-in"
                            />
                            <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up stagger-2">
                                Digital health records, AI-powered care insights, and instant veterinary connections - all in one place.
                            </p>
                            <div className="flex gap-4 animate-fade-in-up stagger-3">
                                <Link to="/auth">
                                    <Button size="lg" className="text-lg px-8 hover-lift btn-press">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="text-lg px-8 hover-lift btn-press">
                                    Watch Demo
                                </Button>
                            </div>
                        </div>
                        <div className="relative animate-fade-in-right">
                            <img
                                src="https://images.unsplash.com/photo-1625321171045-1fea4ac688e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MXx8fHwxNzcxOTM3MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Happy pet owner with veterinarian"
                                className="rounded-2xl shadow-2xl w-full hover-scale transition-smooth"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section id="features" className="py-20 px-4">
                <div className="container mx-auto max-w-6xl" ref={featuresAnimation.ref}>
                    <div className={`text-center mb-16 ${featuresAnimation.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        <h2 className="text-4xl font-bold mb-4">Everything Your Pet Needs</h2>
                        <p className="text-xl text-muted-foreground">Comprehensive care tools for modern pet parents</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className={`hover-lift transition-smooth overflow-hidden ${featuresAnimation.isVisible ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                <img
                                    src="/digital-passport-illustration.svg"
                                    alt="Digital health passport with QR code"
                                    className="w-full h-full object-cover hover-scale transition-smooth"
                                />
                            </div>
                            <CardHeader>
                                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                                    <QrCode className="size-6 text-primary" />
                                </div>
                                <CardTitle>Digital Passport</CardTitle>
                                <CardDescription>
                                    Store all medical records, vaccinations, and health history in one secure place. Share instantly via QR code.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className={`hover-lift transition-smooth overflow-hidden ${featuresAnimation.isVisible ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
                                <img
                                    src="/ai-assistant-illustration.svg"
                                    alt="AI-powered health assistant"
                                    className="w-full h-full object-cover hover-scale transition-smooth"
                                />
                            </div>
                            <CardHeader>
                                <div className="size-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                                    <Bot className="size-6 text-accent" />
                                </div>
                                <CardTitle>AI Health Assistant</CardTitle>
                                <CardDescription>
                                    Get instant answers to pet care questions and AI-powered health risk predictions based on symptoms.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className={`hover-lift transition-smooth overflow-hidden ${featuresAnimation.isVisible ? 'animate-fade-in-up stagger-3' : 'opacity-0'}`}>
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                <img
                                    src="/vet-network-illustration.svg"
                                    alt="Connected veterinary network"
                                    className="w-full h-full object-cover hover-scale transition-smooth"
                                />
                            </div>
                            <CardHeader>
                                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                                    <Users className="size-6 text-primary" />
                                </div>
                                <CardTitle>Vet Network</CardTitle>
                                <CardDescription>
                                    Connect with top-rated veterinary professionals and manage appointments seamlessly.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* For Veterinarians Section */}
            <section id="for-vets" className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl" ref={vetsAnimation.ref}>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className={`${vetsAnimation.isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
                            <h2 className="text-4xl font-bold mb-6">Built for Veterinarians</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Streamline your practice with digital patient records, appointment management, and instant access to complete health histories.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 animate-fade-in-up stagger-1">
                                    <Shield className="size-6 text-primary mt-1 animate-float" />
                                    <div>
                                        <h4 className="font-semibold">Secure Patient Records</h4>
                                        <p className="text-muted-foreground">HIPAA-compliant storage and sharing</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 animate-fade-in-up stagger-2">
                                    <Calendar className="size-6 text-primary mt-1 animate-float" />
                                    <div>
                                        <h4 className="font-semibold">Smart Scheduling</h4>
                                        <p className="text-muted-foreground">Automated reminders and calendar integration</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 animate-fade-in-up stagger-3">
                                    <QrCode className="size-6 text-primary mt-1 animate-float" />
                                    <div>
                                        <h4 className="font-semibold">QR Code Access</h4>
                                        <p className="text-muted-foreground">Instant patient history with a simple scan</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <Card className={`bg-white hover-lift transition-smooth ${vetsAnimation.isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
                            <CardHeader>
                                <CardTitle>Join Our Network</CardTitle>
                                <CardDescription>Trusted by over 5,000 veterinary professionals</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link to="/auth">
                                    <Button className="w-full hover-glow btn-press" size="lg">Register as Veterinarian</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary/5 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-1 mb-4">
                                <div className="relative flex items-center">
                                    <Heart className="size-6 text-primary" fill="currentColor" />
                                    <div className="absolute -right-1.5 -top-1 flex">
                                        <PawPrint className="size-3 text-accent rotate-12" fill="currentColor" />
                                        <PawPrint className="size-3 text-accent -rotate-12 mt-1.5 -ml-0.5" fill="currentColor" />
                                    </div>
                                </div>
                                <span className="font-bold text-lg ml-1.5">PetGuardian</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Complete health management for your beloved pets.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/auth" className="hover:text-primary">Pet Owner</Link></li>
                                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary">About</a></li>
                                <li><a href="#" className="hover:text-primary">Contact</a></li>
                                <li><a href="#" className="hover:text-primary">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                        © 2026 PetGuardian. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

