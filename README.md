# Sebos Book 📱

**Sebos Book** is a premium digital management and bookkeeping solution specifically designed for mobile phone retailers and technicians. It simplifies the complexity of tracking multi-brand inventory, sales, and trade-ins with an elegant, professional interface.

## 🚀 Key Features

- **Omni-channel Management**: Seamlessly manage your business across **Web** and **Mobile** (Android/iOS).
- **Offline-First Sync**: Powered by a robust synchronization layer that works offline and syncs to the cloud (Supabase) when you're back online.
- **Advanced POS Receipts**: Generate professional, customer-ready digital receipts for every transaction, featuring customer details and business branding.
- **Dynamic Inventory**: Track stock levels, condition (New/Used), cost price, and IMEI numbers with ease.
- **Real-time Analytics**: Monitor daily profits, weekly revenue trends, and stock health at a glance.
- **Secure Data**: Industry-standard authentication and data encryption to keep your business records safe.

## 🛠 Tech Stack

- **Web Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Mobile App**: [Flutter](https://flutter.dev/)
- **Local Databases**: [Dexie (IndexedDB)](https://dexie.org/) for Web & [Isar](https://isar.dev/) for Mobile.
- **Backend & Sync**: [Supabase](https://supabase.com/) (PostgreSQL + Auth).
- **PDF Engine**: [jsPDF](https://github.com/parallax/jsPDF).

## 📦 Getting Started

### Web Application
1. Install dependencies: `npm install`
2. Configure `.env` with your Supabase credentials.
3. Start dev server: `npm run dev`

### Mobile Application
1. Navigate to `sebos_mobile` directory.
2. Install Flutter dependencies: `flutter pub get`
3. Run the app: `flutter run`

## 📄 License
Created for personal/commercial business management. All rights reserved.
