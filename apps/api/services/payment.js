const db = require('../models/database');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    // Initialize with mock Stripe for development
    // In production, use: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    this.mockMode = !process.env.STRIPE_SECRET_KEY;
  }

  /**
   * Create payment intent for an invoice
   */
  async createPaymentIntent(invoiceId, paymentMethod = 'CARD') {
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    if (invoice.status === 'PAID') {
      throw new Error('Invoice is already paid');
    }
    
    const amountDue = invoice.balance || (invoice.total - (invoice.amountPaid || 0));
    
    if (this.mockMode) {
      // Mock payment intent for development
      const paymentIntent = {
        id: 'pi_' + crypto.randomBytes(16).toString('hex'),
        amount: Math.round(amountDue * 100), // Convert to cents
        currency: 'usd',
        status: 'requires_payment_method',
        client_secret: 'pi_mock_secret_' + crypto.randomBytes(16).toString('hex'),
        metadata: {
          invoiceId,
          invoiceNumber: invoice.number
        }
      };
      
      // Store in database for tracking
      db.create('paymentIntents', {
        intentId: paymentIntent.id,
        invoiceId,
        amount: amountDue,
        currency: 'USD',
        status: 'PENDING',
        clientSecret: paymentIntent.client_secret,
        paymentMethod
      });
      
      return paymentIntent;
    }
    
    // Production Stripe integration would go here
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // return await stripe.paymentIntents.create({...});
  }

  /**
   * Process payment
   */
  async processPayment(invoiceId, paymentData) {
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const amountDue = invoice.balance || (invoice.total - (invoice.amountPaid || 0));
    
    // Create payment record
    const payment = db.create('payments', {
      invoiceId,
      projectId: invoice.projectId,
      amount: paymentData.amount || amountDue,
      currency: 'USD',
      method: paymentData.method || 'CARD',
      status: 'PROCESSING',
      transactionId: 'txn_' + crypto.randomBytes(16).toString('hex'),
      metadata: {
        cardLast4: paymentData.cardLast4,
        cardBrand: paymentData.cardBrand,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName
      }
    });
    
    try {
      if (this.mockMode) {
        // Simulate payment processing
        await this.simulatePaymentProcessing();
        
        // Update payment status
        db.update('payments', payment.id, {
          status: 'COMPLETED',
          processedAt: new Date().toISOString(),
          confirmationNumber: 'CONF-' + Date.now()
        });
      } else {
        // Production payment processing would go here
      }
      
      // Update invoice
      const newAmountPaid = (invoice.amountPaid || 0) + payment.amount;
      const newBalance = invoice.total - newAmountPaid;
      
      db.update('invoices', invoiceId, {
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newBalance <= 0 ? 'PAID' : 'PARTIAL',
        lastPaymentDate: new Date().toISOString()
      });
      
      // Create transaction log
      db.create('transactions', {
        type: 'PAYMENT',
        entityType: 'INVOICE',
        entityId: invoiceId,
        amount: payment.amount,
        description: `Payment for invoice ${invoice.number}`,
        status: 'COMPLETED',
        paymentId: payment.id
      });
      
      return {
        success: true,
        payment: db.findById('payments', payment.id),
        invoice: db.findById('invoices', invoiceId)
      };
    } catch (error) {
      // Update payment as failed
      db.update('payments', payment.id, {
        status: 'FAILED',
        failureReason: error.message,
        failedAt: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Create payment link
   */
  createPaymentLink(invoiceId, options = {}) {
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const paymentLink = db.create('paymentLinks', {
      invoiceId,
      amount: invoice.balance || invoice.total,
      currency: 'USD',
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: options.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/pay/${crypto.randomBytes(16).toString('hex')}`,
      metadata: {
        invoiceNumber: invoice.number,
        customerEmail: options.customerEmail,
        description: options.description || `Payment for invoice ${invoice.number}`
      },
      status: 'ACTIVE'
    });
    
    return paymentLink;
  }

  /**
   * Process refund
   */
  async processRefund(paymentId, amount, reason) {
    const payment = db.findById('payments', paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'COMPLETED') {
      throw new Error('Can only refund completed payments');
    }
    
    const refundAmount = amount || payment.amount;
    
    if (refundAmount > payment.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }
    
    const refund = db.create('refunds', {
      paymentId,
      invoiceId: payment.invoiceId,
      amount: refundAmount,
      reason,
      status: 'PROCESSING',
      refundId: 'ref_' + crypto.randomBytes(16).toString('hex')
    });
    
    try {
      if (this.mockMode) {
        // Simulate refund processing
        await this.simulatePaymentProcessing();
        
        db.update('refunds', refund.id, {
          status: 'COMPLETED',
          processedAt: new Date().toISOString()
        });
      } else {
        // Production refund processing would go here
      }
      
      // Update invoice if full refund
      if (refundAmount === payment.amount) {
        const invoice = db.findById('invoices', payment.invoiceId);
        db.update('invoices', payment.invoiceId, {
          amountPaid: (invoice.amountPaid || 0) - refundAmount,
          balance: (invoice.balance || 0) + refundAmount,
          status: 'REFUNDED'
        });
      }
      
      // Update payment
      db.update('payments', paymentId, {
        refundedAmount: (payment.refundedAmount || 0) + refundAmount,
        partiallyRefunded: refundAmount < payment.amount,
        fullyRefunded: refundAmount === payment.amount
      });
      
      // Create transaction log
      db.create('transactions', {
        type: 'REFUND',
        entityType: 'PAYMENT',
        entityId: paymentId,
        amount: -refundAmount,
        description: `Refund for payment ${payment.transactionId}`,
        status: 'COMPLETED',
        refundId: refund.id
      });
      
      return {
        success: true,
        refund: db.findById('refunds', refund.id)
      };
    } catch (error) {
      db.update('refunds', refund.id, {
        status: 'FAILED',
        failureReason: error.message
      });
      
      throw error;
    }
  }

  /**
   * Set up recurring payment
   */
  createPaymentPlan(invoiceId, planDetails) {
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const installments = [];
    const installmentAmount = invoice.total / planDetails.numberOfPayments;
    
    for (let i = 0; i < planDetails.numberOfPayments; i++) {
      const dueDate = new Date(planDetails.startDate);
      dueDate.setMonth(dueDate.getMonth() + i * (planDetails.frequency === 'MONTHLY' ? 1 : 0));
      dueDate.setDate(dueDate.getDate() + i * (planDetails.frequency === 'WEEKLY' ? 7 : 0));
      
      installments.push({
        number: i + 1,
        amount: installmentAmount,
        dueDate: dueDate.toISOString(),
        status: 'PENDING'
      });
    }
    
    const paymentPlan = db.create('paymentPlans', {
      invoiceId,
      projectId: invoice.projectId,
      totalAmount: invoice.total,
      numberOfPayments: planDetails.numberOfPayments,
      frequency: planDetails.frequency,
      installments,
      status: 'ACTIVE',
      nextPaymentDate: installments[0].dueDate,
      metadata: {
        customerEmail: planDetails.customerEmail,
        autoCharge: planDetails.autoCharge || false
      }
    });
    
    // Update invoice
    db.update('invoices', invoiceId, {
      paymentPlanId: paymentPlan.id,
      paymentType: 'INSTALLMENT'
    });
    
    return paymentPlan;
  }

  /**
   * Get payment history
   */
  getPaymentHistory(filters = {}) {
    let payments = db.findAll('payments', filters);
    
    // Add invoice details
    payments = payments.map(payment => {
      const invoice = db.findById('invoices', payment.invoiceId);
      return {
        ...payment,
        invoiceNumber: invoice?.number,
        invoiceTotal: invoice?.total
      };
    });
    
    return payments;
  }

  /**
   * Get payment analytics
   */
  getPaymentAnalytics(organizationId, dateRange) {
    const payments = db.findAll('payments', { 
      status: 'COMPLETED',
      organizationId 
    });
    
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date();
    
    const filteredPayments = payments.filter(p => {
      const paymentDate = new Date(p.processedAt || p.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const averagePayment = totalRevenue / (filteredPayments.length || 1);
    
    // Group by method
    const byMethod = {};
    filteredPayments.forEach(p => {
      if (!byMethod[p.method]) {
        byMethod[p.method] = { count: 0, total: 0 };
      }
      byMethod[p.method].count++;
      byMethod[p.method].total += p.amount;
    });
    
    // Group by day for chart
    const dailyRevenue = {};
    filteredPayments.forEach(p => {
      const date = new Date(p.processedAt || p.createdAt).toISOString().split('T')[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += p.amount;
    });
    
    return {
      totalRevenue,
      totalTransactions: filteredPayments.length,
      averagePayment,
      byMethod,
      dailyRevenue,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };
  }

  /**
   * Simulate payment processing delay
   */
  simulatePaymentProcessing() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000); // 1 second delay
    });
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(paymentMethod) {
    const validMethods = ['CARD', 'BANK', 'PAYPAL', 'CHECK', 'CASH'];
    if (!validMethods.includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }
    return true;
  }

  /**
   * Calculate fees
   */
  calculateFees(amount, paymentMethod) {
    const fees = {
      CARD: 0.029 * amount + 0.30, // 2.9% + $0.30
      BANK: 0.008 * amount, // 0.8%
      PAYPAL: 0.029 * amount + 0.30, // 2.9% + $0.30
      CHECK: 0,
      CASH: 0
    };
    
    return {
      amount,
      fee: fees[paymentMethod] || 0,
      net: amount - (fees[paymentMethod] || 0)
    };
  }
}

module.exports = new PaymentService();