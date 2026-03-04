import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Heart, PawPrint, LogOut, Users, ShieldCheck, UserCheck, UserX,
    Search, RefreshCw, Edit3, Trash2, Plus, ChevronDown, AlertTriangle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────── types ───────────────────────────────
type UserRole = 'OWNER' | 'VETERINARIAN' | 'ADMIN';

interface SystemUser {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
}

// ─────────────────────────── API helpers ──────────────────────────────
const API_BASE = 'http://localhost:8080/api/admin/users';

async function fetchAllUsers(): Promise<SystemUser[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

async function updateRole(id: number, role: UserRole): Promise<SystemUser> {
    const res = await fetch(`${API_BASE}/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
}

async function deactivateUserApi(id: number): Promise<SystemUser> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to deactivate user');
    return res.json();
}

async function deleteUserApi(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/permanent`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to permanently delete user');
}

// ─────────────────────────── helpers ────────────────────────────────
const roleColor: Record<UserRole, string> = {
    ADMIN: 'bg-violet-600 hover:bg-violet-700',
    VETERINARIAN: 'bg-teal-600 hover:bg-teal-700',
    OWNER: 'bg-sky-500 hover:bg-sky-600',
};

const roleLabel: Record<UserRole, string> = {
    ADMIN: '🛡️ Admin',
    VETERINARIAN: '🩺 Veterinarian',
    OWNER: '🐾 Pet Owner',
};

// ═══════════════════════════ Component ═══════════════════════════════
export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');

    // Role-change dialog
    const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: SystemUser | null }>({ open: false, user: null });
    const [selectedRole, setSelectedRole] = useState<UserRole>('OWNER');
    const [roleUpdating, setRoleUpdating] = useState(false);

    // Deactivate confirm dialog
    const [deactivateDialog, setDeactivateDialog] = useState<{ open: boolean; user: SystemUser | null }>({ open: false, user: null });
    const [deactivating, setDeactivating] = useState(false);

    // Delete confirm dialog
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: SystemUser | null }>({ open: false, user: null });
    const [deleting, setDeleting] = useState(false);

    // Register new user dialog
    const [registerDialog, setRegisterDialog] = useState(false);
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'OWNER' as UserRole });
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);

    // ── fetch users ──
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (e: any) {
            setError(e.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    // ── computed ──
    const filtered = users.filter(u => {
        const matchSearch =
            (u.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'ALL' || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const stats = {
        total: users.length,
        owners: users.filter(u => u.role === 'OWNER').length,
        vets: users.filter(u => u.role === 'VETERINARIAN').length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        active: users.filter(u => u.isActive).length,
    };

    // ── handlers ──
    const handleLogout = () => { logout(); navigate('/'); };

    const openRoleDialog = (u: SystemUser) => {
        setSelectedRole(u.role);
        setRoleDialog({ open: true, user: u });
    };

    const confirmRoleChange = async () => {
        if (!roleDialog.user) return;
        setRoleUpdating(true);
        try {
            const updated = await updateRole(roleDialog.user.id, selectedRole);
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            setRoleDialog({ open: false, user: null });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setRoleUpdating(false);
        }
    };

    const confirmDeactivate = async () => {
        if (!deactivateDialog.user) return;
        setDeactivating(true);
        try {
            const updated = await deactivateUserApi(deactivateDialog.user.id);
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            setDeactivateDialog({ open: false, user: null });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeactivating(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteDialog.user) return;
        setDeleting(true);
        try {
            await deleteUserApi(deleteDialog.user.id);
            setUsers(prev => prev.filter(u => u.id !== deleteDialog.user!.id));
            setDeleteDialog({ open: false, user: null });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleRegister = async () => {
        if (!registerForm.name || !registerForm.email || !registerForm.password) {
            setRegisterError('Please fill in all fields.');
            return;
        }
        setRegistering(true);
        setRegisterError(null);
        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: registerForm.name,
                    email: registerForm.email,
                    password: registerForm.password,
                    role: registerForm.role.toLowerCase(),
                }),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Registration failed');
            }
            setRegisterDialog(false);
            setRegisterForm({ name: '', email: '', password: '', role: 'OWNER' });
            await loadUsers(); // refresh list
        } catch (e: any) {
            setRegisterError(e.message);
        } finally {
            setRegistering(false);
        }
    };

    // ── render ──
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-sky-50">

            {/* ── Header ── */}
            <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-1">
                        <div className="relative flex items-center">
                            <Heart className="size-8 text-violet-600" fill="currentColor" />
                            <div className="absolute -right-2 -top-1 flex">
                                <PawPrint className="size-4 text-teal-500 rotate-12" fill="currentColor" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-violet-700 ml-3">PetGuardian</span>
                        <Badge className="ml-2 bg-violet-600 hover:bg-violet-700 text-xs">Admin</Badge>
                    </Link>

                    <nav className="flex items-center gap-3">
                        <Link to="/admin/knowledge">
                            <Button variant="ghost" size="sm">Knowledge Center</Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="size-4 mr-2" /> Logout
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 bg-violet-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="size-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user?.name} — manage all system users here</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats.total, icon: Users, color: 'bg-violet-100 text-violet-700' },
                        { label: 'Pet Owners', value: stats.owners, icon: PawPrint, color: 'bg-sky-100 text-sky-700' },
                        { label: 'Veterinarians', value: stats.vets, icon: UserCheck, color: 'bg-teal-100 text-teal-700' },
                        { label: 'Admins', value: stats.admins, icon: ShieldCheck, color: 'bg-violet-100 text-violet-700' },
                        { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-green-100 text-green-700' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Card className="text-center hover:shadow-md transition-shadow">
                                <CardContent className="pt-5 pb-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                                        <s.icon className="size-5" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* ── Toolbar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                            id="admin-search"
                            placeholder="Search by name or email…"
                            className="pl-9"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Role filter */}
                    <div className="relative">
                        <select
                            id="admin-role-filter"
                            className="h-10 border rounded-md px-3 pr-8 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                            value={filterRole}
                            onChange={e => setFilterRole(e.target.value as UserRole | 'ALL')}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="OWNER">Pet Owners</option>
                            <option value="VETERINARIAN">Veterinarians</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Actions */}
                    <Button variant="outline" size="icon" onClick={loadUsers} title="Refresh">
                        <RefreshCw className="size-4" />
                    </Button>
                    <Button
                        id="admin-register-btn"
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                        onClick={() => { setRegisterError(null); setRegisterDialog(true); }}
                    >
                        <Plus className="size-4 mr-2" /> Register User
                    </Button>
                </div>

                {/* ── Table / List ── */}
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="size-10 animate-spin mx-auto text-violet-400 mb-3" />
                        <p className="text-gray-400">Loading users…</p>
                    </div>
                ) : error ? (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="py-10 text-center text-red-600">
                            <AlertTriangle className="size-10 mx-auto mb-3" />
                            <p className="font-semibold">{error}</p>
                            <Button variant="outline" className="mt-4" onClick={loadUsers}>Retry</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="border-b bg-gray-50/60 py-4">
                            <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="size-4" /> Users
                                <Badge variant="secondary" className="ml-1">{filtered.length}</Badge>
                            </CardTitle>
                        </CardHeader>

                        {/* Header row */}
                        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-3 px-6 py-3 bg-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <span>Name</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Status</span>
                            <span>Joined</span>
                            <span>Actions</span>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {filtered.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-16 text-center text-gray-400"
                                >
                                    <Users className="size-12 mx-auto mb-3 opacity-30" />
                                    <p>No users match your filter.</p>
                                </motion.div>
                            ) : (
                                filtered.map((u, idx) => (
                                    <motion.div
                                        key={u.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={`grid md:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-3 px-6 py-4 border-b last:border-0 items-center
                                            ${!u.isActive ? 'bg-gray-50 opacity-60' : 'hover:bg-violet-50/40'} transition-colors`}
                                    >
                                        {/* Name */}
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-gradient-to-br from-violet-400 to-teal-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {(u.fullName ?? u.email)[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">{u.fullName || '—'}</p>
                                                <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <p className="text-sm text-gray-600 truncate">{u.email}</p>

                                        {/* Role badge */}
                                        <Badge className={`${roleColor[u.role]} text-white text-xs w-fit`}>
                                            {roleLabel[u.role]}
                                        </Badge>

                                        {/* Status */}
                                        <div>
                                            {u.isActive ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">
                                                    ✅ Active
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 text-xs">
                                                    ❌ Inactive
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Joined */}
                                        <p className="text-xs text-gray-400">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-violet-100 hover:text-violet-700 h-8 w-8"
                                                title="Change Role"
                                                onClick={() => openRoleDialog(u)}
                                            >
                                                <Edit3 className="size-4" />
                                            </Button>
                                            {u.isActive && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-orange-100 hover:text-orange-600 h-8 w-8"
                                                    title="Deactivate"
                                                    onClick={() => setDeactivateDialog({ open: true, user: u })}
                                                >
                                                    <UserX className="size-4" />
                                                </Button>
                                            )}
                                            {u.role !== 'ADMIN' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-red-100 hover:text-red-700 h-8 w-8"
                                                    title="Delete (Permanent)"
                                                    onClick={() => setDeleteDialog({ open: true, user: u })}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </Card>
                )}
            </main>

            {/* ══════════ Register User Dialog ══════════ */}
            <Dialog open={registerDialog} onOpenChange={setRegisterDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="size-5 text-violet-600" /> Register New User
                        </DialogTitle>
                        <DialogDescription>Create a new account and assign a role.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-name">Full Name</Label>
                            <Input id="reg-name" placeholder="John Doe"
                                value={registerForm.name}
                                onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input id="reg-email" type="email" placeholder="john@example.com"
                                value={registerForm.email}
                                onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input id="reg-password" type="password" placeholder="••••••••"
                                value={registerForm.password}
                                onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-role">Role</Label>
                            <select
                                id="reg-role"
                                className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                                value={registerForm.role}
                                onChange={e => setRegisterForm(p => ({ ...p, role: e.target.value as UserRole }))}
                            >
                                <option value="OWNER">🐾 Pet Owner</option>
                                <option value="VETERINARIAN">🩺 Veterinarian</option>
                                <option value="ADMIN">🛡️ Admin</option>
                            </select>
                        </div>

                        {registerError && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertTriangle className="size-4" /> {registerError}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRegisterDialog(false)} disabled={registering}>Cancel</Button>
                        <Button
                            id="reg-submit-btn"
                            className="bg-violet-600 hover:bg-violet-700 text-white"
                            onClick={handleRegister}
                            disabled={registering}
                        >
                            {registering ? <><Loader2 className="size-4 mr-2 animate-spin" /> Creating…</> : 'Create Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ══════════ Change Role Dialog ══════════ */}
            <Dialog open={roleDialog.open} onOpenChange={open => setRoleDialog(p => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit3 className="size-5 text-violet-600" /> Change Role
                        </DialogTitle>
                        <DialogDescription>
                            Update the role for <strong>{roleDialog.user?.fullName || roleDialog.user?.email}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        {(['OWNER', 'VETERINARIAN', 'ADMIN'] as UserRole[]).map(r => (
                            <label
                                key={r}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                                    ${selectedRole === r ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    className="accent-violet-600"
                                    checked={selectedRole === r}
                                    onChange={() => setSelectedRole(r)}
                                />
                                <span className="font-medium text-sm">{roleLabel[r]}</span>
                            </label>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialog({ open: false, user: null })} disabled={roleUpdating}>
                            Cancel
                        </Button>
                        <Button
                            id="role-save-btn"
                            className="bg-violet-600 hover:bg-violet-700 text-white"
                            onClick={confirmRoleChange}
                            disabled={roleUpdating}
                        >
                            {roleUpdating ? <><Loader2 className="size-4 mr-2 animate-spin" /> Saving…</> : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ══════════ Deactivate Confirm Dialog ══════════ */}
            <Dialog open={deactivateDialog.open} onOpenChange={open => setDeactivateDialog(p => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="size-5" /> Deactivate Account
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to deactivate{' '}
                            <strong>{deactivateDialog.user?.fullName || deactivateDialog.user?.email}</strong>?
                            They will no longer be able to log in, but their data is preserved.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDeactivateDialog({ open: false, user: null })} disabled={deactivating}>
                            Cancel
                        </Button>
                        <Button
                            id="deactivate-confirm-btn"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={confirmDeactivate}
                            disabled={deactivating}
                        >
                            {deactivating ? <><Loader2 className="size-4 mr-2 animate-spin" /> Deactivating…</> : 'Yes, Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ══════════ Permanent Delete Confirm Dialog ══════════ */}
            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog(p => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-sm border-red-200 shadow-red-500/10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-700">
                            <Trash2 className="size-5" /> Delete Account Permanently
                        </DialogTitle>
                        <DialogDescription className="text-red-600/90 font-medium mt-3">
                            Warning: You are about to permanently delete <strong>{deleteDialog.user?.fullName || deleteDialog.user?.email}</strong>.
                            <br /><br />
                            This action cannot be undone. All linked data will be destroyed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-5">
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            id="delete-confirm-btn"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? <><Loader2 className="size-4 mr-2 animate-spin" /> Deleting…</> : 'Destroy Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
