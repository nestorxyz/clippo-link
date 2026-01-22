import {
  useState,
  useRef,
  useEffect,
  memo,
  useDeferredValue,
  useMemo,
} from 'react';
import {
  Send,
  RefreshCw,
  Link as LinkIcon,
  Smartphone,
  Folder,
  X,
  Lightbulb,
} from 'lucide-react';
import { Category, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Image from 'next/image';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { useQueryState, parseAsStringLiteral } from 'nuqs';

const settingsTabs = ['profile', 'integrations', 'billing'] as const;

interface ChatProps {
  categories: Category[];
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
            {/* Map Convex _id to id if needed, or use _id as key */}
            <div
              className={cn(
                'rounded-lg border p-4',
                message.sender === 'user'
                  ? 'bg-[#141414] border-[#1D1D1D]'
                  : 'bg-transparent border-0',
              )}
            >
              {message.sender === 'bot' || message.role === 'model' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {message.text ||
                    (message.parts && message.parts[0]?.text) ||
                    ''}
                </ReactMarkdown>
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {message.text || (message.parts && message.parts[0]?.text)}
                </p>
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
  },
);

const Chat = ({ onLinkAdded }: ChatProps) => {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<Id<'chatSessions'> | null>(null);
  const [, setSettingsTab] = useQueryState(
    'settings',
    parseAsStringLiteral(settingsTabs),
  );

  const getOrCreateSession = useMutation(api.chat.getOrCreateSession);
  const clearHistory = useMutation(api.chat.clearHistory);
  const processMessage = useAction(api.ai.processChatMessage);

  const { phoneStatus, loading: dateLoading } = usePhoneVerification();
  const [showNotification, setShowNotification] = useState(true);

  // Initial session load
  useEffect(() => {
    getOrCreateSession().then((session) => setSessionId(session._id));
  }, []);

  const rawMessages = useQuery(
    api.chat.getMessages,
    sessionId ? { sessionId } : 'skip',
  );

  // Convert Convex messages to UI Message type
  const messages = useMemo<Message[]>(
    () =>
      (rawMessages || [])
        .filter((m) => m.role !== 'function')
        .map((m) => {
          let text = '';
          const parts = m.parts as any[];

          if (parts && Array.isArray(parts)) {
            parts.forEach((p) => {
              if (p.text) {
                text += p.text;
              } else if (p.functionCall) {
                text += `_Used tool: ${p.functionCall.name}_\n`;
              }
            });
          }

          return {
            id: m._id,
            text,
            parts: m.parts as any,
            sender: m.role === 'model' ? 'bot' : 'user',
            role: m.role as any,
          };
        }),
    [rawMessages],
  );

  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const deferredMessages = useDeferredValue(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isBotTyping]);

  const handleSendMessage = async (customInput?: string) => {
    const messageToSend = customInput || input;

    if (!messageToSend.trim() || isBotTyping || !sessionId) return;

    setIsBotTyping(true);
    if (!customInput) setInput('');

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await processMessage({
        message: messageToSend,
        sessionId,
        timeZone,
      });

      if (result.reply) {
        onLinkAdded();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred', {
        description: "I couldn't process that request. Please try again.",
      });
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) return;
    if (confirm('Are you sure you want to clear the chat history?')) {
      try {
        await clearHistory({ sessionId });
        toast.success('Chat history cleared');
      } catch (e) {
        toast.error('Failed to clear history');
      }
    }
  };

  const openSettings = () => {
    setSettingsTab('integrations');
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Top Notification Bar */}
      {showNotification && phoneStatus && !phoneStatus.whatsappEnabled && (
        <div className="bg-[#1D1D1D] text-white px-4 py-2 flex items-center justify-between text-sm absolute top-4 left-4 right-4 z-20 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>
              Pro tip: Forward links directly from WhatsApp to save them
              instantly.
              <button
                onClick={openSettings}
                className="text-blue-400 hover:text-blue-300 ml-1 font-medium hover:underline"
              >
                Connect Now →
              </button>
            </span>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        // Blank State
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20 fade-in zoom-in duration-500">
          <div className="mb-8 relative opacity-80">
            <Image
              src="/isologo.png"
              width={260}
              height={48}
              alt="DoryAI"
              className="opacity-10"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 text-center">
            Welcome to DoryAI!
          </h1>
          <p className="text-[#A5A5A5] text-lg mb-10 text-center">
            I'm ready to organize your short content links
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={() => handleSendMessage('hello how can i save a link?')}
            >
              <LinkIcon className="h-4 w-4" />
              Save a test link
            </Button>
            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={openSettings}
            >
              <Smartphone className="h-4 w-4" />
              Connect WhatsApp
            </Button>
            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={() => handleSendMessage('How does DoryAI work?')}
            >
              <Folder className="h-4 w-4" />
              See how it works
            </Button>
          </div>
        </div>
      ) : (
        <>
          <header className="px-4 h-12 flex items-center shrink-0 border-b border-[#1D1D1D]">
            <div className="mx-auto w-full max-w-[720px] flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    disabled={
                      !sessionId || messages.length === 0 || isBotTyping
                    }
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
        </>
      )}

      <div className="sticky bottom-0 z-10 border-t border-[#1D1D1D] bg-[#0A0A0A]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="relative mx-auto w-full max-w-[720px] px-4 py-4 pt-3 pb-[calc(8px+env(safe-area-inset-bottom))]">
          <form onSubmit={() => handleSendMessage()} className="relative">
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
                    handleSendMessage();
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
