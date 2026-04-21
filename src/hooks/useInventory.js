import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  getInventory,
  getInventoryCount,
  getInventoryStats,
  deleteInventoryItem,
  getUniqueBrands,
} from '../services/inventoryService';

export function useInventory(filters = {}) {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [brands, setBrands] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, statsData, brandList] = await Promise.all([
        getInventory(filters),
        getInventoryStats(),
        getUniqueBrands(),
      ]);
      setItems(data);
      setStats(statsData);
      setBrands(brandList);
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
    setLoading(false);
  }, [refreshKey, filters.search, filters.condition, filters.brand]);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id) => {
    try {
      await deleteInventoryItem(id);
      triggerRefresh();
      showToast('Item removed from inventory', 'success');
    } catch (e) {
      showToast('Failed to remove item', 'error');
    }
  }, [triggerRefresh, showToast]);

  return { items, loading, stats, brands, remove, refresh: load };
}

export function useInventoryCount() {
  const { refreshKey } = useApp();
  const [count, setCount] = useState(0);

  useEffect(() => {
    getInventoryCount().then(setCount).catch(() => {});
  }, [refreshKey]);

  return count;
}
