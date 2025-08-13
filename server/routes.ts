import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSessionSchema, insertTargetSchema, insertCalmPlaceSchema, insertResourceSchema, insertBilateralSessionSchema, insertScriptProgressionSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionStatus: string | null;
      trialEndsAt?: Date | null;
    }
  }
}



export async function registerRoutes(app: Express): Promise<Server> {

  // Session configuration - simplified for Replit environment
  app.use(session({
    secret: process.env.SESSION_SECRET || "heal-emdr-secret",
    resave: true, // Force session save for Replit
    saveUninitialized: true, // Save uninitialized sessions
    name: 'connect.sid',
    cookie: { 
      secure: false, 
      httpOnly: false, // Allow JS access for debugging in Replit
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none' // More permissive for Replit iframe environment
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const expressUser: Express.User = {
          ...user,
          stripeCustomerId: user.stripeCustomerId || undefined,
          stripeSubscriptionId: user.stripeSubscriptionId || undefined,
          subscriptionStatus: user.subscriptionStatus || 'trial',
          trialEndsAt: user.trialEndsAt || undefined,
        };
        return done(null, expressUser);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id, user.email);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log('Deserializing user with ID:', id);
      const user = await storage.getUser(id);
      if (!user) {
        console.log('User not found for ID:', id);
        return done(null, null);
      }
      const expressUser: Express.User = {
        ...user,
        stripeCustomerId: user.stripeCustomerId || undefined,
        stripeSubscriptionId: user.stripeSubscriptionId || undefined,
        subscriptionStatus: user.subscriptionStatus || 'trial',
        trialEndsAt: user.trialEndsAt || undefined,
      };
      console.log('User deserialized successfully:', expressUser.email);
      done(null, expressUser);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now

      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword
      });
      
      // Update subscription info after creation
      await storage.updateUserSubscriptionStatus(user.id, "trial");

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        res.json({ user: { id: user.id, username: user.username, email: user.email, subscriptionStatus: user.subscriptionStatus } });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/login - redirect to auth page
  app.get("/api/login", (req, res) => {
    res.redirect('/auth');
  });

  app.post("/api/login", (req, res, next) => {
    console.log('Login request body:', req.body);
    console.log('Session ID before login:', req.sessionID);
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        console.log('Authentication failed:', info?.message);
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login session error:', err);
          return res.status(500).json({ message: "Login error" });
        }
        console.log('Login successful, session ID:', req.sessionID);
        console.log('User logged in:', user.email);
        console.log('Session cookie will be set for domain:', req.get('host'));
        res.json({ user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          subscriptionStatus: user.subscriptionStatus
        }});
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('GET /api/user - Session ID:', req.sessionID);
    console.log('GET /api/user - Authenticated:', req.isAuthenticated());
    console.log('GET /api/user - User:', req.user?.email || 'No user');
    
    if (req.isAuthenticated()) {
      res.json({ user: { 
        id: req.user!.id, 
        username: req.user!.username, 
        email: req.user!.email,
        subscriptionStatus: req.user!.subscriptionStatus,
        trialEndsAt: req.user!.trialEndsAt
      }});
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Development helper endpoint to clear test users
  if (process.env.NODE_ENV === 'development') {
    app.delete("/api/clear-test-users", async (req, res) => {
      try {
        // Clear test user by email
        const testUser = await storage.getUserByEmail("test@example.com");
        if (testUser) {
          // Note: This would require implementing a deleteUser method
          res.json({ message: "Test user found but deletion not implemented yet" });
        } else {
          res.json({ message: "No test user found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to clear test users" });
      }
    });
  }

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "gbp", // Changed to GBP for UK pricing
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Subscription routes
  app.post('/api/create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    let user = req.user!;

    // For trial users, they already have access - just confirm it
    if (user.subscriptionStatus === 'trial') {
      res.json({ 
        success: true, 
        message: 'Trial access active',
        subscriptionStatus: 'trial',
        trialEndsAt: user.trialEndsAt 
      });
      return;
    }

    // For actual paid subscriptions (when trial expires), redirect to Stripe
    // For now, just confirm trial access for testing
    res.json({ 
      success: true, 
      message: 'Trial access confirmed',
      subscriptionStatus: 'trial'
    });
  });

  // Full Stripe subscription endpoint
  app.post('/api/get-or-create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    let user = req.user!;

    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        res.send({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
        return;
      } catch (error) {
        console.error('Error retrieving subscription:', error);
      }
    }
    
    if (!user.email) {
      throw new Error('No user email on file');
    }

    try {
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customer.id });
      }

      console.log('Creating subscription with price ID:', process.env.STRIPE_PRICE_ID);
      
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_1Rvk0XIM2Jemf1le0GSfooRm',
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUser(user.id, { 
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id 
      });
  
      res.send({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  // Protected middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      // Check subscription status
      const user = req.user!;
      const now = new Date();
      
      if (user.subscriptionStatus === 'trial' && user.trialEndsAt && now > user.trialEndsAt) {
        return res.status(403).json({ message: "Trial expired. Please subscribe to continue." });
      }
      
      if (user.subscriptionStatus === 'cancelled' || user.subscriptionStatus === 'expired') {
        return res.status(403).json({ message: "Subscription required to access this feature." });
      }
      
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // Session routes - updated to always start with Script 1
  app.post("/api/sessions", requireAuth, async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse({
        ...req.body,
        userId: req.user!.id,
        currentScript: 1  // Always start with Script 1 (Welcome & Introduction)
      });
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/sessions", requireAuth, async (req, res) => {
    try {
      const sessions = await storage.getUserSessions(req.user!.id);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await storage.getSession(parseInt(req.params.id));
      if (!session || session.userId !== req.user!.id) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await storage.getSession(parseInt(req.params.id));
      if (!session || session.userId !== req.user!.id) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const updates = req.body;
      const updatedSession = await storage.updateSession(session.id, updates);
      res.json(updatedSession);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Target routes
  app.post("/api/targets", requireAuth, async (req, res) => {
    try {
      const targetData = insertTargetSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const target = await storage.createTarget(targetData);
      res.json(target);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/targets", requireAuth, async (req, res) => {
    try {
      const targets = await storage.getUserTargets(req.user!.id);
      res.json(targets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/targets/:id", requireAuth, async (req, res) => {
    try {
      const target = await storage.getTarget(parseInt(req.params.id));
      if (!target || target.userId !== req.user!.id) {
        return res.status(404).json({ message: "Target not found" });
      }
      
      const updates = req.body;
      const updatedTarget = await storage.updateTarget(target.id, updates);
      res.json(updatedTarget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Calm place routes
  app.post("/api/calm-places", requireAuth, async (req, res) => {
    try {
      const calmPlaceData = insertCalmPlaceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const calmPlace = await storage.createCalmPlace(calmPlaceData);
      res.json(calmPlace);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/calm-places", requireAuth, async (req, res) => {
    try {
      const calmPlaces = await storage.getUserCalmPlaces(req.user!.id);
      res.json(calmPlaces);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/calm-places/:id", requireAuth, async (req, res) => {
    try {
      const calmPlace = await storage.getCalmPlace(parseInt(req.params.id));
      if (!calmPlace || calmPlace.userId !== req.user!.id) {
        return res.status(404).json({ message: "Calm place not found" });
      }
      
      const updates = req.body;
      const updatedCalmPlace = await storage.updateCalmPlace(calmPlace.id, updates);
      res.json(updatedCalmPlace);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Resource routes
  app.post("/api/resources", requireAuth, async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const resource = await storage.createResource(resourceData);
      res.json(resource);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/resources", requireAuth, async (req, res) => {
    try {
      const type = req.query.type as string;
      const resources = type 
        ? await storage.getUserResourcesByType(req.user!.id, type)
        : await storage.getUserResources(req.user!.id);
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/resources/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const updatedResource = await storage.updateResource(parseInt(req.params.id), updates);
      res.json(updatedResource);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/resources/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteResource(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bilateral session routes
  app.post("/api/bilateral-sessions", requireAuth, async (req, res) => {
    try {
      const bilateralSessionData = insertBilateralSessionSchema.parse(req.body);
      const bilateralSession = await storage.createBilateralSession(bilateralSessionData);
      res.json(bilateralSession);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });





  // Script progression routes for EMDR workflow
  app.get("/api/session/current", requireAuth, async (req, res) => {
    try {
      let session = await storage.getCurrentSessionState(req.user!.id);
      
      // If session exists but is completed (Script 10), don't return it
      if (session && session.currentScript === 10) {
        return res.status(404).json({ message: "No active session found" });
      }
      
      // Only return existing session, don't auto-create here
      // Let the frontend explicitly start new sessions
      if (!session) {
        return res.status(404).json({ message: "No active session found" });
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/session/start", requireAuth, async (req, res) => {
    try {
      const sessionData = {
        userId: req.user!.id,
        currentScript: 1,
        phase: "introduction",
        status: "active" as const
      };
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/session/:id/advance", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const forceNext = req.body.forceNext || false; // Allow manual progression out of loops
      const session = await storage.advanceToNextScript(sessionId, forceNext);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/session/:id/script-progress", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { scriptNumber, userInput, notes } = req.body;
      
      const progressionData = {
        sessionId,
        scriptNumber,
        userInput,
        status: "completed" as const,
        completedAt: new Date()
      };
      
      const progression = await storage.createScriptProgression(progressionData);
      res.json(progression);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/session/:id/script-progress", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const progressions = await storage.getSessionScriptProgressions(sessionId);
      res.json(progressions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/session/:id", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateSession(sessionId, updates);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
