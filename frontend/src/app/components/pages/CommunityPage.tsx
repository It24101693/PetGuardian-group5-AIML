import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart, ArrowLeft, Users, MessageCircle, ThumbsUp, Share2, PawPrint, Trash2, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

export default function CommunityPage() {
    const { user } = useAuth();
    const { posts, addPost, deletePost, loading } = useChat();
    const navigate = useNavigate();
    const [postContent, setPostContent] = useState('');

    const handlePostSubmit = async () => {
        if (!postContent.trim()) return;
        await addPost(postContent);
        setPostContent('');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-primary/20">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/owner/dashboard" className="flex items-center gap-1 group">
                        <div className="relative flex items-center">
                            <Heart className="size-8 text-primary group-hover:scale-110 transition-transform" fill="currentColor" />
                            <div className="absolute -right-2 -top-1 flex">
                                <PawPrint className="size-4 text-accent rotate-12" fill="currentColor" />
                                <PawPrint className="size-4 text-accent -rotate-12 mt-2 -ml-1" fill="currentColor" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-primary ml-2 tracking-tight">PetGuardian</span>
                    </Link>
                    <Button variant="ghost" className="hover:bg-primary/5 font-medium" onClick={() => navigate(-1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

                    {/* Left Sidebar (Desktop Only) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-sm bg-white overflow-hidden group">
                            <div className="h-20 bg-gradient-to-r from-primary/80 to-primary" />
                            <CardContent className="pt-0 relative">
                                <Avatar className="size-16 border-4 border-white -mt-8 mx-auto shadow-md">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center mt-3">
                                    <h3 className="font-bold text-lg">{user?.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Followers</span>
                                        <span className="font-bold">1.2k</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Posts</span>
                                        <span className="font-bold">{posts.filter(p => p.authorId === user?.id?.toString()).length}</span>
                                    </div>
                                </div>
                                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                                    View Profile
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                                <ShieldCheck className="size-5" />
                                Community Rules
                            </h4>
                            <ul className="text-sm space-y-3 text-primary/80">
                                <li className="flex gap-2"><span>•</span> Respect all pet owners</li>
                                <li className="flex gap-2"><span>•</span> Share helpful advice</li>
                                <li className="flex gap-2"><span>•</span> Report medical misinformation</li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <main className="lg:col-span-6 space-y-6">
                        {/* Feed Header */}
                        <div className="mb-8">
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Users className="size-10 text-primary" />
                                    The Pack <span className="text-accent">Live</span>
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Join the conversation with over 5,000 pet parents.</p>
                            </motion.div>
                        </div>

                        {/* Create Post */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden glass hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar className="size-12 shadow-sm border border-slate-100">
                                            <AvatarFallback className="bg-accent/10 text-accent font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-4">
                                            <textarea
                                                placeholder="What's on your pet's mind today?"
                                                className="w-full bg-slate-50 rounded-2xl p-4 text-slate-700 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-none placeholder:text-slate-400 font-medium resize-none text-lg"
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-slate-100 text-slate-500 font-semibold px-4">
                                                        <Share2 className="size-4 mr-2" />
                                                        Photo
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-slate-100 text-slate-500 font-semibold px-4">
                                                        <Sparkles className="size-4 mr-2" />
                                                        Feeling
                                                    </Button>
                                                </div>
                                                <Button
                                                    className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
                                                    disabled={!postContent.trim()}
                                                    onClick={handlePostSubmit}
                                                >
                                                    Post Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Feed Filter */}
                        <div className="flex items-center justify-between px-2 pt-4">
                            <h2 className="font-black text-lg text-slate-700 uppercase tracking-widest">Recent Activity</h2>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="rounded-full text-primary font-bold bg-primary/10">Latest</Button>
                                <Button variant="ghost" size="sm" className="rounded-full text-slate-500 font-bold hover:bg-slate-100">Popular</Button>
                            </div>
                        </div>

                        {/* Community Posts */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <PawPrint className="size-10" />
                                        </motion.div>
                                        <p className="font-medium">Sniffing out the latest posts...</p>
                                    </div>
                                ) : (
                                    posts.map(post => (
                                        <motion.div key={post.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.95 }}>
                                            <Card className="border-none shadow-md bg-white rounded-3xl group hover:shadow-xl transition-all duration-300">
                                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-11 cursor-pointer ring-2 ring-white shadow-sm hover:ring-primary/30 transition-all" onClick={() => navigate(`/owner/chat/${post.authorId}`)}>
                                                            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                                                            <AvatarFallback className="bg-slate-100 font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle
                                                                className="text-base font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                                                                onClick={() => navigate(`/owner/chat/${post.authorId}`)}
                                                            >
                                                                {post.authorName}
                                                                {post.authorId === "vet" && <ShieldCheck className="size-4 text-blue-500" fill="currentColor" />}
                                                            </CardTitle>
                                                            <CardDescription className="text-xs font-semibold text-slate-400">
                                                                {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    {(user?.id?.toString() === post.authorId?.toString() || user?.role === 'vet') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="rounded-full hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors"
                                                            onClick={() => deletePost(post.id)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    )}
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-slate-700 leading-relaxed text-[17px] mb-6 font-medium whitespace-pre-wrap">
                                                        {post.content}
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                        <div className="flex items-center gap-1">
                                                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-pink-50 hover:text-pink-500 text-slate-500 transition-all font-bold group">
                                                                <Heart className="size-5 group-hover:scale-125 transition-transform" />
                                                                {post.likes}
                                                            </button>
                                                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-500 text-slate-500 transition-all font-bold group">
                                                                <MessageCircle className="size-5 group-hover:-rotate-12 transition-transform" />
                                                                {post.comments}
                                                            </button>
                                                        </div>
                                                        <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold transition-all">
                                                            <Share2 className="size-4" />
                                                            Share
                                                        </button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>

                            {!loading && posts.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <div className="bg-slate-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="size-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700">The field is empty!</h3>
                                    <p className="text-slate-500 mt-2">Be the first to share something with the community!</p>
                                    <Button className="mt-8 rounded-full px-8 py-6 font-bold" variant="outline">Invite a Friend</Button>
                                </div>
                            )}
                        </motion.div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="size-5 text-accent" />
                                    Trending Topics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { tag: "#SummerSafety", posts: 142 },
                                    { tag: "#PuppyTraining", posts: 89 },
                                    { tag: "#VetAdvice", posts: 254 },
                                    { tag: "#PetGuardian", posts: 512 }
                                ].map((topic, i) => (
                                    <div key={i} className="flex flex-col cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                                        <span className="font-bold text-primary">{topic.tag}</span>
                                        <span className="text-xs text-muted-foreground">{topic.posts} discussions</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Suggested Vets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: "Dr. Sarah Miller", clinic: "Happy Paws Clinic" },
                                    { name: "Dr. James Wilson", clinic: "City Vet Hospital" }
                                ].map((vet, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{vet.name.charAt(4)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{vet.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{vet.clinic}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="rounded-full text-[10px] px-3 h-7">Follow</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-[10px] text-slate-400 font-medium">
                            <a href="#" className="hover:text-primary">About</a>
                            <a href="#" className="hover:text-primary">Help Center</a>
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <span>© 2024 PetGuardian</span>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
