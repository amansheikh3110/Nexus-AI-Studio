import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftOpen, PanelLeftClose,
  Sparkles, ArrowDown, Plus
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingBubble from './LoadingBubble';
import EmptyState from './EmptyState';
import SkeletonLoader from './SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '');

const PERSONAS = [
  { id: '', name: 'Assistant' },
  { id: 'You are an expert software engineer. Always provide clean, documented code.', name: 'Engineer' },
  { id: 'You are a stand-up comedian. Answer with humor.', name: 'Comedian' },
  { id: 'You are a Socratic tutor. Guide with questions, never give direct answers.', name: 'Tutor' },
];

export default function ChatArea({
  toggleSidebar, sidebarOpen,
  activeChat, setActiveChat,
  handleNewChat, fetchChats,
}) {
  const [messages,    setMessages]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isFetching,  setIsFetching]  = useState(false);
  const [isStreaming, setIsStreaming]  = useState(false);
  const [model,       setModel]       = useState('openai/gpt-oss-20b:free');
  const [persona,     setPersona]     = useState(PERSONAS[0]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [activeChatId, setActiveChatId]   = useState(null); // track to avoid race conditions

  const messagesEndRef = useRef(null);
  const scrollAreaRef  = useRef(null);
  const readerRef      = useRef(null); // for stop generation

  const { token, user } = useAuth();
  const { toast }       = useToast();

  const ignoreNextLoadRef = useRef(false);

  // ─── Fetch messages on activeChat change ───────────────────
  useEffect(() => {
    if (activeChat) {
      if (ignoreNextLoadRef.current) {
        ignoreNextLoadRef.current = false;
        setActiveChatId(activeChat);
        return;
      }
      setActiveChatId(activeChat);
      loadMessages(activeChat);
    } else {
      setMessages([]);
      setActiveChatId(null);
    }
  }, [activeChat]);

  const loadMessages = async (chatId) => {
    setIsFetching(true);
    try {
      const res = await fetch(`${API}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setIsFetching(false);
    }
  };

  // ─── Scroll to bottom ───────────────────────────────────────
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => { scrollToBottom(false); }, [messages]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
  };

  // ─── Stop generation ────────────────────────────────────────
  const handleStop = () => {
    readerRef.current?.cancel?.();
    setIsLoading(false);
    setIsStreaming(false);
    toast.info('Generation stopped');
  };

  // ─── Send message ───────────────────────────────────────────
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    let currentChatId = activeChat;

    // Create chat if none exists
    if (!currentChatId) {
      try {
        const res  = await fetch(`${API}/api/chats`, {
          method:  'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        currentChatId = data._id;
        ignoreNextLoadRef.current = true;
        setActiveChat?.(currentChatId);
        fetchChats?.();
      } catch {
        toast.error('Failed to create conversation');
        return;
      }
    }

    // Optimistically add user message
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/chats/${currentChatId}/message`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, model, persona: persona.id }),
      });

      if (!res.ok) throw new Error('Request failed');

      const reader  = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let firstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        if (!chunk) continue;

        if (firstChunk) {
          setIsLoading(false);
          setIsStreaming(true);
          firstChunk = false;
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: chunk, timestamp: new Date().toISOString() },
          ]);
        } else {
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: copy[copy.length - 1].content + chunk,
            };
            return copy;
          });
        }
      }

      if (firstChunk) {
        // No response received
        setIsLoading(false);
        setMessages(prev => [...prev, { role: 'assistant', content: '_(No response)_', timestamp: new Date().toISOString() }]);
      }

      setIsStreaming(false);
      fetchChats?.();
    } catch (err) {
      if (err.name === 'AbortError') return; // stopped by user
      setIsLoading(false);
      setIsStreaming(false);
      toast.error('Failed to get response. Trying next model…');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [activeChat, isLoading, model, persona.id, token, fetchChats, setActiveChat, toast]);

  // ─── Regenerate ─────────────────────────────────────────────
  const handleRegenerate = useCallback((index) => {
    let i = index - 1;
    while (i >= 0 && messages[i].role !== 'user') i--;
    if (i >= 0) {
      const userText = messages[i].content;
      setMessages(prev => prev.slice(0, i));
      handleSendMessage(userText);
    }
  }, [messages, handleSendMessage]);

  // ─── Edit user message ───────────────────────────────────────
  const handleEdit = useCallback((index, newText) => {
    setMessages(prev => prev.slice(0, index));
    handleSendMessage(newText);
  }, [handleSendMessage]);

  // ─── Delete message ─────────────────────────────────────────
  const handleDelete = useCallback((index) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const isEmpty = messages.length === 0 && !isFetching;

  return (
    <div className="flex flex-col h-full" style={{ background: 'rgb(var(--c-bg))' }}>

      {/* ── Header ── */}
      <header
        className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0 border-b-theme"
      >
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-c-muted hover:text-c-text hover-bg transition"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkles size={16} className="text-accent flex-shrink-0" />
          <h1 className="text-sm font-semibold text-c-text truncate">
            {activeChat ? 'Chat' : 'NexusAI'}
          </h1>
        </div>

        {/* New chat button */}
        <button
          onClick={handleNewChat}
          title="New chat"
          className="p-2 rounded-xl text-c-muted hover:text-c-text hover-bg transition"
        >
          <Plus size={18} />
        </button>
      </header>

      {/* ── Messages ── */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-none relative"
      >
        {isFetching ? (
          <div className="p-6 space-y-8">
            {[3, 2, 4].map((n, i) => <SkeletonLoader key={i} lines={n} />)}
          </div>
        ) : isEmpty ? (
          <EmptyState onSend={handleSendMessage} username={user?.username} />
        ) : (
          <div className="px-4 md:px-8 lg:px-12 py-6 space-y-4 max-w-4xl mx-auto w-full">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  isLast={i === messages.length - 1}
                  isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
                  onRegenerate={() => handleRegenerate(i)}
                  onDelete={() => handleDelete(i)}
                  onEdit={msg.role === 'user' ? (newText) => handleEdit(i, newText) : undefined}
                />
              ))}
            </AnimatePresence>

            {isLoading && <LoadingBubble />}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}

        {/* Scroll-to-bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1   }}
              exit={{    opacity: 0, scale: 0.8  }}
              onClick={() => scrollToBottom()}
              className="fixed bottom-28 right-6 z-10 glass rounded-full p-2.5 shadow-card
                         border border-white/10 text-c-muted hover:text-c-text transition"
            >
              <ArrowDown size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div
        className="px-4 md:px-8 lg:px-12 py-4 flex-shrink-0 border-t-theme"
      >
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={isLoading || isStreaming ? handleStop : handleSendMessage}
            disabled={isLoading || isStreaming}
            selectedModel={model}
            onModelChange={setModel}
            selectedPersona={persona}
            onPersonaChange={setPersona}
            personas={PERSONAS}
          />
        </div>
      </div>
    </div>
  );
}