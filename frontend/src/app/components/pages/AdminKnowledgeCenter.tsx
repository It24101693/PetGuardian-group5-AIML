import { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Plus, Trash2, Search, BookOpen, Heart, PawPrint, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { chatApi } from '../../services/api';

export default function AdminKnowledgeCenter() {
    const navigate = useNavigate();
    const { addKnowledge } = useChat();
    const [knowledgeEntries, setKnowledgeEntries] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEntry, setNewEntry] = useState({ keyword: '', response: '', category: 'General' });

    const fetchKnowledge = async () => {
        try {
            const data = await chatApi.getAdminKnowledge();
            setKnowledgeEntries(data);
        } catch (e) {
            console.error('Error fetching knowledge base:', e);
        }
    };

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const handleAdd = async () => {
        if (!newEntry.keyword || !newEntry.response) return;
        await addKnowledge(newEntry.keyword, newEntry.response, newEntry.category);
        setNewEntry({ keyword: '', response: '', category: 'General' });
        fetchKnowledge();
    };

    const filteredEntries = knowledgeEntries.filter(e =>
        e.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <span className="text-2xl font-bold text-primary ml-2">PetGuardian Admin</span>
                    </Link>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <BookOpen className="size-8 text-primary" />
                            AI Knowledge Base Manager
                        </h1>
                        <p className="text-muted-foreground">Manage the chatbot's collective intelligence</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Entry Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-xl">Add New Entry</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="keyword">Keyword / Trigger</Label>
                                <Input
                                    id="keyword"
                                    placeholder="e.g., Chocolate"
                                    value={newEntry.keyword}
                                    onChange={e => setNewEntry({ ...newEntry, keyword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g., Nutrition"
                                    value={newEntry.category}
                                    onChange={e => setNewEntry({ ...newEntry, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="response">AI Response</Label>
                                <Textarea
                                    id="response"
                                    placeholder="Detailed answer for the AI to provide..."
                                    className="min-h-[150px]"
                                    value={newEntry.response}
                                    onChange={e => setNewEntry({ ...newEntry, response: e.target.value })}
                                />
                            </div>
                            <Button className="w-full" onClick={handleAdd} disabled={!newEntry.keyword || !newEntry.response}>
                                <Plus className="size-4 mr-2" />
                                Add Knowledge
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Knowledge List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                className="pl-10"
                                placeholder="Search by keyword or category..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            {filteredEntries.map(entry => (
                                <Card key={entry.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-primary">{entry.keyword}</span>
                                                    <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20">
                                                        {entry.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{entry.response}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredEntries.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                                    <BookOpen className="size-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium">No results found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
