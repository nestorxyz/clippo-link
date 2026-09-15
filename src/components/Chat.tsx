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
  Folder,
} from 'lucide-react';
import { Message } from '@/lib/types';
import { formatChatRecord } from './chat/chat-message';
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
          <div className="group" role="status" aria-label="DoryAI is working">
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

const Chat = () => {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<Id<'chatSessions'> | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(
    null,
  );
  const getOrCreateSession = useMutation(api.chat.getOrCreateSession);
  const clearHistory = useMutation(api.chat.clearHistory);
  const processMessage = useAction(api.ai.processChatMessage);

  // Initial session load
  useEffect(() => {
    let active = true;
    setSessionError(false);
    void getOrCreateSession({})
      .then((session) => {
        if (active && session) setSessionId(session._id);
      })
      .catch(() => {
        if (active) setSessionError(true);
      });
    return () => {
      active = false;
    };
  }, [getOrCreateSession, sessionAttempt]);

  const rawMessages = useQuery(
    api.chat.getMessages,
    sessionId ? { sessionId } : 'skip',
  );

  // Convert Convex messages to UI Message type
  const messages = useMemo<Message[]>(
    () => {
      const formattedMessages: Message[] = [];
      for (const message of rawMessages ?? []) {
        const text = formatChatRecord(message);
        if (!text) continue;
        formattedMessages.push({
          id: message._id,
          text,
          parts: message.parts as any,
          sender: message.role === 'user' ? 'user' : 'bot',
          role: message.role as any,
        });
      }
      return formattedMessages;
    },
    [rawMessages],
  );

  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    setRequestError(null);
    setLastFailedMessage(null);
    if (!customInput) setInput('');

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await processMessage({
        message: messageToSend,
        sessionId,
        timeZone,
      });
    } catch {
      setRequestError("DoryAI couldn't finish that request.");
      setLastFailedMessage(messageToSend);
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
      } catch {
        toast.error('Failed to clear history');
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative">
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
              disabled={!sessionId || isBotTyping}
            >
              <LinkIcon className="h-4 w-4" />
              Save a test link
            </Button>

            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={() => handleSendMessage('How does DoryAI work?')}
              disabled={!sessionId || isBotTyping}
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
          {(sessionError || requestError) && (
            <div
              className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-100"
              role="alert"
            >
              <span>
                {sessionError ? 'Chat could not start.' : requestError}
              </span>
              {sessionError ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSessionAttempt((attempt) => attempt + 1)}
                >
                  Try again
                </Button>
              ) : lastFailedMessage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBotTyping || !sessionId}
                  onClick={() => void handleSendMessage(lastFailedMessage)}
                >
                  Try again
                </Button>
              ) : null}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendMessage();
            }}
            className="relative"
          >
            <div className="relative rounded-[28px] md:rounded-full border border-[#1D1D1D] bg-[#1A1A1A] shadow-sm">
              <Textarea
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
