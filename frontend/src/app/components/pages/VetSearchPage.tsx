import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, Star, Phone, ShieldCheck, Clock, Filter, Sparkles, Building2, User, Stethoscope, Heart, PawPrint, Loader2, Navigation, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { vetApi } from '../../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Types
type Category = 'All' | 'Hospital' | 'Doctor' | 'Clinic';
type Status = 'All' | 'Open Now';

interface VetListing {
    id: number;
    name: string;
    type: string;
    specialty: string;
    address: string;
    rating: number;
    reviews: number;
    phone: string;
    isOpen: boolean;
    image?: string;
    verified: boolean;
    aiRecommended?: boolean;
    latitude?: number;
    longitude?: number;
}

export default function VetSearchPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [statusFilter, setStatusFilter] = useState<Status>('All');

    // Real Data States
    const [vets, setVets] = useState<VetListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userCoords, setUserCoords] = useState<{ lat: number, lon: number } | null>(null);
    const [emergencyVets, setEmergencyVets] = useState<VetListing[]>([]);

    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.LayerGroup | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);

    // Filter Logic
    const filteredListings = useMemo(() => {
        return vets.filter((listing: VetListing) => {
            const name = listing.name || '';
            const specialty = listing.specialty || '';
            const address = listing.address || '';

            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                specialty.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocation = address.toLowerCase().includes(locationQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || listing.type === selectedCategory;
            const matchesStatus = statusFilter === 'All' || (statusFilter === 'Open Now' && listing.isOpen);

            return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
        });
    }, [vets, searchQuery, locationQuery, selectedCategory, statusFilter]);

    // Fetch initial data
    const fetchVets = async () => {
        setIsLoading(true);
        try {
            const data = await vetApi.getAll();
            setVets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch vets", error);
            setVets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmergencyVets = async () => {
        try {
            const data = await vetApi.getEmergency();
            setEmergencyVets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch emergency vets", error);
            setEmergencyVets([]);
        }
    };

    useEffect(() => {
        fetchVets();
        fetchEmergencyVets();
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => console.log("Location access denied")
            );
        }
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current).setView([6.9271, 79.8612], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        markersRef.current = L.layerGroup().addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update Markers
    useEffect(() => {
        if (!mapRef.current || !markersRef.current) return;

        // Clear existing markers
        markersRef.current.clearLayers();

        // Add vet markers
        filteredListings.forEach(listing => {
            if (listing.latitude && listing.longitude) {
                const marker = L.marker([listing.latitude, listing.longitude])
                    .bindPopup(`
                        <div class="p-1">
                            <strong style="color: #2563eb;">${listing.name}</strong><br/>
                            <small>${listing.address}</small><br/>
                            <span style="font-size: 10px; font-weight: 600;">${listing.type}</span>
                        </div>
                    `);
                markersRef.current?.addLayer(marker);
            }
        });

        // Add user marker
        if (userCoords) {
            if (userMarkerRef.current) {
                userMarkerRef.current.remove();
            }
            userMarkerRef.current = L.marker([userCoords.lat, userCoords.lon], {
                icon: L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048314.png',
                    iconSize: [32, 32],
                })
            }).addTo(mapRef.current).bindPopup('You are here');
        }
    }, [filteredListings, userCoords]);

    const handleProximitySearch = async () => {
        if (!userCoords) {
            alert("Please enable location access to find nearby clinics.");
            return;
        }
        setIsLoading(true);
        try {
            const data = await vetApi.getNearby(userCoords.lat, userCoords.lon, 5.0);
            setVets(data);
        } catch (error) {
            console.error("Proximity search failed", error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to remove this listing?")) {
            try {
                await vetApi.delete(id);
                fetchVets();
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation Header */}
            <header className="border-b bg-white sticky top-0 z-50 animate-fade-in-down">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover-scale">
                        <div className="relative flex items-center">
                            <Heart className="size-8 text-primary" fill="currentColor" />
                            <div className="absolute -right-2 -top-1 flex">
                                <PawPrint className="size-4 text-accent rotate-12" fill="currentColor" />
                                <PawPrint className="size-4 text-accent -rotate-12 mt-2 -ml-1" fill="currentColor" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-primary ml-2">PetGuardian</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link to="/search" className="hover:text-primary transition-colors font-medium text-primary">Find a Vet</Link>
                        <Link to="/auth" className="hover:text-primary transition-colors">For Pet Owners</Link>
                        <Link to="/auth">
                            <Button variant="outline" className="btn-press">Login</Button>
                        </Link>
                        <Link to="/auth">
                            <Button className="btn-press">Sign Up</Button>
                        </Link>
                    </nav>
                    <div className="md:hidden">
                        <Link to="/auth">
                            <Button size="sm" className="btn-press">Login</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Search Hero Section */}
            <section className="bg-primary/5 border-b py-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Building2 className="w-64 h-64" />
                </div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-1.5 rounded-full mb-6 text-sm">
                            <Sparkles className="size-4" />
                            <span>Sri Lanka's trusted AI Vet & Clinic finder.</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800">
                            Professional Care. Local Vets.
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Manually verified clinic listings with exact coordinates and real-time availability.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        <div className="bg-white p-3 rounded-2xl shadow-lg border flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1 flex items-center">
                                <Search className="absolute left-4 text-slate-400 size-5" />
                                <Input
                                    placeholder="Search by name or specialty..."
                                    className="pl-12 h-14 border-0 bg-slate-50 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-px bg-slate-200 hidden md:block my-2"></div>
                            <div className="relative flex-1 flex items-center">
                                <MapPin className="absolute left-4 text-slate-400 size-5" />
                                <Input
                                    placeholder="City or Address..."
                                    className="pl-12 h-14 border-0 bg-slate-50 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl w-full"
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                />
                            </div>
                            <Button className="h-14 px-8 rounded-xl text-lg font-semibold shrink-0" onClick={handleProximitySearch}>
                                <Navigation className="mr-2 size-5" /> Nearby
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {user?.role === 'vet' && (
                                <Link to="/vet/dashboard">
                                    <Button className="rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg btn-press">
                                        <Stethoscope className="mr-2 size-4" /> Go to Vet Dashboard
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Section */}
            {emergencyVets.length > 0 && (
                <section className="bg-rose-50 border-b py-8">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex items-center gap-2 mb-4 text-rose-600">
                            <AlertTriangle className="size-5 fill-rose-600 text-white" />
                            <h2 className="text-lg font-bold">Recommended 24/7 Emergency Clinics</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {emergencyVets.slice(0, 4).map(vet => (
                                <Card key={vet.id} className="min-w-[280px] shrink-0 border-rose-200 shadow-sm border-l-4 border-l-rose-500">
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-slate-800">{vet.name}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{vet.address}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">Emergency</span>
                                            <span className="text-xs font-medium text-slate-500">{vet.phone}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Map Integration */}
            <section className="h-[400px] border-b relative z-0">
                <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
            </section>

            {/* Main Content Area */}
            <section className="py-12 px-4 container mx-auto max-w-7xl flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                            <Filter className="size-5 text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {(['All', 'Hospital', 'Doctor', 'Clinic'] as Category[]).map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                            />
                                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Availability</h3>
                                <div className="space-y-2">
                                    {(['All', 'Open Now'] as Status[]).map(status => (
                                        <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={statusFilter === status}
                                                onChange={() => setStatusFilter(status)}
                                                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                            />
                                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {isLoading ? 'Searching...' : `Showing ${filteredListings.length} Result${filteredListings.length !== 1 ? 's' : ''}`}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                            <Loader2 className="size-12 animate-spin text-primary opacity-20" />
                            <p className="mt-4 text-muted-foreground">Finding the best care near you...</p>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Search className="size-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No clinics found</h3>
                            <p className="text-slate-500">Try adjusting your filters or "Nearby" range.</p>
                            <Button variant="outline" className="mt-6" onClick={() => {
                                setSearchQuery(''); setLocationQuery(''); setSelectedCategory('All'); setStatusFilter('All');
                                fetchVets();
                            }}>
                                View All Collections
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredListings.map((listing) => (
                                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group border-slate-200">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={listing.image || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=300'}
                                            alt={listing.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4">
                                            {listing.isOpen ? (
                                                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                    <Clock className="size-3" /> Open Now
                                                </span>
                                            ) : (
                                                <span className="bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
                                                    <Clock className="size-3" /> Closed
                                                </span>
                                            )}
                                        </div>
                                        {listing.aiRecommended && (
                                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                <Sparkles className="size-3" /> AI Pick
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{listing.type}</span>
                                                    {listing.verified && (
                                                        <span title="Verified Listing">
                                                            <ShieldCheck className="size-4 text-emerald-500" />
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{listing.name}</h3>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded text-sm shrink-0">
                                                    <span>{(listing.rating || 0).toFixed(1)}</span>
                                                    <Star className="size-3 fill-amber-500 text-amber-500" />
                                                </div>
                                                <span className="text-xs text-slate-500 mt-1">({listing.reviews || 0})</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-1">{listing.specialty}</p>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <MapPin className="size-4 shrink-0 mt-0.5 text-slate-400" />
                                                <span className="line-clamp-1">{listing.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="size-4 shrink-0 text-slate-400" />
                                                <span>{listing.phone}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                                            <Button className="flex-1 gap-2" variant="outline">
                                                View Details
                                            </Button>
                                            <Button variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDelete(listing.id)}>
                                                Delete
                                            </Button>
                                            <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                                                <Phone className="size-4" /> Call
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </section>
        </div>
    );
}
