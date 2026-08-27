import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { PinLoginModal } from './components/PinLoginModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { POSView } from './components/pos/POSView.tsx';
import { KDSView } from './components/kds/KDSView.tsx';
import { TablesView } from './components/tables/TablesView.tsx';
import { MenuView } from './components/menu/MenuView.tsx';
import { ReservationsView } from './components/reservations/ReservationsView.tsx';
import { CustomersView } from './components/customers/CustomersView.tsx';
import { InventoryView } from './components/inventory/InventoryView.tsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.tsx';
import { SettingsView } from './components/settings/SettingsView.tsx';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'pos':
        return <POSView />;
      case 'kds':
        return <KDSView />;
      case 'tables':
        return <TablesView />;
      case 'menu':
        return <MenuView />;
      case 'reservations':
        return <ReservationsView />;
      case 'customers':
        return <CustomersView />;
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased font-sans transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderCurrentView()}
      </main>
      <PinLoginModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
