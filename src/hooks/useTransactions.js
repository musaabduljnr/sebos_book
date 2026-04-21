import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getRecentActivity,
} from '../services/transactionService';

export function useTransactions(options = {}) {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions(options);
      setTransactions(data);
    } catch (e) {
      console.error('Failed to load transactions:', e);
    }
    setLoading(false);
  }, [refreshKey, options.type, options.limit]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (data) => {
    try {
      const id = await addTransaction(data);
      triggerRefresh();
      showToast(
        data.type === 'sale' ? 'Sale recorded successfully!' : 'Trade-in recorded!',
        'success'
      );
      return id;
    } catch (e) {
      showToast('Failed to record transaction', 'error');
      throw e;
    }
  }, [triggerRefresh, showToast]);

  const remove = useCallback(async (id) => {
    try {
      await deleteTransaction(id);
      triggerRefresh();
      showToast('Transaction deleted', 'success');
    } catch (e) {
      showToast('Failed to delete transaction', 'error');
    }
  }, [triggerRefresh, showToast]);

  return { transactions, loading, create, remove, refresh: load };
}

export function useRecentActivity(limit = 10) {
  const { refreshKey } = useApp();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getRecentActivity(limit);
        setActivity(data);
      } catch (e) {
        console.error('Failed to load activity:', e);
      }
      setLoading(false);
    }
    load();
  }, [refreshKey, limit]);

  return { activity, loading };
}
