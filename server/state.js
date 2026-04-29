// In-memory state for the banking demo
// Resets on server restart — this is intentional for a demo

const initialState = () => ({
  ahmed: {
    id: 'ahmed',
    name: 'Ahmed Al-Mansouri',
    nameAr: 'أحمد المنصوري',
    avatar: 'AM',
    accounts: [
      {
        id: 'aed-everyday',
        name: 'AED Everyday',
        currency: 'AED',
        balance: 24500.00,
        iban: 'AE070331000012345678',
      },
      {
        id: 'usd-savings',
        name: 'USD Savings',
        currency: 'USD',
        balance: 8200.00,
        iban: 'AE070331000087654321',
      },
      {
        id: 'eur-travel',
        name: 'EUR Travel',
        currency: 'EUR',
        balance: 3150.00,
        iban: 'AE070331000011223344',
      },
    ],
    cards: [
      {
        id: 'visa-4821',
        type: 'Visa',
        tier: 'Platinum',
        lastFour: '4821',
        status: 'active',
        expiryDate: '12/27',
      },
      {
        id: 'mc-7743',
        type: 'Mastercard',
        tier: 'Classic',
        lastFour: '7743',
        status: 'active',
        expiryDate: '09/26',
      },
    ],
    beneficiaries: [
      {
        id: 'rania-local',
        name: 'Rania Khalid',
        nameAr: 'رانيا خالد',
        type: 'local',
        bank: 'Emirates NBD',
        iban: 'AE070331234567890000',
        currency: 'AED',
      },
      {
        id: 'john-intl',
        name: 'John Smith',
        type: 'international',
        bank: 'Barclays UK',
        iban: 'GB29NWBK60161331926819',
        currency: 'GBP',
      },
    ],
    transactions: [
      {
        id: 'txn-001',
        date: '2026-04-28T14:30:00Z',
        description: 'Salary Credit',
        descriptionAr: 'إيداع راتب',
        amount: 15000.00,
        currency: 'AED',
        type: 'credit',
        accountId: 'aed-everyday',
      },
      {
        id: 'txn-002',
        date: '2026-04-27T10:15:00Z',
        description: 'Carrefour - Grocery',
        descriptionAr: 'كارفور - بقالة',
        amount: -342.50,
        currency: 'AED',
        type: 'debit',
        accountId: 'aed-everyday',
      },
      {
        id: 'txn-003',
        date: '2026-04-26T16:45:00Z',
        description: 'DEWA Utilities',
        descriptionAr: 'ديوا - خدمات',
        amount: -890.00,
        currency: 'AED',
        type: 'debit',
        accountId: 'aed-everyday',
      },
      {
        id: 'txn-004',
        date: '2026-04-25T09:00:00Z',
        description: 'Transfer to USD Savings',
        descriptionAr: 'تحويل إلى حساب التوفير بالدولار',
        amount: -2000.00,
        currency: 'AED',
        type: 'debit',
        accountId: 'aed-everyday',
      },
      {
        id: 'txn-005',
        date: '2026-04-25T09:00:00Z',
        description: 'Transfer from AED Everyday',
        descriptionAr: 'تحويل من الحساب اليومي بالدرهم',
        amount: 544.60,
        currency: 'USD',
        type: 'credit',
        accountId: 'usd-savings',
      },
    ],
  },
  sara: {
    id: 'sara',
    name: 'Sara Al-Hashimi',
    nameAr: 'سارة الهاشمي',
    avatar: 'SH',
    accounts: [
      {
        id: 'aed-main',
        name: 'AED Main',
        currency: 'AED',
        balance: 51200.00,
        iban: 'AE120401000098765432',
      },
      {
        id: 'usd-investment',
        name: 'USD Investment',
        currency: 'USD',
        balance: 22000.00,
        iban: 'AE120401000056781234',
      },
    ],
    cards: [
      {
        id: 'visa-9912',
        type: 'Visa',
        tier: 'Signature',
        lastFour: '9912',
        status: 'active',
        expiryDate: '03/28',
      },
    ],
    beneficiaries: [
      {
        id: 'fatima-local',
        name: 'Fatima Al-Zaabi',
        nameAr: 'فاطمة الزعابي',
        type: 'local',
        bank: 'Abu Dhabi Commercial Bank',
        iban: 'AE120401987654320000',
        currency: 'AED',
      },
      {
        id: 'pierre-intl',
        name: 'Pierre Dubois',
        type: 'international',
        bank: 'BNP Paribas',
        iban: 'FR7630006000011234567890189',
        currency: 'EUR',
      },
    ],
    transactions: [
      {
        id: 'txn-s01',
        date: '2026-04-28T11:00:00Z',
        description: 'Investment Return',
        descriptionAr: 'عائد استثمار',
        amount: 1500.00,
        currency: 'USD',
        type: 'credit',
        accountId: 'usd-investment',
      },
      {
        id: 'txn-s02',
        date: '2026-04-27T15:30:00Z',
        description: 'Dubai Mall - Shopping',
        descriptionAr: 'دبي مول - تسوق',
        amount: -4200.00,
        currency: 'AED',
        type: 'debit',
        accountId: 'aed-main',
      },
      {
        id: 'txn-s03',
        date: '2026-04-26T08:20:00Z',
        description: 'Etisalat Mobile',
        descriptionAr: 'اتصالات - هاتف',
        amount: -350.00,
        currency: 'AED',
        type: 'debit',
        accountId: 'aed-main',
      },
    ],
  },
});

