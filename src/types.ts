export type StaffRole =
  | 'admin'
  | 'manager'
  | 'server'
  | 'waiter'
  | 'chef'
  | 'kitchen_staff'
  | 'bartender'
  | 'host'
  | 'cashier';

export interface StaffPermission {
  canManageMenu: boolean;
  canManageStaff: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  canCreateOrders: boolean;
  canVoidOrders: boolean;
  canApplyDiscounts: boolean;
  canAccessKDS: boolean;
  canManageInventory: boolean;
  canManageReservations: boolean;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  pin: string;
  role: StaffRole;
  branchId: string;
  branchName?: string;
  avatarUrl?: string;
  phone?: string;
  hourlyWage?: number;
  isActive: boolean;
  permissions?: any;
  shiftStartedAt?: string;
}

export interface RestaurantProfile {
  id: string;
  name: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  serviceChargeRate: number;
  logoUrl?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  defaultTipPercentages?: number[];
  allowOnlineOrders?: boolean;
}

export interface Branch {
  id: string;
  restaurantId?: string;
  name: string;
  code: string;
  address: string;
  city?: string;
  phone: string;
  email?: string;
  tablesCount?: number;
  isActive: boolean;
  operatingHours?: {
    open: string;
    close: string;
    daysOpen: string[];
  };
}

export type RestaurantBranch = Branch;

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'billing';
export type TableZone = 'Main Dining' | 'Patio & Garden' | 'Bar Area' | 'Rooftop Lounge' | 'VIP Private Room';

export interface RestaurantTable {
  id: string;
  branchId: string;
  number: string;
  zone: TableZone;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  assignedWaiterId?: string;
  assignedWaiterName?: string;
  currentGuestsCount?: number;
  occupiedSince?: string;
  notes?: string;
  qrCodeToken?: string;
  position?: {
    x: number;
    y: number;
  };
}

export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Halal'
  | 'Spicy'
  | 'Chef Special'
  | 'Contains Nuts'
  | 'Dairy-Free';

export type KitchenStation = 'Grill' | 'Saute' | 'Pizza' | 'Fryer' | 'Pantry' | 'Bar' | 'Dessert';

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItemModifier {
  id: string;
  name: string;
  required: boolean;
  maxSelection: number;
  options: ModifierOption[];
}

export interface MenuItemRecipeIngredient {
  inventoryItemId: string;
  ingredientName: string;
  quantityUsed: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  kitchenStation: KitchenStation;
  prepTimeMinutes: number;
  calories?: number;
  dietaryTags: DietaryTag[];
  isAvailable: boolean;
  imageUrl: string;
  modifiers?: MenuItemModifier[];
  recipe?: MenuItemRecipeIngredient[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  iconName: string;
  isActive: boolean;
}

export type OrderType = 'dine-in' | 'takeout' | 'delivery' | 'qr-mobile';
export type OrderStatus = 'pending' | 'confirmed' | 'prepping' | 'ready' | 'served' | 'completed' | 'cancelled';
export type OrderItemStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'voided';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
export type PaymentMethod = 'credit_card' | 'cash' | 'apple_pay' | 'google_pay' | 'gift_card';

export interface SelectedModifier {
  modifierId: string;
  modifierName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedModifiers?: SelectedModifier[];
  specialInstructions?: string;
  kitchenStation: KitchenStation;
  status: OrderItemStatus;
  kitchenTicketId?: string;
  startedCookingAt?: string;
  readyAt?: string;
}

export interface BillPayment {
  id: string;
  method: PaymentMethod;
  amount: number;
  tipAmount: number;
  paidAt: string;
  cardLast4?: string;
  transactionRef?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  orderType: OrderType;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  waiterId?: string;
  waiterName?: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  discountCode?: string;
  serviceChargeAmount: number;
  tipAmount: number;
  total: number;
  payments?: BillPayment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  orderType: OrderType;
  waiterName?: string;
  createdAt: string;
  items: {
    orderItemId: string;
    name: string;
    quantity: number;
    station: KitchenStation;
    modifiers: string[];
    specialInstructions?: string;
    status: OrderItemStatus;
  }[];
  urgency: 'normal' | 'warning' | 'urgent';
  elapsedMinutes: number;
  allReady: boolean;
}

export type ReservationStatus = 'confirmed' | 'arrived' | 'seated' | 'cancelled' | 'no-show' | 'no_show' | 'completed';

export interface Reservation {
  id: string;
  branchId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestsCount: number;
  reservationDate: string;
  reservationTime: string;
  tableId?: string;
  tableName?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
}

export type CustomerTag = string;

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  tags: CustomerTag[];
  visitsCount: number;
  totalSpend?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  loyaltyPoints?: number;
  lastVisitAt?: string;
  lastVisit?: string;
  allergies?: string[];
  favoriteDishes?: string[];
  dietaryPreferences?: string[];
  notes?: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type InventoryCategory = string;
export type InventoryUnit = 'kg' | 'g' | 'lb' | 'oz' | 'liter' | 'ml' | 'bottle' | 'unit' | 'box' | 'liters' | 'bottles' | 'pieces' | 'packs' | 'boxes';

export interface InventoryItem {
  id: string;
  sku?: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  minThreshold: number;
  maxCapacity?: number;
  unit: InventoryUnit | string;
  costPerUnit?: number;
  unitCost?: number;
  supplier?: string;
  supplierPhone?: string;
  lastRestockedAt?: string;
  status?: StockStatus;
}

export type NotificationType = 'order_new' | 'kitchen_ready' | 'low_stock' | 'table_assistance' | 'reservation_alert' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetRole?: StaffRole;
  linkTab?: string;
}

export interface AnalyticsSummary {
  todayRevenue?: number;
  todayOrdersCount?: number;
  todayAverageTicket?: number;
  activeTablesCount?: number;
  openOrdersCount?: number;
  weeklyRevenue?: { day: string; revenue: number; orders: number }[];
  categoryShare?: { category: string; amount: number; percentage: number }[];
  topSellingItems?: { name: string; soldCount: number; revenue: number; category: string }[];
  branchComparison?: { branchName: string; revenue: number; orders: number; activeTables: number }[];
  metrics: {
    totalRevenue: number;
    netSales: number;
    totalOrders: number;
    averageOrderValue: number;
    totalTips: number;
    totalTax: number;
    tableTurnoverRate: number;
  };
  hourlySales: { hour: string; sales: number; orders: number }[];
  categorySales: { categoryName: string; sales: number; itemsSold: number }[];
  bestSellers: { name: string; quantity: number; revenue: number }[];
  paymentMethodBreakdown: { method: string; count: number; amount?: number; total?: number }[];
}

export interface TestCaseResult {
  id: string;
  name: string;
  category: 'API' | 'Validation' | 'POS Engine' | 'KDS Bump Bar' | 'Inventory Auto-Depletion' | 'Role Security';
  passed: boolean;
  durationMs: number;
  details: string;
  timestamp: string;
}
