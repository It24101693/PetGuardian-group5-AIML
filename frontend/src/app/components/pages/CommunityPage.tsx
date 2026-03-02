import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart, ArrowLeft, Users, MessageCircle, ThumbsUp, Share2, PawPrint } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function CommunityPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const communityPosts = [
        {
            id: 1,
            author: 'Jessica Smith',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            time: '2 hours ago',
            content: 'Just celebrated my golden retriever Max\'s 5th birthday! 🎉 Time flies when you\'re having fun with your best friend.',
            likes: 24,
            comments: 8
        },
        {
            id: 2,
            author: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            time: '5 hours ago',
            content: 'Does anyone have recommendations for a good dog trainer in the downtown area? Looking to work on recall commands.',
            likes: 12,
            comments: 15
        },
        {
            id: 3,
            author: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            time: '1 day ago',
            content: 'PSA: Just learned about the importance of regular dental checkups for pets. Don\'t skip them like I did!',
            likes: 45,
            comments: 12
        }
    ];

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
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Users className="size-10 text-primary" />
                        Community
                    </h1>
                    <p className="text-muted-foreground">Connect with fellow pet parents, share experiences, and get advice</p>
                </div>

                {/* Create Post */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <Avatar>
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Share something with the community..."
                                    className="w-full px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex gap-2 mt-3">
                                    <Button size="sm">Post</Button>
                                    <Button size="sm" variant="outline">Add Photo</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Community Posts */}
                <div className="space-y-4">
                    {communityPosts.map(post => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.avatar} alt={post.author} />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{post.author}</CardTitle>
                                        <CardDescription className="text-xs">{post.time}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{post.content}</p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                        <ThumbsUp className="size-4" />
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                        <MessageCircle className="size-4" />
                                        {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                        <Share2 className="size-4" />
                                        Share
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
