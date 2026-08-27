import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  RestaurantProfile,
  Branch,
  RestaurantTable,
  MenuCategory,
  MenuItem,
  Order,
  KitchenTicket,
  StaffUser,
  Reservation,
  Customer,
  InventoryItem,
  AppNotification,
  AnalyticsSummary,
  TestCaseResult,
  OrderItem,
  SelectedModifier,
} from '../types.ts';

export type AppView =
  | 'pos'
  | 'kds'
  | 'tables'
  | 'menu'
  | 'reservations'
  | 'customers'
  | 'inventory'
  | 'analytics'
  | 'staff'
  | 'settings'
  | 'customer-portal';

export interface CartItem extends OrderItem {}

interface AppContextType {
  // Theme & View
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Auth & Branch
  currentUser: StaffUser;
  setCurrentUser: (user: StaffUser) => void;
  activeBranch: Branch;
  setActiveBranch: (branch: Branch) => void;
  staffList: StaffUser[];
  loginWithPin: (pin: string) => Promise<boolean>;

  // Data
  profile: RestaurantProfile | null;
  branches: Branch[];
  tables: RestaurantTable[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  kitchenTickets: KitchenTicket[];
  reservations: Reservation[];
  customers: Customer[];
  inventory: InventoryItem[];
  notifications: AppNotification[];
  analytics: AnalyticsSummary | null;
  testResults: TestCaseResult[];
  isLoading: boolean;
  lastSyncTime: Date;

  // Actions
  refreshAllData: () => Promise<void>;
  updateTableStatus: (tableId: string, status: RestaurantTable['status'], notes?: string) => Promise<void>;
  createOrder: (orderPayload: Partial<Order>) => Promise<Order | null>;
  payOrder: (orderId: string, method: string, amount: number, tipAmount?: number) => Promise<Order | null>;
  bumpKitchenTicket: (orderId: string, nextStatus?: 'ready' | 'served' | 'prepping') => Promise<void>;
  toggleMenuItemAvailability: (itemId: string, isAvailable: boolean) => Promise<void>;
  createMenuItem: (item: Partial<MenuItem>) => Promise<boolean>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;
  adjustInventory: (itemId: string, delta: number) => Promise<void>;
  createReservation: (resData: Partial<Reservation>) => Promise<boolean>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<RestaurantProfile>) => Promise<boolean>;
  runAutomatedTestsSuite: () => Promise<TestCaseResult[]>;
  resetDemoData: () => Promise<void>;

  // POS Cart State
  cart: CartItem[];
  selectedTableForPOS: RestaurantTable | null;
  setSelectedTableForPOS: (tbl: RestaurantTable | null) => void;
  addToCart: (item: MenuItem, modifiers?: SelectedModifier[], instructions?: string) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartDiscount: number;
  setCartDiscount: (amt: number) => void;
  cartDiscountCode: string;
  setCartDiscountCode: (code: string) => void;
  cartTipPercent: number;
  setCartTipPercent: (pct: number) => void;
  guestNameForPOS: string;
  setGuestNameForPOS: (name: string) => void;
  orderTypeForPOS: Order['orderType'];
  setOrderTypeForPOS: (type: Order['orderType']) => void;

  // Modal helpers
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppView>('pos');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Data states
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch>({
    id: 'branch_dt',
    restaurantId: 'rest_01',
    name: 'Downtown Flagship',
    code: 'DT-01',
    address: '100 Culinary Way, Suite 400',
    city: 'Metropolis',
    phone: '(555) 839-2041',
    email: 'downtown@savoryprime.com',
    tablesCount: 16,
    isActive: true,
    operatingHours: { open: '11:00', close: '23:30', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  });

  const [currentUser, setCurrentUser] = useState<StaffUser>({
    id: 'stf_01',
    name: 'Alexander Hayes',
    email: 'alexander@savoryprime.com',
    pin: '1234',
    role: 'admin',
    branchId: 'branch_dt',
    branchName: 'Downtown Flagship',
    phone: '(555) 201-9081',
    isActive: true,
    permissions: {
      canManageMenu: true,
      canManageStaff: true,
      canManageSettings: true,
      canViewReports: true,
      canCreateOrders: true,
      canVoidOrders: true,
      canApplyDiscounts: true,
      canAccessKDS: true,
      canManageInventory: true,
      canManageReservations: true,
    },
  });

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableForPOS, setSelectedTableForPOS] = useState<RestaurantTable | null>(null);
  const [guestNameForPOS, setGuestNameForPOS] = useState<string>('');
  const [orderTypeForPOS, setOrderTypeForPOS] = useState<Order['orderType']>('dine-in');
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [cartDiscountCode, setCartDiscountCode] = useState<string>('');
  const [cartTipPercent, setCartTipPercent] = useState<number>(18);

