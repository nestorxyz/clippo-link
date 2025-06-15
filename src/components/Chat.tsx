import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, RefreshCw } from 'lucide-react';
import { Category, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatProps {
  categories: Category[];
  session: Session | null;
  onLinkAdded: () => void;
}

const Chat = ({ categories, session, onLinkAdded }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: crypto.randomUUID(), text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  useEffect(() => {
    if (!session?.user.id) return;

    const loadOrCreateChatSession = async () => {
      setIsBotTyping(true);
      try {
        const { data: existingSession, error: existingSessionError } = await retired-provider
          .from('chat_sessions')
          .select('id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingSessionError) throw existingSessionError;

        let currentSessionId: string;

        if (existingSession) {
          currentSessionId = existingSession.id;
          setSessionId(currentSessionId);

          const { data: messageHistory, error: messageHistoryError } = await retired-provider
            .from('chat_messages')
            .select('id, parts, role')
            .eq('session_id', currentSessionId)
            .order('created_at', { ascending: true });

          if (messageHistoryError) throw messageHistoryError;

          if (messageHistory && messageHistory.length > 0) {
            const formattedMessages: Message[] = messageHistory.map((msg: any) => ({
              id: msg.id,
              text: (Array.isArray(msg.parts) && msg.parts[0]?.text) || '',
              sender: msg.role === 'user' ? 'user' : 'bot',
            }));
            setMessages(formattedMessages);
          } else {
            setMessages([
              { id: crypto.randomUUID(), text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.", sender: 'bot' }
            ]);
          }
        } else {
          const { data: newSession, error: newSessionError } = await retired-provider
            .from('chat_sessions')
            .insert({ user_id: session.user.id })
            .select('id')
            .single();

          if (newSessionError) throw newSessionError;
          
          currentSessionId = newSession.id;
          setSessionId(currentSessionId);
          setMessages([
            { id: crypto.randomUUID(), text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.", sender: 'bot' }
          ]);
        }
      } catch (error) {
        console.error("Error managing chat session:", error);
        toast.error("Could not start a new chat session.");
        setMessages(prev => [...prev, {id: crypto.randomUUID(), text: "Sorry, I'm having trouble starting our conversation. Please refresh the page.", sender: 'bot'}]);
      } finally {
        setIsBotTyping(false);
      }
    };

    loadOrCreateChatSession();
  }, [session]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping || !sessionId) return;

    const userMessage: Message = { id: crypto.randomUUID(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsBotTyping(true);

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data, error } = await retired-provider.functions.invoke('gemini-chat', {
        body: {
          sessionId,
          message: currentInput,
          timeZone,
        },
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      const botMessage: Message = { id: crypto.randomUUID(), text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

      if (data.functionCalls?.some((fc: any) => fc.function?.name === 'register_link' && fc.function.result?.success)) {
        onLinkAdded();
        toast.success("Link added successfully!");
      }
    } catch (error) {
      console.error("Error calling gemini-chat function:", error);
      toast.error("An error occurred", { description: "I couldn't process that request. Please try again." });
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) {
      toast.info("No active chat session to clear.");
      return;
    }

    setIsBotTyping(true);
    try {
      const { error } = await retired-provider
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;

      setMessages([
        { id: crypto.randomUUID(), text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.", sender: 'bot' }
      ]);
      toast.success("Chat history has been cleared.");
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast.error("Could not clear chat history. Please try again.");
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, James</h1>
          <p className="text-muted-foreground">How can I assist you right now?</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              disabled={!sessionId || messages.length <= 1 || isBotTyping}
            >
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Clear chat history</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear chat history</p>
          </TooltipContent>
        </Tooltip>
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
      <div className="p-4 border-t bg-card">
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
          <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2" disabled={isBotTyping || !input.trim() || !sessionId}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
