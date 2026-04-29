export default function BeneficiaryList({ beneficiaries = [] }) {
  if (!beneficiaries.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        No beneficiaries available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {beneficiaries.map((ben, i) => (
        <div
          key={ben.id}
          className="glass-card glass-card-hover animate-fade-in-up"
          style={{
            padding: '16px 20px',
            minWidth: 220,
            flex: '1 1 220px',
            animationDelay: `${i * 0.1}s`,
            animation: `fadeInUp 0.5s ease ${i * 0.1}s forwards`,
            opacity: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                {ben.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ben.name}
                </div>
                {ben.nameAr && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {ben.nameAr}
                  </div>
                )}
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 99,
                background: ben.type === 'local' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                color: ben.type === 'local' ? 'var(--accent-blue)' : '#a78bfa',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {ben.type}
            </span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>Bank:</span> {ben.bank}
          </div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            IBAN: {ben.iban.slice(0, 4)}•••••••••••{ben.iban.slice(-4)}
          </div>
        </div>
      ))}
    </div>
  );
}
