import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db.ts';
import { runAutomatedTests } from './server/test-runner.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini AI client if GEMINI_API_KEY is provided
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.warn('Gemini AI initialization note:', err);
      }
    }
    return aiClient;
  }

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.4.0',
      uptime: process.uptime(),
    });
  });

  // Profile & Settings
  app.get('/api/profile', (req, res) => {
    res.json(db.getProfile());
  });

  app.put('/api/profile', (req, res) => {
    try {
      const updated = db.updateProfile(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Branches
  app.get('/api/branches', (req, res) => {
    res.json(db.getBranches());
  });

  // Tables
  app.get('/api/tables', (req, res) => {
    const branchId = req.query.branchId as string;
    res.json(db.getTables(branchId));
  });

  app.post('/api/tables', (req, res) => {
    try {
      const { number, zone, capacity, branchId } = req.body;
      if (!number || !capacity) {
        return res.status(400).json({ error: 'Table number and capacity are required' });
      }
      const newTable = db.createTable({
        number,
        zone: zone || 'Main Dining',
        capacity: Number(capacity),
        status: 'available',
        branchId: branchId || 'branch_dt',
        position: { x: 100, y: 100 },
      });
      res.status(201).json(newTable);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/tables/:id/status', (req, res) => {
    try {
      const { status, assignedWaiterName, notes } = req.body;
      const updated = db.updateTable(req.params.id, {
        status,
        ...(assignedWaiterName !== undefined && { assignedWaiterName }),
        ...(notes !== undefined && { notes }),
        ...(status === 'available' && { currentOrderId: undefined, occupiedSince: undefined }),
      });
      if (!updated) return res.status(404).json({ error: 'Table not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Menu Categories & Items
  app.get('/api/menu/categories', (req, res) => {
    res.json(db.getCategories());
  });

  app.get('/api/menu/items', (req, res) => {
    const categoryId = req.query.categoryId as string;
    const branchId = req.query.branchId as string;
    res.json(db.getMenuItems(categoryId, branchId));
  });

  app.post('/api/menu/items', (req, res) => {
    try {
      const { name, categoryId, categoryName, price, costPrice, kitchenStation, prepTimeMinutes, dietaryTags, imageUrl, description, modifiers } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ error: 'Item name and price are required' });
      }
      const newItem = db.createMenuItem({
        name,
        categoryId: categoryId || 'cat_mains',
        categoryName: categoryName || 'Prime Steaks & Grills',
        price: Number(price),
        costPrice: Number(costPrice || price * 0.3),
        kitchenStation: kitchenStation || 'Grill',
        prepTimeMinutes: Number(prepTimeMinutes || 12),
        dietaryTags: dietaryTags || [],
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        description: description || '',
        isAvailable: true,
        modifiers: modifiers || [],
      });
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/menu/items/:id', (req, res) => {
    try {
      const updated = db.updateMenuItem(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Item not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/menu/items/:id/availability', (req, res) => {
    try {
      const { isAvailable } = req.body;
      const updated = db.updateMenuItem(req.params.id, { isAvailable });
      if (!updated) return res.status(404).json({ error: 'Item not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/menu/items/:id', (req, res) => {
    const success = db.deleteMenuItem(req.params.id);
    if (!success) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const branchId = req.query.branchId as string;
    const status = req.query.status as string;
    res.json(db.getOrders(branchId, status));
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    try {
      const newOrder = db.createOrder(req.body);
      res.status(201).json(newOrder);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateOrder(req.params.id, { status });
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/orders/:id/pay', (req, res) => {
    try {
      const { method, amount, tipAmount } = req.body;
      const order = db.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const newPayment = {
        id: `pay_${Date.now()}`,
        method: method || 'credit_card',
        amount: Number(amount || order.total),
        tipAmount: Number(tipAmount || 0),
        paidAt: new Date().toISOString(),
        cardLast4: '4242',
      };

      const updated = db.updateOrder(req.params.id, {
        paymentStatus: 'paid',
        status: 'completed',
        tipAmount: Number(tipAmount || 0),
        payments: [...(order.payments || []), newPayment],
        completedAt: new Date().toISOString(),
      });

      // Free table if associated
      if (order.tableId) {
        db.updateTable(order.tableId, {
          status: 'cleaning',
          currentOrderId: undefined,
        });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Kitchen Display System (KDS)
  app.get('/api/kds/tickets', (req, res) => {
    const station = req.query.station as string;
    res.json(db.getKitchenTickets(station));
  });

  app.patch('/api/kds/tickets/:orderId/bump', (req, res) => {
    try {
      const { nextStatus } = req.body;
      const bumped = db.bumpKitchenTicket(req.params.orderId, nextStatus);
      if (!bumped) return res.status(404).json({ error: 'Order ticket not found' });
      res.json(bumped);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Staff & Auth
  app.get('/api/staff', (req, res) => {
    res.json(db.getStaff());
  });

  app.post('/api/auth/pin-login', (req, res) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'PIN is required' });
    const user = db.getStaffByPin(pin);
    if (!user) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    res.json({
      user,
      token: `token_${user.id}_${Date.now()}`,
    });
  });

  // Reservations
  app.get('/api/reservations', (req, res) => {
    const branchId = req.query.branchId as string;
    res.json(db.getReservations(branchId));
  });

  app.post('/api/reservations', (req, res) => {
    try {
      const { customerName, customerPhone, guestsCount, reservationDate, reservationTime, tableId, specialRequests, branchId } = req.body;
      if (!customerName || !customerPhone || !guestsCount || !reservationDate || !reservationTime) {
        return res.status(400).json({ error: 'Missing required reservation fields' });
      }
      const newRes = db.createReservation({
        branchId: branchId || 'branch_dt',
        customerName,
        customerPhone,
        guestsCount: Number(guestsCount),
        reservationDate,
        reservationTime,
        tableId,
        status: 'confirmed',
        specialRequests,
      });
      res.status(201).json(newRes);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/reservations/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateReservation(req.params.id, { status });
      if (!updated) return res.status(404).json({ error: 'Reservation not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Customers CRM
  app.get('/api/customers', (req, res) => {
    res.json(db.getCustomers());
  });

  app.get('/api/customers/:id', (req, res) => {
    const cust = db.getCustomerById(req.params.id);
    if (!cust) return res.status(404).json({ error: 'Customer not found' });
    res.json(cust);
  });

  // Inventory
  app.get('/api/inventory', (req, res) => {
    res.json(db.getInventory());
  });

  app.patch('/api/inventory/:id/adjust', (req, res) => {
    try {
      const { delta } = req.body;
      if (delta === undefined) return res.status(400).json({ error: 'Delta is required' });
      const updated = db.adjustInventoryStock(req.params.id, Number(delta));
      if (!updated) return res.status(404).json({ error: 'Inventory item not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Analytics
  app.get('/api/analytics', (req, res) => {
    res.json(db.getAnalytics());
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    res.json(db.getNotifications());
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const ok = db.markNotificationAsRead(req.params.id);
    res.json({ success: ok });
  });

  // AI Menu Description Enhancement
  app.post('/api/ai/suggest-menu-description', async (req, res) => {
    const { itemName, category, ingredients } = req.body;
    if (!itemName) return res.status(400).json({ error: 'Item name is required' });

    const ai = getAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an elite culinary writer for a luxury Michelin-guide restaurant. Write a mouth-watering, sensory-rich 2-sentence restaurant menu description for:
Dish Name: ${itemName}
Category: ${category || 'Main Course'}
Key Ingredients/Notes: ${ingredients || 'High quality fresh ingredients'}

Output ONLY the final 2-sentence description without any intro or quotation marks.`,
        });
        const text = response.text?.trim() || '';
        return res.json({ description: text });
      } catch (err) {
        console.warn('Gemini API call error fallback:', err);
      }
    }

    // High quality fallback if AI is unconfigured or rate limited
    const fallbackTemplates = [
      `Artfully prepared with premium ingredients, highlighting delicate textures and deep savory notes. Finished with fresh herbs and a signature house glaze.`,
      `Pan-seared to culinary perfection and paired with seasonal organic elements. A balanced masterpiece celebrating rich, comforting heritage flavors.`,
      `Hand-crafted with meticulous technique to bring out bright natural essences, accompanied by our chef's reduction and micro herbs.`,
    ];
    const picked = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
    res.json({ description: picked });
  });

  // Automated Tests Endpoint
  app.post('/api/tests/run', async (req, res) => {
    try {
      const results = await runAutomatedTests();
      res.json({
        total: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tests/results', (req, res) => {
    const results = db.getTestResults();
    res.json(results);
  });

  // Reset Demo Data
  app.post('/api/reset-demo-data', (req, res) => {
    const reset = db.resetToDefaults();
    res.json({ message: 'Restaurant database reset to defaults', profile: reset.profile });
  });

  // ==========================================
  // Vite Integration for Front-end & Assets
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SavoryOS Restaurant Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
