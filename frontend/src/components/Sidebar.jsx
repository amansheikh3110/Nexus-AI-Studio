import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, Search, Trash2,
  LogOut, Sparkles, Edit3, Check, X,
  Sun, Moon, Palette, Command
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ─── Helper: get a chat's age in ms, with fallbacks ─────────────
const getChatAge = (chat) => {
  const d = new Date(chat.updatedAt || chat.createdAt || 0);
  return isNaN(d.getTime()) ? 0 : Date.now() - d.getTime();
};

// ─── Individual chat row ──────────────────────────────────────────
function ChatItem({ chat, active, onClick, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title,   setTitle]   = useState(chat.title || 'Untitled');
  const inputRef              = useRef(null);

  useEffect(() => { if (editing) setTimeout(() => inputRef.current?.focus(), 0); }, [editing]);

  const saveRename = () => {
    if (title.trim()) onRename?.(chat._id, title.trim());
    setEditing(false);
  };

  return (
    <div
      className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                  cursor-pointer transition-all duration-150
                  ${active
                    ? 'bg-accent/10 border border-accent/20 text-c-text'
                    : 'border border-transparent text-c-muted hover:text-c-text hover-bg'}`}
      onClick={() => !editing && onClick(chat._id)}
    >
      <MessageSquare
        size={14}
        className={`flex-shrink-0 transition ${active ? 'text-accent' : 'text-c-muted group-hover:text-accent/70'}`}
      />

      {editing ? (
        <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')  saveRename();
              if (e.key === 'Escape') { setTitle(chat.title || 'Untitled'); setEditing(false); }
            }}
            className="flex-1 bg-transparent text-c-text text-sm outline-none border-b border-accent/50 pb-0.5 min-w-0"
          />
          <button onClick={saveRename} className="text-emerald-400 hover:text-emerald-300 p-0.5 flex-shrink-0">
            <Check size={13} />
          </button>
          <button
            onClick={() => { setTitle(chat.title || 'Untitled'); setEditing(false); }}
            className="text-c-muted hover:text-red-400 p-0.5 flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <span className="flex-1 text-sm font-medium truncate leading-snug min-w-0">
          {chat.title || 'New Chat'}
        </span>
      )}

      {/* Hover actions */}
      {!editing && (
        <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={e => { e.stopPropagation(); setEditing(true); }}
            className="p-1 rounded-md text-c-muted hover:text-c-text hover-bg transition"
            title="Rename"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(chat._id); }}
            className="p-1 rounded-md text-c-muted hover:text-red-400 hover:bg-red-400/10 transition"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────
export default function Sidebar({
  onClose, chats, activeChat,
  setActiveChat, handleNewChat, handleDeleteChat,
  onOpenThemeBuilder, onCommandPalette
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch,  setShowSearch]  = useState(false);
  const { user, logout }              = useAuth();
  const { theme, setTheme }           = useTheme();

  // Filter
  const filtered = searchQuery.trim()
    ? chats.filter(c => (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  // Group by recency — uses getChatAge so undefined/null dates still work
  const DAY  = 86_400_000;
  const WEEK = 7 * DAY;
  const toDay  = filtered.filter(c => getChatAge(c) <  DAY);
  const toWeek = filtered.filter(c => { const a = getChatAge(c); return a >= DAY  && a < WEEK; });
  const older  = filtered.filter(c => getChatAge(c) >= WEEK);
  // Fallback: chats with no date (age = 0) land in today
  // (getChatAge returns 0 for invalid dates, so age < DAY → goes into toDay) ✓

  const renderGroup = (label, items) => items.length === 0 ? null : (
    <div key={label} className="mb-1">
      <p className="text-[10px] text-c-muted/50 font-medium uppercase tracking-wider px-3 py-1.5 select-none">
        {label}
      </p>
      {items.map(chat => (
        <ChatItem
          key={chat._id}
          chat={chat}
          active={activeChat === chat._id}
          onClick={id => setActiveChat(id)}
          onDelete={handleDeleteChat}
          onRename={(id, newTitle) => {
            chat.title = newTitle;
            setActiveChat(null);
            setTimeout(() => setActiveChat(id), 0);
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full surface border-r-theme">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-4 border-b-theme">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
            <Sparkles size={14} className="text-accent" />
          </div>
          <span className="font-semibold text-c-text tracking-tight">NexusAI</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(p => !p)}
            title="Search chats"
            className="p-1.5 rounded-lg text-c-muted hover:text-c-text hover-bg transition"
          >
            <Search size={16} />
          </button>
          <button
            onClick={onCommandPalette}
            title="Command palette (Ctrl+K)"
            className="p-1.5 rounded-lg text-c-muted hover:text-c-text hover-bg transition"
          >
            <Command size={16} />
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-3 pt-2"
          >
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-c-muted pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chats…"
                className="input-field pl-8 text-sm py-2"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-c-muted hover:text-c-text transition"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── New Chat ── */}
      <div className="px-3 py-3">
        <button
          onClick={handleNewChat}
          className="btn-accent w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* ── Chat list ── */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-none">
        {chats.length === 0 ? (
          <div className="text-center py-10 px-4">
            <MessageSquare size={28} className="text-c-muted/30 mx-auto mb-2" />
            <p className="text-sm text-c-muted/50">No conversations yet</p>
            <p className="text-xs text-c-muted/30 mt-1">Start a new chat above</p>
          </div>
        ) : (
          <>
            {renderGroup('Today',     toDay)}
            {renderGroup('This Week', toWeek)}
            {renderGroup('Older',     older)}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="p-3 space-y-1 border-t-theme">
        {/* Theme toggle */}
        <div className="flex items-center gap-1 px-1 py-1">
          {[
            { id: 'dark',   icon: <Moon size={13} />,    label: 'Dark'   },
            { id: 'light',  icon: <Sun size={13} />,     label: 'Light'  },
            { id: 'custom', icon: <Palette size={13} />, label: 'Custom' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => t.id === 'custom' ? onOpenThemeBuilder?.() : setTheme(t.id)}
              title={`${t.label} mode`}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs
                          transition font-medium
                          ${theme === t.id
                            ? 'bg-accent/15 text-accent border border-accent/25'
                            : 'text-c-muted hover:text-c-text hover-bg'}`}
            >
              {t.icon}
              <span className="ml-1 hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* User profile row */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover-bg transition group cursor-default">
          <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/20
                          flex items-center justify-center text-sm font-bold text-accent uppercase flex-shrink-0">
            {user?.username?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-c-text truncate">{user?.username}</p>
            <p className="text-[11px] text-c-muted">Free tier</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-c-muted hover:text-red-400 hover:bg-red-400/10 transition
                       opacity-0 group-hover:opacity-100"
          >
            <LogOut size={14} />
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] text-c-muted/30 pb-1 select-none">
          <kbd className="font-mono">Ctrl+K</kbd> — Command Palette
        </p>
      </div>
    </div>
  );
}