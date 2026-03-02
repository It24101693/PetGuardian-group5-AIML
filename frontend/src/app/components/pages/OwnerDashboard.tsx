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
import { Heart, PawPrint, Bot, Settings, LogOut, Plus, Calendar } from 'lucide-react';

export default function OwnerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pets, vaccinations, addPet } = usePets();
    const [showAddPetDialog, setShowAddPetDialog] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<{
        species?: string;
        breed?: string;
        estimatedAge?: number;
        estimatedWeight?: number;
    } | null>(null);
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
                ownerId: user?.id || '1'
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

    // Handle image upload and AI analysis
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
                        <Button variant="ghost" size="icon">
                            <Settings className="size-5" />
                        </Button>
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
                <section className="mt-8 grid md:grid-cols-3 gap-4">
                    <Link to="/owner/ai-chat">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-accent/20 rounded-lg flex items-center justify-center">
                                        <Bot className="size-6 text-accent" />
                                    </div>
                                    <div>
                                        <CardTitle>AI Health Chat</CardTitle>
                                        <CardDescription>Ask pet care questions</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Calendar className="size-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Schedule Checkup</CardTitle>
                                    <CardDescription>Book appointments</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Link to="/owner/community">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-accent/20 rounded-lg flex items-center justify-center">
                                        <Heart className="size-6 text-accent" />
                                    </div>
                                    <div>
                                        <CardTitle>Community</CardTitle>
                                        <CardDescription>Connect with owners</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
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
        </div>
    );
}
