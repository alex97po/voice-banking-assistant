import { isArabic } from '../lib/constants';

export default function ChatBubble({ message, index = 0 }) {
  const isUser = message.role === 'user';
  const textIsArabic = isArabic(message.content);
  const animClass = isUser ? 'animate-slide-right' : 'animate-slide-left';

  return (
    <div
      className={animClass}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div
        className={textIsArabic ? 'text-rtl' : 'text-ltr'}
        style={{
          maxWidth: '85%',
          padding: '10px 16px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser
            ? 'linear-gradient(135deg, var(--accent-blue), #0284c7)'
            : 'var(--bg-surface)',
          color: isUser ? 'white' : 'var(--text-primary)',
          fontSize: 14,
          lineHeight: 1.5,
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
