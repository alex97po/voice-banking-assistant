import { CURRENCY_COLORS, formatCurrency } from '../lib/constants';

const CURRENCY_ICONS = {
  AED: 'د.إ',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export default function AccountCard({ account, index = 0 }) {
  const color = CURRENCY_COLORS[account.currency] || '#0ea5e9';

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        padding: '20px 24px',
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        animation: `fadeInUp 0.5s ease ${index * 0.1}s forwards`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>
            {account.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {account.iban ? `···${account.iban.slice(-4)}` : ''}
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color,
          }}
        >
          {CURRENCY_ICONS[account.currency] || account.currency[0]}
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color }}>
        {formatCurrency(account.balance, account.currency)}
      </div>

      {account.balance > 0 && (
        <div
          style={{
            marginTop: 12,
            height: 3,
            borderRadius: 2,
            background: `${color}15`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '65%',
              borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
