import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { usePets } from '../contexts/PetContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
    Heart, ArrowLeft, QrCode, Download, Share2,
    Syringe, FileText, TrendingUp, Calendar, Weight, Hash,
    Edit, Trash2, Plus, AlertCircle, PawPrint
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Vaccination, MedicalRecord } from '../data/mockData';

export default function PetPassport() {
    const { petId } = useParams<{ petId: string }>();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        pets,
        vaccinations,
        medicalRecords,
        updatePet,
        addVaccination,
        updateVaccination,
        deleteVaccination,
        addMedicalRecord,
        updateMedicalRecord,
        deleteMedicalRecord,
        deletePet
    } = usePets();

    const [showQRCode, setShowQRCode] = useState(false);
    const [showVaccinationDialog, setShowVaccinationDialog] = useState(false);
    const [showMedicalDialog, setShowMedicalDialog] = useState(false);
    const [showPetEditDialog, setShowPetEditDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
    const [editingMedical, setEditingMedical] = useState<MedicalRecord | null>(null);

    // Form states
    const [vaccinationForm, setVaccinationForm] = useState({
        vaccineName: '',
        dateGiven: '',
        nextDueDate: '',
        veterinarian: ''
    });

    const [medicalForm, setMedicalForm] = useState({
        date: '',
        type: 'checkup' as 'checkup' | 'surgery' | 'illness' | 'injury',
        title: '',
        description: '',
        veterinarian: '',
        medications: ''
    });

    const [petEditForm, setPetEditForm] = useState({
        weight: '',
        allergies: '',
        emergencyNotes: ''
    });

    const pet = pets.find(p => p.id === petId);
    const petVaccinations = vaccinations.filter(v => v.petId === petId);
    const petMedicalRecords = medicalRecords.filter(m => m.petId === petId);

    if (!pet) {
        return <div className="p-8 text-center">Pet not found</div>;
    }

    // Mock weight history data
    const weightHistory = [
        { date: 'Jan', weight: 28 },
        { date: 'Feb', weight: 28.5 },
        { date: 'Mar', weight: 29 },
        { date: 'Apr', weight: 29.5 },
        { date: 'May', weight: pet.weight },
    ];

    // Mock health risk data
    const healthRiskData = [
        { category: 'Joint Health', risk: 25 },
        { category: 'Dental', risk: 15 },
        { category: 'Allergies', risk: 40 },
        { category: 'Heart', risk: 10 },
    ];

    // Handle vaccination submit
    const handleVaccinationSubmit = () => {
        if (!vaccinationForm.vaccineName || !vaccinationForm.dateGiven || !vaccinationForm.nextDueDate) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingVaccination) {
            updateVaccination(editingVaccination.id, {
                ...vaccinationForm
            });
        } else {
            addVaccination({
                petId: petId!,
                ...vaccinationForm
            });
        }

        setShowVaccinationDialog(false);
        setEditingVaccination(null);
        setVaccinationForm({
            vaccineName: '',
            dateGiven: '',
            nextDueDate: '',
            veterinarian: ''
        });
    };

    // Handle medical record submit
    const handleMedicalSubmit = () => {
        if (!medicalForm.title || !medicalForm.date) {
            alert('Please fill in all required fields');
            return;
        }

        const medications = medicalForm.medications
            ? medicalForm.medications.split(',').map(m => m.trim()).filter(m => m)
            : undefined;

        if (editingMedical) {
            updateMedicalRecord(editingMedical.id, {
                date: medicalForm.date,
                type: medicalForm.type,
                title: medicalForm.title,
                description: medicalForm.description,
                veterinarian: medicalForm.veterinarian,
                medications
            });
        } else {
            addMedicalRecord({
                petId: petId!,
                date: medicalForm.date,
                type: medicalForm.type,
                title: medicalForm.title,
                description: medicalForm.description,
                veterinarian: medicalForm.veterinarian,
                medications
            });
        }

        setShowMedicalDialog(false);
        setEditingMedical(null);
        setMedicalForm({
            date: '',
            type: 'checkup',
            title: '',
            description: '',
            veterinarian: '',
            medications: ''
        });
    };

    // Handle pet info update
    const handlePetUpdate = () => {
        const updates: any = {};
        if (petEditForm.weight) updates.weight = parseFloat(petEditForm.weight);
        if (petEditForm.allergies) updates.allergies = petEditForm.allergies;
        if (petEditForm.emergencyNotes) updates.emergencyNotes = petEditForm.emergencyNotes;

        updatePet(petId!, updates);
        setShowPetEditDialog(false);
        setPetEditForm({ weight: '', allergies: '', emergencyNotes: '' });
    };

    // Handle pet deletion
    const handleDeletePet = () => {
        deletePet(petId!);
        navigate('/owner/dashboard');
    };

    // Open edit vaccination
    const openEditVaccination = (vac: Vaccination) => {
        setEditingVaccination(vac);
        setVaccinationForm({
            vaccineName: vac.vaccineName,
            dateGiven: vac.dateGiven,
            nextDueDate: vac.nextDueDate,
            veterinarian: vac.veterinarian
        });
        setShowVaccinationDialog(true);
    };

    // Open edit medical record
    const openEditMedical = (record: MedicalRecord) => {
        setEditingMedical(record);
        setMedicalForm({
            date: record.date,
            type: record.type,
            title: record.title,
            description: record.description,
            veterinarian: record.veterinarian,
            medications: record.medications?.join(', ') || ''
        });
        setShowMedicalDialog(true);
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
                    <Link to="/owner/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="size-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Pet Header */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-b">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <img
                            src={pet.imageUrl}
                            alt={pet.name}
                            className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                        />
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{pet.name}</h1>
                                    <p className="text-xl text-muted-foreground">{pet.breed} • {pet.species}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-green-500 hover:bg-green-600">
                                        {pet.status === 'healthy' ? '🟢 Healthy' : '🟠 Vaccine Due'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Date of Birth</p>
                                    <p className="font-semibold">{new Date(pet.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Age</p>
                                    <p className="font-semibold">{pet.age} years</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Weight</p>
                                    <p className="font-semibold">{pet.weight} kg</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Chip Number</p>
                                    <p className="font-semibold">{pet.chipNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <QrCode className="size-4 mr-2" />
                                        QR Code
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Health Records QR Code</DialogTitle>
                                        <DialogDescription>
                                            Share this QR code with your veterinarian for instant access to {pet.name}'s health records.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center py-6">
                                        <div className="w-64 h-64 bg-white border-2 border-muted rounded-lg flex items-center justify-center mb-4">
                                            <div className="text-center text-muted-foreground">
                                                <QrCode className="size-32 mx-auto mb-2" />
                                                <p className="text-sm">QR Code for Pet ID: {pet.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline">
                                                <Download className="size-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button variant="outline">
                                                <Share2 className="size-4 mr-2" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" onClick={() => setShowPetEditDialog(true)}>
                                <Edit className="size-4 mr-2" />
                                Edit Info
                            </Button>

                            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 className="size-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
                        <TabsTrigger value="medical">Medical History</TabsTrigger>
                        <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Weight className="size-5" />
                                        Weight Tracking
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={weightHistory}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis domain={[25, 32]} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hash className="size-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Species</span>
                                        <span className="font-semibold">{pet.species}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Breed</span>
                                        <span className="font-semibold">{pet.breed}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Microchip</span>
                                        <span className="font-semibold">{pet.chipNumber}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Current Weight</span>
                                        <span className="font-semibold">{pet.weight} kg</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-muted-foreground">Date of Birth</span>
                                        <span className="font-semibold">{new Date(pet.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Vaccinations Tab */}
                    <TabsContent value="vaccinations" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-2xl font-bold">Vaccination Records</h3>
                                <p className="text-muted-foreground">Track all vaccinations and upcoming due dates</p>
                            </div>
                            <Button onClick={() => {
                                setEditingVaccination(null);
                                setVaccinationForm({ vaccineName: '', dateGiven: '', nextDueDate: '', veterinarian: '' });
                                setShowVaccinationDialog(true);
                            }}>
                                <Syringe className="size-4 mr-2" />
                                Add Vaccination
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {petVaccinations.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-muted-foreground">
                                        <Syringe className="size-12 mx-auto mb-4 opacity-50" />
                                        <p>No vaccination records yet. Click "Add Vaccination" to get started.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                petVaccinations.map(vac => {
                                    const nextDue = new Date(vac.nextDueDate);
                                    const isPastDue = nextDue < new Date();

                                    return (
                                        <Card key={vac.id}>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <Syringe className="size-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <CardTitle>{vac.vaccineName}</CardTitle>
                                                            <CardDescription>
                                                                Administered by {vac.veterinarian}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={isPastDue ? "destructive" : "outline"}>
                                                            {isPastDue ? 'Overdue' : 'Up to date'}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditVaccination(vac)}
                                                        >
                                                            <Edit className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteVaccination(vac.id)}
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Date Given</p>
                                                        <p className="font-semibold">{new Date(vac.dateGiven).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Next Due Date</p>
                                                        <p className="font-semibold">{nextDue.toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>

                    {/* Medical History Tab */}
                    <TabsContent value="medical" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-2xl font-bold">Medical History</h3>
                                <p className="text-muted-foreground">Complete health record and veterinary notes</p>
                            </div>
                            <Button onClick={() => {
                                setEditingMedical(null);
                                setMedicalForm({ date: '', type: 'checkup', title: '', description: '', veterinarian: '', medications: '' });
                                setShowMedicalDialog(true);
                            }}>
                                <FileText className="size-4 mr-2" />
                                Add Record
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {petMedicalRecords.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-muted-foreground">
                                        <FileText className="size-12 mx-auto mb-4 opacity-50" />
                                        <p>No medical records yet. Click "Add Record" to get started.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                petMedicalRecords.map(record => {
                                    const typeColors = {
                                        checkup: 'bg-blue-500',
                                        surgery: 'bg-purple-500',
                                        illness: 'bg-orange-500',
                                        injury: 'bg-red-500'
                                    };

                                    return (
                                        <Card key={record.id}>
                                            <CardHeader>
                                                <div className="flex items-start gap-3">
                                                    <div className={`size-12 ${typeColors[record.type]} rounded-lg flex items-center justify-center`}>
                                                        <FileText className="size-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <CardTitle>{record.title}</CardTitle>
                                                                <CardDescription>
                                                                    {new Date(record.date).toLocaleDateString()} • Dr. {record.veterinarian}
                                                                </CardDescription>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Badge className="capitalize">{record.type}</Badge>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openEditMedical(record)}
                                                                >
                                                                    <Edit className="size-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => deleteMedicalRecord(record.id)}
                                                                >
                                                                    <Trash2 className="size-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-2">{record.description}</p>
                                                        {record.medications && record.medications.length > 0 && (
                                                            <div className="mt-3">
                                                                <p className="text-sm font-semibold mb-1">Medications:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {record.medications.map((med, idx) => (
                                                                        <Badge key={idx} variant="outline">{med}</Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>

                    {/* AI Insights Tab */}
                    <TabsContent value="insights" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="size-5" />
                                    Health Risk Assessment
                                </CardTitle>
                                <CardDescription>
                                    AI-powered prediction based on breed, age, and medical history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {healthRiskData.map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium">{item.category}</span>
                                                <span className="text-sm text-muted-foreground">{item.risk}% risk</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.risk > 30 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                    style={{ width: `${item.risk}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Health Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-4 bg-primary/5 rounded-lg">
                                    <h4 className="font-semibold mb-1">🦴 Joint Care</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {pet.breed}s are prone to hip dysplasia. Consider glucosamine supplements and regular low-impact exercise.
                                    </p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                    <h4 className="font-semibold mb-1">🦷 Dental Health</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Schedule dental cleaning every 6-12 months to prevent periodontal disease.
                                    </p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                    <h4 className="font-semibold mb-1">š–ï¸ Weight Management</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Current weight is healthy. Maintain with balanced diet and daily exercise (30-60 minutes).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Vaccination Dialog */}
            <Dialog open={showVaccinationDialog} onOpenChange={setShowVaccinationDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingVaccination ? 'Edit' : 'Add'} Vaccination</DialogTitle>
                        <DialogDescription>
                            {editingVaccination ? 'Update' : 'Enter'} vaccination details for {pet.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="vaccineName">Vaccine Name *</Label>
                            <Input
                                id="vaccineName"
                                value={vaccinationForm.vaccineName}
                                onChange={(e) => setVaccinationForm({ ...vaccinationForm, vaccineName: e.target.value })}
                                placeholder="e.g., Rabies, DHPP"
                            />
                        </div>
                        <div>
                            <Label htmlFor="dateGiven">Date Given *</Label>
                            <Input
                                id="dateGiven"
                                type="date"
                                value={vaccinationForm.dateGiven}
                                onChange={(e) => setVaccinationForm({ ...vaccinationForm, dateGiven: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="nextDueDate">Next Due Date *</Label>
                            <Input
                                id="nextDueDate"
                                type="date"
                                value={vaccinationForm.nextDueDate}
                                onChange={(e) => setVaccinationForm({ ...vaccinationForm, nextDueDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="veterinarian">Veterinarian</Label>
                            <Input
                                id="veterinarian"
                                value={vaccinationForm.veterinarian}
                                onChange={(e) => setVaccinationForm({ ...vaccinationForm, veterinarian: e.target.value })}
                                placeholder="e.g., Dr. Smith"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowVaccinationDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleVaccinationSubmit}>
                            {editingVaccination ? 'Update' : 'Add'} Vaccination
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Medical Record Dialog */}
            <Dialog open={showMedicalDialog} onOpenChange={setShowMedicalDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingMedical ? 'Edit' : 'Add'} Medical Record</DialogTitle>
                        <DialogDescription>
                            {editingMedical ? 'Update' : 'Enter'} medical record details for {pet.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="medDate">Date *</Label>
                                <Input
                                    id="medDate"
                                    type="date"
                                    value={medicalForm.date}
                                    onChange={(e) => setMedicalForm({ ...medicalForm, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="medType">Type *</Label>
                                <Select value={medicalForm.type} onValueChange={(value: any) => setMedicalForm({ ...medicalForm, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="checkup">Checkup</SelectItem>
                                        <SelectItem value="surgery">Surgery</SelectItem>
                                        <SelectItem value="illness">Illness</SelectItem>
                                        <SelectItem value="injury">Injury</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="medTitle">Title *</Label>
                            <Input
                                id="medTitle"
                                value={medicalForm.title}
                                onChange={(e) => setMedicalForm({ ...medicalForm, title: e.target.value })}
                                placeholder="e.g., Annual Checkup, Dental Cleaning"
                            />
                        </div>
                        <div>
                            <Label htmlFor="medDescription">Description</Label>
                            <Textarea
                                id="medDescription"
                                value={medicalForm.description}
                                onChange={(e) => setMedicalForm({ ...medicalForm, description: e.target.value })}
                                placeholder="Enter notes and observations..."
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="medVet">Veterinarian</Label>
                            <Input
                                id="medVet"
                                value={medicalForm.veterinarian}
                                onChange={(e) => setMedicalForm({ ...medicalForm, veterinarian: e.target.value })}
                                placeholder="e.g., Dr. Smith"
                            />
                        </div>
                        <div>
                            <Label htmlFor="medications">Medications (comma-separated)</Label>
                            <Input
                                id="medications"
                                value={medicalForm.medications}
                                onChange={(e) => setMedicalForm({ ...medicalForm, medications: e.target.value })}
                                placeholder="e.g., Amoxicillin, Pain Relief"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMedicalDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleMedicalSubmit}>
                            {editingMedical ? 'Update' : 'Add'} Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pet Edit Dialog */}
            <Dialog open={showPetEditDialog} onOpenChange={setShowPetEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Pet Information</DialogTitle>
                        <DialogDescription>
                            Update health details and emergency information for {pet.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                value={petEditForm.weight}
                                onChange={(e) => setPetEditForm({ ...petEditForm, weight: e.target.value })}
                                placeholder={`Current: ${pet.weight} kg`}
                            />
                        </div>
                        <div>
                            <Label htmlFor="allergies">Allergies</Label>
                            <Textarea
                                id="allergies"
                                value={petEditForm.allergies}
                                onChange={(e) => setPetEditForm({ ...petEditForm, allergies: e.target.value })}
                                placeholder="List any known allergies..."
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="emergencyNotes">Emergency Notes</Label>
                            <Textarea
                                id="emergencyNotes"
                                value={petEditForm.emergencyNotes}
                                onChange={(e) => setPetEditForm({ ...petEditForm, emergencyNotes: e.target.value })}
                                placeholder="Important information for emergencies..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPetEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePetUpdate}>
                            Update Information
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="size-5" />
                            Delete Pet Health Passport
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {pet.name}'s health passport? This will permanently remove all vaccination records, medical history, and health data. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeletePet}>
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


