import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Square, Paperclip, ChevronDown, Sparkles, Bot, FileText, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SUPPORTED_EXT = ['.txt','.md','.csv','.json','.js','.ts','.jsx','.tsx','.py','.html','.css','.xml','.yaml','.yml','.toml','.sh','.sql','.java','.c','.cpp','.rs'];

const MODELS = [
  { id: 'openai/gpt-oss-20b:free',                label: 'GPT OSS 20B',    badge: 'Free' },
  { id: 'google/gemma-4-31b-it:free',             label: 'Gemma 4 31B',    badge: 'Free' },
  { id: 'google/gemma-4-26b-a4b-it:free',         label: 'Gemma 4 26B',    badge: 'Free' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron Ultra', badge: 'Free' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron Super', badge: 'Free' },
  { id: 'cohere/north-mini-code:free',            label: 'Cohere North',   badge: 'Free' },
];

export default function ChatInput({
  onSend, disabled,
  selectedModel, onModelChange,
  selectedPersona, onPersonaChange, personas = [],
}) {
  const [text,         setText]         = useState('');
  const [showModels,   setShowModels]   = useState(false);
  const [showPersona,  setShowPersona]  = useState(false);
  const [attachedFile, setAttachedFile] = useState(null); // { name, content }

  const textareaRef      = useRef(null);
  const modelDropRef     = useRef(null);
  const personaDropRef   = useRef(null);
  const fileInputRef     = useRef(null);
  const { toast }        = useToast();
  const charLimit        = 4000;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modelDropRef.current   && !modelDropRef.current.contains(e.target))   setShowModels(false);
      if (personaDropRef.current && !personaDropRef.current.contains(e.target)) setShowPersona(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── File handling ───────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_EXT.includes(ext)) {
      toast.error(`"${ext}" not supported. Use text-based files (txt, md, py, js…)`);
      e.target.value = '';
      return;
    }
    if (file.size > 500_000) {
      toast.error('File too large. Max 500 KB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedFile({ name: file.name, content: ev.target.result });
      toast.success(`Attached: ${file.name}`);
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (disabled) return; // stop button handled in parent via onSend wrapper

    const hasMsg  = text.trim().length > 0;
    const hasFile = attachedFile !== null;
    if (!hasMsg && !hasFile) return;

    let messageContent = text.trim();

    if (hasFile) {
      // Prepend file as context block
      const fileBlock = `\`\`\`${attachedFile.name.split('.').pop()}\n${attachedFile.content}\n\`\`\``;
      messageContent = hasMsg
        ? `I have attached the file **"${attachedFile.name}"**:\n\n${fileBlock}\n\nMy question about it: ${messageContent}`
        : `Please read and analyze this file **"${attachedFile.name}"**:\n\n${fileBlock}\n\nProvide a summary and any key insights.`;
      setAttachedFile(null);
    }

    onSend(messageContent);
    setText('');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent  = text.trim().length > 0 || attachedFile !== null;
  const charPercent = Math.min((text.length / charLimit) * 100, 100);
  const nearLimit   = text.length > charLimit * 0.85;
  const overLimit   = text.length > charLimit;
  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <div className="relative w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_EXT.join(',')}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* ── Model dropdown (outside glass to avoid overflow-hidden clip) ── */}
      <AnimatePresence>
        {showModels && (
          <motion.div
            ref={modelDropRef}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{    opacity: 0, y: 8, scale: 0.97  }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 z-50 glass rounded-xl shadow-card overflow-hidden min-w-[240px]"
          >
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => { onModelChange(m.id); setShowModels(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover-bg transition
                            ${m.id === selectedModel ? 'text-accent bg-accent/8 font-medium' : 'text-c-text'}`}
              >
                <span>{m.label}</span>
                <span className="badge text-[10px]">{m.badge}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Persona dropdown (outside glass, offset to align with persona button) ── */}
      <AnimatePresence>
        {showPersona && personas.length > 0 && (
          <motion.div
            ref={personaDropRef}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{    opacity: 0, y: 8, scale: 0.97  }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-32 z-50 glass rounded-xl shadow-card overflow-hidden min-w-[170px]"
          >
            {personas.map(p => (
              <button
                key={p.name}
                onClick={() => { onPersonaChange(p); setShowPersona(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover-bg transition
                            ${p.id === selectedPersona?.id ? 'text-accent bg-accent/8 font-medium' : 'text-c-text'}`}
              >
                <Bot size={13} className={p.id === selectedPersona?.id ? 'text-accent' : 'text-c-muted'} />
                {p.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main glass container (NO overflow-hidden so dropdowns can escape) ── */}
      <div className="glass rounded-2xl shadow-card">

        {/* Attached file pill */}
        {attachedFile && (
          <div className="px-4 pt-3 pb-1">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-lg px-3 py-1.5">
              <FileText size={13} className="text-accent flex-shrink-0" />
              <span className="text-xs text-accent font-medium max-w-[220px] truncate">{attachedFile.name}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-accent/60 hover:text-accent transition ml-0.5 flex-shrink-0"
              >
                <X size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="px-4 pt-3.5 pb-1">
          <TextareaAutosize
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachedFile ? `Ask about "${attachedFile.name}"…` : 'Message AI…'}
            minRows={1}
            maxRows={8}
            disabled={disabled}
            className="w-full bg-transparent text-c-text text-[15px] leading-relaxed
                       resize-none outline-none placeholder:text-c-muted/50
                       disabled:opacity-50 transition-opacity"
          />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">

          {/* Left: Model · Persona · Attach */}
          <div className="flex items-center gap-0.5">

            {/* Model button */}
            <button
              onClick={() => { setShowModels(p => !p); setShowPersona(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                         text-c-muted hover:text-c-text hover-bg transition"
            >
              <Sparkles size={12} className="text-accent" />
              <span className="max-w-[90px] truncate">{currentModel.label}</span>
              <ChevronDown size={11} className={`transition-transform ${showModels ? 'rotate-180' : ''}`} />
            </button>

            {/* Divider */}
            {personas.length > 0 && (
              <span className="w-px h-3.5 bg-c-muted/25 mx-0.5 flex-shrink-0" />
            )}

            {/* Persona button */}
            {personas.length > 0 && selectedPersona && (
              <button
                onClick={() => { setShowPersona(p => !p); setShowModels(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                           text-c-muted hover:text-c-text hover-bg transition"
              >
                <Bot size={12} className="text-accent/70" />
                <span className="max-w-[72px] truncate">{selectedPersona.name}</span>
                <ChevronDown size={11} className={`transition-transform ${showPersona ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Divider */}
            <span className="w-px h-3.5 bg-c-muted/25 mx-0.5 flex-shrink-0" />

            {/* Attach file button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach a text file for the AI to read"
              className="p-1.5 rounded-lg text-c-muted hover:text-accent hover-bg transition"
            >
              <Paperclip size={15} />
            </button>
          </div>

          {/* Right: Char ring + Send/Stop */}
          <div className="flex items-center gap-2.5">
            {/* Character counter ring */}
            {text.length > 0 && (
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" className="-rotate-90" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none"
                    stroke="rgb(var(--c-border-rgb) / 0.15)" strokeWidth="2" />
                  <circle
                    cx="8" cy="8" r="6" fill="none"
                    stroke={overLimit ? '#f87171' : nearLimit ? '#fb923c' : 'rgb(var(--c-accent))'}
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 6}`}
                    strokeDashoffset={`${2 * Math.PI * 6 * (1 - charPercent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                </svg>
                {nearLimit && (
                  <span className={`text-[10px] font-mono tabular-nums ${overLimit ? 'text-red-400' : 'text-amber-400'}`}>
                    {charLimit - text.length}
                  </span>
                )}
              </div>
            )}

            {/* Send / Stop button */}
            <motion.button
              onClick={handleSubmit}
              disabled={(!hasContent && !disabled) || overLimit}
              whileHover={(hasContent || disabled) && !overLimit ? { scale: 1.06 } : {}}
              whileTap={(hasContent || disabled) && !overLimit  ? { scale: 0.94 } : {}}
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                          transition-all duration-200
                          ${disabled
                            ? 'bg-red-500/80 text-white cursor-pointer'
                            : hasContent && !overLimit
                              ? 'bg-accent text-white shadow-glow-sm hover:brightness-110'
                              : 'bg-raised text-c-muted cursor-not-allowed'}`}
            >
              {disabled
                ? <Square size={14} fill="currentColor" />
                : <Send size={15} className={hasContent ? '' : 'opacity-40'} />
              }
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-[11px] text-c-muted/40 mt-2 select-none">
        Enter to send · Shift+Enter for new line · 📎 Attach files for AI to read
      </p>
    </div>
  );
}