  // Modals
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  // Sync with HTML dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const refreshAllData = useCallback(async () => {
    try {
      const [
        profRes,
        branchRes,
        tablesRes,
        catsRes,
        itemsRes,
        ordersRes,
        kdsRes,
        resRes,
        custRes,
        invRes,
        staffRes,
        notifRes,
        analyticsRes,
      ] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/branches').then((r) => r.json()),
        fetch(`/api/tables?branchId=${activeBranch.id}`).then((r) => r.json()),
        fetch('/api/menu/categories').then((r) => r.json()),
        fetch('/api/menu/items').then((r) => r.json()),
        fetch(`/api/orders?branchId=${activeBranch.id}`).then((r) => r.json()),
        fetch('/api/kds/tickets').then((r) => r.json()),
        fetch(`/api/reservations?branchId=${activeBranch.id}`).then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/inventory').then((r) => r.json()),
        fetch('/api/staff').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()),
      ]);

      if (profRes) setProfile(profRes);
      if (Array.isArray(branchRes)) setBranches(branchRes);
      if (Array.isArray(tablesRes)) setTables(tablesRes);
      if (Array.isArray(catsRes)) setCategories(catsRes);
      if (Array.isArray(itemsRes)) setMenuItems(itemsRes);
      if (Array.isArray(ordersRes)) setOrders(ordersRes);
      if (Array.isArray(kdsRes)) setKitchenTickets(kdsRes);
      if (Array.isArray(resRes)) setReservations(resRes);
      if (Array.isArray(custRes)) setCustomers(custRes);
      if (Array.isArray(invRes)) setInventory(invRes);
      if (Array.isArray(staffRes)) setStaffList(staffRes);
      if (Array.isArray(notifRes)) setNotifications(notifRes);
      if (analyticsRes) setAnalytics(analyticsRes);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Error syncing restaurant data:', err);
    }
  }, [activeBranch.id]);

  // Initial load & Polling interval
  useEffect(() => {
    refreshAllData();
    const interval = setInterval(() => {
      refreshAllData();
    }, 8000); // 8s live refresh
    return () => clearInterval(interval);
  }, [refreshAllData]);

  const loginWithPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsPinModalOpen(false);
        // Switch view if role is Chef to KDS, Server to POS
        if (data.user.role === 'chef') setActiveView('kds');
        else if (data.user.role === 'server') setActiveView('pos');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateTableStatus = async (tableId: string, status: RestaurantTable['status'], notes?: string) => {
    try {
      await fetch(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, assignedWaiterName: currentUser.name }),
      });
      refreshAllData();
    } catch (err) {
      console.error('Error updating table:', err);
    }
  };

  const createOrder = async (orderPayload: Partial<Order>): Promise<Order | null> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderPayload,
          branchId: activeBranch.id,
          waiterId: currentUser.id,
          waiterName: currentUser.name,
        }),
      });
      if (res.ok) {
        const created: Order = await res.json();
        clearCart();
        refreshAllData();
        return created;
      }
      return null;
    } catch (err) {
      console.error('Error creating order:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const payOrder = async (orderId: string, method: string, amount: number, tipAmount: number = 0): Promise<Order | null> => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, tipAmount }),
      });
      if (res.ok) {
        const updated: Order = await res.json();
        refreshAllData();
        return updated;
      }
      return null;
    } catch (err) {
      console.error('Error paying order:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const bumpKitchenTicket = async (orderId: string, nextStatus?: 'ready' | 'served' | 'prepping') => {
    try {
      await fetch(`/api/kds/tickets/${orderId}/bump`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStatus }),
      });
      refreshAllData();
    } catch (err) {
      console.error('Error bumping kitchen ticket:', err);
    }
  };

  const toggleMenuItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      await fetch(`/api/menu/items/${itemId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable }),
      });
      refreshAllData();
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  const createMenuItem = async (item: Partial<MenuItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshAllData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const adjustInventory = async (itemId: string, delta: number) => {
    try {
      await fetch(`/api/inventory/${itemId}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      refreshAllData();
    } catch (err) {
      console.error('Error adjusting inventory:', err);
    }
  };

  const createReservation = async (resData: Partial<Reservation>): Promise<boolean> => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resData, branchId: activeBranch.id }),
      });
      if (res.ok) {
        refreshAllData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      refreshAllData();
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('Error reading notification:', err);
    }
  };

  const updateProfile = async (updates: Partial<RestaurantProfile>): Promise<boolean> => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const runAutomatedTestsSuite = async (): Promise<TestCaseResult[]> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tests/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTestResults(data.results || []);
        return data.results || [];
      }
      return [];
    } catch (err) {
      console.error('Error running test suite:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemoData = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/reset-demo-data', { method: 'POST' });
      await refreshAllData();
    } finally {
      setIsLoading(false);
    }
  };

  // Cart operations
  const addToCart = (item: MenuItem, modifiers: SelectedModifier[] = [], instructions?: string) => {
    const existingIndex = cart.findIndex(
      (ci) =>
        ci.menuItemId === item.id &&
        JSON.stringify(ci.selectedModifiers) === JSON.stringify(modifiers) &&
        ci.specialInstructions === instructions
    );

    if (existingIndex !== -1) {
      setCart((prev) =>
        prev.map((ci, idx) => (idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci))
      );
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        selectedModifiers: modifiers,
        specialInstructions: instructions,
        kitchenStation: item.kitchenStation,
        status: 'cooking',
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTableForPOS(null);
    setGuestNameForPOS('');
    setCartDiscount(0);
    setCartDiscountCode('');
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        activeView,
        setActiveView,
        currentUser,
        setCurrentUser,
        activeBranch,
        setActiveBranch,
        staffList,
        loginWithPin,
        profile,
        branches,
        tables,
        categories,
        menuItems,
        orders,
        kitchenTickets,
        reservations,
        customers,
        inventory,
        notifications,
        analytics,
        testResults,
        isLoading,
        lastSyncTime,
        refreshAllData,
        updateTableStatus,
        createOrder,
        payOrder,
        bumpKitchenTicket,
        toggleMenuItemAvailability,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        adjustInventory,
        createReservation,
        updateReservationStatus,
        markNotificationRead,
        updateProfile,
        runAutomatedTestsSuite,
        resetDemoData,
        cart,
        selectedTableForPOS,
        setSelectedTableForPOS,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartDiscount,
        setCartDiscount,
        cartDiscountCode,
        setCartDiscountCode,
        cartTipPercent,
        setCartTipPercent,
        guestNameForPOS,
        setGuestNameForPOS,
        orderTypeForPOS,
        setOrderTypeForPOS,
        activeReceiptOrder,
        setActiveReceiptOrder,
        isPinModalOpen,
        setIsPinModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
