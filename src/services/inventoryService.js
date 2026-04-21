import db from '../db/database';

/**
 * Inventory Service — Business Logic Layer
 * Stock management, search, filtering, categorization
 */

export async function getInventory({ search, condition, brand, status = 'active' } = {}) {
  let items = await db.inventory.toArray();

  if (status) {
    items = items.filter(item => item.status === status);
  }
  if (condition) {
    items = items.filter(item => item.condition === condition);
  }
  if (brand) {
    items = items.filter(item => item.brand === brand);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(item =>
      item.phoneModel.toLowerCase().includes(q) ||
      item.imei.includes(q) ||
      item.brand.toLowerCase().includes(q)
    );
  }

  return items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

export async function getInventoryCount() {
  return db.inventory.where('status').equals('active').count();
}

export async function addInventoryItem(item) {
  return db.inventory.add({
    ...item,
    status: 'active',
    addedAt: new Date().toISOString(),
  });
}

export async function updateInventoryItem(id, updates) {
  return db.inventory.update(id, updates);
}

export async function deleteInventoryItem(id) {
  return db.inventory.delete(id);
}

export async function markAsSold(id) {
  return db.inventory.update(id, { status: 'sold' });
}

export async function getInventoryStats() {
  const items = await db.inventory.where('status').equals('active').toArray();

  const totalValue = items.reduce((sum, item) => sum + (item.costPrice || 0), 0);
  const newCount = items.filter(i => i.condition === 'New').length;
  const usedCount = items.filter(i => i.condition === 'Used').length;

  const brandCounts = {};
  items.forEach(item => {
    brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
  });

  return {
    totalItems: items.length,
    totalValue,
    newCount,
    usedCount,
    brandCounts,
  };
}

export async function getUniqueBrands() {
  const items = await db.inventory.toArray();
  const brands = [...new Set(items.map(i => i.brand))];
  return brands.sort();
}
