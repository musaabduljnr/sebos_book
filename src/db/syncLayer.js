/**
 * Cloud Sync Abstraction Layer
 * Integrates with Supabase via Dexie sync logic in database.js
 */
import { syncData } from './database';

const SYNC_KEY = 'sebos_sync_meta';

class SyncLayer {
  constructor() {
    this.listeners = new Set();
    this.syncStatus = 'idle'; // idle | syncing | synced | error
    this.lastSyncTime = this._getLastSyncTime();
  }

  _getLastSyncTime() {
    try {
      const meta = JSON.parse(localStorage.getItem(SYNC_KEY) || '{}');
      return meta.lastSync || null;
    } catch {
      return null;
    }
  }

  _setLastSyncTime() {
    const now = new Date().toISOString();
    localStorage.setItem(SYNC_KEY, JSON.stringify({ lastSync: now }));
    this.lastSyncTime = now;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    this.listeners.forEach(fn => fn({
      status: this.syncStatus,
      lastSync: this.lastSyncTime,
    }));
  }

  async sync() {
    this.syncStatus = 'syncing';
    this._notify();

    try {
      // Call the real Supabase sync implementation from database.js
      await syncData();
      
      this.syncStatus = 'synced';
      this._setLastSyncTime();
      this._notify();
      return { success: true };
    } catch (error) {
      console.error('Sync Error:', error);
      this.syncStatus = 'error';
      this._notify();
      return { success: false, error: error.message };
    }
  }

  getStatus() {
    return {
      status: this.syncStatus,
      lastSync: this.lastSyncTime,
    };
  }
}

export const syncLayer = new SyncLayer();
export default syncLayer;
