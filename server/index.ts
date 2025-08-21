import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const app = express();
// Stripe webhooks need raw body for signature verification:
app.use(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' })
);
// JSON for everything else:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function readPriceId() {
  // Some env UIs accidentally include spaces/newlines or quotes when pasting.
  // Clean it up defensively before validating/using.
  let v = process.env.STRIPE_PRICE_ID || "";
  // strip wrapping quotes/backticks and whitespace
  v = v.trim().replace(/^['"`]|['"`]$/g, "");
  // common paste artifact: backticks around values (from code blocks)
  v = v.replace(/^`|`$/g, "");
  return v;
}

// --- Admin Supabase client for webhooks (service role required) ---
const supabaseUrl = 'https://jxhjghgectlpgrpwpkfd.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  { auth: { persistSession: false } }
);

// --- Stripe client (server-side secret key) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

// Helper: upsert subscription status into Supabase
async function upsertSubscriptionStatus(params: {
  user_id?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status?: string | null;
  current_period_end?: number | null;
  trial_end?: number | null;
  cancel_at?: number | null;
}) {
  try {
    const payload = {
      user_id: params.user_id ?? null,
      stripe_customer_id: params.stripe_customer_id ?? null,
      stripe_subscription_id: params.stripe_subscription_id ?? null,
      status: params.status ?? null,
      current_period_end: params.current_period_end
        ? new Date(params.current_period_end * 1000).toISOString()
        : null,
      trial_end: params.trial_end
        ? new Date(params.trial_end * 1000).toISOString()
        : null,
      cancel_at: params.cancel_at
        ? new Date(params.cancel_at * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };
    // Assumes a table: subscription_status (user_id text PK or unique)
    const { error, data } = await supabaseAdmin
      .from('subscription_status')
      .upsert(payload, { onConflict: 'user_id' });
    if (error) {
      console.error('[supabase upsert error]', error);
      console.error('[supabase payload]', payload);
    } else {
      console.log('[webhook] updated subscription status for user:', params.user_id);
      console.log('[webhook] upsert successful:', data);
    }
  } catch (e) {
    console.error('[supabase upsert exception]', e);
  }
}

// --- Stripe Webhook endpoint ---
app.post('/api/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    console.error('[webhook] missing signature or secret');
    return res.status(400).send('Missing signature or secret');
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    console.error('[webhook] signature verification failed', err?.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log('[webhook] received event:', event.type);
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = (s.subscription as string) || null;
        const customerId = (s.customer as string) || null;
        let userId = s.metadata?.user_id || null;
        console.log('[webhook] checkout completed for user:', userId);
        
        // If no user_id in metadata, try to find it by customer ID
        if (!userId && customerId) {
          try {
            console.log('[webhook] No user_id in metadata, searching by customer ID:', customerId);
            const userByCustomer = await storage.getUserByStripeCustomerId(customerId);
            if (userByCustomer) {
              userId = userByCustomer.id.toString();
              console.log('[webhook] Found user by customer ID:', userId);
            }
          } catch (error) {
            console.error('[webhook] Error finding user by customer ID:', error);
          }
        }
        
        // fetch subscription for more fields
        if (subscriptionId && userId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionStatus({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: sub.status,
            current_period_end: (sub as any).current_period_end,
            trial_end: (sub as any).trial_end,
            cancel_at: (sub as any).cancel_at,
          });
        } else {
          console.error('[webhook] Cannot process checkout completion - missing userId or subscriptionId');
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        // user_id can be on the subscription metadata (we attach it when creating)
        const userId =
          (sub.metadata && (sub.metadata as any).user_id) || null;
        console.log(`[webhook] subscription ${event.type} for user:`, userId);
        await upsertSubscriptionStatus({
          user_id: userId,
          stripe_customer_id: (sub.customer as string) || null,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: (sub as any).current_period_end,
          trial_end: (sub as any).trial_end,
          cancel_at: (sub as any).cancel_at,
        });
        break;
      }
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
      case 'customer.subscription.trial_will_end':
        console.log(`[webhook] ${event.type} - logged but no action taken`);
        // Optional: you could log or notify here if desired.
        break;
      default:
        console.log(`[webhook] unhandled event type: ${event.type}`);
        // ignore other events
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error('[webhook handler error]', e);
    res.status(500).send('Webhook handler error');
  }
});

// Test endpoint to verify webhook functionality
app.get('/api/test-webhook-connection', async (req, res) => {
  try {
    // First, try to create the table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS subscription_status (
        user_id TEXT PRIMARY KEY,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        status TEXT,
        current_period_end TIMESTAMPTZ,
        trial_end TIMESTAMPTZ,
        cancel_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabaseAdmin.rpc('execute_sql', { sql: createTableQuery });
    if (createError) {
      console.log('[webhook] Note: Could not create table via RPC, trying direct access...');
    }
    
    // Test Supabase connection
    const { data, error } = await supabaseAdmin.from('subscription_status').select('*').limit(1);
    if (error) {
      return res.status(500).json({ 
        supabase_connection: 'failed', 
        error: error.message,
        instructions: 'Please create the subscription_status table in Supabase Dashboard > SQL Editor',
        create_table_sql: 'CREATE TABLE subscription_status (user_id TEXT PRIMARY KEY, stripe_customer_id TEXT, stripe_subscription_id TEXT, status TEXT, current_period_end TIMESTAMPTZ, trial_end TIMESTAMPTZ, cancel_at TIMESTAMPTZ, updated_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW());'
      });
    }
    
    // Test upsert functionality
    const testPayload = {
      user_id: 'test_user_123',
      stripe_customer_id: 'cus_test123',
      stripe_subscription_id: 'sub_test123',
      status: 'test',
      current_period_end: new Date().toISOString(),
      trial_end: null,
      cancel_at: null,
      updated_at: new Date().toISOString(),
    };
    
    const { error: upsertError } = await supabaseAdmin
      .from('subscription_status')
      .upsert(testPayload, { onConflict: 'user_id' });
      
    if (upsertError) {
      return res.status(500).json({ 
        supabase_connection: 'ok', 
        upsert_test: 'failed',
        error: upsertError.message 
      });
    }
    
    // Clean up test data
    await supabaseAdmin.from('subscription_status').delete().eq('user_id', 'test_user_123');
    
    // Query actual subscription status data for verification
    const { data: realData, error: realError } = await supabaseAdmin
      .from('subscription_status')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(3);
    
    res.json({ 
      supabase_connection: 'ok', 
      upsert_test: 'ok',
      webhook_endpoint: '/api/stripe-webhook ready',
      recent_entries: realData || [],
      total_entries: realData?.length || 0
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Serve static files from public directory in development
    app.use(express.static("public"));
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