// Exchange rates (from → to)
const exchangeRates = {
  'AED-USD': 0.2723,
  'AED-EUR': 0.2512,
  'AED-GBP': 0.2156,
  'USD-AED': 3.6725,
  'USD-EUR': 0.9225,
  'USD-GBP': 0.7920,
  'EUR-AED': 3.9810,
  'EUR-USD': 1.0840,
  'EUR-GBP': 0.8587,
  'GBP-AED': 4.6382,
  'GBP-USD': 1.2626,
  'GBP-EUR': 1.1646,
};

let state = initialState();
let txnCounter = 100;

export function resetState() {
  state = initialState();
  txnCounter = 100;
}

export function getUser(userId) {
  return state[userId] || null;
}

export function getAccounts(userId) {
  const user = state[userId];
  return user ? user.accounts : null;
}

export function getAccount(userId, accountId) {
  const user = state[userId];
  if (!user) return null;
  return user.accounts.find((a) => a.id === accountId) || null;
}

export function getAccountByCurrency(userId, currency) {
  const user = state[userId];
  if (!user) return null;
  return user.accounts.find((a) => a.currency === currency.toUpperCase()) || null;
}

export function getTransactions(userId, accountId, limit = 20) {
  const user = state[userId];
  if (!user) return null;
  let txns = user.transactions;
  if (accountId) {
    txns = txns.filter((t) => t.accountId === accountId);
  }
  return txns
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

export function getCards(userId) {
  const user = state[userId];
  return user ? user.cards : null;
}

export function getBeneficiaries(userId) {
  const user = state[userId];
  return user ? user.beneficiaries : null;
}

export function getExchangeRate(from, to) {
  const key = `${from.toUpperCase()}-${to.toUpperCase()}`;
  return exchangeRates[key] || null;
}

export function getAllExchangeRates() {
  return { ...exchangeRates };
}

export function addTransaction(userId, txn) {
  const user = state[userId];
  if (!user) return null;
  txnCounter++;
  const newTxn = {
    id: `txn-${txnCounter}`,
    date: new Date().toISOString(),
    ...txn,
  };
  user.transactions.unshift(newTxn);
  return newTxn;
}

export function updateBalance(userId, accountId, delta) {
  const user = state[userId];
  if (!user) return null;
  const account = user.accounts.find((a) => a.id === accountId);
  if (!account) return null;
  account.balance = Math.round((account.balance + delta) * 100) / 100;
  return account;
}

export function blockCard(userId, cardId) {
  const user = state[userId];
  if (!user) return null;
  const card = user.cards.find((c) => c.id === cardId);
  if (!card) return null;
  card.status = 'blocked';
  return card;
}

export function convertCurrency(userId, fromAccountId, toAccountId, amount) {
  const user = state[userId];
  if (!user) return { error: 'User not found' };

  const fromAccount = user.accounts.find((a) => a.id === fromAccountId);
  const toAccount = user.accounts.find((a) => a.id === toAccountId);

  if (!fromAccount) return { error: `Source account ${fromAccountId} not found` };
  if (!toAccount) return { error: `Destination account ${toAccountId} not found` };
  if (fromAccount.balance < amount) return { error: 'Insufficient funds' };

  const rateKey = `${fromAccount.currency}-${toAccount.currency}`;
  const rate = exchangeRates[rateKey];
  if (!rate) return { error: `No exchange rate for ${rateKey}` };

  const convertedAmount = Math.round(amount * rate * 100) / 100;

  // Mutate balances
  fromAccount.balance = Math.round((fromAccount.balance - amount) * 100) / 100;
  toAccount.balance = Math.round((toAccount.balance + convertedAmount) * 100) / 100;

  // Record transactions
  txnCounter++;
  const debitTxn = {
    id: `txn-${txnCounter}`,
    date: new Date().toISOString(),
    description: `Currency conversion to ${toAccount.currency}`,
    descriptionAr: `تحويل عملة إلى ${toAccount.currency}`,
    amount: -amount,
    currency: fromAccount.currency,
    type: 'debit',
    accountId: fromAccountId,
  };

  txnCounter++;
  const creditTxn = {
    id: `txn-${txnCounter}`,
    date: new Date().toISOString(),
    description: `Currency conversion from ${fromAccount.currency}`,
    descriptionAr: `تحويل عملة من ${fromAccount.currency}`,
    amount: convertedAmount,
    currency: toAccount.currency,
    type: 'credit',
    accountId: toAccountId,
  };

  user.transactions.unshift(debitTxn, creditTxn);

  return {
    fromAccount: { id: fromAccount.id, currency: fromAccount.currency, newBalance: fromAccount.balance },
    toAccount: { id: toAccount.id, currency: toAccount.currency, newBalance: toAccount.balance },
    amountDebited: amount,
    amountCredited: convertedAmount,
    rate,
  };
}

export function transferFunds(userId, beneficiaryId, amount, currency) {
  const user = state[userId];
  if (!user) return { error: 'User not found' };

  const beneficiary = user.beneficiaries.find((b) => b.id === beneficiaryId);
  if (!beneficiary) return { error: `Beneficiary ${beneficiaryId} not found` };

  // Find account with matching currency
  const account = user.accounts.find((a) => a.currency === currency.toUpperCase());
  if (!account) return { error: `No account found with currency ${currency}` };
  if (account.balance < amount) return { error: 'Insufficient funds' };

  // Mutate balance
  account.balance = Math.round((account.balance - amount) * 100) / 100;

  // Record transaction
  txnCounter++;
  const txn = {
    id: `txn-${txnCounter}`,
    date: new Date().toISOString(),
    description: `Transfer to ${beneficiary.name}`,
    descriptionAr: `تحويل إلى ${beneficiary.nameAr || beneficiary.name}`,
    amount: -amount,
    currency: currency.toUpperCase(),
    type: 'debit',
    accountId: account.id,
  };

  user.transactions.unshift(txn);

  return {
    account: { id: account.id, currency: account.currency, newBalance: account.balance },
    beneficiary: { name: beneficiary.name, bank: beneficiary.bank, iban: beneficiary.iban },
    amount,
    currency: currency.toUpperCase(),
    transaction: txn,
  };
}
