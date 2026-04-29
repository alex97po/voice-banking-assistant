import { Router } from 'express';
import { getUser, getAccounts, getTransactions, getCards, getBeneficiaries, getAllExchangeRates } from '../state.js';

const router = Router();

router.get('/user/:userId', (req, res) => {
  const user = getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { transactions, ...userData } = user;
  res.json(userData);
});

router.get('/accounts/:userId', (req, res) => {
  const accounts = getAccounts(req.params.userId);
  if (!accounts) return res.status(404).json({ error: 'User not found' });
  res.json({ accounts });
});

router.get('/transactions/:userId', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const accountId = req.query.accountId;
  const transactions = getTransactions(req.params.userId, accountId, limit);
  if (!transactions) return res.status(404).json({ error: 'User not found' });
  res.json({ transactions });
});

router.get('/cards/:userId', (req, res) => {
  const cards = getCards(req.params.userId);
  if (!cards) return res.status(404).json({ error: 'User not found' });
  res.json({ cards });
});

router.get('/beneficiaries/:userId', (req, res) => {
  const beneficiaries = getBeneficiaries(req.params.userId);
  if (!beneficiaries) return res.status(404).json({ error: 'User not found' });
  res.json({ beneficiaries });
});

router.get('/rates', (req, res) => {
  res.json({ rates: getAllExchangeRates() });
});

export default router;
