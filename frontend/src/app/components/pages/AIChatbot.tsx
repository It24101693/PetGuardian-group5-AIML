import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useChat, Message } from '../contexts/ChatContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Heart, ArrowLeft, Send, Bot, User, AlertTriangle, PawPrint, Sparkles, Zap, ShieldCheck, RefreshCcw } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';

export default function AIChatbot() {
    const navigate = useNavigate();
    const { aiMessages: messages, sendAiQuery } = useChat();
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showRiskAssessment, setShowRiskAssessment] = useState(false);

    // Initial message if empty
    const displayMessages = messages.length > 0 ? messages : [
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm your PetGuardian AI Assistant. 🐾 I can help answer questions about pet care, symptoms, and health concerns. How can I help you today?",
            timestamp: new Date().toISOString(),
            isAi: true
        }
    ];

    // Risk assessment form state
    const [symptoms, setSymptoms] = useState({
        lethargy: false,
        vomiting: false,
        diarrhea: false,
        lossOfAppetite: false,
        coughing: false,
        limping: false,
        excessiveThirst: false,
        weightLoss: false
    });
    const [additionalSymptoms, setAdditionalSymptoms] = useState('');
    const [riskResult, setRiskResult] = useState<{ level: string; score: number; recommendation: string } | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        setIsTyping(true);
        const query = inputMessage;
        setInputMessage('');

        await sendAiQuery(query);
        setIsTyping(false);
    };

    const handleQuickQuestion = (question: string) => {
        setInputMessage(question);
    };

    const calculateHealthRisk = () => {
        const selectedSymptoms = Object.values(symptoms).filter(Boolean).length;
        const totalSymptoms = Object.keys(symptoms).length;
        const score = (selectedSymptoms / totalSymptoms) * 100;

        let level = 'Low';
        let recommendation = 'Monitor your pet and maintain regular checkups.';

        if (score > 60) {
            level = 'High';
            recommendation = '⚠️ Immediate veterinary attention recommended. Multiple symptoms may indicate a serious condition.';
        } else if (score > 30) {
            level = 'Moderate';
            recommendation = '📞 Schedule a veterinary appointment within 24-48 hours to assess these symptoms.';
        }

        setRiskResult({ level, score, recommendation });
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
                    <div className="flex items-center gap-3">
                        <Dialog open={showRiskAssessment} onOpenChange={setShowRiskAssessment}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="hidden sm:flex rounded-full border-accent/20 text-accent hover:bg-accent/5">
                                    <AlertTriangle className="size-4 mr-2" />
                                    Risk Calculator
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">AI Health Risk Assessment</DialogTitle>
                                    <DialogDescription className="font-medium">
                                        Select symptoms your pet is experiencing to get an AI-powered health risk assessment
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(symptoms).map(([key, value]) => (
                                            <label key={key} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${value ? 'border-accent bg-accent/5 shadow-inner' : 'border-slate-100 hover:border-accent/20'}`}>
                                                <Checkbox
                                                    id={key}
                                                    checked={value}
                                                    onCheckedChange={(checked) =>
                                                        setSymptoms(prev => ({ ...prev, [key]: checked as boolean }))
                                                    }
                                                    className="rounded-md border-slate-200 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                                />
                                                <span className="text-sm font-bold capitalize text-slate-700">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="additional" className="font-bold ml-1">Additional Symptoms or Notes</Label>
                                        <Textarea
                                            id="additional"
                                            placeholder="Describe any other symptoms or concerns..."
                                            value={additionalSymptoms}
                                            onChange={(e) => setAdditionalSymptoms(e.target.value)}
                                            className="min-h-[100px] rounded-2xl border-2 border-slate-100 focus:border-accent/20 focus:ring-0 resize-none font-medium"
                                        />
                                    </div>

                                    <Button onClick={calculateHealthRisk} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-lg shadow-lg shadow-accent/20 active:scale-[0.98] transition-transform">
                                        Calculate Health Risk
                                    </Button>

                                    {riskResult && (
                                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                            <Card className={`overflow-hidden border-2 shadow-xl ${riskResult.level === 'High' ? 'border-red-500 bg-red-50' :
                                                riskResult.level === 'Moderate' ? 'border-orange-500 bg-orange-50' :
                                                    'border-green-500 bg-green-50'
                                                }`}>
                                                <CardHeader className="pb-3 border-b border-white/50">
                                                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                                                        Risk Level:
                                                        <Badge className={`rounded-lg px-3 py-1 text-sm ${riskResult.level === 'High' ? 'bg-red-500' :
                                                            riskResult.level === 'Moderate' ? 'bg-orange-500' :
                                                                'bg-green-500'
                                                            }`}>
                                                            {riskResult.level}
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-4">
                                                    <p className="font-bold text-slate-700 leading-relaxed mb-4">{riskResult.recommendation}</p>
                                                    <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl text-[11px] font-medium text-slate-500 leading-tight">
                                                        <AlertTriangle className="size-4 shrink-0 text-slate-400" />
                                                        This is an AI-powered estimate and not a substitute for professional veterinary diagnosis.
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button variant="ghost" className="hover:bg-primary/5 font-medium" onClick={() => navigate(-1)}>
                            <ArrowLeft className="size-4 mr-2" />
                            Exit
                        </Button>
                    </div>
                </div>
            </header>

            {/* Chat Content */}
            <main className="flex-1 overflow-hidden flex flex-col container mx-auto max-w-5xl relative">

                {/* Background Sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <Sparkles className="absolute top-20 left-[10%] size-20 text-primary animate-pulse" />
                    <Sparkles className="absolute bottom-40 right-[15%] size-32 text-accent animate-pulse delay-700" />
                    <PawPrint className="absolute top-1/2 left-[20%] size-12 text-primary/20 rotate-45" />
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence initial={false}>
                        {displayMessages.map((message: any) => {
                            const isAssistant = message.isAi || message.senderId === 'assistant';
                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex gap-3 sm:gap-4 ${!isAssistant ? 'justify-end' : 'justify-start'}`}
                                >
                                    {isAssistant && (
                                        <div className="size-10 bg-white shadow-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 group">
                                            <Bot className="size-5 text-accent group-hover:scale-110 transition-transform" />
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] sm:max-w-[75%] relative ${!isAssistant ? 'order-1' : ''}`}>
                                        <div className={`rounded-3xl px-5 py-4 shadow-sm ${!isAssistant
                                            ? 'bg-primary text-white rounded-tr-none font-medium'
                                            : 'bg-white border border-slate-100 rounded-tl-none font-medium text-slate-700'
                                            }`}>
                                            <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 mt-2 px-2 ${!isAssistant ? 'justify-end' : 'justify-start'}`}>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {isAssistant && <Zap className="size-3 text-accent fill-accent opacity-50" />}
                                        </div>
                                    </div>
                                    {!isAssistant && (
                                        <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <User className="size-5 text-primary" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                            <div className="size-10 bg-white shadow-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100">
                                <Bot className="size-5 text-accent animate-bounce" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none px-6 py-4 shadow-sm">
                                <div className="flex gap-1.5 px-1">
                                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="size-1.5 bg-accent/40 rounded-full" />
                                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="size-1.5 bg-accent/40 rounded-full" />
                                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="size-1.5 bg-accent/40 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-8 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent">
                    <div className="max-w-4xl mx-auto space-y-4">

                        {/* Quick Questions */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                            {[
                                { q: "Is chocolate bad for dogs?", icon: "🍫" },
                                { q: "Vaccination schedule?", icon: "💉" },
                                { q: "Exercise needs?", icon: "🥎" },
                                { q: "Safe foods?", icon: "🥕" }
                            ].map((item, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuickQuestion(item.q)}
                                    className="rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 whitespace-nowrap text-xs font-bold py-5 px-5 group"
                                >
                                    <span className="mr-2 group-hover:scale-125 transition-transform">{item.icon}</span>
                                    {item.q}
                                </Button>
                            ))}
                        </div>

                        {/* Input Field */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Card className="rounded-[2.5rem] shadow-2xl border-none p-2 bg-white flex items-center gap-2 pr-4 focus-within:ring-4 ring-primary/5 transition-all group">
                                <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center ml-2 border border-slate-100">
                                    <Bot className="size-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <Input
                                    placeholder="Type your question here..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-slate-300 h-14"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className="size-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-90 transition-all p-0"
                                >
                                    <Send className="size-6 -mr-1" />
                                </Button>
                            </Card>
                        </motion.div>

                        <div className="flex items-center justify-center gap-6 pt-2">
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <ShieldCheck className="size-3" /> AI Verification On
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <Zap className="size-3" /> GPT-4 Intelligence
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
