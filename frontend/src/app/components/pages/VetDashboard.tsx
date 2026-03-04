import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
    Heart, Stethoscope, ShieldCheck, LogOut,
    Calendar, Users, Activity, TrendingUp,
    MessageSquare, Search, Filter, MoreVertical,
    CheckCircle2, Clock, AlertCircle, ChevronRight,
    SearchIcon, LayoutDashboard, Settings, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '../NotificationCenter';

export default function VetDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'overview' | 'appointments' | 'patients'>('overview');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mock Data for Demo
    const stats = [
        { label: 'Today\'s Appointments', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Patients', value: '1,280', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Avg. Rating', value: '4.9', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Pending Health Reports', value: '8', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const appointments = [
        { id: 1, pet: 'Max', owner: 'John Doe', type: 'Checkup', time: '09:00 AM', status: 'completed' },
        { id: 2, pet: 'Bella', owner: 'Sarah Wilson', type: 'Vaccination', time: '10:30 AM', status: 'active' },
        { id: 3, pet: 'Luna', owner: 'Mike Brown', type: 'Surgery', time: '01:00 PM', status: 'pending' },
        { id: 4, pet: 'Charlie', owner: 'Emma Davis', type: 'Consultation', time: '03:15 PM', status: 'pending' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b">
                    <Link to="/" className="flex items-center gap-2">
                        <Heart className="size-8 text-primary" fill="currentColor" />
                        <span className="text-xl font-bold text-primary tracking-tight">PetGuardian</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <LayoutDashboard className="size-5" />
                        <span className="font-bold">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('appointments')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'appointments' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <Calendar className="size-5" />
                        <span className="font-bold">Appointments</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('patients')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'patients' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <Users className="size-5" />
                        <span className="font-bold">Patients</span>
                    </button>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                            <Settings className="size-5" />
                            <span className="font-bold">Settings</span>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-600 transition-all">
                            <LogOut className="size-5" />
                            <span className="font-bold">Logout</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 p-4 rounded-2xl border flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.name?.charAt(0) || <Stethoscope className="size-5" />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name || 'Dr. Smith'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Veterinarian</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">
                            {activeSection === 'overview' && 'Dashboard Overview'}
                            {activeSection === 'appointments' && 'Appointment Scheduler'}
                            {activeSection === 'patients' && 'Patient Records'}
                        </h1>
                        {user?.role === 'admin' && (
                            <Link to="/admin/dashboard">
                                <Button variant="ghost" size="sm" className="text-violet-600 font-bold border border-violet-200 bg-violet-50 hover:bg-violet-100 hidden sm:flex">
                                    <ShieldCheck className="size-4 mr-1.5" />
                                    Admin View
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Find a patient..."
                                className="pl-9 pr-4 h-10 bg-slate-100 border-transparent focus:bg-white focus:ring-1 focus:ring-primary rounded-xl text-sm w-64 transition-all"
                            />
                        </div>
                        <NotificationCenter />
                        <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all relative">
                            <MessageSquare className="size-5 text-slate-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard View */}
                <div className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        {activeSection === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Welcome */}
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-1">Welcome back, Dr. {user?.name?.split(' ')[0] || 'Veterinarian'}! 👋</h2>
                                    <p className="text-slate-500 font-medium">You have {appointments.length} appointments scheduled for today.</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {stats.map((stat, i) => (
                                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                                        <stat.icon className={`size-6 ${stat.color}`} />
                                                    </div>
                                                    <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">
                                                        +12% 📈
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Appointment Queue */}
                                    <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden">
                                        <CardHeader className="flex flex-row items-center justify-between py-6">
                                            <div>
                                                <CardTitle className="text-lg font-black tracking-tight">Next Patients</CardTitle>
                                                <CardDescription className="text-xs font-medium">Upcoming scheduled visits</CardDescription>
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-xl font-bold">View Calendar</Button>
                                        </CardHeader>
                                        <CardContent className="px-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-y">
                                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text">Time</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pet & Owner</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Visit Purpose</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {appointments.map((apt) => (
                                                            <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                                                                <td className="px-6 py-5">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="size-3.5 text-primary" />
                                                                        <span className="text-sm font-bold text-slate-700">{apt.time}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                                            {apt.pet[0]}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-black text-slate-800">{apt.pet}</p>
                                                                            <p className="text-[11px] font-medium text-slate-500">{apt.owner}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 by-1 rounded-full">{apt.type}</span>
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    {apt.status === 'completed' && <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]"><CheckCircle2 className="size-3.5" /> Completed</div>}
                                                                    {apt.status === 'active' && <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] animate-pulse"><Clock className="size-3.5" /> In Progress</div>}
                                                                    {apt.status === 'pending' && <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]"><AlertCircle className="size-3.5" /> Upcoming</div>}
                                                                </td>
                                                                <td className="px-6 py-5 text-right">
                                                                    <Button variant="ghost" size="icon" className="group-hover:bg-white rounded-lg"><ChevronRight className="size-4 text-slate-400" /></Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Sidebar widgets */}
                                    <div className="space-y-6">
                                        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                                                <Stethoscope className="size-32" />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-lg font-black">Digital Health API</CardTitle>
                                                <CardDescription className="text-primary-foreground/80 text-xs">Sync medical records instantly</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Button className="w-full bg-white text-primary hover:bg-slate-50 font-black rounded-xl border-none shadow-lg">New Health Record</Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg font-black">Quick Actions</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <button className="w-full flex items-center justify-between p-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <Activity className="size-4 text-indigo-500" />
                                                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary">Medical History</span>
                                                    </div>
                                                    <ChevronRight className="size-4 text-slate-300" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <MessageSquare className="size-4 text-teal-500" />
                                                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary">Chat with Owner</span>
                                                    </div>
                                                    <ChevronRight className="size-4 text-slate-300" />
                                                </button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'appointments' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex items-center justify-center border-2 border-dashed rounded-3xl"
                            >
                                <div className="text-center">
                                    <Calendar className="size-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800">Full Calendar View</h3>
                                    <p className="text-slate-500 max-w-xs">Interactive scheduling system is currently in development for better time management.</p>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'patients' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex items-center justify-center border-2 border-dashed rounded-3xl"
                            >
                                <div className="text-center">
                                    <Users className="size-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800">Pet Record Index</h3>
                                    <p className="text-slate-500 max-w-xs">Detailed patient history and treatment tracking modules coming shortly.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}


