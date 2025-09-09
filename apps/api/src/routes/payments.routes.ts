import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import Stripe from 'stripe';

const router = Router();
const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// ============= PAYMENT PROCESSING =============

// Create payment intent for invoice
router.post('/invoices/:id/pay', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;
    
    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { lead: true }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        leadId: invoice.leadId || '',
        organizationId: req.user.organizationId
      }
    });

    // Update invoice status
    if (paymentIntent.status === 'succeeded') {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paymentId: paymentIntent.id
        }
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: amount,
          paymentMethod: 'stripe',
          transactionId: paymentIntent.id,
          status: 'COMPLETED',
          organizationId: req.user.organizationId
        }
      });
    }

    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Get payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user?.stripeCustomerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: {
          userId: user?.id || '',
          organizationId: req.user.organizationId
        }
      });

      // Save customer ID
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { stripeCustomerId: customer.id }
      });

      res.json({ paymentMethods: [] });
    } else {
      // Get saved payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      });

      res.json({
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year
        }))
      });
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Add payment method
router.post('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    // Create customer if doesn't exist
    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        payment_method: paymentMethodId,
        metadata: {
          userId: user?.id || '',
          organizationId: req.user.organizationId
        }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: req.user.userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// Process subscription
router.post('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { priceId, paymentMethodId } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: req.user.userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent']
    });

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        // Update invoice status
        if (paymentIntent.metadata.invoiceId) {
          await prisma.invoice.update({
            where: { id: paymentIntent.metadata.invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date()
            }
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any;
        // Handle subscription payment
        console.log('Subscription payment succeeded:', invoice.id);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as any;
        // Handle subscription cancellation
        console.log('Subscription cancelled:', subscription.id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Create checkout session for shop
router.post('/shop/checkout', async (req, res) => {
  try {
    const { items, customerEmail } = req.body;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/cart`,
      customer_email: customerEmail,
      metadata: {
        items: JSON.stringify(items)
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;
