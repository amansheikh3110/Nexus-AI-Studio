import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import CommandPalette from '../components/CommandPalette';
import ThemeBuilder from '../components/ThemeBuilder';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '');

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats,       setChats]       = useState([]);
  const [activeChat,  setActiveChatState] = useState(() => localStorage.getItem('activeChatId') || null);
  const [cmdOpen,     setCmdOpen]     = useState(false);
  const [themeOpen,   setThemeOpen]   = useState(false);
  const { token, logout }             = useAuth();

  const changeActiveChat = useCallback((id) => {
    setActiveChatState(id);
    if (id) {
      localStorage.setItem('activeChatId', id);
    } else {
      localStorage.removeItem('activeChatId');
    }
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setChats(Array.isArray(data) ? data : []);
        const savedId = localStorage.getItem('activeChatId');
        if (savedId && Array.isArray(data) && data.some(c => c._id === savedId)) {
          setActiveChatState(savedId);
        }
      } else if (res.status === 401) {
        logout();
      }
    } catch {}
  }, [token, logout]);

  useEffect(() => {
    if (token) fetchChats();
  }, [token, fetchChats]);

  const handleNewChat = useCallback(() => {
    changeActiveChat(null);
  }, [changeActiveChat]);

  const handleDeleteChat = useCallback(async (id) => {
    try {
      await fetch(`${API}/api/chats/${id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(prev => prev.filter(c => c._id !== id));
      if (activeChat === id) changeActiveChat(null);
    } catch {}
  }, [token, activeChat, changeActiveChat]);

  // Global Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Responsive: auto-close sidebar on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches) setSidebarOpen(false);
    const handler = (e) => { if (e.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'rgb(var(--c-bg))' }}>

      {/* ── Sidebar ── */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <>
            {/* Mobile overlay backdrop */}
            <motion.div
              className="fixed inset-0 z-20 md:hidden bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0,    opacity: 1 }}
              exit={{    x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed md:relative z-30 md:z-auto w-[280px] h-full flex-shrink-0"
            >
              <Sidebar
                onClose={() => setSidebarOpen(false)}
                chats={chats}
                activeChat={activeChat}
                setActiveChat={changeActiveChat}
                handleNewChat={handleNewChat}
                handleDeleteChat={handleDeleteChat}
                onCommandPalette={() => setCmdOpen(true)}
                onOpenThemeBuilder={() => setThemeOpen(true)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Chat area ── */}
      <div className="flex-1 min-w-0 h-full">
        <ChatArea
          toggleSidebar={() => setSidebarOpen(p => !p)}
          sidebarOpen={sidebarOpen}
          activeChat={activeChat}
          setActiveChat={changeActiveChat}
          handleNewChat={handleNewChat}
          fetchChats={fetchChats}
        />
      </div>

      {/* ── Overlays ── */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNewChat={handleNewChat}
        chats={chats}
        onSelectChat={(id) => { changeActiveChat(id); setSidebarOpen(true); }}
      />

      <ThemeBuilder
        isOpen={themeOpen}
        onClose={() => setThemeOpen(false)}
      />
    </div>
  );
}