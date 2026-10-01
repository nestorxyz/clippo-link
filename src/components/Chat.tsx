import {
  useState,
  useRef,
  useEffect,
  memo,
  useDeferredValue,
  useMemo,
  useCallback,
} from 'react';
import {
  Send,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Message } from '@/lib/types';
import {
  formatChatRecord,
  getActivationStep,
  getSavedLinkPreview,
  getSavedLinkPreviewsById,
  getSearchResultPreviews,
  suggestedSavedLinkQuestion,
  type SearchResultPreview,
} from './chat/chat-message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Image from 'next/image';
import { extractSharedHttpUrl } from '@/lib/share-target';
import { LinkPreviewArtwork } from '@/components/LinkPreviewArtwork';

const SearchResultCard = ({ result }: { result: SearchResultPreview }) => {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-36 min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#141414] transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-40"
    >
      <LinkPreviewArtwork url={result.url} imgPreview={result.imgPreview} />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
      {result.contentScope ? (
        <span className="relative z-10 m-2 self-start rounded bg-black/70 px-2 py-0.5 text-[10px] text-amber-200">
          {result.contentScope === 'partial-preview'
            ? 'Partial preview'
            : 'Metadata only'}
        </span>
      ) : null}
      <span className="relative z-10 mt-auto flex min-w-0 flex-col px-3 pb-3">
        <span className="flex items-start justify-between gap-2 text-sm font-semibold text-white">
          <span className="min-w-0 line-clamp-2 break-words">{result.title}</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="mt-1 block truncate text-xs text-gray-300">
          {new URL(result.url).hostname}
        </span>
      </span>
    </a>
  );
};

