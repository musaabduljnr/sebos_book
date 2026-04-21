import db from '../db/database';

/**
 * Transaction Service — Business Logic Layer
 * Handles CRUD for sales and trade-ins, profit calculations, aggregations
 */

export async function addTransaction(data) {
  const transaction = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  const id = await db.transactions.add(transaction);

  // If it's a trade-in, add to inventory
  if (data.type === 'trade-in') {
    await db.inventory.add({
      phoneModel: data.phoneModel,
      imei: data.imei,
      condition: data.condition,
      costPrice: data.costPrice,
      brand: data.brand,
      status: 'active',
      addedAt: new Date().toISOString(),
    });
  }

  // If it's a sale, try to remove from inventory by IMEI
  if (data.type === 'sale' && data.imei) {
    const existing = await db.inventory.where('imei').equals(data.imei).first();
    if (existing) {
      await db.inventory.delete(existing.id);
    }
  }

  return id;
}

export async function getTransactions({ limit, offset = 0, type, dateFrom, dateTo } = {}) {
  let collection = db.transactions.orderBy('createdAt').reverse();

  const all = await collection.toArray();
  let filtered = all;

  if (type) {
    filtered = filtered.filter(tx => tx.type === type);
  }
  if (dateFrom) {
    filtered = filtered.filter(tx => tx.date >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter(tx => tx.date <= dateTo);
  }

  if (limit) {
    return filtered.slice(offset, offset + limit);
  }
  return filtered;
}

export async function getTransactionById(id) {
  return db.transactions.get(id);
}

export async function deleteTransaction(id) {
  return db.transactions.delete(id);
}

export function calculateProfit(transaction) {
  if (transaction.type === 'sale' && transaction.salePrice && transaction.costPrice) {
    return transaction.salePrice - transaction.costPrice;
  }
  return 0;
}

export function calculateMargin(transaction) {
  if (transaction.type === 'sale' && transaction.salePrice > 0) {
    return ((transaction.salePrice - transaction.costPrice) / transaction.salePrice) * 100;
  }
  return 0;
}

export async function getDailyStats(dateStr) {
  const date = dateStr || new Date().toISOString().split('T')[0];
  const txs = await db.transactions.where('date').equals(date).toArray();

  const sales = txs.filter(t => t.type === 'sale');
  const tradeIns = txs.filter(t => t.type === 'trade-in');

  const totalRevenue = sales.reduce((sum, t) => sum + (t.salePrice || 0), 0);
  const totalCost = sales.reduce((sum, t) => sum + (t.costPrice || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const tradeInSpend = tradeIns.reduce((sum, t) => sum + (t.costPrice || 0), 0);

  return {
    date,
    salesCount: sales.length,
    tradeInCount: tradeIns.length,
    totalRevenue,
    totalCost,
    totalProfit,
    tradeInSpend,
    transactionCount: txs.length,
  };
}

export async function getWeeklyRevenue() {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const stats = await getDailyStats(dateStr);
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      revenue: stats.totalRevenue,
      profit: stats.totalProfit,
      count: stats.salesCount,
    });
  }

  return days;
}

export async function getRecentActivity(limit = 10) {
  return db.transactions.orderBy('createdAt').reverse().limit(limit).toArray();
}
