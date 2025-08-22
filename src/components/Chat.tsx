import { useState, useRef, useEffect, memo, useDeferredValue } from 'react';
import { Send, RefreshCw, Plus, Mic } from 'lucide-react';
import { Category, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import { env } from '@/env';
import remarkGfm from 'remark-gfm';

interface ChatProps {
  categories: Category[];
  session: Session | null;
  onLinkAdded: () => void;
}

// Memoized list to avoid re-rendering the whole chat on each keystroke
const MessageList = memo(
  ({
    messages,
    isBotTyping,
    messagesEndRef,
  }: {
    messages: Message[];
    isBotTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
  }) => {
    return (
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="animate-message-in group">
            <div
              className={cn(
                'rounded-lg border p-4',
                message.sender === 'user'
                  ? 'bg-[#141414] border-[#1D1D1D]'
                  : 'bg-transparent border-0'
              )}
            >
              {message.sender === 'bot' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="group">
            <div className="rounded-lg p-4">
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
    );
  }
);

const Chat = ({ categories, session, onLinkAdded }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 200;
  // Defer heavy message list rendering while the user is typing
  const deferredMessages = useDeferredValue(messages);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isBotTyping]);

  useEffect(() => {
    if (!session?.user.id) return;
    const loadOrCreateChatSession = async () => {
      setIsBotTyping(true);
      try {
        const { data: existingSession, error: existingSessionError } =
          await supabase
            .from('chat_sessions')
            .select('id')
            .eq('user_id', session.user.id)
            .order('created_at', {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();
        if (existingSessionError) throw existingSessionError;
        let currentSessionId: string;
        if (existingSession) {
          currentSessionId = existingSession.id;
          setSessionId(currentSessionId);
          const { data: messageHistory, error: messageHistoryError } =
            await supabase
              .from('chat_messages')
              .select('id, parts, role')
              .eq('session_id', currentSessionId)
              .order('created_at', {
                ascending: true,
              });
          if (messageHistoryError) throw messageHistoryError;
          if (messageHistory && messageHistory.length > 0) {
            type RawMessage = {
              id: string;
              parts: Array<{ text?: string }>;
              role: string;
            };
            const formattedMessages: Message[] = (
              messageHistory as RawMessage[]
            ).map((msg) => ({
              id: msg.id,
              text: (Array.isArray(msg.parts) && msg.parts[0]?.text) || '',
              sender: msg.role === 'user' ? 'user' : 'bot',
            }));
            setMessages(formattedMessages);
          } else {
            setMessages([
              {
                id: crypto.randomUUID(),
                text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.",
                sender: 'bot',
              },
            ]);
          }
        } else {
          const { data: newSession, error: newSessionError } = await supabase
            .from('chat_sessions')
            .insert({
              user_id: session.user.id,
            })
            .select('id')
            .single();
          if (newSessionError) throw newSessionError;
          currentSessionId = newSession.id;
          setSessionId(currentSessionId);
          setMessages([
            {
              id: crypto.randomUUID(),
              text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.",
              sender: 'bot',
            },
          ]);
        }
      } catch (error) {
        console.error('Error managing chat session:', error);
        toast.error('Could not start a new chat session.');
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: "Sorry, I'm having trouble starting our conversation. Please refresh the page.",
            sender: 'bot',
          },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    };
    loadOrCreateChatSession();
  }, [session]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping || !sessionId) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsBotTyping(true);
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Call backend instead of edge function
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          message: currentInput,
          timeZone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.reply,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
      if (
        Array.isArray(data?.functionCalls) &&
        data.functionCalls.some(
          (fc: {
            function?: { name?: string; result?: { success?: boolean } };
          }) =>
            fc.function?.name === 'register_link' &&
            fc.function?.result?.success
        )
      ) {
        onLinkAdded();
        toast.success('Link added successfully!');
      }
    } catch (error) {
      console.error('Error calling gemini-chat function:', error);
      toast.error('An error occurred', {
        description: "I couldn't process that request. Please try again.",
      });
    } finally {
      setIsBotTyping(false);
    }
  };
  const handleClearChat = async () => {
    if (!sessionId) {
      toast.info('No active chat session to clear.');
      return;
    }
    setIsBotTyping(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
      if (error) throw error;
      setMessages([
        {
          id: crypto.randomUUID(),
          text: "Hello! I'm your AI link organizer. How can I assist you right now? You can ask me to `add a new link` or `show me my links`.",
          sender: 'bot',
        },
      ]);
      toast.success('Chat history has been cleared.');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast.error('Could not clear chat history. Please try again.');
    } finally {
      setIsBotTyping(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <header className="px-4 h-12 flex items-center shrink-0 border-b border-[#1D1D1D]">
        <div className="mx-auto w-full max-w-[720px] flex justify-end">
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
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-4 py-6">
          <MessageList
            messages={deferredMessages}
            isBotTyping={isBotTyping}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
      <div className="sticky bottom-16 md:bottom-0 z-10 border-t border-[#1D1D1D] bg-[#0A0A0A]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="relative mx-auto w-full max-w-[720px] px-4 py-4 pt-3 pb-[calc(8px+env(safe-area-inset-bottom))]">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="relative rounded-[28px] md:rounded-full border border-[#1D1D1D] bg-[#1A1A1A] shadow-sm">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Talk with DoryAI"
                className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base min-h-[52px] max-h-[200px] px-12 md:pr-28 py-3 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  disabled={isBotTyping || !input.trim() || !sessionId}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Chat;
