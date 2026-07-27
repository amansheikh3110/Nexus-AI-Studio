import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createPortal } from 'react-dom';

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />,
  error:   <XCircle    size={16} className="text-red-400    flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />,
  info:    <Info       size={16} className="text-blue-400   flex-shrink-0" />,
};

const COLORS = {
  success: 'border-emerald-500/25 bg-emerald-500/8',
  error:   'border-red-500/25    bg-red-500/8',
  warning: 'border-amber-500/25  bg-amber-500/8',
  info:    'border-blue-500/25   bg-blue-500/8',
};

function Toast({ id, message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1     }}
      exit={{    opacity: 0, x: 60, scale: 0.92   }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`glass flex items-start gap-3 px-4 py-3 rounded-xl min-w-[260px] max-w-sm
                  border ${COLORS[type]} shadow-card`}
    >
      {ICONS[type]}
      <p className="text-sm text-c-text flex-1 leading-snug">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-c-muted hover:text-c-text transition p-0.5 flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function ToastSystem() {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div id="toast-root">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
