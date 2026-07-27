import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PRESETS = [
  { name: 'Violet Night',  bg: '#0a0a0f', accent: '#7c3aed', accent2: '#a78bfa', surface: '#111118' },
  { name: 'Midnight Blue', bg: '#0a0f1e', accent: '#3b82f6', accent2: '#93c5fd', surface: '#111827' },
  { name: 'Emerald Dark',  bg: '#0a0f0a', accent: '#059669', accent2: '#6ee7b7', surface: '#111811' },
  { name: 'Rose Dark',     bg: '#0f0a0a', accent: '#e11d48', accent2: '#fda4af', surface: '#1a1010' },
  { name: 'Amber Dark',    bg: '#0f0d08', accent: '#d97706', accent2: '#fcd34d', surface: '#1a1810' },
  { name: 'Cyan Dark',     bg: '#0a0f14', accent: '#0891b2', accent2: '#67e8f9', surface: '#101820' },
];

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-c-muted">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-c-muted/60">{value}</span>
      <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10 cursor-pointer"
           style={{ backgroundColor: value }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
    </div>
  </div>
);

export default function ThemeBuilder({ isOpen, onClose }) {
  const { theme, setTheme, customColors, updateCustomColors } = useTheme();

  const defaults = {
    bg:      '#0a0a0f',
    accent:  '#7c3aed',
    accent2: '#a78bfa',
    surface: '#111118',
    ...customColors,
  };

  const applyPreset = (preset) => {
    updateCustomColors({
      bg:      preset.bg,
      accent:  preset.accent,
      accent2: preset.accent2,
      surface: preset.surface,
    });
    setTheme('custom');
  };

  const reset = () => {
    updateCustomColors({ bg: '#0a0a0f', accent: '#7c3aed', accent2: '#a78bfa', surface: '#111118' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.95, y: 10  }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative glass rounded-2xl w-full max-w-md shadow-card border border-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <Palette size={18} className="text-accent" />
                <h2 className="font-semibold text-c-text">Theme Builder</h2>
              </div>
              <button onClick={onClose} className="text-c-muted hover:text-c-text transition p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Base modes */}
              <div>
                <p className="text-xs text-c-muted mb-2 uppercase tracking-wider font-medium">Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark',   icon: <Moon size={14} />,    label: 'Dark'   },
                    { id: 'light',  icon: <Sun size={14} />,     label: 'Light'  },
                    { id: 'custom', icon: <Palette size={14} />, label: 'Custom' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setTheme(m.id)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl text-sm
                                  border transition font-medium
                                  ${theme === m.id
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-white/8 text-c-muted hover:border-white/15 hover:text-c-text'}`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div>
                <p className="text-xs text-c-muted mb-2 uppercase tracking-wider font-medium">Presets</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                                 border border-white/8 hover:border-white/20 transition"
                    >
                      <div className="w-8 h-8 rounded-lg flex overflow-hidden">
                        <div className="w-1/2 h-full" style={{ background: p.bg }} />
                        <div className="w-1/2 h-full" style={{ background: p.accent }} />
                      </div>
                      <span className="text-[10px] text-c-muted group-hover:text-c-text transition text-center leading-tight">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              {theme === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-c-muted uppercase tracking-wider font-medium">Colors</p>
                    <button onClick={reset} className="flex items-center gap-1 text-xs text-c-muted hover:text-c-text transition">
                      <RotateCcw size={11} /> Reset
                    </button>
                  </div>
                  <div className="space-y-3 elevated p-4 rounded-xl">
                    <ColorPicker label="Background"  value={defaults.bg}      onChange={v => updateCustomColors({ bg: v })} />
                    <ColorPicker label="Surface"     value={defaults.surface}  onChange={v => updateCustomColors({ surface: v })} />
                    <ColorPicker label="Accent"      value={defaults.accent}  onChange={v => updateCustomColors({ accent: v })} />
                    <ColorPicker label="Accent Light" value={defaults.accent2} onChange={v => updateCustomColors({ accent2: v })} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
