import {
  getAccounts, getAccount, getAccountByCurrency, getTransactions,
  getCards, getBeneficiaries, getExchangeRate, convertCurrency,
  transferFunds, blockCard,
} from './state.js';

export const toolDefinitions = [
  {
    name: 'get_balance',
    description: 'Get balance of all or a specific account. READ operation — no confirmation needed.',
    input_schema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Optional account ID. If omitted, returns all.' },
      },
      required: [],
    },
  },
  {
    name: 'get_transactions',
    description: 'Get recent transaction history. READ operation.',
    input_schema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Optional account ID filter.' },
        limit: { type: 'number', description: 'Max transactions. Default: 10.' },
      },
      required: [],
    },
  },
  {
    name: 'get_exchange_rate',
    description: 'Get exchange rate between currencies. READ operation.',
    input_schema: {
      type: 'object',
      properties: {
        from_currency: { type: 'string', description: 'Source currency (AED, USD, EUR, GBP).' },
        to_currency: { type: 'string', description: 'Target currency.' },
      },
      required: ['from_currency', 'to_currency'],
    },
  },
  {
    name: 'convert_currency',
    description: 'Convert money between accounts. WRITE operation — requires confirmation.',
    input_schema: {
      type: 'object',
      properties: {
        from_account_id: { type: 'string' },
        to_account_id: { type: 'string' },
        amount: { type: 'number', description: 'Amount in source currency.' },
      },
      required: ['from_account_id', 'to_account_id', 'amount'],
    },
  },
  {
    name: 'transfer_funds',
    description: 'Transfer money to a beneficiary. WRITE operation — requires confirmation.',
    input_schema: {
      type: 'object',
      properties: {
        beneficiary_id: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
      },
      required: ['beneficiary_id', 'amount', 'currency'],
    },
  },
  {
    name: 'get_beneficiaries',
    description: 'List all beneficiaries. READ operation.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'block_card',
    description: 'Block a card. WRITE operation — requires confirmation.',
    input_schema: {
      type: 'object',
      properties: { card_id: { type: 'string' } },
      required: ['card_id'],
    },
  },
  {
    name: 'get_cards',
    description: 'List all cards with status. READ operation.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
];

const WRITE_TOOLS = new Set(['convert_currency', 'transfer_funds', 'block_card']);

export function isWriteOperation(toolName) {
  return WRITE_TOOLS.has(toolName);
}

export function executeTool(userId, toolName, input) {
  switch (toolName) {
    case 'get_balance': {
      if (input.account_id) {
        const acct = getAccount(userId, input.account_id) || getAccountByCurrency(userId, input.account_id.toUpperCase());
        return acct ? { account: acct } : { error: `Account ${input.account_id} not found` };
      }
      return { accounts: getAccounts(userId) };
    }
    case 'get_transactions':
      return { transactions: getTransactions(userId, input.account_id, input.limit || 10) };
    case 'get_exchange_rate': {
      const rate = getExchangeRate(input.from_currency, input.to_currency);
      if (!rate) return { error: `No rate for ${input.from_currency}→${input.to_currency}` };
      return { from: input.from_currency.toUpperCase(), to: input.to_currency.toUpperCase(), rate, example: `1 ${input.from_currency.toUpperCase()} = ${rate} ${input.to_currency.toUpperCase()}` };
    }
    case 'convert_currency':
      return convertCurrency(userId, input.from_account_id, input.to_account_id, input.amount);
    case 'transfer_funds':
      return transferFunds(userId, input.beneficiary_id, input.amount, input.currency);
    case 'get_beneficiaries':
      return { beneficiaries: getBeneficiaries(userId) };
    case 'block_card': {
      const card = blockCard(userId, input.card_id);
      return card ? { card, message: `Card ending in ${card.lastFour} has been blocked.` } : { error: `Card ${input.card_id} not found` };
    }
    case 'get_cards':
      return { cards: getCards(userId) };
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export function describePendingAction(toolName, input, userId) {
  switch (toolName) {
    case 'convert_currency': {
      const from = getAccount(userId, input.from_account_id);
      const to = getAccount(userId, input.to_account_id);
      const rate = from && to ? getExchangeRate(from.currency, to.currency) : null;
      const converted = rate ? Math.round(input.amount * rate * 100) / 100 : '?';
      return {
        title: 'Currency Conversion', titleAr: 'تحويل عملة',
        summary: `Convert ${input.amount.toLocaleString()} ${from?.currency || '?'} to ${to?.currency || '?'} (~${converted} ${to?.currency || '?'})`,
        summaryAr: `تحويل ${input.amount.toLocaleString()} ${from?.currency || '?'} إلى ${to?.currency || '?'} (~${converted} ${to?.currency || '?'})`,
      };
    }
    case 'transfer_funds': {
      const bens = getBeneficiaries(userId);
      const ben = bens?.find(b => b.id === input.beneficiary_id);
      return {
        title: 'Fund Transfer', titleAr: 'تحويل أموال',
        summary: `Transfer ${input.amount.toLocaleString()} ${input.currency} to ${ben?.name || input.beneficiary_id}`,
        summaryAr: `تحويل ${input.amount.toLocaleString()} ${input.currency} إلى ${ben?.nameAr || ben?.name || input.beneficiary_id}`,
      };
    }
    case 'block_card': {
      const cards = getCards(userId);
      const card = cards?.find(c => c.id === input.card_id);
      return {
        title: 'Block Card', titleAr: 'حظر البطاقة',
        summary: `Block ${card?.type || ''} card ending in ${card?.lastFour || input.card_id}`,
        summaryAr: `حظر بطاقة ${card?.type || ''} المنتهية بـ ${card?.lastFour || input.card_id}`,
      };
    }
    default:
      return { title: toolName, titleAr: toolName, summary: JSON.stringify(input), summaryAr: JSON.stringify(input) };
  }
}
