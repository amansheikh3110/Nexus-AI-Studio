import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

export default function MarkdownRenderer({ content, isStreaming }) {
  return (
    <div className={`prose-chat ${isStreaming ? 'streaming-cursor' : ''}`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return <CodeBlock language={match[1]} value={value} />;
            }
            // Inline code — handled by prose-chat CSS
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // Custom table wrapper for overflow scroll
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-xl border border-white/6">
                <table>{children}</table>
              </div>
            );
          },

          // Blockquote
          blockquote({ children }) {
            return <blockquote>{children}</blockquote>;
          },

          // Links open in new tab
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
