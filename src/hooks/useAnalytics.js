import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  getTopSellingBrands,
  getMonthlyGrowth,
  getPeriodStats,
  getDailyBreakdown,
} from '../services/analyticsService';

export function useAnalytics(period = 7) {
  const { refreshKey } = useApp();
  const [topBrands, setTopBrands] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [periodStats, setPeriodStats] = useState(null);
  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [brands, growth, stats, daily] = await Promise.all([
        getTopSellingBrands(period),
        getMonthlyGrowth(),
        getPeriodStats(period),
        getDailyBreakdown(period),
      ]);
      setTopBrands(brands);
      setMonthlyGrowth(growth);
      setPeriodStats(stats);
      setDailyBreakdown(daily);
    } catch (e) {
      console.error('Analytics load error:', e);
    }
    setLoading(false);
  }, [refreshKey, period]);

  useEffect(() => { load(); }, [load]);

  return { topBrands, monthlyGrowth, periodStats, dailyBreakdown, loading };
}
