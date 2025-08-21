import type { Request, Response } from "express";
import { storage } from "./storage";

// RevenueCat webhook event types
interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    type: string;
    id: string;
    event_timestamp_ms: number;
    app_user_id: string;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number | null;
    environment: string;
    entitlement_id: string | null;
    entitlement_ids: string[];
    presented_offering_id: string | null;
    transaction_id: string;
    original_transaction_id: string;
    is_family_share: boolean;
    country_code: string;
    app_id: string;
    aliases: string[];
    original_app_user_id: string;
  };
}

export async function handleRevenueCatWebhook(req: Request, res: Response) {
  try {
    const event: RevenueCatWebhookEvent = req.body;
    
    console.log('[revenuecat-webhook] received event:', event.event.type);
    console.log('[revenuecat-webhook] app_user_id:', event.event.app_user_id);
    
    const { type, app_user_id, expiration_at_ms, entitlement_ids, product_id } = event.event;
    
    // Extract user ID from RevenueCat app_user_id (should match Supabase user ID)
    const userId = app_user_id;
    
    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE':
        console.log(`[revenuecat-webhook] subscription ${type.toLowerCase()} for user: ${userId}`);
        
        // Update user's subscription status to active
        await storage.updateUserSubscriptionStatus(userId, {
          hasActiveSubscription: true,
          subscriptionId: event.event.transaction_id,
          customerId: userId,
          productId: product_id,
          expirationDate: expiration_at_ms ? new Date(expiration_at_ms) : null,
        });
        
        console.log('[revenuecat-webhook] updated subscription status for user:', userId);
        break;
      
      case 'CANCELLATION':
      case 'EXPIRATION':
      case 'BILLING_ISSUE':
        console.log(`[revenuecat-webhook] subscription ${type.toLowerCase()} for user: ${userId}`);
        
        // Check if subscription is still active (CANCELLATION doesn't immediately deactivate)
        const isStillActive = type === 'CANCELLATION' && expiration_at_ms && expiration_at_ms > Date.now();
        
        await storage.updateUserSubscriptionStatus(userId, {
          hasActiveSubscription: isStillActive,
          subscriptionId: event.event.transaction_id,
          customerId: userId,
          productId: product_id,
          expirationDate: expiration_at_ms ? new Date(expiration_at_ms) : null,
        });
        
        console.log('[revenuecat-webhook] updated subscription status for user:', userId);
        break;
      
      case 'UNCANCELLATION':
        console.log(`[revenuecat-webhook] subscription uncancellation for user: ${userId}`);
        
        // Reactivate subscription
        await storage.updateUserSubscriptionStatus(userId, {
          hasActiveSubscription: true,
          subscriptionId: event.event.transaction_id,
          customerId: userId,
          productId: product_id,
          expirationDate: expiration_at_ms ? new Date(expiration_at_ms) : null,
        });
        
        console.log('[revenuecat-webhook] reactivated subscription for user:', userId);
        break;
      
      default:
        console.log(`[revenuecat-webhook] ${type} - logged but no action taken`);
        break;
    }
    
    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('[revenuecat-webhook] error processing webhook:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}

// RevenueCat webhook verification (optional but recommended)
export function verifyRevenueCatWebhook(req: Request, res: Response, next: Function) {
  // RevenueCat sends a signature header for verification
  const signature = req.headers['x-revenuecat-signature'] as string;
  
  if (!signature) {
    console.warn('[revenuecat-webhook] no signature provided');
    // In development, we might allow unsigned webhooks
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    return res.status(401).json({ error: 'No signature provided' });
  }
  
  // TODO: Implement signature verification using RevenueCat webhook secret
  // For now, we'll trust the webhook in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // In production, implement proper signature verification
  // const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
  // ... signature verification logic ...
  
  next();
}