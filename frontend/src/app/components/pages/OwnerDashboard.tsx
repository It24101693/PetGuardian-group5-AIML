import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePets } from '../contexts/PetContext';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Heart, PawPrint, Bot, Settings, LogOut, Plus, Calendar, Activity, Camera, Trash2, Edit3, Loader2, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { symptomScanApi } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationCenter } from '../NotificationCenter';

export default function OwnerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pets, vaccinations, addPet } = usePets();

    // Regular states
    const [showAddPetDialog, setShowAddPetDialog] = useState(false);

    // AI Symptom Scanner states
    const [showScannerDialog, setShowScannerDialog] = useState(false);
    const [scannerImageFile, setScannerImageFile] = useState<File | null>(null);
    const [scannerImagePreview, setScannerImagePreview] = useState<string>('');
    const [isScannerAnalyzing, setIsScannerAnalyzing] = useState(false);
    const [scannerResults, setScannerResults] = useState<any>(null);
    const [scanHistory, setScanHistory] = useState<any[]>([]);
    const [selectedPetForScan, setSelectedPetForScan] = useState<string>('');
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Existing "Add Pet" AI variables
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<{
        species?: string;
        breed?: string;
        estimatedAge?: number;
        estimatedWeight?: number;
    } | null>(null);

    // Load Scan History
    const loadScanHistory = async (petId: string) => {
        if (!petId) return;
        setIsLoadingHistory(true);
        try {
            const data = await symptomScanApi.getByPetId(Number(petId));
            setScanHistory(data);
        } catch (error) {
            console.error('Failed to load scan history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };
    const [newPetForm, setNewPetForm] = useState({
        name: '',
        species: '',
        breed: '',
        dateOfBirth: '',
        weight: '',
        chipNumber: '',
        imageUrl: ''
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Get upcoming reminders
    const upcomingReminders = vaccinations
        .filter(v => {
            const dueDate = new Date(v.nextDueDate);
            const today = new Date();
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays >= 0;
        })
        .map(v => ({
            ...v,
            pet: pets.find(p => p.id === v.petId)
        }));

    const handleAddPet = async () => {
        if (!newPetForm.name || !newPetForm.species || !newPetForm.breed || !newPetForm.dateOfBirth || !newPetForm.weight) {
            alert('Please fill in all required fields');
            return;
        }

        const dateOfBirth = new Date(newPetForm.dateOfBirth);
        const age = new Date().getFullYear() - dateOfBirth.getFullYear();

        try {
            await addPet({
                name: newPetForm.name,
                species: newPetForm.species,
                breed: newPetForm.breed,
                dateOfBirth: newPetForm.dateOfBirth,
                age: age,
                weight: parseFloat(newPetForm.weight),
                chipNumber: newPetForm.chipNumber || undefined,
                imageUrl: imagePreview || newPetForm.imageUrl || '/placeholder-dog.svg',
                status: 'healthy',
                ownerId: (user?.id || 1).toString()
            });

            // Reset form
            setShowAddPetDialog(false);
            setNewPetForm({
                name: '',
                species: '',
                breed: '',
                dateOfBirth: '',
                weight: '',
                chipNumber: '',
                imageUrl: ''
            });
            setImageFile(null);
            setImagePreview('');
            setAiSuggestions(null);
        } catch (error) {
            console.error('Failed to add pet:', error);
            alert('Failed to add pet. Please try again.');
        }
    };

    // Handle Scanner image upload
    const handleScannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setScannerImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setScannerImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Run AI Symptom Scanner Analysis
    const runScannerAnalysis = async () => {
        if (!scannerImagePreview) {
            alert('Please upload an image first');
            return;
        }

        setIsScannerAnalyzing(true);
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock diseases
        const diseases = [
            { name: 'Mange (Sarcoptic)', prob: 0.85, severity: 'Moderate', advice: 'Isolate pet and consult vet for anti-parasitic treatment.' },
            { name: 'Ringworm', prob: 0.72, severity: 'Mild', advice: 'Antifungal creams and regular bathing with medicated shampoo.' },
            { name: 'Allergic Dermatitis', prob: 0.65, severity: 'Mild', advice: 'Identify and remove allergen. Consult vet for antihistamines.' },
            { name: 'Hot Spots (Pyotraumatic Dermatitis)', prob: 0.91, severity: 'Moderate', advice: 'Clip hair around area and use antiseptic spray. Prevent licking.' },
            { name: 'Flea Allergy Dermatitis', prob: 0.78, severity: 'Mild', advice: 'Strict flea control for all pets in the household.' }
        ];

        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const result = {
            diseaseName: randomDisease.name,
            probability: randomDisease.prob,
            severity: randomDisease.severity,
            precautionaryAdvice: randomDisease.advice
        };

        setScannerResults(result);
        setIsScannerAnalyzing(false);
    };

    // Save Scan to Database
    const saveScanResult = async () => {
        if (!selectedPetForScan || !scannerResults) {
            alert('Please select a pet and run analysis first');
            return;
        }

        try {
            await symptomScanApi.create({
                petId: Number(selectedPetForScan),
                imageUrl: scannerImagePreview,
                diseaseName: scannerResults.diseaseName,
                probability: scannerResults.probability,
                severity: scannerResults.severity,
                precautionaryAdvice: scannerResults.precautionaryAdvice
            });
            alert('Scan record saved successfully!');
            loadScanHistory(selectedPetForScan);
            setScannerResults(null);
            setScannerImagePreview('');
            setScannerImageFile(null);
        } catch (error) {
            console.error('Failed to save scan:', error);
            alert('Failed to save scan record');
        }
    };

    // Delete Scan Record
    const deleteScanRecord = async (id: number) => {
        if (!confirm('Are you sure you want to delete this scan record?')) return;
        try {
            await symptomScanApi.delete(id);
            setScanHistory(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete scan:', error);
        }
    };

    // Update Severity
    const updateScanSeverity = async (id: number, newSeverity: string) => {
        try {
            await symptomScanApi.updateSeverity(id, newSeverity);
            setScanHistory(prev => prev.map(s => s.id === id ? { ...s, severity: newSeverity } : s));
        } catch (error) {
            console.error('Failed to update severity:', error);
        }
    };

    // Handle image upload and AI analysis for new pet
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Simulate AI analysis
        setIsAnalyzing(true);

        // Mock AI prediction (in real app, this would call an AI API)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate AI predictions based on common breeds
        const predictions = simulateAIPrediction();
        setAiSuggestions(predictions);

        // Auto-fill form with AI suggestions
        setNewPetForm(prev => ({
            ...prev,
            species: predictions.species || prev.species,
            breed: predictions.breed || prev.breed,
            weight: predictions.estimatedWeight?.toString() || prev.weight,
            dateOfBirth: predictions.estimatedAge
                ? new Date(new Date().setFullYear(new Date().getFullYear() - predictions.estimatedAge)).toISOString().split('T')[0]
                : prev.dateOfBirth
        }));

        setIsAnalyzing(false);
    };

    // Simulate AI prediction (mock function)
    const simulateAIPrediction = () => {
        const dogBreeds = [
            { breed: 'Golden Retriever', weight: 30, age: 3 },
            { breed: 'Labrador Retriever', weight: 32, age: 4 },
            { breed: 'German Shepherd', weight: 35, age: 3 },
            { breed: 'Beagle', weight: 12, age: 2 },
            { breed: 'Bulldog', weight: 22, age: 4 },
            { breed: 'Poodle', weight: 25, age: 3 },
        ];

        const catBreeds = [
            { breed: 'Persian', weight: 4.5, age: 3 },
            { breed: 'Siamese', weight: 4, age: 2 },
            { breed: 'Maine Coon', weight: 6.5, age: 3 },
            { breed: 'British Shorthair', weight: 5, age: 4 },
        ];

        // Randomly decide if it's a dog or cat (70% dog, 30% cat)
        const isDog = Math.random() > 0.3;
        const breeds = isDog ? dogBreeds : catBreeds;
        const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

        return {
            species: isDog ? 'Dog' : 'Cat',
            breed: randomBreed.breed,
            estimatedAge: randomBreed.age,
            estimatedWeight: randomBreed.weight
        };
    };

    // Reset form when dialog opens
    const handleDialogOpen = (open: boolean) => {
        setShowAddPetDialog(open);
        if (!open) {
            // Reset everything when closing
            setNewPetForm({
                name: '',
                species: '',
                breed: '',
                dateOfBirth: '',
                weight: '',
                chipNumber: '',
                imageUrl: ''
            });
            setImageFile(null);
            setImagePreview('');
            setAiSuggestions(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
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
                        <span className="text-2xl font-bold text-primary ml-2">PetGuardian</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        {user?.role === 'admin' && (
                            <Link to="/admin/dashboard">
                                <Button variant="ghost" className="text-violet-600 font-bold border border-violet-200 bg-violet-50 hover:bg-violet-100">
                                    🛡️ Admin Dashboard
                                </Button>
                            </Link>
                        )}
                        <Link to="/">
                            <Button variant="ghost">Home</Button>
                        </Link>
                        <Link to="/owner/community">
                            <Button variant="ghost">Community</Button>
                        </Link>
                        <Link to="/owner/ai-chat">
                            <Button variant="ghost">
                                <Bot className="size-4 mr-2" />
                                AI Assistant
                            </Button>
                        </Link>
                        <NotificationCenter />
                        <Button variant="ghost" size="icon">
                            <Settings className="size-5" />
                        </Button>
                        {/* User profile badge */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${user?.role === 'admin' ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                            {user?.role === 'admin' ? '🛡️ ADMIN' : `👤 ${user?.name}`}
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="size-4 mr-2" />
                            Logout
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-muted-foreground">Here's what's happening with your pets today</p>
                </div>

                {/* My Pets Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">My Pets</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pets.map(pet => (
                            <Link key={pet.id} to={`/owner/pet/${pet.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <CardHeader className="pb-3">
                                        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                                            <img
                                                src={pet.imageUrl}
                                                alt={pet.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{pet.name}</CardTitle>
                                                <CardDescription>{pet.breed}</CardDescription>
                                            </div>
                                            {pet.status === 'healthy' && (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    🟢 Healthy
                                                </Badge>
                                            )}
                                            {pet.status === 'vaccine-due' && (
                                                <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
                                                    🟠 Vaccine Due
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>Age:</span>
                                                <span className="font-medium text-foreground">{pet.age} years</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Weight:</span>
                                                <span className="font-medium text-foreground">{pet.weight} kg</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {/* Add Pet Card */}
                        <Card
                            className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center min-h-[300px]"
                            onClick={() => setShowAddPetDialog(true)}
                        >
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Plus className="size-8 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg">Add New Pet</h3>
                                <p className="text-sm text-muted-foreground text-center mt-2">
                                    Create a health profile for your pet
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Upcoming Reminders */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Upcoming Reminders</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {upcomingReminders.length > 0 ? (
                            upcomingReminders.map(reminder => {
                                const dueDate = new Date(reminder.nextDueDate);
                                const today = new Date();
                                const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                return (
                                    <Card key={reminder.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="size-5 text-primary" />
                                                    <div>
                                                        <CardTitle className="text-lg">{reminder.vaccineName}</CardTitle>
                                                        <CardDescription>
                                                            {reminder.pet?.name} â€¢ Due in {diffDays} day{diffDays !== 1 ? 's' : ''}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">{dueDate.toLocaleDateString()}</Badge>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card className="md:col-span-2">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    <PawPrint className="size-12 mx-auto mb-2 opacity-50" />
                                    <p>No upcoming reminders. All vaccinations are up to date! 🎉</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden group h-full"
                            onClick={() => setShowScannerDialog(true)}
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="size-12 text-primary rotate-12" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                        <Camera className="size-7" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">AI Skin Scanner</CardTitle>
                                        <CardDescription className="font-medium text-primary/70">Expert disease screening</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Link to="/owner/ai-chat" className="block h-full">
                            <Card className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 relative overflow-hidden group h-full">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Bot className="size-12 text-accent -rotate-12" />
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                            <Bot className="size-7" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">AI Health Chat</CardTitle>
                                            <CardDescription className="font-medium text-accent/70">Instant vet-approved advice</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Card className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden group h-full">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar className="size-12 text-primary rotate-12" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:-rotate-6 transition-transform">
                                        <Calendar className="size-7" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Schedule Checkup</CardTitle>
                                        <CardDescription className="font-medium text-primary/70">Book expert care</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Link to="/owner/community" className="block h-full">
                            <Card className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 relative overflow-hidden group h-full">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Heart className="size-12 text-accent rotate-12" />
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Heart className="size-7" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Community</CardTitle>
                                            <CardDescription className="font-medium text-accent/70">Join fellow pet parents</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    </motion.div>
                </section>

                {/* AI Symptom Scan History */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="size-6 text-primary" />
                            AI Skin Scan History
                        </h2>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="petFilter" className="text-sm">Filter by Pet:</Label>
                            <select
                                id="petFilter"
                                className="text-sm border rounded p-1"
                                value={selectedPetForScan}
                                onChange={(e) => {
                                    setSelectedPetForScan(e.target.value);
                                    loadScanHistory(e.target.value);
                                }}
                            >
                                <option value="">Select a pet</option>
                                {pets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedPetForScan ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {isLoadingHistory ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="col-span-full py-12 text-center"
                                    >
                                        <Loader2 className="size-12 animate-spin mx-auto text-primary opacity-50" />
                                        <p className="mt-4 text-muted-foreground font-medium">Retrieving scan history...</p>
                                    </motion.div>
                                ) : scanHistory.length > 0 ? (
                                    scanHistory.map((scan, index) => (
                                        <motion.div
                                            key={scan.id}
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            layout
                                        >
                                            <Card className="hover:shadow-xl transition-all border-l-4 border-l-primary group">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{scan.diseaseName}</CardTitle>
                                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                                <Calendar className="size-3" />
                                                                {new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </CardDescription>
                                                        </div>
                                                        <Badge
                                                            variant={scan.probability > 0.8 ? "destructive" : "secondary"}
                                                            className="px-2 py-1"
                                                        >
                                                            {(scan.probability * 100).toFixed(0)}% Match
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-inner group">
                                                        <img src={scan.imageUrl} alt="Scan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                            <span className="text-white text-xs font-medium">View original image</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                                        <div className="flex items-center gap-2 mb-1 text-primary font-bold text-xs uppercase tracking-wider">
                                                            <ShieldCheck className="size-3" /> Recommended Action
                                                        </div>
                                                        <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-2">
                                                            "{scan.precautionaryAdvice}"
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t">
                                                        <Badge className={
                                                            scan.severity === 'Severe' ? 'bg-red-500 hover:bg-red-600' :
                                                                scan.severity === 'Moderate' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                                                        }>
                                                            {scan.severity}
                                                        </Badge>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => {
                                                                    const newSev = scan.severity === 'Mild' ? 'Moderate' : scan.severity === 'Moderate' ? 'Severe' : 'Mild';
                                                                    updateScanSeverity(scan.id, newSev);
                                                                }}
                                                            >
                                                                <Edit3 className="size-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() => deleteScanRecord(scan.id)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl bg-muted/20"
                                    >
                                        <div className="bg-muted size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Camera className="size-8 text-muted-foreground opacity-40" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">No scans yet</h3>
                                        <p className="text-muted-foreground mt-1 max-w-xs mx-auto">Start your first skin screening to see results here.</p>
                                        <Button
                                            variant="outline"
                                            className="mt-6 border-primary text-primary hover:bg-primary/5"
                                            onClick={() => setShowScannerDialog(true)}
                                        >
                                            New Skin Screening
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Card className="bg-muted/30 border-dashed">
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <Bot className="size-12 mx-auto mb-2 opacity-50" />
                                <p>Select a pet to view their AI Skin Scan history</p>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </main>

            {/* Add Pet Dialog */}
            <Dialog open={showAddPetDialog} onOpenChange={handleDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bot className="size-5 text-accent" />
                            Add New Pet with AI
                        </DialogTitle>
                        <DialogDescription>
                            Upload a photo and let AI predict your pet's details
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Image Upload Section */}
                        <div className="space-y-3">
                            <Label htmlFor="imageFile" className="text-base font-semibold">
                                Step 1: Upload Pet Photo
                            </Label>
                            <div className="border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary transition-colors">
                                <div className="flex flex-col items-center gap-3">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Pet preview"
                                                className="w-48 h-48 object-cover rounded-lg"
                                            />
                                            {isAnalyzing && (
                                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                                    <div className="text-white text-center">
                                                        <Bot className="size-8 animate-pulse mx-auto mb-2" />
                                                        <p className="text-sm">Analyzing image...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <PawPrint className="size-12 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Click to upload pet photo</p>
                                        </div>
                                    )}
                                    <Input
                                        id="imageFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* AI Suggestions Display */}
                            {aiSuggestions && !isAnalyzing && (
                                <Card className="border-accent/50 bg-accent/5">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Bot className="size-4 text-accent" />
                                            AI Predictions (Auto-filled)
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            âš ï¸ Please verify and edit these suggestions as they may not be 100% accurate
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Species</p>
                                                <p className="font-semibold">{aiSuggestions.species}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Breed</p>
                                                <p className="font-semibold">{aiSuggestions.breed}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Estimated Age</p>
                                                <p className="font-semibold">{aiSuggestions.estimatedAge} years</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Estimated Weight</p>
                                                <p className="font-semibold">{aiSuggestions.estimatedWeight} kg</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                Step 2: Verify & Complete Details
                            </Label>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newPetForm.name}
                                        onChange={(e) => setNewPetForm({ ...newPetForm, name: e.target.value })}
                                        placeholder="e.g., Bella"
                                        className="col-span-3"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="species" className="text-right">
                                        Species *
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="species"
                                            value={newPetForm.species}
                                            onChange={(e) => setNewPetForm({ ...newPetForm, species: e.target.value })}
                                            placeholder="e.g., Dog, Cat"
                                            className={aiSuggestions ? 'border-accent' : ''}
                                        />
                                        {aiSuggestions && (
                                            <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-accent/10">
                                                AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="breed" className="text-right">
                                        Breed *
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="breed"
                                            value={newPetForm.breed}
                                            onChange={(e) => setNewPetForm({ ...newPetForm, breed: e.target.value })}
                                            placeholder="e.g., Golden Retriever"
                                            className={aiSuggestions ? 'border-accent' : ''}
                                        />
                                        {aiSuggestions && (
                                            <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-accent/10">
                                                AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dateOfBirth" className="text-right">
                                        Birth Date *
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={newPetForm.dateOfBirth}
                                            onChange={(e) => setNewPetForm({ ...newPetForm, dateOfBirth: e.target.value })}
                                            className={aiSuggestions ? 'border-accent' : ''}
                                        />
                                        {aiSuggestions && (
                                            <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-accent/10">
                                                AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="weight" className="text-right">
                                        Weight (kg) *
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            value={newPetForm.weight}
                                            onChange={(e) => setNewPetForm({ ...newPetForm, weight: e.target.value })}
                                            placeholder="e.g., 30"
                                            className={aiSuggestions ? 'border-accent' : ''}
                                        />
                                        {aiSuggestions && (
                                            <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-accent/10">
                                                AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="chipNumber" className="text-right">
                                        Chip Number
                                    </Label>
                                    <Input
                                        id="chipNumber"
                                        value={newPetForm.chipNumber}
                                        onChange={(e) => setNewPetForm({ ...newPetForm, chipNumber: e.target.value })}
                                        placeholder="e.g., CH123456789"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAddPet}
                            disabled={isAnalyzing}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <PawPrint className="size-4 mr-2" />
                            Create Pet Profile
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Symptom Scanner Dialog */}
            <Dialog open={showScannerDialog} onOpenChange={(open) => {
                setShowScannerDialog(open);
                if (!open) {
                    setScannerImageFile(null);
                    setScannerImagePreview('');
                    setScannerResults(null);
                }
            }}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Bot className="size-6 text-primary" />
                            AI Skin Symptom Scanner
                        </DialogTitle>
                        <DialogDescription>
                            Identify common pet skin diseases using image recognition
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid md:grid-cols-2 gap-6 py-4">
                        {/* Upload Side */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">1. Select Pet</Label>
                                <select
                                    className="w-full border rounded-md p-2"
                                    value={selectedPetForScan}
                                    onChange={(e) => setSelectedPetForScan(e.target.value)}
                                >
                                    <option value="">Choose a pet...</option>
                                    {pets.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold">2. Upload Photo</Label>
                                <div className="border-3 border-dashed rounded-2xl p-4 text-center hover:border-primary hover:bg-primary/5 transition-all bg-muted/30 relative overflow-hidden group">
                                    {scannerImagePreview ? (
                                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                                            <img src={scannerImagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                                            <AnimatePresence>
                                                {isScannerAnalyzing && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-6"
                                                    >
                                                        <div className="relative">
                                                            <Loader2 className="size-16 animate-spin-slow text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Bot className="size-6 text-white" />
                                                            </div>
                                                        </div>
                                                        <p className="mt-6 text-lg font-bold tracking-tight animate-pulse text-center">AI analyzing patterns...</p>
                                                        <p className="text-xs text-white/70 mt-2 text-center max-w-[180px]">Comparing with thousands of dermatological symptoms</p>

                                                        {/* Scanning Beam Animation */}
                                                        <motion.div
                                                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_15px_rgba(var(--primary),1)]"
                                                            animate={{
                                                                top: ["0%", "100%", "0%"]
                                                            }}
                                                            transition={{
                                                                duration: 2.5,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="py-12 px-4 group-hover:translate-y-[-5px] transition-transform">
                                            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                                                <Camera className="size-8 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-bold text-foreground">Click to upload</h4>
                                            <p className="text-sm text-muted-foreground mt-1 px-4">Ensure the skin area is clear and well-lit for best results</p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleScannerImageUpload}
                                        disabled={isScannerAnalyzing}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-primary hover:bg-primary/90 group"
                                    onClick={runScannerAnalysis}
                                    disabled={!scannerImagePreview || isScannerAnalyzing || !selectedPetForScan}
                                >
                                    {isScannerAnalyzing ? (
                                        <Loader2 className="size-6 animate-spin mr-2" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-6 group-hover:text-yellow-400 transition-colors" />
                                            Start AI Diagnosis
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </div>

                        {/* Result Side */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">3. Diagnosis Reports</Label>
                            <AnimatePresence mode="wait">
                                {scannerResults ? (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="space-y-4"
                                    >
                                        <Card className="bg-gradient-to-br from-primary/5 to-white border-primary/30 shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4">
                                                <Badge className="bg-primary/20 text-primary border-primary/30 h-10 px-4 text-lg font-black rounded-full">
                                                    {(scannerResults.probability * 100).toFixed(0)}%
                                                </Badge>
                                            </div>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.2em] mb-1">
                                                    <ShieldCheck className="size-3" /> Preliminary Match
                                                </div>
                                                <CardTitle className="text-3xl font-black text-foreground drop-shadow-sm">{scannerResults.diseaseName}</CardTitle>
                                                <div className="flex gap-2 items-center mt-2">
                                                    <Badge className={
                                                        scannerResults.severity === 'Severe' ? 'bg-red-500' :
                                                            scannerResults.severity === 'Moderate' ? 'bg-orange-500' : 'bg-blue-500'
                                                    }>
                                                        {scannerResults.severity} Severity
                                                    </Badge>
                                                    <div className="flex gap-1 h-2 w-24 bg-muted rounded-full overflow-hidden ml-2 shadow-inner">
                                                        <motion.div
                                                            className={`h-full ${scannerResults.severity === 'Severe' ? 'bg-red-500' :
                                                                scannerResults.severity === 'Moderate' ? 'bg-orange-500' : 'bg-blue-500'
                                                                }`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: scannerResults.severity === 'Severe' ? '90%' : scannerResults.severity === 'Moderate' ? '50%' : '25%' }}
                                                            transition={{ delay: 0.5, duration: 1 }}
                                                        />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-5">
                                                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm">
                                                    <p className="font-bold text-primary mb-2 flex items-center gap-2">
                                                        <Bot className="size-5" /> Precautionary Care Plan:
                                                    </p>
                                                    <p className="text-foreground/90 leading-relaxed font-medium">"{scannerResults.precautionaryAdvice}"</p>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 border border-orange-200 bg-orange-50/50 rounded-2xl">
                                                    <div className="size-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 border border-orange-200">
                                                        <AlertCircle className="size-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-orange-800">Veterinary Disclaimer</p>
                                                        <p className="text-xs text-orange-700 leading-tight mt-1 opacity-80">This screening is powered by AI and should not replace a professional clinical diagnosis. Consult your vet immediately for confirmation.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <Button
                                                variant="default"
                                                className="w-full h-14 bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 text-lg font-black rounded-xl"
                                                onClick={saveScanResult}
                                            >
                                                <ShieldCheck className="size-5 mr-3" />
                                                Finalize & Save Report
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10 border-muted/50 p-12 text-center"
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <Bot className="size-24 opacity-10 mb-6 drop-shadow-sm" />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-foreground mb-2">Ready for Diagnosis</h4>
                                        <p className="text-sm opacity-60 leading-relaxed">Select a pet and upload an image to generate your first AI skin screening report.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <DialogFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => setShowScannerDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
