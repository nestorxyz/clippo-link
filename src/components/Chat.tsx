import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { Category, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatProps {
  addLink: (categoryName: string, subCategoryName: string, url: string, description: string) => Promise<boolean>;
  categories: Category[];
}

const Chat = ({ addLink, categories }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: crypto.randomUUID(), text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link`.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [addLinkState, setAddLinkState] = useState<{ step: 'url' | 'description' | 'category' | null }>({ step: null });
  const [newLink, setNewLink] = useState({ url: '', description: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping) return;

    const userMessage: Message = { id: crypto.randomUUID(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    // Mock AI processing
    setTimeout(() => {
      handleBotResponse(input);
      setIsBotTyping(false);
    }, 1000 + Math.random() * 500);
  };
  
  const handleBotResponse = (userInput: string) => {
    let botResponseText = "";

    if (addLinkState.step) {
      handleMultiTurnAddLink(userInput);
      return;
    }

    if (userInput.toLowerCase().includes('add a new link')) {
      setAddLinkState({ step: 'url' });
      botResponseText = "Sure! What is the URL of the link you want to add?";
    } else {
      botResponseText = "I can help you organize links. Try asking me to `add a new link`.";
    }

    const botMessage: Message = { id: crypto.randomUUID(), text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleMultiTurnAddLink = async (userInput: string) => {
    let botResponseText = "";
    if (addLinkState.step === 'url') {
      try {
        new URL(userInput);
        setNewLink({ ...newLink, url: userInput });
        setAddLinkState({ step: 'description' });
        botResponseText = "Great. What is a short description for this link?";
      } catch (error) {
        botResponseText = "That doesn't look like a valid URL. Please provide a valid URL.";
      }
    } else if (addLinkState.step === 'description') {
      setNewLink({ ...newLink, description: userInput });
      setAddLinkState({ step: 'category' });
      const categoryExamples = categories.map(c => `${c.name}/${c.subCategories[0]?.name || ''}`).filter(Boolean).slice(0,2).join(', ');
      botResponseText = `Got it. Which category/subcategory should I put it under? (e.g., ${categoryExamples || 'Work/React'})`;
    } else if (addLinkState.step === 'category') {
      const [catName, subCatName] = userInput.split('/');
      
      if (!catName || !subCatName) {
        botResponseText = "Sorry, I need the category and subcategory in the format 'Category/Subcategory'. Please try again.";
      } else {
        const success = await addLink(catName, subCatName, newLink.url, newLink.description);
        if (success) {
          botResponseText = "Done! I've saved the link for you.";
        } else {
          botResponseText = "Sorry, I couldn't save the link. An error occurred. Please try again.";
        }
      }
      setAddLinkState({ step: null });
      setNewLink({ url: '', description: '' });
    }
    
    const botMessage: Message = { id: crypto.randomUUID(), text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-background/70">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Hello, James</h1>
        <p className="text-muted-foreground">How can I assist you right now?</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3 animate-message-in", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
            {message.sender === 'bot' && <div className="bg-primary rounded-full p-2"><Bot className="h-5 w-5 text-primary-foreground" /></div>}
            <div className={cn("max-w-md p-3 rounded-lg", message.sender === 'user' ? 'bg-secondary' : 'bg-card')}>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
            {message.sender === 'user' && <div className="bg-secondary rounded-full p-2"><UserIcon className="h-5 w-5" /></div>}
          </div>
        ))}
        {isBotTyping && (
          <div className="flex items-start gap-3 animate-message-in">
            <div className="bg-primary rounded-full p-2"><Bot className="h-5 w-5 text-primary-foreground" /></div>
            <div className="p-3 rounded-lg bg-card">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-input rounded-lg pr-20 min-h-[40px] resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2" disabled={isBotTyping || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
