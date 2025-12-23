import { useState, useRef, useEffect } from 'react';
import { ExamResult, OOPS_QUESTIONS, TOTAL_EXAM_MARKS, TOTAL_SEMESTER_MARKS } from '@/types/exam';
import { useAISettings } from '@/hooks/useAISettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Bot, User, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  result: ExamResult;
  onClose: () => void;
}

export function AIAssistant({ result, onClose }: AIAssistantProps) {
  const { settings, isConfigured } = useAISettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(!isConfigured);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && isConfigured) {
      // Initial greeting
      const greeting: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hello! I'm your AI study assistant. I can see your ${result.subject} exam results. You scored ${result.percentage}% overall with a grade of ${result.grade}. How can I help you understand your results or provide study tips?`,
      };
      setMessages([greeting]);
    }
  }, [isConfigured, result, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildSystemPrompt = () => {
    const questionDetails = result.questions
      .map((q) => {
        return `Q${q.questionNumber}: ${q.marksObtained}/${q.maxMarks} (${((q.marksObtained / q.maxMarks) * 100).toFixed(1)}%)`;
      })
      .join('\n');

    return `You are a helpful, encouraging educational AI assistant analyzing OOPs (Object Oriented Programming) exam results for a student.

Student's Exam Results:
- Name: ${result.studentName}
- Subject: ${result.subject}
- Exam: ${result.examName}
- Date: ${result.examDate}
- Exam Score: ${result.examMarks}/${TOTAL_EXAM_MARKS}
- Semester Score: ${result.semesterMarks}/${TOTAL_SEMESTER_MARKS} (${result.percentage}%)
- Grade: ${result.grade}
${result.rank ? `- Rank: #${result.rank}` : ''}

Question-wise Performance:
${questionDetails}

Teacher: ${result.teacher.name} (${result.teacher.designation || result.teacher.department})

Your role:
1. Provide constructive feedback on their OOPs performance
2. Identify areas of strength and improvement based on question topics
3. Offer specific, actionable study tips for OOP concepts
4. Be encouraging and supportive
5. Answer questions about their results

Keep responses concise but helpful. Use emojis sparingly for friendliness.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSettings || !isConfigured) {
    return (
      <AISettingsPanel 
        onClose={onClose} 
        onComplete={() => setShowSettings(false)} 
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="gradient-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Study Assistant</CardTitle>
              <p className="text-sm opacity-80">Powered by {settings.model}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your results..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AISettingsPanelProps {
  onClose: () => void;
  onComplete: () => void;
}

function AISettingsPanel({ onClose, onComplete }: AISettingsPanelProps) {
  const { settings, updateApiKey, updateModel, isConfigured } = useAISettings();
  const [apiKey, setApiKey] = useState(settings.apiKey);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    updateApiKey(apiKey.trim());
    toast.success('API key saved!');
    onComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in">
      <Button variant="ghost" onClick={onClose} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            AI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Your API key is stored locally</p>
              <p className="text-muted-foreground mt-1">
                The key is saved in your browser's localStorage and never sent to any server except OpenAI.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <select
              value={settings.model}
              onChange={(e) => updateModel(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cheap)</option>
              <option value="gpt-4o">GPT-4o (Powerful)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
            </select>
          </div>

          <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
