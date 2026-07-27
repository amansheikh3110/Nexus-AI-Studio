import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const dotVariants = {
  idle:   { y: 0,  opacity: 0.4 },
  bounce: { y: -5, opacity: 1   },
};

export default function LoadingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 max-w-2xl px-1"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/20
                      flex items-center justify-center flex-shrink-0 mt-0.5 glow-accent">
        <Bot size={16} className="text-accent" />
      </div>

      {/* Bubble */}
      <div className="glass px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-card mt-0.5">
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-accent/60 block"
              variants={dotVariants}
              animate="bounce"
              initial="idle"
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
        <p className="text-xs text-c-muted mt-1.5 font-medium tracking-wide">Thinking…</p>
      </div>
    </motion.div>
  );
}
