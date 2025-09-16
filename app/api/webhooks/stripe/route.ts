import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    const schoolId = invoice.metadata?.school_id;
    if (!schoolId) return;

    // Update subscription status
    await supabase
      .from('school_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('school_id', schoolId);

    // Create notification for school admin
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('school_id', schoolId)
      .eq('role', 'admin');

    if (admins) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'Payment Successful',
        message: 'Your subscription payment has been processed successfully.',
        type: 'success',
      }));

      await supabase.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    const schoolId = invoice.metadata?.school_id;
    if (!schoolId) return;

    // Create notification for school admin
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('school_id', schoolId)
      .eq('role', 'admin');

    if (admins) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'Payment Failed',
        message: 'Your subscription payment failed. Please update your payment method.',
        type: 'error',
      }));

      await supabase.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const schoolId = subscription.metadata?.school_id;
    if (!schoolId) return;

    // Update subscription in database
    await supabase
      .from('school_subscriptions')
      .update({
        status: subscription.status,
        expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('school_id', schoolId);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const schoolId = subscription.metadata?.school_id;
    if (!schoolId) return;

    // Update subscription status
    await supabase
      .from('school_subscriptions')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('school_id', schoolId);

    // Notify school admin
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('school_id', schoolId)
      .eq('role', 'admin');

    if (admins) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled. Some features may be limited.',
        type: 'warning',
      }));

      await supabase.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}