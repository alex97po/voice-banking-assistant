import { formatCurrency, timeAgo } from '../lib/constants';
import { useEffect, useRef } from 'react';

export default function TransactionList({ transactions = [] }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [transactions.length]);

  if (!transactions.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        No transactions yet
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: 360,
        overflowY: 'auto',
        paddingRight: 4,
      }}
    >
      {transactions.map((txn, i) => (
        <div
          key={txn.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: 10,
            background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
            transition: 'background 0.15s',
            cursor: 'default',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
                background: txn.type === 'credit'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                color: txn.type === 'credit' ? 'var(--accent-green)' : 'var(--accent-red)',
              }}
            >
              {txn.type === 'credit' ? '↓' : '↑'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {txn.description}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {timeAgo(txn.date)}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'monospace',
              color: txn.type === 'credit' ? 'var(--accent-green)' : 'var(--accent-red)',
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            {txn.type === 'credit' ? '+' : ''}{formatCurrency(txn.amount, txn.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}
