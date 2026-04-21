import db from '../db/database';

/**
 * Analytics Service — Business Intelligence Layer
 * Top-selling brands, monthly growth, period comparisons
 */

export async function getTopSellingBrands(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];

  const txs = await db.transactions.toArray();
  const sales = txs.filter(t => t.type === 'sale' && t.date >= sinceStr);

  const brandMap = {};
  sales.forEach(sale => {
    if (!brandMap[sale.brand]) {
      brandMap[sale.brand] = { count: 0, revenue: 0, profit: 0 };
    }
    brandMap[sale.brand].count += 1;
    brandMap[sale.brand].revenue += sale.salePrice || 0;
    brandMap[sale.brand].profit += (sale.salePrice || 0) - (sale.costPrice || 0);
  });

  return Object.entries(brandMap)
    .map(([brand, data]) => ({ brand, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getMonthlyGrowth() {
  const txs = await db.transactions.toArray();
  const sales = txs.filter(t => t.type === 'sale');

  const monthMap = {};
  sales.forEach(sale => {
    const month = sale.date.substring(0, 7); // YYYY-MM
    if (!monthMap[month]) {
      monthMap[month] = { revenue: 0, profit: 0, count: 0 };
    }
    monthMap[month].revenue += sale.salePrice || 0;
    monthMap[month].profit += (sale.salePrice || 0) - (sale.costPrice || 0);
    monthMap[month].count += 1;
  });

  const months = Object.entries(monthMap)
    .map(([month, data]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
      ...data,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Calculate growth percentages
  for (let i = 1; i < months.length; i++) {
    const prev = months[i - 1].revenue;
    const curr = months[i].revenue;
    months[i].growth = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  }
  if (months.length > 0) months[0].growth = 0;

  return months;
}

export async function getPeriodStats(days = 7) {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - days);
  const prevPeriodStart = new Date(periodStart);
  prevPeriodStart.setDate(prevPeriodStart.getDate() - days);

  const periodStr = periodStart.toISOString().split('T')[0];
  const prevStr = prevPeriodStart.toISOString().split('T')[0];
  const nowStr = now.toISOString().split('T')[0];

  const txs = await db.transactions.toArray();

  const current = txs.filter(t => t.date >= periodStr && t.date <= nowStr);
  const previous = txs.filter(t => t.date >= prevStr && t.date < periodStr);

  const calcStats = (list) => {
    const sales = list.filter(t => t.type === 'sale');
    const tradeIns = list.filter(t => t.type === 'trade-in');
    return {
      totalRevenue: sales.reduce((s, t) => s + (t.salePrice || 0), 0),
      totalProfit: sales.reduce((s, t) => s + ((t.salePrice || 0) - (t.costPrice || 0)), 0),
      salesCount: sales.length,
      tradeInCount: tradeIns.length,
      avgSalePrice: sales.length > 0 ? sales.reduce((s, t) => s + (t.salePrice || 0), 0) / sales.length : 0,
    };
  };

  const currentStats = calcStats(current);
  const previousStats = calcStats(previous);

  const revenueChange = previousStats.totalRevenue > 0
    ? ((currentStats.totalRevenue - previousStats.totalRevenue) / previousStats.totalRevenue) * 100
    : 0;

  const profitChange = previousStats.totalProfit > 0
    ? ((currentStats.totalProfit - previousStats.totalProfit) / previousStats.totalProfit) * 100
    : 0;

  return {
    current: currentStats,
    previous: previousStats,
    revenueChange,
    profitChange,
    period: days,
  };
}

export async function getDailyBreakdown(days = 7) {
  const results = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const txs = await db.transactions.where('date').equals(dateStr).toArray();
    const sales = txs.filter(t => t.type === 'sale');

    results.push({
      date: dateStr,
      label: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' }),
      revenue: sales.reduce((s, t) => s + (t.salePrice || 0), 0),
      profit: sales.reduce((s, t) => s + ((t.salePrice || 0) - (t.costPrice || 0)), 0),
      count: sales.length,
    });
  }

  return results;
}
