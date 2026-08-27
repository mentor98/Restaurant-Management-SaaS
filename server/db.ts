import fs from 'fs';
import path from 'path';
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
} from '../src/types.ts';

export interface DatabaseSchema {
  profile: RestaurantProfile;
  branches: Branch[];
  tables: RestaurantTable[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  staff: StaffUser[];
  reservations: Reservation[];
  customers: Customer[];
  inventory: InventoryItem[];
  notifications: AppNotification[];
  testResults: TestCaseResult[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function createSeedData(): DatabaseSchema {
  const profile: RestaurantProfile = {
    id: 'rest_01',
    name: 'Savory Prime Grill & Bistro',
    tagline: 'Artisanal Wood-Fired Cuisine & Craft Cocktails',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0.0825, // 8.25%
    serviceChargeRate: 0.10, // 10%
    receiptHeader: 'SAVORY PRIME GRILL & BISTRO\n100 Culinary Way, Suite 400\nTel: (555) 839-2041\nwww.savoryprime.com',
    receiptFooter: 'Thank you for dining with us!\nGratuity is shared among our kitchen & front of house teams.',
    defaultTipPercentages: [15, 18, 20, 25],
    allowOnlineOrders: true,
  };

  const branches: Branch[] = [
    {
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
      operatingHours: {
        open: '11:00',
        close: '23:30',
        daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    },
    {
      id: 'branch_up',
      restaurantId: 'rest_01',
      name: 'Uptown Bistro & Terrace',
      code: 'UP-02',
      address: '742 Highland Avenue',
      city: 'Metropolis',
      phone: '(555) 839-8800',
      email: 'uptown@savoryprime.com',
      tablesCount: 12,
      isActive: true,
      operatingHours: {
        open: '11:30',
        close: '22:30',
        daysOpen: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    },
    {
      id: 'branch_wf',
      restaurantId: 'rest_01',
      name: 'Waterfront Sunset Lounge',
      code: 'WF-03',
      address: '50 Marina Boulevard',
      city: 'Metropolis Bay',
      phone: '(555) 839-3310',
      email: 'waterfront@savoryprime.com',
      tablesCount: 14,
      isActive: true,
      operatingHours: {
        open: '12:00',
        close: '01:00',
        daysOpen: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    },
  ];

  const tables: RestaurantTable[] = [
    { id: 'tbl_01', branchId: 'branch_dt', number: 'T-01', zone: 'Main Dining', capacity: 2, status: 'occupied', currentOrderId: 'ord_101', assignedWaiterName: 'Elena Rostova', currentGuestsCount: 2, occupiedSince: new Date(Date.now() - 35 * 60000).toISOString(), position: { x: 100, y: 80 } },
    { id: 'tbl_02', branchId: 'branch_dt', number: 'T-02', zone: 'Main Dining', capacity: 4, status: 'occupied', currentOrderId: 'ord_102', assignedWaiterName: 'Marco Bellini', currentGuestsCount: 3, occupiedSince: new Date(Date.now() - 50 * 60000).toISOString(), position: { x: 220, y: 80 } },
    { id: 'tbl_03', branchId: 'branch_dt', number: 'T-03', zone: 'Main Dining', capacity: 4, status: 'available', position: { x: 340, y: 80 } },
    { id: 'tbl_04', branchId: 'branch_dt', number: 'T-04', zone: 'Main Dining', capacity: 6, status: 'reserved', notes: 'Anniversary couple (VIP)', position: { x: 460, y: 80 } },
    { id: 'tbl_05', branchId: 'branch_dt', number: 'T-05', zone: 'Main Dining', capacity: 4, status: 'billing', currentOrderId: 'ord_103', assignedWaiterName: 'Elena Rostova', currentGuestsCount: 4, occupiedSince: new Date(Date.now() - 75 * 60000).toISOString(), position: { x: 100, y: 200 } },
    { id: 'tbl_06', branchId: 'branch_dt', number: 'T-06', zone: 'Main Dining', capacity: 8, status: 'cleaning', notes: 'Needs sanitizing and fresh linen', position: { x: 240, y: 200 } },
    { id: 'tbl_07', branchId: 'branch_dt', number: 'P-01', zone: 'Patio & Garden', capacity: 2, status: 'available', position: { x: 100, y: 340 } },
    { id: 'tbl_08', branchId: 'branch_dt', number: 'P-02', zone: 'Patio & Garden', capacity: 4, status: 'occupied', currentOrderId: 'ord_104', assignedWaiterName: 'Sarah Jenkins', currentGuestsCount: 4, occupiedSince: new Date(Date.now() - 20 * 60000).toISOString(), position: { x: 220, y: 340 } },
    { id: 'tbl_09', branchId: 'branch_dt', number: 'P-03', zone: 'Patio & Garden', capacity: 4, status: 'available', position: { x: 340, y: 340 } },
    { id: 'tbl_10', branchId: 'branch_dt', number: 'B-01', zone: 'Bar Area', capacity: 2, status: 'available', position: { x: 480, y: 220 } },
    { id: 'tbl_11', branchId: 'branch_dt', number: 'B-02', zone: 'Bar Area', capacity: 2, status: 'occupied', currentOrderId: 'ord_105', assignedWaiterName: 'Devon Vance', currentGuestsCount: 1, occupiedSince: new Date(Date.now() - 15 * 60000).toISOString(), position: { x: 480, y: 300 } },
    { id: 'tbl_12', branchId: 'branch_dt', number: 'VIP-1', zone: 'VIP Private Room', capacity: 12, status: 'reserved', notes: 'Corporate Dinner - TechCorp', position: { x: 100, y: 480 } },
  ];

  const categories: MenuCategory[] = [
    { id: 'cat_starters', name: 'Starters & Crudo', description: 'Appetizers, raw bar, and sharable bites', displayOrder: 1, iconName: 'Utensils', isActive: true },
    { id: 'cat_mains', name: 'Prime Steaks & Grills', description: 'Dry-aged cuts cooked over oak and charcoal', displayOrder: 2, iconName: 'Flame', isActive: true },
    { id: 'cat_pasta', name: 'Artisan Pasta & Risotto', description: 'Handcrafted daily with Italian semolina', displayOrder: 3, iconName: 'Wheat', isActive: true },
    { id: 'cat_pizza', name: 'Wood-Fired Pizza', description: '72-hour fermented sourdough crust', displayOrder: 4, iconName: 'Disc', isActive: true },
    { id: 'cat_seafood', name: 'Coastal Seafood', description: 'Wild-caught fish and crustaceans', displayOrder: 5, iconName: 'Fish', isActive: true },
    { id: 'cat_desserts', name: 'Decadent Desserts', description: 'Pastry chef specials & sweet finishes', displayOrder: 6, iconName: 'Cake', isActive: true },
    { id: 'cat_cocktails', name: 'Signature Cocktails', description: 'House infusions, smoke, and botanicals', displayOrder: 7, iconName: 'Wine', isActive: true },
    { id: 'cat_beverages', name: 'Wine & Non-Alcoholic', description: 'Curated vintages, artisanal sodas & coffees', displayOrder: 8, iconName: 'Coffee', isActive: true },
  ];

  const menuItems: MenuItem[] = [
    {
      id: 'item_truffle_fries',
      categoryId: 'cat_starters',
      categoryName: 'Starters & Crudo',
      name: 'Black Truffle & Parmesan Fries',
      description: 'Hand-cut Yukon golds, 24-month Parmigiano Reggiano, white truffle oil, roasted garlic aioli.',
      price: 16.0,
      costPrice: 3.2,
      kitchenStation: 'Fryer',
      prepTimeMinutes: 8,
      calories: 520,
      dietaryTags: ['Vegetarian'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
      modifiers: [
        {
          id: 'mod_dip',
          name: 'Extra Dipping Sauce',
          required: false,
          maxSelection: 2,
          options: [
            { id: 'opt_aioli', name: 'Truffle Garlic Aioli', priceDelta: 2.0 },
            { id: 'opt_chipotle', name: 'Smoked Chipotle Mayo', priceDelta: 1.5 },
          ],
        },
      ],
      recipe: [
        { inventoryItemId: 'inv_potatoes', ingredientName: 'Yukon Gold Potatoes', quantityUsed: 0.35, unit: 'kg' },
        { inventoryItemId: 'inv_parmesan', ingredientName: 'Parmigiano Reggiano', quantityUsed: 0.04, unit: 'kg' },
        { inventoryItemId: 'inv_truffle_oil', ingredientName: 'White Truffle Oil', quantityUsed: 0.015, unit: 'liters' },
      ],
    },
    {
      id: 'item_wagyu_carpaccio',
      categoryId: 'cat_starters',
      categoryName: 'Starters & Crudo',
      name: 'A5 Wagyu Beef Carpaccio',
      description: 'Paper-thin Miyazaki Wagyu, caper berries, micro arugula, pickled shallots, cured egg yolk, truffle vinaigrette.',
      price: 26.0,
      costPrice: 7.5,
      kitchenStation: 'Pantry',
      prepTimeMinutes: 6,
      calories: 380,
      dietaryTags: ['Chef Special', 'Gluten-Free'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      recipe: [
        { inventoryItemId: 'inv_wagyu_beef', ingredientName: 'A5 Wagyu Strip', quantityUsed: 0.12, unit: 'kg' },
        { inventoryItemId: 'inv_arugula', ingredientName: 'Micro Greens', quantityUsed: 0.03, unit: 'kg' },
      ],
    },
    {
      id: 'item_ribeye',
      categoryId: 'cat_mains',
      categoryName: 'Prime Steaks & Grills',
      name: '45-Day Dry Aged Bone-In Ribeye (18oz)',
      description: 'USDA Prime dry-aged ribeye seared over oak wood, rosemary bone marrow butter, blistered vine tomatoes.',
      price: 68.0,
      costPrice: 22.0,
      kitchenStation: 'Grill',
      prepTimeMinutes: 18,
      calories: 1100,
      dietaryTags: ['Chef Special', 'Gluten-Free'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
      modifiers: [
        {
          id: 'mod_doneness',
          name: 'Meat Temperature',
          required: true,
          maxSelection: 1,
          options: [
            { id: 'opt_rare', name: 'Rare (Cool Red Center)', priceDelta: 0 },
            { id: 'opt_med_rare', name: 'Medium Rare (Warm Red)', priceDelta: 0 },
            { id: 'opt_med', name: 'Medium (Pink Center)', priceDelta: 0 },
            { id: 'opt_med_well', name: 'Medium Well (Slight Pink)', priceDelta: 0 },
          ],
        },
        {
          id: 'mod_crust',
          name: 'Steak Enhancements',
          required: false,
          maxSelection: 2,
          options: [
            { id: 'opt_crab_oscar', name: 'Jumbo Lump Crab Oscar', priceDelta: 16.0 },
            { id: 'opt_truffle_butter', name: 'Black Truffle Butter', priceDelta: 4.0 },
            { id: 'opt_blue_cheese', name: 'Point Reyes Blue Crust', priceDelta: 5.0 },
          ],
        },
      ],
      recipe: [
        { inventoryItemId: 'inv_ribeye_beef', ingredientName: 'Dry-Aged Ribeye', quantityUsed: 0.55, unit: 'kg' },
        { inventoryItemId: 'inv_butter', ingredientName: 'Artisan Butter', quantityUsed: 0.04, unit: 'kg' },
      ],
    },
    {
      id: 'item_truffle_pasta',
      categoryId: 'cat_pasta',
      categoryName: 'Artisan Pasta & Risotto',
      name: 'Wild Mushroom & Black Truffle Tagliatelle',
      description: 'House-made egg tagliatelle, chanterelles, porcini cream, white wine reduction, fresh shaved Norcia truffle.',
      price: 32.0,
      costPrice: 6.8,
      kitchenStation: 'Saute',
      prepTimeMinutes: 12,
      calories: 640,
      dietaryTags: ['Vegetarian'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281545?w=600&auto=format&fit=crop&q=80',
      modifiers: [
        {
          id: 'mod_pasta_protein',
          name: 'Add Protein',
          required: false,
          maxSelection: 1,
          options: [
            { id: 'opt_grilled_shrimp', name: 'Wild Gulf Prawns (3 pcs)', priceDelta: 12.0 },
            { id: 'opt_smoked_chicken', name: 'Organic Grilled Chicken', priceDelta: 8.0 },
          ],
        },
      ],
      recipe: [
        { inventoryItemId: 'inv_pasta_dough', ingredientName: 'Fresh Pasta Dough', quantityUsed: 0.22, unit: 'kg' },
        { inventoryItemId: 'inv_cream', ingredientName: 'Heavy Cream', quantityUsed: 0.1, unit: 'liters' },
        { inventoryItemId: 'inv_mushrooms', ingredientName: 'Wild Mushrooms', quantityUsed: 0.15, unit: 'kg' },
      ],
    },
    {
      id: 'item_burrata_pizza',
      categoryId: 'cat_pizza',
      categoryName: 'Wood-Fired Pizza',
      name: 'Pugliese Burrata & Hot Honey Pizza',
      description: 'San Marzano D.O.P. tomatoes, whole fresh burrata, spicy Calabrian soppressata, hot chili honey drizzle, fresh basil.',
      price: 24.0,
      costPrice: 4.9,
      kitchenStation: 'Pizza',
      prepTimeMinutes: 10,
      calories: 820,
      dietaryTags: ['Chef Special', 'Spicy'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      modifiers: [
        {
          id: 'mod_pizza_crust',
          name: 'Crust Style',
          required: false,
          maxSelection: 1,
          options: [
            { id: 'opt_extra_crisp', name: 'Extra Well Done / Charred', priceDelta: 0 },
            { id: 'opt_gf_crust', name: 'Gluten-Free Cauliflower Crust', priceDelta: 4.5 },
          ],
        },
      ],
      recipe: [
        { inventoryItemId: 'inv_pizza_dough', ingredientName: 'Fermented Pizza Dough', quantityUsed: 1, unit: 'pieces' },
        { inventoryItemId: 'inv_burrata', ingredientName: 'Fresh Burrata', quantityUsed: 1, unit: 'pieces' },
        { inventoryItemId: 'inv_tomato_sauce', ingredientName: 'San Marzano Sauce', quantityUsed: 0.12, unit: 'liters' },
      ],
    },
    {
      id: 'item_chilean_seabass',
      categoryId: 'cat_seafood',
      categoryName: 'Coastal Seafood',
      name: 'Miso-Glazed Chilean Sea Bass',
      description: 'Sweet red miso glaze, baby bok choy, dashi ginger reduction, lotus root chips, scallion oil.',
      price: 48.0,
      costPrice: 15.2,
      kitchenStation: 'Saute',
      prepTimeMinutes: 15,
      calories: 590,
      dietaryTags: ['Gluten-Free', 'Chef Special'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
      recipe: [
        { inventoryItemId: 'inv_seabass', ingredientName: 'Chilean Sea Bass Fillet', quantityUsed: 0.25, unit: 'kg' },
      ],
    },
    {
      id: 'item_chocolate_fondant',
      categoryId: 'cat_desserts',
      categoryName: 'Decadent Desserts',
      name: 'Molten Valrhona Chocolate Lava Cake',
      description: '70% dark Valrhona center, Tahitian vanilla bean gelato, raspberry coulis, gold leaf flakes.',
      price: 15.0,
      costPrice: 2.8,
      kitchenStation: 'Dessert',
      prepTimeMinutes: 10,
      calories: 490,
      dietaryTags: ['Vegetarian'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
      recipe: [
        { inventoryItemId: 'inv_chocolate', ingredientName: 'Valrhona Chocolate', quantityUsed: 0.1, unit: 'kg' },
        { inventoryItemId: 'inv_ice_cream', ingredientName: 'Vanilla Gelato', quantityUsed: 0.08, unit: 'liters' },
      ],
    },
    {
      id: 'item_smoked_old_fashioned',
      categoryId: 'cat_cocktails',
      categoryName: 'Signature Cocktails',
      name: 'Hickory Smoked Old Fashioned',
      description: 'Small batch bourbon, Demerara syrup, Angostura & orange bitters, smoked under a glass cloche with hickory chips.',
      price: 19.0,
      costPrice: 3.5,
      kitchenStation: 'Bar',
      prepTimeMinutes: 4,
      calories: 210,
      dietaryTags: ['Chef Special'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
      recipe: [
        { inventoryItemId: 'inv_bourbon', ingredientName: 'Craft Bourbon', quantityUsed: 0.06, unit: 'liters' },
      ],
    },
    {
      id: 'item_lavender_sparkler',
      categoryId: 'cat_beverages',
      categoryName: 'Wine & Non-Alcoholic',
      name: 'Botanical Lavender Yuzu Fizz (Mocktail)',
      description: 'Distilled seedlip botanical, house lavender syrup, Japanese yuzu juice, sparkling mineral water.',
      price: 11.0,
      costPrice: 1.6,
      kitchenStation: 'Bar',
      prepTimeMinutes: 3,
      calories: 90,
      dietaryTags: ['Vegan', 'Gluten-Free'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const staff: StaffUser[] = [
    {
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
    },
    {
      id: 'stf_02',
      name: 'Chef Marcus Laurent',
      email: 'marcus@savoryprime.com',
      pin: '5555',
      role: 'chef',
      branchId: 'branch_dt',
      branchName: 'Downtown Flagship',
      phone: '(555) 201-9082',
      isActive: true,
      permissions: {
        canManageMenu: true,
        canManageStaff: false,
        canManageSettings: false,
        canViewReports: false,
        canCreateOrders: false,
        canVoidOrders: false,
        canApplyDiscounts: false,
        canAccessKDS: true,
        canManageInventory: true,
        canManageReservations: false,
      },
    },
    {
      id: 'stf_03',
      name: 'Elena Rostova',
      email: 'elena@savoryprime.com',
      pin: '1111',
      role: 'server',
      branchId: 'branch_dt',
      branchName: 'Downtown Flagship',
      phone: '(555) 201-9083',
      isActive: true,
      permissions: {
        canManageMenu: false,
        canManageStaff: false,
        canManageSettings: false,
        canViewReports: false,
        canCreateOrders: true,
        canVoidOrders: false,
        canApplyDiscounts: true,
        canAccessKDS: true,
        canManageInventory: false,
        canManageReservations: true,
      },
    },
    {
      id: 'stf_04',
      name: 'Marco Bellini',
      email: 'marco@savoryprime.com',
      pin: '2222',
      role: 'manager',
      branchId: 'branch_dt',
      branchName: 'Downtown Flagship',
      phone: '(555) 201-9084',
      isActive: true,
      permissions: {
        canManageMenu: true,
        canManageStaff: true,
        canManageSettings: false,
        canViewReports: true,
        canCreateOrders: true,
        canVoidOrders: true,
        canApplyDiscounts: true,
        canAccessKDS: true,
        canManageInventory: true,
        canManageReservations: true,
      },
    },
    {
      id: 'stf_05',
      name: 'Devon Vance',
      email: 'devon@savoryprime.com',
      pin: '3333',
      role: 'cashier',
      branchId: 'branch_dt',
      branchName: 'Downtown Flagship',
      phone: '(555) 201-9085',
      isActive: true,
      permissions: {
        canManageMenu: false,
        canManageStaff: false,
        canManageSettings: false,
        canViewReports: false,
        canCreateOrders: true,
        canVoidOrders: false,
        canApplyDiscounts: true,
        canAccessKDS: false,
        canManageInventory: false,
        canManageReservations: true,
      },
    },
  ];

  const inventory: InventoryItem[] = [
    { id: 'inv_ribeye_beef', sku: 'MT-RIB-01', name: 'Prime Dry-Aged Ribeye Beef', category: 'Meat & Poultry', currentStock: 18.5, minThreshold: 10.0, maxCapacity: 40.0, unit: 'kg', unitCost: 38.0, supplier: 'Heritage Meats Co.', supplierPhone: '(555) 789-0111', lastRestockedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'in_stock' },
    { id: 'inv_wagyu_beef', sku: 'MT-WAG-02', name: 'A5 Miyazaki Wagyu Loin', category: 'Meat & Poultry', currentStock: 4.2, minThreshold: 5.0, maxCapacity: 15.0, unit: 'kg', unitCost: 65.0, supplier: 'Tokyo Gourmet Import', supplierPhone: '(555) 789-0222', lastRestockedAt: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'low_stock' },
    { id: 'inv_burrata', sku: 'DY-BUR-01', name: 'Fresh Artisan Burrata Balls', category: 'Dairy & Cheese', currentStock: 28, minThreshold: 12, maxCapacity: 60, unit: 'pieces', unitCost: 3.5, supplier: 'Puglia Dairy House', supplierPhone: '(555) 789-0333', lastRestockedAt: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'in_stock' },
    { id: 'inv_parmesan', sku: 'DY-PAR-02', name: 'Parmigiano Reggiano 24-Mo', category: 'Dairy & Cheese', currentStock: 14.0, minThreshold: 6.0, maxCapacity: 30.0, unit: 'kg', unitCost: 24.0, supplier: 'ItalCheese Importers', lastRestockedAt: new Date(Date.now() - 6 * 86400000).toISOString(), status: 'in_stock' },
    { id: 'inv_truffle_oil', sku: 'DG-TRU-01', name: 'Urbani White Truffle Oil', category: 'Dry Goods & Spices', currentStock: 1.2, minThreshold: 2.0, maxCapacity: 8.0, unit: 'liters', unitCost: 75.0, supplier: 'Urbani Truffles USA', lastRestockedAt: new Date(Date.now() - 10 * 86400000).toISOString(), status: 'low_stock' },
    { id: 'inv_seabass', sku: 'SF-BAS-01', name: 'Fresh Chilean Sea Bass Fillets', category: 'Seafood', currentStock: 8.0, minThreshold: 6.0, maxCapacity: 20.0, unit: 'kg', unitCost: 44.0, supplier: 'Pacific Coast Fishery', lastRestockedAt: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'in_stock' },
    { id: 'inv_bourbon', sku: 'BV-BRB-01', name: 'Woodford Reserve Small Batch', category: 'Beverages & Spirits', currentStock: 14, minThreshold: 6, maxCapacity: 36, unit: 'bottles', unitCost: 32.0, supplier: 'Metro Liquor Distributors', lastRestockedAt: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'in_stock' },
    { id: 'inv_potatoes', sku: 'PR-POT-01', name: 'Organic Yukon Gold Potatoes', category: 'Produce', currentStock: 45.0, minThreshold: 20.0, maxCapacity: 100.0, unit: 'kg', unitCost: 2.2, supplier: 'Valley Fresh Farms', lastRestockedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'in_stock' },
  ];

  const customers: Customer[] = [
    {
      id: 'cust_01',
      name: 'Victoria Sterling',
      email: 'victoria.s@sterlingcorp.com',
      phone: '(555) 441-9920',
      tags: ['VIP', 'Wine Club', 'High Spender'],
      visitsCount: 14,
      totalSpent: 2840.0,
      averageOrderValue: 202.85,
      lastVisit: new Date(Date.now() - 3 * 86400000).toISOString(),
      favoriteDishes: ['45-Day Dry Aged Bone-In Ribeye (18oz)', 'Hickory Smoked Old Fashioned'],
      dietaryPreferences: ['Prefers booths', 'Table 4 or VIP Room'],
      notes: 'Always requests Sommelier wine pairings. Celebrating wedding anniversary in October.',
    },
    {
      id: 'cust_02',
      name: 'David Chen',
      email: 'david.chen@innovate.io',
      phone: '(555) 332-1100',
      tags: ['Regular'],
      visitsCount: 8,
      totalSpent: 920.0,
      averageOrderValue: 115.0,
      lastVisit: new Date(Date.now() - 7 * 86400000).toISOString(),
      favoriteDishes: ['Pugliese Burrata & Hot Honey Pizza', 'A5 Wagyu Beef Carpaccio'],
      dietaryPreferences: ['No shellfish'],
    },
    {
      id: 'cust_03',
      name: 'Sophia Patel',
      email: 'sophia.p@horizonmedia.net',
      phone: '(555) 781-4433',
      tags: ['Allergy Alert', 'Regular'],
      visitsCount: 6,
      totalSpent: 750.0,
      averageOrderValue: 125.0,
      lastVisit: new Date(Date.now() - 12 * 86400000).toISOString(),
      favoriteDishes: ['Wild Mushroom & Black Truffle Tagliatelle'],
      dietaryPreferences: ['Severe peanut allergy', 'Vegetarian preferred'],
      notes: 'Ensure clean cookware when prepping pasta.',
    },
  ];

  const reservations: Reservation[] = [
    {
      id: 'res_01',
      branchId: 'branch_dt',
      customerName: 'Jonathan & Claire Vance',
      customerPhone: '(555) 887-2130',
      customerEmail: 'jvance@finance.org',
      guestsCount: 2,
      reservationDate: new Date().toISOString().split('T')[0],
      reservationTime: '19:30',
      tableId: 'tbl_04',
      tableName: 'T-04',
      status: 'confirmed',
      specialRequests: 'Window seat if possible, 5th anniversary celebration.',
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
    {
      id: 'res_02',
      branchId: 'branch_dt',
      customerName: 'TechCorp Executive Board',
      customerPhone: '(555) 441-9920',
      customerEmail: 'events@techcorp.com',
      guestsCount: 10,
      reservationDate: new Date().toISOString().split('T')[0],
      reservationTime: '20:00',
      tableId: 'tbl_12',
      tableName: 'VIP-1',
      status: 'confirmed',
      specialRequests: 'Pre-ordered 3 bottles of Cabernet. High privacy required.',
      createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    },
    {
      id: 'res_03',
      branchId: 'branch_dt',
      customerName: 'Dr. Robert Miller',
      customerPhone: '(555) 902-3341',
      guestsCount: 4,
      reservationDate: new Date().toISOString().split('T')[0],
      reservationTime: '18:15',
      tableId: 'tbl_02',
      tableName: 'T-02',
      status: 'seated',
      specialRequests: 'Celebrating daughter medical school graduation.',
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord_101',
      orderNumber: '#1081',
      branchId: 'branch_dt',
      orderType: 'dine-in',
      tableId: 'tbl_01',
      tableName: 'T-01',
      customerName: 'Victoria Sterling',
      customerId: 'cust_01',
      waiterId: 'stf_03',
      waiterName: 'Elena Rostova',
      status: 'prepping',
      paymentStatus: 'unpaid',
      subtotal: 103.0,
      taxAmount: 8.5,
      discountAmount: 0,
      serviceChargeAmount: 10.3,
      tipAmount: 0,
      total: 121.8,
      payments: [],
      notes: 'Customer prefers extra crispy fries.',
      createdAt: new Date(Date.now() - 32 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
      items: [
        {
          id: 'oi_101_1',
          menuItemId: 'item_wagyu_carpaccio',
          name: 'A5 Wagyu Beef Carpaccio',
          price: 26.0,
          quantity: 1,
          selectedModifiers: [],
          kitchenStation: 'Pantry',
          status: 'ready',
          readyAt: new Date(Date.now() - 12 * 60000).toISOString(),
        },
        {
          id: 'oi_101_2',
          menuItemId: 'item_ribeye',
          name: '45-Day Dry Aged Bone-In Ribeye (18oz)',
          price: 68.0,
          quantity: 1,
          selectedModifiers: [
            { modifierId: 'mod_doneness', modifierName: 'Meat Temperature', optionId: 'opt_med_rare', optionName: 'Medium Rare (Warm Red)', priceDelta: 0 },
            { modifierId: 'mod_crust', modifierName: 'Steak Enhancements', optionId: 'opt_truffle_butter', optionName: 'Black Truffle Butter', priceDelta: 4.0 },
          ],
          kitchenStation: 'Grill',
          status: 'cooking',
          startedCookingAt: new Date(Date.now() - 14 * 60000).toISOString(),
        },
        {
          id: 'oi_101_3',
          menuItemId: 'item_smoked_old_fashioned',
          name: 'Hickory Smoked Old Fashioned',
          price: 19.0,
          quantity: 1,
          selectedModifiers: [],
          kitchenStation: 'Bar',
          status: 'served',
        },
      ],
    },
    {
      id: 'ord_102',
      orderNumber: '#1082',
      branchId: 'branch_dt',
      orderType: 'dine-in',
      tableId: 'tbl_02',
      tableName: 'T-02',
      customerName: 'Dr. Robert Miller',
      waiterId: 'stf_04',
      waiterName: 'Marco Bellini',
      status: 'prepping',
      paymentStatus: 'unpaid',
      subtotal: 120.0,
      taxAmount: 9.9,
      discountAmount: 0,
      serviceChargeAmount: 12.0,
      tipAmount: 0,
      total: 141.9,
      payments: [],
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
      items: [
        {
          id: 'oi_102_1',
          menuItemId: 'item_truffle_fries',
          name: 'Black Truffle & Parmesan Fries',
          price: 16.0,
          quantity: 1,
          selectedModifiers: [
            { modifierId: 'mod_dip', modifierName: 'Extra Dipping Sauce', optionId: 'opt_aioli', optionName: 'Truffle Garlic Aioli', priceDelta: 2.0 },
          ],
          kitchenStation: 'Fryer',
          status: 'served',
        },
        {
          id: 'oi_102_2',
          menuItemId: 'item_burrata_pizza',
          name: 'Pugliese Burrata & Hot Honey Pizza',
          price: 24.0,
          quantity: 2,
          selectedModifiers: [],
          kitchenStation: 'Pizza',
          status: 'cooking',
          startedCookingAt: new Date(Date.now() - 8 * 60000).toISOString(),
        },
        {
          id: 'oi_102_3',
          menuItemId: 'item_truffle_pasta',
          name: 'Wild Mushroom & Black Truffle Tagliatelle',
          price: 32.0,
          quantity: 1,
          selectedModifiers: [
            { modifierId: 'mod_pasta_protein', modifierName: 'Add Protein', optionId: 'opt_grilled_shrimp', optionName: 'Wild Gulf Prawns (3 pcs)', priceDelta: 12.0 },
          ],
          kitchenStation: 'Saute',
          status: 'cooking',
          startedCookingAt: new Date(Date.now() - 10 * 60000).toISOString(),
        },
      ],
    },
    {
      id: 'ord_103',
      orderNumber: '#1083',
      branchId: 'branch_dt',
      orderType: 'dine-in',
      tableId: 'tbl_05',
      tableName: 'T-05',
      customerName: 'Sophia Patel Party',
      waiterId: 'stf_03',
      waiterName: 'Elena Rostova',
      status: 'served',
      paymentStatus: 'unpaid',
      subtotal: 185.0,
      taxAmount: 15.26,
      discountAmount: 18.5,
      discountCode: 'VIP10',
      serviceChargeAmount: 18.5,
      tipAmount: 0,
      total: 200.26,
      payments: [],
      createdAt: new Date(Date.now() - 70 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
      items: [
        {
          id: 'oi_103_1',
          menuItemId: 'item_chilean_seabass',
          name: 'Miso-Glazed Chilean Sea Bass',
          price: 48.0,
          quantity: 2,
          selectedModifiers: [],
          kitchenStation: 'Saute',
          status: 'served',
        },
        {
          id: 'oi_103_2',
          menuItemId: 'item_ribeye',
          name: '45-Day Dry Aged Bone-In Ribeye (18oz)',
          price: 68.0,
          quantity: 1,
          selectedModifiers: [
            { modifierId: 'mod_doneness', modifierName: 'Meat Temperature', optionId: 'opt_med', optionName: 'Medium (Pink Center)', priceDelta: 0 },
          ],
          kitchenStation: 'Grill',
          status: 'served',
        },
        {
          id: 'oi_103_3',
          menuItemId: 'item_chocolate_fondant',
          name: 'Molten Valrhona Chocolate Lava Cake',
          price: 15.0,
          quantity: 2,
          selectedModifiers: [],
          kitchenStation: 'Dessert',
          status: 'served',
        },
      ],
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: 'notif_01',
      type: 'kitchen_ready',
      title: 'Kitchen Ticket Ready',
      message: 'Table T-01: A5 Wagyu Beef Carpaccio is ready on the pass.',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      isRead: false,
      targetRole: 'server',
      linkTab: 'pos',
    },
    {
      id: 'notif_02',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'A5 Miyazaki Wagyu Loin is down to 4.2 kg (Threshold: 5.0 kg).',
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      isRead: false,
      targetRole: 'admin',
      linkTab: 'inventory',
    },
    {
      id: 'notif_03',
      type: 'reservation_alert',
      title: 'VIP Arrival Reminder',
      message: 'Jonathan & Claire Vance (Table T-04) arriving in 30 minutes.',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      isRead: false,
      targetRole: 'manager',
      linkTab: 'reservations',
    },
  ];

  return {
    profile,
    branches,
    tables,
    categories,
    menuItems,
    orders,
    staff,
    reservations,
    customers,
    inventory,
    notifications,
    testResults: [],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing db.json, generating fresh seed data:', err);
    }
    const seed = createSeedData();
    this.persist(seed);
    return seed;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  public resetToDefaults(): DatabaseSchema {
    this.data = createSeedData();
    this.persist();
    return this.data;
  }

  public getProfile(): RestaurantProfile {
    return this.data.profile;
  }

  public updateProfile(updated: Partial<RestaurantProfile>): RestaurantProfile {
    this.data.profile = { ...this.data.profile, ...updated };
    this.persist();
    return this.data.profile;
  }

  public getBranches(): Branch[] {
    return this.data.branches;
  }

  public getBranchById(id: string): Branch | undefined {
    return this.data.branches.find((b) => b.id === id);
  }

  public getTables(branchId?: string): RestaurantTable[] {
    if (branchId) {
      return this.data.tables.filter((t) => t.branchId === branchId);
    }
    return this.data.tables;
  }

  public getTableById(id: string): RestaurantTable | undefined {
    return this.data.tables.find((t) => t.id === id);
  }

  public createTable(table: Omit<RestaurantTable, 'id'>): RestaurantTable {
    const newTable: RestaurantTable = {
      ...table,
      id: `tbl_${Date.now()}`,
    };
    this.data.tables.push(newTable);
    this.persist();
    return newTable;
  }

  public updateTable(id: string, updates: Partial<RestaurantTable>): RestaurantTable | null {
    const idx = this.data.tables.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tables[idx] = { ...this.data.tables[idx], ...updates };
    this.persist();
    return this.data.tables[idx];
  }

  public getCategories(): MenuCategory[] {
    return this.data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getMenuItems(categoryId?: string, branchId?: string): MenuItem[] {
    let items = this.data.menuItems;
    if (categoryId && categoryId !== 'all') {
      items = items.filter((i) => i.categoryId === categoryId);
    }
    return items;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.data.menuItems.find((i) => i.id === id);
  }

  public createMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item_${Date.now()}`,
    };
    this.data.menuItems.push(newItem);
    this.persist();
    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const idx = this.data.menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.menuItems[idx] = { ...this.data.menuItems[idx], ...updates };
    this.persist();
    return this.data.menuItems[idx];
  }

  public deleteMenuItem(id: string): boolean {
    const len = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter((i) => i.id !== id);
    if (this.data.menuItems.length !== len) {
      this.persist();
      return true;
    }
    return false;
  }

  public getOrders(branchId?: string, status?: string): Order[] {
    let list = this.data.orders;
    if (branchId) {
      list = list.filter((o) => o.branchId === branchId);
    }
    if (status) {
      list = list.filter((o) => o.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public createOrder(orderPayload: Partial<Order>): Order {
    const count = this.data.orders.length + 1085;
    const orderNumber = `#${count}`;
    const subtotal = (orderPayload.items || []).reduce((acc, item) => {
      const modSum = (item.selectedModifiers || []).reduce((mAcc, m) => mAcc + m.priceDelta, 0);
      return acc + (item.price + modSum) * item.quantity;
    }, 0);

    const taxRate = this.data.profile.taxRate || 0.0825;
    const taxAmount = Number((subtotal * taxRate).toFixed(2));
    const discountAmount = orderPayload.discountAmount || 0;
    const serviceCharge = orderPayload.orderType === 'dine-in' ? Number((subtotal * (this.data.profile.serviceChargeRate || 0.1)).toFixed(2)) : 0;
    const total = Number((subtotal + taxAmount + serviceCharge - discountAmount + (orderPayload.tipAmount || 0)).toFixed(2));

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      branchId: orderPayload.branchId || 'branch_dt',
      orderType: orderPayload.orderType || 'dine-in',
      tableId: orderPayload.tableId,
      tableName: orderPayload.tableName,
      customerName: orderPayload.customerName || 'Walk-in Guest',
      customerPhone: orderPayload.customerPhone,
      customerId: orderPayload.customerId,
      waiterId: orderPayload.waiterId,
      waiterName: orderPayload.waiterName || 'Staff',
      items: (orderPayload.items || []).map((item, idx) => ({
        ...item,
        id: item.id || `oi_${Date.now()}_${idx}`,
        status: item.status || 'cooking',
        startedCookingAt: new Date().toISOString(),
      })),
      status: 'prepping',
      paymentStatus: orderPayload.paymentStatus || 'unpaid',
      subtotal,
      taxAmount,
      discountAmount,
      discountCode: orderPayload.discountCode,
      serviceChargeAmount: serviceCharge,
      tipAmount: orderPayload.tipAmount || 0,
      total,
      payments: orderPayload.payments || [],
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);

    // Update table status if dine-in
    if (newOrder.tableId) {
      this.updateTable(newOrder.tableId, {
        status: 'occupied',
        currentOrderId: newOrder.id,
        occupiedSince: new Date().toISOString(),
        assignedWaiterName: newOrder.waiterName,
      });
    }

    // Auto deplete inventory based on recipe
    this.depleteInventoryForOrder(newOrder);

    // Add notification
    this.addNotification({
      type: 'order_new',
      title: `New Order ${newOrder.orderNumber}`,
      message: `${newOrder.orderType.toUpperCase()} - ${newOrder.tableName || 'Takeout'} (${newOrder.items.length} items)`,
      targetRole: 'chef',
      linkTab: 'kds',
    });

    this.persist();
    return newOrder;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If order is completed or cancelled, free table if dine-in
    if (updates.status === 'completed' || updates.status === 'cancelled') {
      const order = this.data.orders[idx];
      if (order.tableId) {
        this.updateTable(order.tableId, {
          status: 'cleaning',
          currentOrderId: undefined,
        });
      }
    }

    this.persist();
    return this.data.orders[idx];
  }

  private depleteInventoryForOrder(order: Order) {
    order.items.forEach((item) => {
      const menuItem = this.getMenuItemById(item.menuItemId);
      if (menuItem && menuItem.recipe) {
        menuItem.recipe.forEach((ingredient) => {
          const invIdx = this.data.inventory.findIndex((inv) => inv.id === ingredient.inventoryItemId);
          if (invIdx !== -1) {
            const needed = ingredient.quantityUsed * item.quantity;
            this.data.inventory[invIdx].currentStock = Math.max(0, Number((this.data.inventory[invIdx].currentStock - needed).toFixed(2)));
            if (this.data.inventory[invIdx].currentStock <= this.data.inventory[invIdx].minThreshold) {
              this.data.inventory[invIdx].status = 'low_stock';
              this.addNotification({
                type: 'low_stock',
                title: 'Low Stock Alert',
                message: `${this.data.inventory[invIdx].name} is low (${this.data.inventory[invIdx].currentStock} ${this.data.inventory[invIdx].unit} left)`,
                targetRole: 'admin',
                linkTab: 'inventory',
              });
            }
          }
        });
      }
    });
  }

  public getKitchenTickets(station?: string): KitchenTicket[] {
    const activeOrders = this.data.orders.filter((o) => o.status === 'prepping' || o.status === 'confirmed' || o.status === 'ready');
    return activeOrders.map((order) => {
      let filteredItems = order.items;
      if (station && station !== 'All') {
        filteredItems = filteredItems.filter((i) => i.kitchenStation.toLowerCase() === station.toLowerCase());
      }
      const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
      const allReady = order.items.every((i) => i.status === 'ready' || i.status === 'served');
      let urgency: 'normal' | 'warning' | 'urgent' = 'normal';
      if (elapsedMinutes > 20) urgency = 'urgent';
      else if (elapsedMinutes > 12) urgency = 'warning';

      return {
        id: `ticket_${order.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableName,
        orderType: order.orderType,
        waiterName: order.waiterName,
        createdAt: order.createdAt,
        urgency,
        elapsedMinutes,
        allReady,
        items: filteredItems.map((item) => ({
          orderItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          station: item.kitchenStation,
          modifiers: item.selectedModifiers.map((m) => `${m.modifierName}: ${m.optionName}`),
          specialInstructions: item.specialInstructions,
          status: item.status,
        })),
      };
    });
  }

  public bumpKitchenTicket(orderId: string, nextStatus?: 'ready' | 'served' | 'prepping'): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    if (order.status === 'prepping' || !nextStatus) {
      order.status = 'ready';
      order.items.forEach((i) => {
        if (i.status === 'cooking') i.status = 'ready';
      });
      this.addNotification({
        type: 'kitchen_ready',
        title: `Order ${order.orderNumber} Ready!`,
        message: `${order.tableName || 'Takeout'} is plated and ready for pickup.`,
        targetRole: 'server',
        linkTab: 'pos',
      });
    } else if (order.status === 'ready') {
      order.status = 'served';
      order.items.forEach((i) => {
        i.status = 'served';
      });
    }

    return this.updateOrder(orderId, order);
  }

  public getStaff(): StaffUser[] {
    return this.data.staff;
  }

  public getStaffByPin(pin: string): StaffUser | undefined {
    return this.data.staff.find((s) => s.pin === pin && s.isActive);
  }

  public getReservations(branchId?: string): Reservation[] {
    let list = this.data.reservations;
    if (branchId) {
      list = list.filter((r) => r.branchId === branchId);
    }
    return list.sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));
  }

  public createReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Reservation {
    const newRes: Reservation = {
      ...reservation,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reservations.push(newRes);
    this.addNotification({
      type: 'reservation_alert',
      title: 'New Reservation Booked',
      message: `${newRes.customerName} for ${newRes.guestsCount} guests at ${newRes.reservationTime}`,
      targetRole: 'manager',
      linkTab: 'reservations',
    });
    this.persist();
    return newRes;
  }

  public updateReservation(id: string, updates: Partial<Reservation>): Reservation | null {
    const idx = this.data.reservations.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.reservations[idx] = { ...this.data.reservations[idx], ...updates };
    this.persist();
    return this.data.reservations[idx];
  }

  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  public createCustomer(cust: Omit<Customer, 'id' | 'visitsCount' | 'totalSpent' | 'averageOrderValue' | 'lastVisit'>): Customer {
    const newCust: Customer = {
      ...cust,
      id: `cust_${Date.now()}`,
      visitsCount: 1,
      totalSpent: 0,
      averageOrderValue: 0,
      lastVisit: new Date().toISOString(),
      favoriteDishes: [],
    };
    this.data.customers.push(newCust);
    this.persist();
    return newCust;
  }

  public getInventory(): InventoryItem[] {
    return this.data.inventory;
  }

  public adjustInventoryStock(id: string, delta: number): InventoryItem | null {
    const idx = this.data.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const item = this.data.inventory[idx];
    item.currentStock = Math.max(0, Number((item.currentStock + delta).toFixed(2)));
    if (item.currentStock <= 0) item.status = 'out_of_stock';
    else if (item.currentStock <= item.minThreshold) item.status = 'low_stock';
    else item.status = 'in_stock';
    item.lastRestockedAt = new Date().toISOString();
    this.persist();
    return item;
  }

  public getNotifications(): AppNotification[] {
    return this.data.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
      return true;
    }
    return false;
  }

  public addNotification(n: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): AppNotification {
    const newNotif: AppNotification = {
      ...n,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.data.notifications.unshift(newNotif);
    if (this.data.notifications.length > 50) {
      this.data.notifications.pop();
    }
    this.persist();
    return newNotif;
  }

  public getAnalytics(): AnalyticsSummary {
    const allOrders = this.data.orders;
    const todayRevenue = allOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : o.subtotal), 0);
    const todayOrdersCount = allOrders.length;
    const todayAverageTicket = todayOrdersCount > 0 ? Number((todayRevenue / todayOrdersCount).toFixed(2)) : 0;
    const activeTablesCount = this.data.tables.filter((t) => t.status === 'occupied' || t.status === 'billing').length;
    const openOrdersCount = allOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

    const weeklyRevenue = [
      { day: 'Mon', revenue: 3240, orders: 42 },
      { day: 'Tue', revenue: 4120, orders: 56 },
      { day: 'Wed', revenue: 4890, orders: 64 },
      { day: 'Thu', revenue: 6100, orders: 78 },
      { day: 'Fri', revenue: 9450, orders: 112 },
      { day: 'Sat', revenue: 11280, orders: 140 },
      { day: 'Sun', revenue: 8400, orders: 98 },
    ];

    const hourlySales = [
      { hour: '12:00', sales: 940, orders: 12 },
      { hour: '13:00', sales: 1420, orders: 18 },
      { hour: '14:00', sales: 880, orders: 10 },
      { hour: '17:00', sales: 1150, orders: 14 },
      { hour: '18:00', sales: 2480, orders: 28 },
      { hour: '19:00', sales: 3820, orders: 42 },
      { hour: '20:00', sales: 4100, orders: 46 },
      { hour: '21:00', sales: 2900, orders: 32 },
      { hour: '22:00', sales: 1200, orders: 15 },
    ];

    const categoryShare = [
      { category: 'Prime Steaks & Grills', amount: 4820, percentage: 38 },
      { category: 'Signature Cocktails', amount: 2410, percentage: 19 },
      { category: 'Artisan Pasta & Risotto', amount: 2150, percentage: 17 },
      { category: 'Wood-Fired Pizza', amount: 1650, percentage: 13 },
      { category: 'Starters & Crudo', amount: 1140, percentage: 9 },
      { category: 'Decadent Desserts', amount: 510, percentage: 4 },
    ];

    const topSellingItems = [
      { name: '45-Day Dry Aged Bone-In Ribeye', soldCount: 38, revenue: 2584, category: 'Mains' },
      { name: 'Wild Mushroom & Truffle Tagliatelle', soldCount: 44, revenue: 1408, category: 'Pasta' },
      { name: 'Hickory Smoked Old Fashioned', soldCount: 68, revenue: 1292, category: 'Cocktails' },
      { name: 'Pugliese Burrata & Hot Honey Pizza', soldCount: 52, revenue: 1248, category: 'Pizza' },
      { name: 'Miso-Glazed Chilean Sea Bass', soldCount: 22, revenue: 1056, category: 'Seafood' },
    ];

    const paymentMethodBreakdown = [
      { method: 'Credit Card (Visa/MC/Amex)', count: 94, total: 11420 },
      { method: 'Apple Pay / Contactless', count: 38, total: 4280 },
      { method: 'Cash', count: 18, total: 1820 },
    ];

    const branchComparison = this.data.branches.map((b) => ({
      branchName: b.name,
      revenue: b.id === 'branch_dt' ? 14280 : b.id === 'branch_up' ? 9840 : 11350,
      orders: b.id === 'branch_dt' ? 128 : b.id === 'branch_up' ? 84 : 96,
      activeTables: b.id === 'branch_dt' ? 7 : b.id === 'branch_up' ? 4 : 5,
    }));

    const metrics = {
      totalRevenue: todayRevenue,
      netSales: Math.round(todayRevenue * 0.9 * 100) / 100,
      totalOrders: todayOrdersCount,
      averageOrderValue: todayAverageTicket,
      totalTips: 542.50,
      totalTax: Math.round(todayRevenue * 0.0825 * 100) / 100,
      tableTurnoverRate: 3.4,
    };

    const categorySales = categoryShare.map((c) => ({
      categoryName: c.category,
      sales: c.amount,
      itemsSold: Math.round(c.amount / 24),
    }));

    const bestSellers = topSellingItems.map((t) => ({
      name: t.name,
      quantity: t.soldCount,
      revenue: t.revenue,
    }));

    return {
      todayRevenue,
      todayOrdersCount,
      todayAverageTicket,
      activeTablesCount,
      openOrdersCount,
      weeklyRevenue,
      hourlySales,
      categoryShare,
      topSellingItems,
      paymentMethodBreakdown,
      branchComparison,
      metrics,
      categorySales,
      bestSellers,
    };
  }

  public saveTestResults(results: TestCaseResult[]) {
    this.data.testResults = results;
    this.persist();
  }

  public getTestResults(): TestCaseResult[] {
    return this.data.testResults;
  }
}

export const db = new Database();
