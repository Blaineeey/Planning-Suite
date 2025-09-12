const express = require('express');
const router = express.Router();
const db = require('../models/database');
const stripeService = require('../services/stripe');

// ==================== PAYMENT ENDPOINTS ====================

// Create payment intent for invoice
router.post('/invoices/:invoiceId/payment-intent', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }
    
    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      invoice.total,
      'usd',
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        organizationId: invoice.organizationId
      }
    );
    
    // Update invoice with payment intent ID
    db.update('invoices', invoiceId, {
      paymentIntentId: paymentIntent.paymentIntentId,
      status: 'PENDING_PAYMENT'
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      amount: invoice.total
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment and update invoice
router.post('/invoices/:invoiceId/confirm-payment', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentIntentId } = req.body;
    
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get payment intent status from Stripe
    const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update invoice as paid
      db.update('invoices', invoiceId, {
        status: 'PAID',
        paidAt: new Date().toISOString(),
        paymentMethod: paymentIntent.payment_method_types[0],
        transactionId: paymentIntent.id
      });
      
      // Create payment record
      const payment = db.create('payments', {
        invoiceId: invoice.id,
        organizationId: invoice.organizationId,
        amount: invoice.total,
        paymentMethod: 'stripe',
        transactionId: paymentIntent.id,
        status: 'COMPLETED',
        metadata: {
          paymentIntentId: paymentIntent.id,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
        }
      });
      
      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        payment,
        invoice: db.findById('invoices', invoiceId)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment link for invoice
router.post('/invoices/:invoiceId/payment-link', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = db.findById('invoices', invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }
    
    // Create payment link
    const paymentLink = await stripeService.createPaymentLink({
      amount: invoice.total,
      description: `Invoice #${invoice.number}`,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        organizationId: invoice.organizationId
      }
    });
    
    // Update invoice with payment link
    db.update('invoices', invoiceId, {
      paymentLink: paymentLink.url,
      status: 'SENT'
    });
    
    res.json({
      success: true,
      paymentLink: paymentLink.url,
      invoice: db.findById('invoices', invoiceId)
    });
  } catch (error) {
    console.error('Payment link creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process refund
router.post('/payments/:paymentId/refund', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount } = req.body;
    
    const payment = db.findById('payments', paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }
    
    // Create refund in Stripe
    const refund = await stripeService.createRefund(
      payment.transactionId,
      amount || payment.amount
    );
    
    // Update payment status
    db.update('payments', paymentId, {
      status: 'REFUNDED',
      refundedAt: new Date().toISOString(),
      refundAmount: amount || payment.amount,
      refundId: refund.id
    });
    
    // Update invoice if fully refunded
    if (!amount || amount === payment.amount) {
      db.update('invoices', payment.invoiceId, {
        status: 'REFUNDED'
      });
    }
    
    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund,
      payment: db.findById('payments', paymentId)
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment history for organization
router.get('/payments', (req, res) => {
  try {
    const { organizationId, status, startDate, endDate } = req.query;
    
    let payments = db.findAll('payments', organizationId ? { organizationId } : {});
    
    // Filter by status
    if (status) {
      payments = payments.filter(p => p.status === status);
    }
    
    // Filter by date range
    if (startDate || endDate) {
      payments = payments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        if (startDate && paymentDate < new Date(startDate)) return false;
        if (endDate && paymentDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    // Add invoice details
    payments = payments.map(payment => {
      const invoice = db.findById('invoices', payment.invoiceId);
      return {
        ...payment,
        invoice: invoice ? {
          number: invoice.number,
          total: invoice.total,
          clientName: invoice.clientName
        } : null
      };
    });
    
    res.json({
      success: true,
      payments,
      total: payments.reduce((sum, p) => sum + p.amount, 0),
      count: payments.length
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook endpoint
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = await stripeService.handleWebhook(req.body, signature);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Find invoice by payment intent ID
        const invoices = db.findAll('invoices', { 
          paymentIntentId: paymentIntent.id 
        });
        
        if (invoices.length > 0) {
          const invoice = invoices[0];
          
          // Update invoice as paid
          db.update('invoices', invoice.id, {
            status: 'PAID',
            paidAt: new Date().toISOString(),
            transactionId: paymentIntent.id
          });
          
          // Create payment record
          db.create('payments', {
            invoiceId: invoice.id,
            organizationId: invoice.organizationId,
            amount: paymentIntent.amount / 100, // Convert from cents
            paymentMethod: 'stripe',
            transactionId: paymentIntent.id,
            status: 'COMPLETED',
            metadata: {
              paymentIntentId: paymentIntent.id,
              receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
            }
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update invoice status
        const failedInvoices = db.findAll('invoices', { 
          paymentIntentId: failedPayment.id 
        });
        
        if (failedInvoices.length > 0) {
          db.update('invoices', failedInvoices[0].id, {
            status: 'PAYMENT_FAILED'
          });
        }
        break;
        
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Handle checkout session completion
        if (session.metadata?.invoiceId) {
          db.update('invoices', session.metadata.invoiceId, {
            status: 'PAID',
            paidAt: new Date().toISOString(),
            transactionId: session.payment_intent
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

module.exports = router;
