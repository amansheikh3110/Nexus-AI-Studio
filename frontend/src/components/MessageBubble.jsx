import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Edit3, Check, X as XIcon, Copy } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import MessageActions from './MessageActions';

export default function MessageBubble({
  role, content, isLast, isStreaming = false,
  onRegenerate, onDelete, onEdit,
  timestamp
}) {
  const [isEditing, setIsEditing]   = useState(false);
  const [editValue, setEditValue]   = useState(content);
  const [showActions, setShowActions] = useState(false);
  const isUser = role === 'user';

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== content) {
      onEdit?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group/msg mb-1`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex gap-3 max-w-[90%] md:max-w-2xl lg:max-w-3xl
                       ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-xl flex-shrink-0 mt-0.5 flex items-center justify-center
                         text-sm font-semibold shadow-sm
                         ${isUser
                           ? 'bg-accent text-white'
                           : 'bg-accent/12 text-accent border border-accent/20'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Column */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>

          {/* Bubble */}
          {isEditing ? (
            <div className="glass rounded-2xl p-3 w-full min-w-[280px]">
              <textarea
                className="w-full bg-transparent text-c-text text-[15px] leading-relaxed
                           resize-none outline-none min-h-[80px]"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                             text-c-muted hover:text-c-text hover-bg-md transition"
                >
                  <XIcon size={12} /> Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                             bg-accent text-white hover:brightness-110 transition"
                >
                  <Check size={12} /> Send
                </button>
              </div>
            </div>
          ) : (
            <div className={`relative px-4 py-3.5 rounded-2xl shadow-sm text-[15px]
                             leading-relaxed break-words
                             ${isUser
                               ? 'bg-bubble text-c-text rounded-tr-sm border-theme'
                               : 'glass rounded-tl-sm text-c-text'}`}>
              {isUser
                ? <p className="whitespace-pre-wrap">{content}</p>
                : <MarkdownRenderer content={content || ' '} isStreaming={isStreaming} />
              }

              {/* Timestamp */}
              {timestamp && (
                <span className="block mt-1.5 text-[11px] text-c-muted/60 select-none">
                  {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {/* User message actions (hover) */}
          {isUser && !isEditing && (
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 mt-1 mr-11"
                >
                  {onEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      title="Edit message"
                      className="p-1.5 rounded-lg text-c-muted hover:text-c-text hover-bg-md transition"
                    >
                      <Edit3 size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    title="Copy message"
                    className="p-1.5 rounded-lg text-c-muted hover:text-c-text hover-bg-md transition"
                  >
                    <Copy size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* AI message actions */}
          {!isUser && !isEditing && (
            <AnimatePresence>
              {(showActions || (isStreaming && isLast)) && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <MessageActions
                    content={content}
                    onRegenerate={isLast ? onRegenerate : null}
                    onDelete={onDelete}
                    isLast={isLast}
                    isStreaming={isStreaming}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}