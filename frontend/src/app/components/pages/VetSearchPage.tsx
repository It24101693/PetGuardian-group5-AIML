import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, MapPin, Star, Phone, ShieldCheck, Clock, Filter, Sparkles, Building2, User, Stethoscope, Heart, PawPrint } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

// Types
type Category = 'All' | 'Hospital' | 'Doctor' | 'Clinic';
type Status = 'All' | 'Open Now';

interface VetListing {
    id: string;
    name: string;
    type: 'Hospital' | 'Doctor' | 'Clinic';
    specialty: string;
    address: string;
    rating: number;
    reviews: number;
    phone: string;
    isOpen: boolean;
    image: string;
    verified: boolean;
    aiRecommended?: boolean;
}

// Mock Data
const MOCK_LISTINGS: VetListing[] = [
    {
        id: '1',
        name: 'City Pet Hospital',
        type: 'Hospital',
        specialty: '24/7 Emergency & General Care',
        address: '123 Main St, Colombo 03',
        rating: 4.8,
        reviews: 245,
        phone: '011 234 5678',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=300',
        verified: true,
        aiRecommended: true,
    },
    {
        id: '2',
        name: 'Dr. Sarah Jenkins',
        type: 'Doctor',
        specialty: 'Feline Specialist',
        address: '45 Park Avenue, Colombo 07',
        rating: 4.9,
        reviews: 128,
        phone: '077 125 4321',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1594142404563-64cccaf5a10f?auto=format&fit=crop&q=80&w=400&h=300',
        verified: true,
    },
    {
        id: '3',
        name: 'Paws & Tails Care Clinic',
        type: 'Clinic',
        specialty: 'Vaccinations & Routine Checkups',
        address: '88 Galle Road, Mount Lavinia',
        rating: 4.5,
        reviews: 89,
        phone: '011 987 6543',
        isOpen: false,
        image: 'https://images.unsplash.com/photo-1584813470659-24204d5ab71f?auto=format&fit=crop&q=80&w=400&h=300',
        verified: false,
    },
    {
        id: '4',
        name: 'Blue Cross Animal Hospital',
        type: 'Hospital',
        specialty: 'Surgery & Dentistry',
        address: '210 Kandy Road, Peliyagoda',
        rating: 4.7,
        reviews: 312,
        phone: '011 456 7890',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=400&h=300',
        verified: true,
        aiRecommended: true,
    },
    {
        id: '5',
        name: 'Dr. Nimal Fernando',
        type: 'Doctor',
        specialty: 'Avian & Exotic Pets',
        address: '15 Nawala Road, Rajagiriya',
        rating: 4.6,
        reviews: 56,
        phone: '071 852 9630',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=300',
        verified: true,
    },
    {
        id: '6',
        name: 'Happy Paws Emergency Center',
        type: 'Clinic',
        specialty: 'Trauma & Intensive Care',
        address: '44 Baseline Road, Colombo 08',
        rating: 4.4,
        reviews: 178,
        phone: '011 753 9514',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400&h=300',
        verified: false,
    }
];

export default function VetSearchPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [statusFilter, setStatusFilter] = useState<Status>('All');

    // Filter Logic
    const filteredListings = MOCK_LISTINGS.filter(listing => {
        const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = listing.address.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || listing.type === selectedCategory;
        const matchesStatus = statusFilter === 'All' || (statusFilter === 'Open Now' && listing.isOpen);

        return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
    });

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
                    {/* Mobile menu - simplified */}
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
                            <span>1st Sri Lanka's trusted AI Business finder.</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800">
                            Stop Guessing. Find Trusted Vets.
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Every business is manually verified to guarantee authenticity and give you absolute peace of mind.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-3 rounded-2xl shadow-lg border flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                        <div className="relative flex-1 flex items-center">
                            <Search className="absolute left-4 text-slate-400 size-5" />
                            <Input
                                placeholder="What are you looking for? (e.g. Hospital, Doctor)"
                                className="pl-12 h-14 border-0 bg-slate-50 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-px bg-slate-200 hidden md:block my-2"></div>
                        <div className="relative flex-1 flex items-center">
                            <MapPin className="absolute left-4 text-slate-400 size-5" />
                            <Input
                                placeholder="Location (e.g. Colombo)"
                                className="pl-12 h-14 border-0 bg-slate-50 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl w-full"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                        </div>
                        <Button className="h-14 px-8 rounded-xl text-lg font-semibold shrink-0" size="lg">
                            Search
                        </Button>
                    </div>

                    {/* Quick Category Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {(['Hospital', 'Doctor', 'Clinic'] as Category[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-sm border ${selectedCategory === cat
                                    ? 'bg-primary text-white border-primary border-transparent'
                                    : 'bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {cat === 'Hospital' && <Building2 className="size-4" />}
                                {cat === 'Doctor' && <User className="size-4" />}
                                {cat === 'Clinic' && <StethoscopeIcon className="size-4" />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-12 px-4 container mx-auto max-w-7xl flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                            <Filter className="size-5 text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Categories Filter */}
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

                            {/* Status Filter */}
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

                {/* Results List */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Showing {filteredListings.length} Result{filteredListings.length !== 1 && 's'}
                        </h2>
                    </div>

                    {filteredListings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Search className="size-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No results found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                            <Button variant="outline" className="mt-6" onClick={() => {
                                setSearchQuery(''); setLocationQuery(''); setSelectedCategory('All'); setStatusFilter('All');
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredListings.map((listing) => (
                                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group border-slate-200">
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={listing.image}
                                            alt={listing.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Status Badge */}
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
                                        {/* AI Recommended Badge */}
                                        {listing.aiRecommended && (
                                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                <Sparkles className="size-3" /> AI Pick
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Container */}
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
                                                    <span>{listing.rating.toFixed(1)}</span>
                                                    <Star className="size-3 fill-amber-500 text-amber-500" />
                                                </div>
                                                <span className="text-xs text-slate-500 mt-1">({listing.reviews})</span>
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

// Quick helper icon for the clinic button since lucide doesn't have a direct "clinic" named icon that fits
function StethoscopeIcon(props: any) {
    return <Stethoscope {...props} />;
}
