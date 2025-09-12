const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

class StripeService {
  /**
   * Create a payment intent for invoice payment
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment intent error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create a customer in Stripe
   */
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata
      });
      
      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create a subscription for recurring payments
   */
  async createSubscription(customerId, priceId, trialDays = 0) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: trialDays,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      return subscription;
    } catch (error) {
      console.error('Stripe subscription error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Create a checkout session for one-time payments
   */
  async createCheckoutSession({
    customerId,
    lineItems,
    successUrl,
    cancelUrl,
    metadata = {}
  }) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata
      });
      
      return session;
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe retrieve payment intent error:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Confirm a payment intent (for server-side confirmation)
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethodId }
      );
      return paymentIntent;
    } catch (error) {
      console.error('Stripe confirm payment error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Create a refund
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = { payment_intent: paymentIntentId };
      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }
      
      const refund = await stripe.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error('Failed to create refund');
    }
  }

  /**
   * Create a payment link for invoices
   */
  async createPaymentLink({
    amount,
    description,
    metadata = {}
  }) {
    try {
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        metadata
      });
      
      return paymentLink;
    } catch (error) {
      console.error('Stripe payment link error:', error);
      throw new Error('Failed to create payment link');
    }
  }

  /**
   * Webhook handler for Stripe events
   */
  async handleWebhook(rawBody, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
      );
      
      return event;
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}

module.exports = new StripeService();
