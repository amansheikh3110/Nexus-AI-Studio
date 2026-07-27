import { useState } from 'react';
import {
  Copy, Check, RefreshCw, ThumbsUp, ThumbsDown,
  Share2, Bookmark, Volume2, MoreHorizontal, Trash2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

function ActionBtn({ icon, label, onClick, active, activeClass = 'text-accent' }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-lg transition-all duration-150 active:scale-90
                  ${active
                    ? `${activeClass} bg-accent/10`
                    : 'text-c-muted hover:text-c-text hover-bg-md'}`}
    >
      {icon}
    </button>
  );
}

export default function MessageActions({ content, onRegenerate, onDelete, isLast, isStreaming }) {
  const [copied,   setCopied]   = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(p => !p);
    if (disliked) setDisliked(false);
    toast.success(liked ? 'Feedback removed' : 'Great response! 👍');
  };

  const handleDislike = () => {
    setDisliked(p => !p);
    if (liked) setLiked(false);
    toast.info(disliked ? 'Feedback removed' : 'Feedback noted 👎');
  };

  const handleBookmark = () => {
    setBookmarked(p => !p);
    toast.success(bookmarked ? 'Bookmark removed' : 'Message bookmarked');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: content });
    } else {
      await navigator.clipboard.writeText(content);
      toast.info('Link copied to clipboard');
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content.replace(/[#*`]/g, ''));
      window.speechSynthesis.speak(utterance);
      toast.info('Reading aloud…');
    }
  };

  if (isStreaming) return null;

  return (
    <div className="flex items-center gap-0.5 mt-1.5 ml-11">
      <ActionBtn
        icon={copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        label="Copy"
        onClick={handleCopy}
        active={copied}
        activeClass="text-emerald-400"
      />
      <ActionBtn
        icon={<ThumbsUp size={14} className={liked ? 'fill-current' : ''} />}
        label="Good response"
        onClick={handleLike}
        active={liked}
      />
      <ActionBtn
        icon={<ThumbsDown size={14} className={disliked ? 'fill-current' : ''} />}
        label="Bad response"
        onClick={handleDislike}
        active={disliked}
        activeClass="text-red-400"
      />
      {isLast && onRegenerate && (
        <ActionBtn
          icon={<RefreshCw size={14} />}
          label="Regenerate"
          onClick={onRegenerate}
        />
      )}
      <ActionBtn
        icon={<Volume2 size={14} />}
        label="Read aloud"
        onClick={handleSpeak}
      />
      <ActionBtn
        icon={<Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />}
        label="Bookmark"
        onClick={handleBookmark}
        active={bookmarked}
      />
      <ActionBtn
        icon={<Share2 size={14} />}
        label="Share"
        onClick={handleShare}
      />
      {onDelete && (
        <ActionBtn
          icon={<Trash2 size={14} />}
          label="Delete"
          onClick={onDelete}
          activeClass="text-red-400"
        />
      )}
    </div>
  );
}
