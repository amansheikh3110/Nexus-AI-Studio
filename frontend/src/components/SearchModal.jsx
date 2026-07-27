import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, X, Clock } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, chats, onSelectChat }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? chats.filter(c => c.title?.toLowerCase().includes(query.toLowerCase()))
    : chats.slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y:  0,  scale: 1    }}
            exit={{    opacity: 0, y: -10, scale: 0.97  }}
            transition={{ duration: 0.18 }}
            className="relative glass rounded-2xl w-full max-w-md shadow-card border border-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6">
              <Search size={17} className="text-c-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search conversations…"
                className="flex-1 bg-transparent text-c-text text-sm outline-none placeholder:text-c-muted/50"
              />
              <button onClick={onClose} className="text-c-muted hover:text-c-text transition">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto py-1.5 scrollbar-none">
              {filtered.length === 0 && (
                <p className="text-center text-c-muted text-sm py-6">No conversations found</p>
              )}
              {filtered.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => { onSelectChat(chat._id); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                             text-c-muted hover:text-c-text hover-bg transition"
                >
                  <MessageSquare size={15} className="flex-shrink-0 text-accent/60" />
                  <span className="flex-1 text-left font-medium truncate">{chat.title || 'Untitled'}</span>
                  {chat.updatedAt && (
                    <span className="flex items-center gap-1 text-[11px] text-c-muted/50 flex-shrink-0">
                      <Clock size={10} />
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
