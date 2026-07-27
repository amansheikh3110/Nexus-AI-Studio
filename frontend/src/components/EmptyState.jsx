import { motion } from 'framer-motion';
import { Sparkles, Code2, FileText, Globe, Lightbulb, Zap, Brain, Star } from 'lucide-react';

const SUGGESTIONS = [
  { icon: <Code2 size={18} />,     label: 'Write code',       prompt: 'Write a Python function to sort a list of dictionaries by a key.' },
  { icon: <FileText size={18} />,  label: 'Draft an email',   prompt: 'Write a professional email to reschedule a meeting.' },
  { icon: <Globe size={18} />,     label: 'Research a topic', prompt: 'Explain how large language models work in simple terms.' },
  { icon: <Lightbulb size={18} />, label: 'Brainstorm ideas', prompt: 'Give me 10 unique startup ideas in the health tech space.' },
  { icon: <Brain size={18} />,     label: 'Explain a concept',prompt: 'Explain quantum entanglement as if I were 10 years old.' },
  { icon: <Star size={18} />,      label: 'Creative writing', prompt: 'Write the opening paragraph of a thriller set in Tokyo.' },
];

export default function EmptyState({ onSend, username }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-8 select-none">
      {/* Logo pulse */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 relative"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 glow-accent
                        flex items-center justify-center">
          <Sparkles size={28} className="text-accent" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping bg-accent/8 pointer-events-none" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl font-semibold text-c-text mb-2 text-center"
      >
        {greeting}{username ? `, ${username}` : ''}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5 }}
        className="text-c-muted text-center mb-10 text-[15px] max-w-sm"
      >
        Your AI assistant is ready. What would you like to explore today?
      </motion.p>

      {/* Suggestion chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-xl"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            onClick={() => onSend(s.prompt)}
            className="glass-sm flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                       text-left text-sm text-c-muted hover:text-c-text
                       hover:border-accent/25 hover:bg-accent/5
                       transition-all duration-200 group border border-white/5"
          >
            <span className="text-accent/70 group-hover:text-accent transition-colors flex-shrink-0">
              {s.icon}
            </span>
            <span className="font-medium leading-snug">{s.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-xs text-c-muted/50 flex items-center gap-1.5"
      >
        <Zap size={10} className="text-accent/40" />
        Press <kbd className="px-1.5 py-0.5 rounded bg-white/6 font-mono text-[10px] mx-0.5">⌘K</kbd> to open command palette
      </motion.p>
    </div>
  );
}
