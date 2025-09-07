const express = require('express');
const router = express.Router();
const db = require('../models/database');
const crypto = require('crypto');

// ==================== DIGITAL SHOP ROUTES ====================

// Get all products (public shop)
router.get('/shop/products', (req, res) => {
  try {
    let products = db.findAll('products', { status: 'ACTIVE' });
    
    // Apply filters
    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }
    if (req.query.type) {
      products = products.filter(p => p.type === req.query.type);
    }
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    
    // Sort
    if (req.query.sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (req.query.sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (req.query.sort === 'popular') {
      products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    } else {
      // Default: featured first, then by creation date
      products.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product categories
router.get('/shop/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Wedding Planning Templates', icon: '📋' },
    { id: '2', name: 'Contracts & Legal', icon: '📄' },
    { id: '3', name: 'Checklists & Guides', icon: '✅' },
    { id: '4', name: 'Design Assets', icon: '🎨' },
    { id: '5', name: 'Marketing Materials', icon: '📣' },
    { id: '6', name: 'Budget Templates', icon: '💰' },
    { id: '7', name: 'Timeline Templates', icon: '📅' },
    { id: '8', name: 'Vendor Management', icon: '🤝' }
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

// Get product by ID
router.get('/shop/products/:id', (req, res) => {
  try {
    const product = db.findById('products', req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin)
router.post('/shop/products', (req, res) => {
  try {
    const product = db.create('products', {
      ...req.body,
      slug: db.generateSlug(req.body.name),
      status: req.body.status || 'DRAFT',
      sales: 0,
      stock: req.body.type === 'DIGITAL_DOWNLOAD' ? -1 : req.body.stock
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/shop/products/:id', (req, res) => {
  try {
    const product = db.update('products', req.params.id, req.body);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SHOPPING CART & CHECKOUT ====================

// Create order
router.post('/shop/orders', (req, res) => {
  try {
    const { items, customer, couponCode } = req.body;
    
    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = db.findById('products', item.productId);
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.status !== 'ACTIVE') {
        return res.status(400).json({ error: `Product ${product.name} is not available` });
      }
      
      const itemTotal = product.price * (item.quantity || 1);
      subtotal += itemTotal;
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity || 1,
        total: itemTotal
      });
    }
    
    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = db.findAll('coupons', { code: couponCode, status: 'ACTIVE' })[0];
      
      if (coupon) {
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (coupon.value / 100);
        } else if (coupon.type === 'FIXED') {
          discount = coupon.value;
        }
        
        // Update coupon usage
        db.update('coupons', coupon.id, {
          uses: (coupon.uses || 0) + 1
        });
      }
    }
    
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax - discount;
    
    // Create order
    const order = db.create('orders', {
      orderNumber: 'ORD-' + Date.now(),
      customer,
      items: orderItems,
      subtotal,
      tax,
      discount,
      total,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment
router.post('/shop/orders/:id/pay', (req, res) => {
  try {
    const order = db.findById('orders', req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // In production, process payment with Stripe/PayPal
    // For demo, simulate payment success
    
    const updatedOrder = db.update('orders', req.params.id, {
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paymentMethod: req.body.paymentMethod,
      paymentId: 'PAY-' + Date.now(),
      paidAt: new Date().toISOString()
    });
    
    // Generate download links for digital products
    const downloads = [];
    for (const item of order.items) {
      const product = db.findById('products', item.productId);
      
      if (product && product.type === 'DIGITAL_DOWNLOAD') {
        const download = db.create('downloads', {
          orderId: order.id,
          productId: product.id,
          customerId: order.customer.email,
          token: crypto.randomBytes(32).toString('hex'),
          downloadLimit: product.downloadLimit || 5,
          downloadsUsed: 0,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });
        
        downloads.push({
          productName: product.name,
          downloadUrl: `/api/shop/downloads/${download.token}`
        });
      }
      
      // Update product sales count
      db.update('products', item.productId, {
        sales: (product.sales || 0) + item.quantity
      });
    }
    
    // Create license
    const license = db.create('licenses', {
      orderId: order.id,
      customerId: order.customer.email,
      products: order.items.map(i => i.productId),
      licenseKey: crypto.randomBytes(16).toString('hex').toUpperCase(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    });
    
    res.json({
      success: true,
      data: {
        order: updatedOrder,
        downloads,
        license: license.licenseKey,
        message: 'Payment successful! Your downloads are ready.'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DOWNLOADS ====================

// Download product
router.get('/shop/downloads/:token', (req, res) => {
  try {
    const download = db.findAll('downloads', { token: req.params.token })[0];
    
    if (!download) {
      return res.status(404).json({ error: 'Invalid download link' });
    }
    
    // Check expiration
    if (new Date(download.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Download link has expired' });
    }
    
    // Check download limit
    if (download.downloadsUsed >= download.downloadLimit) {
      return res.status(403).json({ error: 'Download limit reached' });
    }
    
    // Update download count
    db.update('downloads', download.id, {
      downloadsUsed: download.downloadsUsed + 1,
      lastDownloadAt: new Date().toISOString()
    });
    
    const product = db.findById('products', download.productId);
    
    // In production, serve the actual file
    res.json({
      success: true,
      data: {
        fileName: product.name + '.zip',
        fileUrl: product.files?.[0] || '/downloads/sample.zip',
        remainingDownloads: download.downloadLimit - download.downloadsUsed - 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COUPONS ====================

// Validate coupon
router.post('/shop/coupons/validate', (req, res) => {
  try {
    const coupon = db.findAll('coupons', { 
      code: req.body.code,
      status: 'ACTIVE'
    })[0];
    
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }
    
    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    
    // Check usage limit
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    
    // Check minimum purchase
    if (coupon.minimumPurchase && req.body.subtotal < coupon.minimumPurchase) {
      return res.status(400).json({ 
        error: `Minimum purchase of $${coupon.minimumPurchase} required`
      });
    }
    
    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.type === 'PERCENTAGE' 
          ? `${coupon.value}% off` 
          : `$${coupon.value} off`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (admin)
router.post('/shop/coupons', (req, res) => {
  try {
    const coupon = db.create('coupons', {
      ...req.body,
      code: req.body.code.toUpperCase(),
      status: 'ACTIVE',
      uses: 0
    });
    
    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CUSTOMER ACCOUNTS ====================

// Get customer orders
router.get('/shop/customers/:email/orders', (req, res) => {
  try {
    const orders = db.findAll('orders', {})
      .filter(o => o.customer?.email === req.params.email);
    
    res.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer downloads
router.get('/shop/customers/:email/downloads', (req, res) => {
  try {
    const downloads = db.findAll('downloads', { customerId: req.params.email });
    
    const downloadData = downloads.map(d => {
      const product = db.findById('products', d.productId);
      return {
        ...d,
        productName: product?.name,
        remainingDownloads: d.downloadLimit - d.downloadsUsed
      };
    });
    
    res.json({
      success: true,
      data: downloadData,
      total: downloadData.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify license
router.post('/shop/licenses/verify', (req, res) => {
  try {
    const license = db.findAll('licenses', { licenseKey: req.body.licenseKey })[0];
    
    if (!license) {
      return res.status(404).json({ error: 'Invalid license key' });
    }
    
    // Check expiration
    if (new Date(license.validUntil) < new Date()) {
      return res.status(400).json({ error: 'License has expired' });
    }
    
    res.json({
      success: true,
      data: {
        valid: true,
        customerId: license.customerId,
        products: license.products,
        validUntil: license.validUntil
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SHOP STATISTICS ====================

// Get shop statistics
router.get('/shop/stats', (req, res) => {
  try {
    const products = db.findAll('products');
    const orders = db.findAll('orders');
    const downloads = db.findAll('downloads');
    
    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'ACTIVE').length,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + o.total, 0),
      totalDownloads: downloads.reduce((sum, d) => sum + d.downloadsUsed, 0),
      bestSellers: products
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          sales: p.sales || 0
        }))
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
