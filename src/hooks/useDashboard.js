import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDailyStats, getWeeklyRevenue } from '../services/transactionService';
import { getInventoryCount } from '../services/inventoryService';

export function useDashboard() {
  const { refreshKey } = useApp();
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [daily, weekly, count] = await Promise.all([
          getDailyStats(),
          getWeeklyRevenue(),
          getInventoryCount(),
        ]);
        setDailyStats(daily);
        setWeeklyData(weekly);
        setStockCount(count);
      } catch (e) {
        console.error('Dashboard load error:', e);
      }
      setLoading(false);
    }
    load();
  }, [refreshKey]);

  return { dailyStats, weeklyData, stockCount, loading };
}
