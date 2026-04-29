export const USERS = {
  ahmed: {
    id: 'ahmed',
    name: 'Ahmed Al-Mansouri',
    nameAr: 'أحمد المنصوري',
    avatar: 'AM',
    subtitle: '3 Accounts · 2 Cards',
    subtitleAr: '٣ حسابات · بطاقتان',
    gradient: 'linear-gradient(135deg, #0c4a6e, #0369a1)',
  },
  sara: {
    id: 'sara',
    name: 'Sara Al-Hashimi',
    nameAr: 'سارة الهاشمي',
    avatar: 'SH',
    subtitle: '2 Accounts · 1 Card',
    subtitleAr: '٢ حسابات · بطاقة واحدة',
    gradient: 'linear-gradient(135deg, #581c87, #7c3aed)',
  },
};

export const CURRENCY_SYMBOLS = {
  AED: 'د.إ',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCY_COLORS = {
  AED: '#10b981',
  USD: '#0ea5e9',
  EUR: '#a78bfa',
  GBP: '#f59e0b',
};

export function formatCurrency(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

export function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
