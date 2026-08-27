import React, { useState } from 'react';
import {
  UtensilsCrossed,
  LayoutGrid,
  ChefHat,
  Users,
  CalendarCheck,
  Package,
  BarChart3,
  Settings,
  Bell,
  Moon,
  Sun,
  Lock,
  ChevronDown,
  Building2,
  MenuSquare,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext.tsx';

export const Navbar: React.FC = () => {
  const {
    darkMode,
    setDarkMode,
    activeView,
    setActiveView,
    currentUser,
    setCurrentUser,
    activeBranch,
    setActiveBranch,
    branches,
    staffList,
    notifications,
    markNotificationRead,
    isPinModalOpen,
    setIsPinModalOpen,
    refreshAllData,
    isLoading,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Define navigation items based on current role permissions
  const navItems: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }>; roleAccess: string[] }[] = [
    { id: 'pos', label: 'POS Terminal', icon: UtensilsCrossed, roleAccess: ['admin', 'manager', 'server', 'cashier'] },
    { id: 'kds', label: 'Kitchen (KDS)', icon: ChefHat, roleAccess: ['admin', 'manager', 'chef', 'server'] },
    { id: 'tables', label: 'Floor Plan', icon: LayoutGrid, roleAccess: ['admin', 'manager', 'server', 'cashier'] },
    { id: 'menu', label: 'Menu & Recipes', icon: MenuSquare, roleAccess: ['admin', 'manager', 'chef'] },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck, roleAccess: ['admin', 'manager', 'server', 'cashier'] },
    { id: 'customers', label: 'Guests CRM', icon: Users, roleAccess: ['admin', 'manager', 'server'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roleAccess: ['admin', 'manager', 'chef'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roleAccess: ['admin', 'manager'] },
    { id: 'staff', label: 'Staff & Roles', icon: ShieldCheck, roleAccess: ['admin', 'manager'] },
    { id: 'settings', label: 'Settings & Tests', icon: Settings, roleAccess: ['admin', 'manager'] },
    { id: 'customer-portal', label: 'Patron Portal', icon: QrCode, roleAccess: ['admin', 'manager', 'server', 'chef', 'cashier'] },
  ];

  const visibleNav = navItems.filter((item) => item.roleAccess.includes(currentUser.role));

  const roleColors: Record<string, string> = {
    admin: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    manager: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    server: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    chef: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    cashier: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      {/* Top Banner Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          {/* Branch Picker */}
          <div className="relative">
            <button
              id="branch-selector-btn"
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeBranch.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{activeBranch.code}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
            </button>

            {isBranchMenuOpen && (
              <div
                id="branch-dropdown"
                className="absolute left-0 mt-1.5 w-64 p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Select Location</div>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBranch(b);
                      setIsBranchMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between text-xs transition-colors ${
                      b.id === activeBranch.id
                        ? 'bg-amber-500/10 text-amber-500 font-semibold'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div>
                      <div>{b.name}</div>
                      <div className="text-[10px] text-zinc-400">{b.address}</div>
                    </div>
                    {b.id === activeBranch.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live POS Sync Active</span>
          </div>
        </div>

        {/* Right quick tools */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Data Button */}
          <button
            id="manual-refresh-btn"
            title="Refresh restaurant state"
            onClick={() => refreshAllData()}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-1.5 w-80 max-h-96 overflow-y-auto p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 z-50"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800 px-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Live Alerts</span>
                  <span className="text-[10px] text-zinc-400">{unreadNotifs.length} unread</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-400">No active notifications</div>
                ) : (
                  <div className="space-y-1.5">
                    {notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTab) setActiveView(notif.linkTab as AppView);
                          setIsNotifOpen(false);
                        }}
                        className={`p-2 rounded-md text-xs cursor-pointer transition-colors ${
                          notif.isRead
                            ? 'bg-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            : 'bg-amber-500/10 text-zinc-900 dark:text-zinc-100 border-l-2 border-amber-500'
                        }`}
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Role Switcher Pill */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider transition-colors ${
                roleColors[currentUser.role] || 'bg-zinc-800 text-zinc-200 border-zinc-700'
              }`}
            >
              <span>{currentUser.name}</span>
              <span className="opacity-75">({currentUser.role})</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isUserMenuOpen && (
              <div
                id="user-switch-menu"
                className="absolute right-0 mt-1.5 w-60 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 z-50"
              >
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Switch Active Role / Staff</div>
                <div className="space-y-1 my-1">
                  {staffList.map((stf) => (
                    <button
                      key={stf.id}
                      onClick={() => {
                        setCurrentUser(stf);
                        setIsUserMenuOpen(false);
                        if (stf.role === 'chef') setActiveView('kds');
                        else if (stf.role === 'server') setActiveView('pos');
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                        stf.id === currentUser.id
                          ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stf.role === 'admin' ? 'bg-rose-500' : stf.role === 'chef' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                        <span>{stf.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1 rounded bg-zinc-200 dark:bg-zinc-800">{stf.role}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsPinModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick PIN Lock / Switch</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveView('pos')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0 mr-4"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
              <span>Savory<span className="text-amber-500">OS</span></span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono font-normal">SaaS</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Next-Gen Restaurant Platform</div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-sm font-semibold shadow-amber-500/20 scale-[1.02]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
