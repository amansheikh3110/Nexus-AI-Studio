import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language || 'text';

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-white/8 shadow-card group/code">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/6">
        <div className="flex items-center gap-2 text-xs text-c-muted">
          <Terminal size={12} className="text-accent" />
          <span className="font-mono lowercase tracking-wide">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-c-muted hover:text-c-text
                     bg-raised/60 hover-bg-md px-2.5 py-1 rounded-lg
                     transition-all duration-150 active:scale-95"
        >
          {copied
            ? <><Check size={12} className="text-emerald-400" /> Copied</>
            : <><Copy size={12} /> Copy</>
          }
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={displayLang}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin:     0,
          padding:    '1rem',
          background: 'rgba(0,0,0,0.5)',
          fontSize:   '0.8125rem',
          lineHeight: '1.6',
        }}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', monospace" } }}
        showLineNumbers={value.split('\n').length > 5}
        lineNumberStyle={{ opacity: 0.3, fontSize: '0.7rem', minWidth: '2.5rem' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
