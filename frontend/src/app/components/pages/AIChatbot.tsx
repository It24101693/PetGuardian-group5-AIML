import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Heart, ArrowLeft, Send, Bot, User, AlertTriangle, PawPrint } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChatbot() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your PetGuardian AI Assistant. ðŸ¾ I can help answer questions about pet care, symptoms, and health concerns. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showRiskAssessment, setShowRiskAssessment] = useState(false);

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

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getAIResponse(inputMessage),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const getAIResponse = (question: string): string => {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('chocolate')) {
            return "Yes, chocolate is toxic to dogs! ðŸš«ðŸ« Chocolate contains theobromine and caffeine, which dogs cannot metabolize effectively. Even small amounts can cause vomiting, diarrhea, rapid heart rate, and seizures. Dark chocolate and baking chocolate are especially dangerous. If your dog has eaten chocolate, contact your veterinarian immediately!";
        }

        if (lowerQuestion.includes('vaccine') || lowerQuestion.includes('vaccination')) {
            return "Vaccines are essential for protecting your pet! ðŸ’‰ Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats, core vaccines include rabies, feline distemper, feline herpesvirus, and calicivirus. Puppies and kittens typically need vaccines every 3-4 weeks until 16 weeks old, then boosters annually or every 3 years depending on the vaccine. Always consult with your veterinarian for a personalized vaccination schedule!";
        }

        if (lowerQuestion.includes('food') || lowerQuestion.includes('eat')) {
            return "A balanced diet is crucial for your pet's health! ðŸ– Choose high-quality pet food appropriate for your pet's age, size, and activity level. Avoid feeding: chocolate, grapes, raisins, onions, garlic, xylitol, and excessive fatty foods. Fresh water should always be available. For specific dietary recommendations based on your pet's needs, consult your veterinarian.";
        }

        if (lowerQuestion.includes('exercise') || lowerQuestion.includes('walk')) {
            return "Regular exercise is vital for your pet's physical and mental health! ðŸƒâ€â™‚ï¸ Dogs typically need 30-120 minutes of exercise daily, depending on breed and age. Cats benefit from 20-30 minutes of interactive play. Activities can include walks, fetch, puzzle toys, and training sessions. Adjust intensity based on your pet's age and health condition.";
        }

        return "That's a great question! While I can provide general pet care information, I recommend discussing specific health concerns with a licensed veterinarian. They can provide personalized advice based on your pet's complete medical history. Would you like me to help you find a nearby veterinarian or answer another general pet care question?";
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
            recommendation = 'âš ï¸ Immediate veterinary attention recommended. Multiple symptoms may indicate a serious condition.';
        } else if (score > 30) {
            level = 'Moderate';
            recommendation = 'ðŸ“ž Schedule a veterinary appointment within 24-48 hours to assess these symptoms.';
        }

        setRiskResult({ level, score, recommendation });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b bg-white">
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

            {/* Chat Header */}
            <div className="border-b bg-white px-4 py-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-12 bg-accent/20 rounded-full flex items-center justify-center">
                                <Bot className="size-6 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">AI Health Assistant</h1>
                                <p className="text-sm text-muted-foreground">Ask pet care questions anytime</p>
                            </div>
                        </div>
                        <Dialog open={showRiskAssessment} onOpenChange={setShowRiskAssessment}>
                            <DialogTrigger asChild>
                                <Button>
                                    <AlertTriangle className="size-4 mr-2" />
                                    Health Risk Calculator
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>AI Health Risk Assessment</DialogTitle>
                                    <DialogDescription>
                                        Select symptoms your pet is experiencing to get an AI-powered health risk assessment
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base mb-3 block">Common Symptoms</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(symptoms).map(([key, value]) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={key}
                                                        checked={value}
                                                        onCheckedChange={(checked) =>
                                                            setSymptoms(prev => ({ ...prev, [key]: checked as boolean }))
                                                        }
                                                    />
                                                    <Label htmlFor={key} className="font-normal cursor-pointer capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="additional">Additional Symptoms or Notes</Label>
                                        <Textarea
                                            id="additional"
                                            placeholder="Describe any other symptoms or concerns..."
                                            value={additionalSymptoms}
                                            onChange={(e) => setAdditionalSymptoms(e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    <Button onClick={calculateHealthRisk} className="w-full">
                                        Calculate Health Risk
                                    </Button>

                                    {riskResult && (
                                        <Card className={
                                            riskResult.level === 'High' ? 'border-red-500' :
                                                riskResult.level === 'Moderate' ? 'border-orange-500' :
                                                    'border-green-500'
                                        }>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    Risk Level:
                                                    <Badge className={
                                                        riskResult.level === 'High' ? 'bg-red-500' :
                                                            riskResult.level === 'Moderate' ? 'bg-orange-500' :
                                                                'bg-green-500'
                                                    }>
                                                        {riskResult.level}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription>Risk Score: {riskResult.score.toFixed(0)}%</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm">{riskResult.recommendation}</p>
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    âš ï¸ This is an AI-powered estimate and not a substitute for professional veterinary diagnosis.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 bg-muted/30">
                <div className="container mx-auto max-w-4xl space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="size-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="size-4 text-accent" />
                                </div>
                            )}
                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                                <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-white border'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 px-2">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {message.role === 'user' && (
                                <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="size-4 text-primary" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="size-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="size-4 text-accent" />
                            </div>
                            <div className="bg-white border rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Quick Questions */}
            <div className="border-t bg-white px-4 py-3">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion("Is chocolate bad for dogs?")}
                        >
                            Is chocolate bad for dogs?
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion("When should my puppy get vaccinated?")}
                        >
                            Vaccination schedule?
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion("How much exercise does my dog need?")}
                        >
                            Exercise needs?
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion("What foods are safe for pets?")}
                        >
                            Safe foods?
                        </Button>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t bg-white px-4 py-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask a question about pet care..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                            <Send className="size-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        AI Assistant provides general information. Always consult a veterinarian for medical advice.
                    </p>
                </div>
            </div>
        </div>
    );
}
