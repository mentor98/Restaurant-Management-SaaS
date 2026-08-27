import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Send,
  CreditCard,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  Tag,
  SlidersHorizontal,
  Flame,
  ChefHat,
  Receipt,
  User,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MenuItem, SelectedModifier, Order, DietaryTag } from '../../types.ts';
import { ModifierModal } from './ModifierModal.tsx';
import { PaymentModal } from './PaymentModal.tsx';

export const POSView: React.FC = () => {
  const {
    profile,
    tables,
    categories,
    menuItems,
    orders,
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    selectedTableForPOS,
    setSelectedTableForPOS,
    guestNameForPOS,
    setGuestNameForPOS,
    orderTypeForPOS,
    setOrderTypeForPOS,
    cartDiscount,
    setCartDiscount,
    cartDiscountCode,
    setCartDiscountCode,
    cartTipPercent,
    createOrder,
    setActiveReceiptOrder,
    isLoading,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState<'ordering' | 'active_orders'>('ordering');
  const [settlingOrder, setSettlingOrder] = useState<Order | null>(null);

  const currencySymbol = profile?.currencySymbol || '$';

  // Dietary options
  const dietaryOptions: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Spicy', 'Chef Special'];

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    if (!item.isAvailable) return false;
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (selectedDietary !== 'all' && !item.dietaryTags.includes(selectedDietary as DietaryTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.kitchenStation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => {
    const modSum = (item.selectedModifiers || []).reduce((mSum, m) => mSum + m.priceDelta, 0);
    return sum + (item.price + modSum) * item.quantity;
  }, 0);

  const taxRate = profile?.taxRate || 0.0825;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const serviceCharge = orderTypeForPOS === 'dine-in' ? Number((subtotal * (profile?.serviceChargeRate || 0.1)).toFixed(2)) : 0;
  const total = Number((subtotal + taxAmount + serviceCharge - cartDiscount).toFixed(2));

  // Handle promo code
  const handleApplyPromo = () => {
    if (cartDiscountCode.toUpperCase() === 'VIP10') {
      setCartDiscount(Number((subtotal * 0.1).toFixed(2)));
    } else if (cartDiscountCode.toUpperCase() === 'CHEF20') {
      setCartDiscount(Number((subtotal * 0.2).toFixed(2)));
    } else if (cartDiscountCode.toUpperCase() === 'LUNCH5') {
      setCartDiscount(5.0);
    } else {
      setCartDiscount(0);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const handleSendToKitchen = async () => {
    if (cart.length === 0) return;
    const orderPayload: Partial<Order> = {
      orderType: orderTypeForPOS,
      tableId: selectedTableForPOS?.id,
      tableName: selectedTableForPOS?.number,
      customerName: guestNameForPOS || (selectedTableForPOS ? `Table ${selectedTableForPOS.number}` : 'Walk-in Guest'),
      items: cart,
      discountAmount: cartDiscount,
      discountCode: cartDiscountCode || undefined,
    };
    const created = await createOrder(orderPayload);
    if (created) {
      // Switch tab or notify
    }
  };

  // Active open orders
  const activeUnpaidOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div id="pos-container" className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* Left Menu Section */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        {/* Top Control Bar */}
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ordering')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ordering'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Menu & Ordering
            </button>
            <button
              onClick={() => setActiveTab('active_orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'active_orders'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>Live Active Orders</span>
              {activeUnpaidOrders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black">
                  {activeUnpaidOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              id="pos-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, ingredients..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Table Selector Quick Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Table:</span>
            <select
              id="pos-table-select"
              value={selectedTableForPOS?.id || ''}
              onChange={(e) => {
                const tbl = tables.find((t) => t.id === e.target.value);
                setSelectedTableForPOS(tbl || null);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- No Table (Takeout / Bar) --</option>
              {tables.map((tbl) => (
                <option key={tbl.id} value={tbl.id}>
                  {tbl.number} ({tbl.zone} - {tbl.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === 'ordering' ? (
          <>
            {/* Category Filter Chips */}
            <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900/80">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                All Menu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm shadow-amber-500/20'
                      : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dietary Tags Secondary Filter */}
            <div className="px-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <span className="text-zinc-400 font-medium mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setSelectedDietary('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedDietary === 'all'
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                All Diets
              </button>
              {dietaryOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedDietary(tag)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedDietary === tag
                      ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    id={`menu-item-card-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="group rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 overflow-hidden hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-black/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-amber-400 font-extrabold text-xs">
                        {currencySymbol}{item.price.toFixed(2)}
                      </div>
                      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-900/80 text-zinc-300 backdrop-blur-sm">
                          {item.kitchenStation}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-700/60">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTimeMinutes}m</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                          {item.modifiers && item.modifiers.length > 0 ? 'Customize +' : 'Add +'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Live Active Orders Drawer Tab */
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Active Dining & Takeout Orders</h3>
              <span className="text-xs text-zinc-400">{activeUnpaidOrders.length} in progress</span>
            </div>

            {activeUnpaidOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No active orders at this moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeUnpaidOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span>{ord.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 font-mono">
                            {ord.tableName || ord.orderType.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {ord.customerName} • Waiter: {ord.waiterName}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                          ord.status === 'prepping'
                            ? 'bg-amber-500/15 text-amber-500'
                            : ord.status === 'ready'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-zinc-500/15 text-zinc-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300 max-h-32 overflow-y-auto">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-zinc-400">{item.status}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700">
                      <div className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        {currencySymbol}{ord.total.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveReceiptOrder(ord)}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                        <button
                          onClick={() => setSettlingOrder(ord)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Settle Bill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Order Cart / Register Terminal Sidebar */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-zinc-900 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800">
        {/* Cart Header */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Current Order</span>
              {cart.length > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-500 font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-rose-500 hover:underline font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Order Type Toggle */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            {(['dine-in', 'takeout', 'delivery', 'qr-mobile'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderTypeForPOS(type)}
                className={`py-1 text-[11px] font-bold rounded-lg capitalize transition-colors ${
                  orderTypeForPOS === type
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Customer Name or Table Tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={guestNameForPOS}
              onChange={(e) => setGuestNameForPOS(e.target.value)}
              placeholder="Guest Name / Phone / Tag (Optional)"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-2">
              <UtensilsCrossed className="w-10 h-10 stroke-1 opacity-40 text-amber-500" />
              <div className="text-xs font-semibold">Order cart is empty</div>
              <div className="text-[11px] max-w-[200px]">Select items from the menu to start building the ticket.</div>
            </div>
          ) : (
            cart.map((cartItem) => {
              const modSum = (cartItem.selectedModifiers || []).reduce((sum, m) => sum + m.priceDelta, 0);
              const lineTotal = (cartItem.price + modSum) * cartItem.quantity;
              return (
                <div
                  key={cartItem.id}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{cartItem.name}</h5>
                      <span className="text-[11px] text-zinc-500">
                        {currencySymbol}{(cartItem.price + modSum).toFixed(2)} each
                      </span>
                    </div>
                    <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </span>
                  </div>

                  {cartItem.selectedModifiers && cartItem.selectedModifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cartItem.selectedModifiers.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                        >
                          +{m.optionName} {m.priceDelta > 0 && `(${currencySymbol}${m.priceDelta})`}
                        </span>
                      ))}
                    </div>
                  )}

                  {cartItem.specialInstructions && (
                    <div className="text-[10px] text-zinc-400 italic">"{cartItem.specialInstructions}"</div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-700/40">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">{cartItem.kitchenStation}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartItemQuantity(cartItem.id, -1)}
                        className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center text-xs text-zinc-800 dark:text-zinc-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-zinc-900 dark:text-zinc-100">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(cartItem.id, 1)}
                        className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center text-xs text-zinc-800 dark:text-zinc-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="ml-1 text-zinc-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Calculation & Actions Footer */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 space-y-2.5">
          {/* Promo code */}
          <div className="flex gap-2">
            <input
              type="text"
              value={cartDiscountCode}
              onChange={(e) => setCartDiscountCode(e.target.value)}
              placeholder="Promo / Voucher Code (e.g. VIP10, CHEF20)"
              className="flex-1 px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 uppercase font-mono"
            />
            <button
              onClick={handleApplyPromo}
              className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Apply
            </button>
          </div>

          {/* Breakdown */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-500 font-medium">
                <span>Discount</span>
                <span>-{currencySymbol}{cartDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Tax ({((profile?.taxRate || 0.0825) * 100).toFixed(2)}%)</span>
              <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            {orderTypeForPOS === 'dine-in' && (
              <div className="flex justify-between text-zinc-500">
                <span>Service Charge (10%)</span>
                <span>{currencySymbol}{serviceCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Total</span>
              <span className="font-black text-lg text-amber-500">{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="send-to-kitchen-btn"
              disabled={cart.length === 0 || isLoading}
              onClick={handleSendToKitchen}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChefHat className="w-4 h-4" />
              <span>Send to Kitchen</span>
            </button>

            <button
              id="quick-pay-btn"
              disabled={cart.length === 0 || isLoading}
              onClick={async () => {
                const orderPayload: Partial<Order> = {
                  orderType: orderTypeForPOS,
                  tableId: selectedTableForPOS?.id,
                  tableName: selectedTableForPOS?.number,
                  customerName: guestNameForPOS || (selectedTableForPOS ? `Table ${selectedTableForPOS.number}` : 'Walk-in Guest'),
                  items: cart,
                  discountAmount: cartDiscount,
                  discountCode: cartDiscountCode || undefined,
                };
                const created = await createOrder(orderPayload);
                if (created) {
                  setSettlingOrder(created);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay & Settle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {customizingItem && (
        <ModifierModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onConfirm={(mods, inst) => {
            addToCart(customizingItem, mods, inst);
            setCustomizingItem(null);
          }}
        />
      )}

      {settlingOrder && (
        <PaymentModal
          order={settlingOrder}
          onClose={() => setSettlingOrder(null)}
          onPaymentSuccess={() => {
            setSettlingOrder(null);
          }}
        />
      )}
    </div>
  );
};
