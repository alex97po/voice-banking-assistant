import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccounts, getTransactions, getCards, getBeneficiaries } from '../lib/api';
import TopBar from '../components/TopBar';
import AccountCard from '../components/AccountCard';
import TransactionList from '../components/TransactionList';
import BeneficiaryList from '../components/BeneficiaryList';
import VoiceAssistant from '../components/VoiceAssistant';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [sttMode, setSttMode] = useState('accurate');
  const [ttsMode, setTtsMode] = useState('elevenlabs');

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const [accRes, txnRes, cardRes, benRes] = await Promise.all([
        getAccounts(currentUser),
        getTransactions(currentUser),
        getCards(currentUser),
        getBeneficiaries(currentUser),
      ]);
      setAccounts(accRes.accounts || []);
      setTransactions(txnRes.transactions || []);
      setCards(cardRes.cards || []);
      setBeneficiaries(benRes.beneficiaries || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen flex flex-col bg-mesh relative">
      <div className="glow-overlay" />
      <TopBar
        sttMode={sttMode}
        setSttMode={setSttMode}
        ttsMode={ttsMode}
        setTtsMode={setTtsMode}
      />

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-3/5 lg:overflow-y-auto p-4 lg:p-8 flex-shrink-0 lg:flex-shrink">
          {/* Accounts Grid */}
          <div style={{ marginBottom: 24, marginTop: 24 }}>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Accounts
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 14,
              }}
            >
              {accounts.map((account, i) => (
                <AccountCard key={account.id} account={account} index={i} />
              ))}
            </div>
          </div>

          {/* Cards */}
          {cards.length > 0 && (
            <div style={{ marginBottom: 8, marginTop: 24 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 14,
                }}
              >
                Cards
              </h2>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="glass-card animate-fade-in-up"
                    style={{
                      padding: '16px 20px',
                      minWidth: 220,
                      animationDelay: `${(accounts.length + i) * 0.1}s`,
                      opacity: 0,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {card.type} {card.tier}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 10px',
                          borderRadius: 99,
                          background: card.status === 'active'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                          color: card.status === 'active' ? 'var(--accent-green)' : 'var(--accent-red)',
                          fontWeight: 500,
                        }}
                      >
                        {card.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 18, fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: 2 }}>
                      •••• •••• •••• {card.lastFour}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      Expires {card.expiryDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions */}
          <div style={{ marginTop: 24 }}>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 14,
              }}
            >
              Recent Transactions
            </h2>
            <div className="glass-card" style={{ padding: '8px 0' }}>
              <TransactionList transactions={transactions} />
            </div>
          </div>

          {/* Beneficiaries */}
          {beneficiaries.length > 0 && (
            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 14,
                }}
              >
                Beneficiaries
              </h2>
              <BeneficiaryList beneficiaries={beneficiaries} />
            </div>
          )}
        </div>

        {/* Right panel — Voice Assistant */}
        <div className="w-full lg:w-2/5 h-[500px] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/10 flex-shrink-0">
          <VoiceAssistant
            userId={currentUser}
            sttMode={sttMode}
            ttsMode={ttsMode}
            onDataChange={loadData}
          />
        </div>
      </div>
    </div>
  );
}
