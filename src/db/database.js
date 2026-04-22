import Dexie from 'dexie';
import { supabase } from '../lib/supabase';

const db = new Dexie('SebosBookDB');

// Updated schema with sync metadata and customer info
db.version(3).stores({
  transactions: '++id, type, phoneModel, imei, condition, costPrice, salePrice, date, brand, createdAt, isSynced, serverId, updatedAt, customerName, customerPhone, customerAddress',
  inventory: '++id, phoneModel, imei, condition, costPrice, brand, status, addedAt, isSynced, serverId, updatedAt',
}).upgrade(tx => {
  // Simple upgrade logic if needed
});

// --- Background Sync Worker ---

export async function syncData() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const userId = session.user.id;

  // 1. Sync Transactions
  const unsyncedTxs = await db.transactions.where('isSynced').equals(0).toArray();
  for (const tx of unsyncedTxs) {
    const { id, isSynced, serverId, ...txData } = tx;
    const { data: remoteData, error } = await supabase
      .from('transactions')
      .upsert({ ...txData, user_id: userId, id: serverId || undefined })
      .select()
      .single();

    if (!error && remoteData) {
      await db.transactions.update(id, {
        isSynced: 1,
        serverId: remoteData.id,
        updatedAt: remoteData.updated_at
      });
    }
  }

  // 2. Sync Inventory
  const unsyncedInv = await db.inventory.where('isSynced').equals(0).toArray();
  for (const item of unsyncedInv) {
    const { id, isSynced, serverId, ...itemData } = item;
    const { data: remoteData, error } = await supabase
      .from('inventory')
      .upsert({ ...itemData, user_id: userId, id: serverId || undefined })
      .select()
      .single();

    if (!error && remoteData) {
      await db.inventory.update(id, {
        isSynced: 1,
        serverId: remoteData.id,
        updatedAt: remoteData.updated_at
      });
    }
  }

  // 3. Pull Remote Changes (Simplified Last-Write-Wins)
  // In a real app, you'd fetch only changes since last sync
  const { data: remoteTxs } = await supabase.from('transactions').select('*');
  if (remoteTxs) {
    for (const rTx of remoteTxs) {
      const local = await db.transactions.where('serverId').equals(rTx.id).first();
      if (!local) {
        const { user_id, ...cleanData } = rTx;
        await db.transactions.add({ ...cleanData, serverId: rTx.id, isSynced: 1 });
      }
    }
  }
}

// Intercept adds to mark as unsynced
db.transactions.hook('creating', (primKey, obj) => {
  obj.isSynced = 0;
  obj.updatedAt = new Date().toISOString();
});

db.inventory.hook('creating', (primKey, obj) => {
  obj.isSynced = 0;
  obj.updatedAt = new Date().toISOString();
});

// Seed demo data if DB is empty
export async function seedDemoData() {
  const count = await db.transactions.count();
  if (count > 0) return;

  const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Tecno', 'Infinix', 'itel', 'Oppo', 'Redmi'];
  const models = {
    Apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13'],
    Samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54'],
    Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro'],
    OnePlus: ['OnePlus 12', 'OnePlus 12R', 'OnePlus Nord 3'],
    Xiaomi: ['Xiaomi 14 Pro', 'Xiaomi 14', 'Redmi Note 13 Pro'],
    Tecno: ['Phantom X2 Pro', 'Camon 20 Premier', 'Spark 10 Pro', 'Pova 5'],
    Infinix: ['Zero 30 5G', 'Note 30 VIP', 'Hot 30', 'Smart 7'],
    itel: ['S23+', 'P40', 'A60s'],
    Oppo: ['Find N3', 'Reno 10 Pro+', 'A78'],
    Redmi: ['Redmi Note 13 Pro+', 'Redmi 13C', 'Redmi Note 12'],
  };

  const conditions = ['New', 'Used'];

  function randomIMEI() {
    let imei = '';
    for (let i = 0; i < 15; i++) imei += Math.floor(Math.random() * 10);
    return imei;
  }

  function randomPrice(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  }

  const now = new Date();
  const transactions = [];
  const inventoryItems = [];

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const txPerDay = Math.floor(Math.random() * 4) + 1;
    for (let t = 0; t < txPerDay; t++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const modelList = models[brand];
      const model = modelList[Math.floor(Math.random() * modelList.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const isSale = Math.random() > 0.35;
      const costBase = brand === 'Apple' ? 600 : brand === 'Samsung' ? 450 : 300;
      const costPrice = randomPrice(costBase * 0.5, costBase * 1.2);
      const salePrice = isSale ? randomPrice(costPrice * 1.1, costPrice * 1.5) : 0;

      const txDate = new Date(now);
      txDate.setDate(txDate.getDate() - dayOffset);
      txDate.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 60));

      transactions.push({
        type: isSale ? 'sale' : 'trade-in',
        phoneModel: model,
        imei: randomIMEI(),
        condition,
        costPrice,
        salePrice,
        brand,
        date: txDate.toISOString().split('T')[0],
        createdAt: txDate.toISOString(),
        isSynced: 1, // Demo data is local only or "synced"
        updatedAt: txDate.toISOString(),
        customerName: ['John Doe', 'Sarah Smith', 'Michael Chen', 'Amaka Okoro', 'Blessing Udoh'][Math.floor(Math.random() * 5)],
        customerPhone: '080' + Math.floor(10000000 + Math.random() * 90000000),
        customerAddress: 'No ' + Math.floor(Math.random() * 100) + ' Business District, Lagos, Nigeria'
      });
    }
  }

  for (let i = 0; i < 12; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[brand];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const costPrice = randomPrice(200, 800);

    inventoryItems.push({
      phoneModel: model,
      imei: randomIMEI(),
      condition,
      costPrice,
      brand,
      status: 'active',
      addedAt: new Date().toISOString(),
      isSynced: 1,
      updatedAt: new Date().toISOString()
    });
  }

  await db.transactions.bulkAdd(transactions);
  await db.inventory.bulkAdd(inventoryItems);
}

export async function clearDatabase() {
  await db.transactions.clear();
  await db.inventory.clear();
}

export default db;
