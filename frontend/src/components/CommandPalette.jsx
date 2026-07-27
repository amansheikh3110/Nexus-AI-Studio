import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, MessageSquare, Plus, Settings,
  Sun, Moon, Palette, LogOut, Keyboard, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function CommandPalette({ isOpen, onClose, onNewChat, chats, onSelectChat }) {
  const [query, setQuery]     = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef              = useRef(null);
  const { logout }            = useAuth();
  const { theme, setTheme }   = useTheme();

  const COMMANDS = [
    { id: 'new-chat',   icon: <Plus size={16} />,         label: 'New Chat',         action: () => { onNewChat(); onClose(); } },
    { id: 'light',      icon: <Sun size={16} />,          label: 'Switch to Light',  action: () => { setTheme('light'); onClose(); } },
    { id: 'dark',       icon: <Moon size={16} />,         label: 'Switch to Dark',   action: () => { setTheme('dark');  onClose(); } },
    { id: 'custom',     icon: <Palette size={16} />,      label: 'Custom Theme',     action: () => { setTheme('custom'); onClose(); } },
    { id: 'logout',     icon: <LogOut size={16} />,       label: 'Logout',           action: () => { logout(); onClose(); } },
    { id: 'shortcuts',  icon: <Keyboard size={16} />,     label: 'Keyboard Shortcuts', action: () => onClose() },
  ];

  const chatItems = (chats || [])
    .filter(c => c.title?.toLowerCase().includes(query.toLowerCase()) || !query)
    .slice(0, 6)
    .map(c => ({
      id:   c._id,
      icon: <MessageSquare size={16} />,
      label: c.title || 'Untitled Chat',
      action: () => { onSelectChat(c._id); onClose(); },
    }));

  const commandItems = COMMANDS.filter(
    c => c.label.toLowerCase().includes(query.toLowerCase())
  );

  const items = query
    ? [...chatItems, ...commandItems]
    : [...commandItems.slice(0, 3), ...chatItems];

  const totalItems = items.length;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKey = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => (s + 1) % totalItems); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => (s - 1 + totalItems) % totalItems); }
    if (e.key === 'Enter')     { e.preventDefault(); items[selected]?.action(); }
    if (e.key === 'Escape')    { onClose(); }
  }, [isOpen, items, selected, totalItems, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1,    y: 0    }}
            exit={{    opacity: 0, scale: 0.96, y: -10  }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative glass rounded-2xl w-full max-w-md shadow-card border border-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6">
              <Search size={17} className="text-c-muted flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search commands, chats…"
                className="flex-1 bg-transparent text-c-text text-sm outline-none placeholder:text-c-muted/50"
              />
              <button onClick={onClose} className="text-c-muted hover:text-c-text transition">
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto py-1.5 scrollbar-none">
              {items.length === 0 && (
                <p className="text-center text-c-muted text-sm py-6">No results found</p>
              )}
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                              ${selected === i
                                ? 'bg-accent/10 text-accent'
                                : 'text-c-muted hover:text-c-text hover-bg'}`}
                >
                  <span className={selected === i ? 'text-accent' : 'text-c-muted'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-c-muted/50">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">Esc</kbd> close</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-c-muted/40">
                <Command size={9} />K
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