const SearchResultCards = memo(({ message }: { message: Message }) => {
  const results = getSearchResultPreviews({
    role: message.role ?? '',
    parts: message.parts,
  });
  if (results.length === 0) return null;

  return (
    <div className="saved-link-results mt-3" aria-label="Saved link search results">
      <p className="mb-2 text-xs text-muted-foreground">Top matches</p>
      <div className="saved-link-results-grid">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
});

const SavedLinkMoment = ({
  message,
  onAsk,
  disabled,
}: {
  message: Message;
  onAsk: (question: string, savedLinkId: string) => void;
  disabled: boolean;
}) => {
  const saved = getSavedLinkPreview({
    role: message.role ?? '',
    parts: message.parts,
  });
  if (!saved) return null;

  const captureStatus = saved.contentScope === 'metadata-only'
    ? 'Only the title and metadata were available.'
    : saved.contentScope === 'partial-preview'
      ? 'A public preview was saved; the full post may be unavailable.'
      : saved.hasContent
        ? 'Text was saved for later questions.'
        : 'Title and description saved; source text was unavailable.';

  return (
    <section
      className="mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#171717]"
      aria-label="Newly saved link"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="group relative h-28 shrink-0 overflow-hidden sm:h-auto sm:w-36" aria-hidden="true">
          <LinkPreviewArtwork url={saved.url} imgPreview={saved.imgPreview} />
        </div>
        <div className="min-w-0 flex-1 p-4">
          <p className="text-xs font-medium text-emerald-300">Saved to your library</p>
          <a
            href={saved.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block line-clamp-2 font-semibold text-white underline-offset-2 hover:underline focus-visible:underline"
          >
            {saved.title}
          </a>
          {saved.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-gray-300">
              {saved.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-gray-400">{captureStatus}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <p className="text-xs text-gray-400">Try asking about what you saved.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onAsk(suggestedSavedLinkQuestion(), saved.id)}
          className="gap-2"
        >
          Ask about this link
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
};

// Memoized list to avoid re-rendering the whole chat on each keystroke
const MessageList = memo(
  ({
    messages,
    isBotTyping,
    messagesEndRef,
    onAskSavedLink,
  }: {
    messages: Message[];
    isBotTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onAskSavedLink: (question: string, savedLinkId: string) => void;
  }) => {
    const savedLinks = useMemo(
      () => getSavedLinkPreviewsById(messages.map((message) => ({
        role: message.role ?? '',
        parts: message.parts,
      }))),
      [messages],
    );
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
            {message.role === 'user' && message.contextLinkId &&
              savedLinks.has(message.contextLinkId) ? (
              <div className="saved-link-results mt-3" aria-label="Selected saved link">
                <p className="mb-2 text-xs text-muted-foreground">This saved link</p>
                <div className="saved-link-results-grid">
                  <SearchResultCard result={savedLinks.get(message.contextLinkId)!} />
                </div>
              </div>
            ) : null}
            <SearchResultCards message={message} />
            <SavedLinkMoment
              message={message}
              onAsk={onAskSavedLink}
              disabled={isBotTyping}
            />
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
  const [lastFailedMessage, setLastFailedMessage] = useState<{
    text: string;
    savedLinkId?: string;
  } | null>(
    null,
  );
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
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
  const hasSavedLinks = useQuery(api.links.hasSavedLinks);

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
          contextLinkId: message.contextLinkId,
        });
      }
      return formattedMessages;
    },
    [rawMessages],
  );

  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const deferredMessages = useDeferredValue(messages);
  const activationStep = useMemo(
    () => getActivationStep(rawMessages ?? [], hasSavedLinks === true),
    [rawMessages, hasSavedLinks],
  );

  const startFirstSave = () => {
    setInput('Save this link: ');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const startFirstSearch = () => {
    setInput('Find my saved link about ');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedUrl = extractSharedHttpUrl(
      searchParams.get('shared_url'),
    );
    const shareError = searchParams.get('share_error');
    if (!sharedUrl && shareError !== 'missing_url') return;

    if (sharedUrl) {
      setInput(`Save this link: ${sharedUrl}`);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      toast.error('No web link was found in the shared content.');
    }
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isBotTyping]);

  const sendMessage = useCallback(async (
    messageToSend: string,
    clearInput: boolean,
    savedLinkId?: string,
  ) => {
    if (!messageToSend.trim() || isBotTyping || !sessionId) return;

    setIsBotTyping(true);
    setRequestError(null);
    setLastFailedMessage(null);
    if (clearInput) setInput('');

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await processMessage({
        message: messageToSend,
        sessionId,
        timeZone,
        ...(savedLinkId ? { savedLinkId: savedLinkId as Id<'links'> } : {}),
      });
    } catch {
      setRequestError("DoryAI couldn't finish that request.");
      setLastFailedMessage({ text: messageToSend, savedLinkId });
    } finally {
      setIsBotTyping(false);
    }
  }, [isBotTyping, processMessage, sessionId]);

  const handleSendMessage = (customInput?: string) =>
    sendMessage(customInput ?? input, customInput === undefined);

  const handleAskSavedLink = useCallback((question: string, savedLinkId: string) => {
    void sendMessage(question, false, savedLinkId);
  }, [sendMessage]);

  const handleClearChat = async () => {
    if (!sessionId || isClearingHistory) return;

    setIsClearingHistory(true);
    try {
      const result = await clearHistory({ sessionId });
      setClearDialogOpen(false);
      toast.success(
        result.deletedCount === 1
          ? '1 chat message cleared'
          : `${result.deletedCount} chat messages cleared`,
      );
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setIsClearingHistory(false);
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
            {hasSavedLinks === undefined
              ? 'Getting your library ready…'
              : hasSavedLinks
                ? 'Your saved links are ready'
                : 'Save a link you want to remember'}
          </h1>
          <p className="max-w-xl text-[#A5A5A5] text-base md:text-lg mb-6 text-center">
            {hasSavedLinks
              ? 'Ask DoryAI to find or explain something you saved, or add another link.'
              : 'Add a useful webpage, video, or supported post. DoryAI will show what it saved, then you can ask about it in your own words.'}
          </p>

          {hasSavedLinks === false ? (
            <ol
              className="mb-8 flex items-center gap-3 text-sm text-[#A5A5A5]"
              aria-label="Getting started"
            >
              <li className="rounded-full border border-white/20 px-3 py-1 text-white">
                1. Save
              </li>
              <li aria-hidden="true">→</li>
              <li className="rounded-full border border-white/20 px-3 py-1">
                2. Find it
              </li>
            </ol>
          ) : null}

          <div className="flex flex-wrap justify-center gap-3">
            {hasSavedLinks ? (
              <Button
                type="button"
                onClick={startFirstSearch}
                disabled={!sessionId || isBotTyping}
                className="rounded-full h-10 px-6"
              >
                Find a saved link
              </Button>
            ) : null}
            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={startFirstSave}
              disabled={hasSavedLinks === undefined || !sessionId || isBotTyping}
            >
              <LinkIcon className="h-4 w-4" />
              {hasSavedLinks ? 'Add another link' : 'Add a link'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <header className="px-4 h-12 flex items-center shrink-0 border-b border-[#1D1D1D]">
            <div className="mx-auto flex w-full max-w-[720px] items-center justify-between gap-3">
              <p className="text-xs text-[#A5A5A5]" role="status">
                {activationStep === 'save' &&
                  'Step 1 of 2: send a link to save it.'}
                {activationStep === 'ready' &&
                  'Ask DoryAI about any link you saved.'}
                {activationStep === 'retrieve' &&
                  'Step 2 of 2: ask DoryAI to find that link.'}
                {activationStep === 'complete' &&
                  'First save and retrieval complete.'}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setClearDialogOpen(true)}
                    disabled={
                      !sessionId ||
                      messages.length === 0 ||
                      isBotTyping ||
                      isClearingHistory
                    }
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Clear chat history</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat history</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <DialogContent className="sm:max-w-md rounded-xl border border-[#2A2A2A] bg-[#1D1D1D] text-[#E5E5E5]">
              <DialogHeader>
                <DialogTitle>Clear chat history?</DialogTitle>
                <DialogDescription className="text-[#A5A5A5]">
                  This permanently removes this conversation. Your saved links
                  will not be affected.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:space-x-0">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isClearingHistory}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isClearingHistory}
                  onClick={() => void handleClearChat()}
                >
                  {isClearingHistory ? 'Clearing…' : 'Clear history'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[720px] px-4 py-6">
              <MessageList
                messages={deferredMessages}
                isBotTyping={isBotTyping}
                messagesEndRef={messagesEndRef}
                onAskSavedLink={handleAskSavedLink}
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
                  onClick={() => void sendMessage(
                    lastFailedMessage.text,
                    false,
                    lastFailedMessage.savedLinkId,
                  )}
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
                ref={inputRef}
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
