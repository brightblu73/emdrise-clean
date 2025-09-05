import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { SupabaseAPI, UserProgress, EmdrSession, supabaseAdmin } from "./supabase-client";
import { handleRevenueCatWebhook, verifyRevenueCatWebhook } from './revenuecat-webhook';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// Supabase authentication middleware
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.substring(7);
    const user = await SupabaseAPI.verifyUser(token);
    
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Ensure user progress exists in Supabase
    await SupabaseAPI.getOrCreateUserProgress(user.id, user.email);
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: "Authentication required" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      anon_key: !!process.env.VITE_SUPABASE_ANON_KEY
    });
  });

  // RevenueCat webhook endpoint for Apple IAP
  app.post('/api/revenuecat-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      // For now, just acknowledge the webhook since we're focusing on Supabase integration
      console.log('RevenueCat webhook received');
      res.json({ received: true });
    } catch (error) {
      console.error('RevenueCat webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Test endpoint without auth
  app.get("/api/test-memory", async (req, res) => {
    try {
      // Test direct database access
      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .select('*')
        .eq('user_id', '63ee3eee-e618-4b51-8722-4e8455f03d99')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      res.json({ 
        data: data || { memories_cleared: 0 },
        success: true 
      });
    } catch (error: any) {
      console.error('Error in test endpoint:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get user memory count (for Progress menu)  
  app.get("/api/memory-count", async (req, res) => {
    try {
      // Simplified auth - just extract user ID from token without full verification
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header required" });
      }

      const token = authHeader.substring(7);
      
      // Decode JWT to get user ID without verification (for testing)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userId = payload.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // Get or create user progress
      const { data: existingProgress } = await supabaseAdmin
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      let memoriesCleared = 0;
      if (existingProgress) {
        memoriesCleared = existingProgress.memories_cleared || 0;
      } else {
        // Create new progress record
        const { data: newProgress } = await supabaseAdmin
          .from('user_progress')
          .insert({
            user_id: userId,
            email: payload.email || 'unknown@example.com',
            memories_cleared: 0
          })
          .select()
          .single();
        memoriesCleared = newProgress?.memories_cleared || 0;
      }
      
      res.json({ 
        memoriesCleared,
        success: true,
        userId: userId 
      });
    } catch (error: any) {
      console.error('Error fetching memory count:', error);
      res.status(500).json({ message: "Failed to fetch memory count", error: error.message });
    }
  });

  // Increment memory count (called when session completes with reprocessing)
  app.post("/api/increment-memory-count", async (req, res) => {
    try {
      // Simplified auth - extract user ID from JWT
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header required" });
      }

      const token = authHeader.substring(7);
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userId = payload.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // Increment memory count directly in database
      const { data: updatedProgress } = await supabaseAdmin
        .rpc('increment_memory_count', { p_user_id: userId });
      
      if (!updatedProgress) {
        return res.status(404).json({ message: "User progress not found" });
      }
      
      console.log(`Incremented memory count for ${payload.email} to ${updatedProgress.memories_cleared}`);
      res.json({ 
        memoriesCleared: updatedProgress.memories_cleared,
        success: true 
      });
    } catch (error: any) {
      console.error('Error incrementing memory count:', error);
      res.status(500).json({ message: "Failed to increment memory count", error: error.message });
    }
  });

  // Create new EMDR session
  app.post("/api/sessions", async (req, res) => {
    try {
      const currentScript = req.body.currentScript || 1;
      const sessionType = (currentScript === "5a" || String(currentScript) === "5a") ? "resumed" : "normal";
      const hasCompletedReprocessing = (String(currentScript) === "5a");
      
      const sessionData = {
        current_script: currentScript,
        session_type: sessionType,
        has_completed_reprocessing: hasCompletedReprocessing,
        status: "active"
      };
      
      console.log(`Creating ${sessionType} session starting at script ${currentScript}, reprocessing completed: ${hasCompletedReprocessing}`);
      const session = await SupabaseAPI.createEmdrSession(req.user!.id, sessionData);
      res.json(session);
    } catch (error: any) {
      console.error('Error creating session:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get session by ID
  app.get("/api/sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await SupabaseAPI.getEmdrSession(req.params.id);
      
      if (!session || session.user_id !== req.user!.id) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error: any) {
      console.error('Error fetching session:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update session (for script progression and reprocessing tracking)
  app.patch("/api/sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await SupabaseAPI.getEmdrSession(req.params.id);
      
      if (!session || session.user_id !== req.user!.id) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const updates = req.body;
      
      // Mark reprocessing completion when advancing to Script 5 or 5a
      if (updates.currentScript === 5 || String(updates.currentScript) === "5a") {
        updates.has_completed_reprocessing = true;
        console.log(`Session ${session.id} marked as having completed reprocessing`);
      }
      
      // Convert currentScript to current_script for database
      if (updates.currentScript !== undefined) {
        updates.current_script = updates.currentScript;
        delete updates.currentScript;
      }
      
      const updatedSession = await SupabaseAPI.updateEmdrSession(req.params.id, updates);
      
      // Convert back to frontend format
      const responseSession = {
        ...updatedSession,
        currentScript: updatedSession.current_script,
        sessionType: updatedSession.session_type,
        hasCompletedReprocessing: updatedSession.has_completed_reprocessing
      };
      
      res.json(responseSession);
    } catch (error: any) {
      console.error('Error updating session:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get current active session for user
  app.get("/api/session/current", requireAuth, async (req, res) => {
    try {
      const session = await SupabaseAPI.getCurrentSession(req.user!.id);
      
      if (!session || session.current_script === 10) {
        return res.status(404).json({ message: "No active session found" });
      }
      
      // Convert to frontend format
      const responseSession = {
        ...session,
        currentScript: session.current_script,
        sessionType: session.session_type,
        hasCompletedReprocessing: session.has_completed_reprocessing
      };
      
      res.json(responseSession);
    } catch (error: any) {
      console.error('Error fetching current session:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Start new session (simplified)
  app.post("/api/session/start", requireAuth, async (req, res) => {
    try {
      const sessionData = {
        current_script: 1,
        session_type: "normal",
        has_completed_reprocessing: false,
        status: "active"
      };
      
      const session = await SupabaseAPI.createEmdrSession(req.user!.id, sessionData);
      
      // Convert to frontend format
      const responseSession = {
        ...session,
        currentScript: session.current_script,
        sessionType: session.session_type,
        hasCompletedReprocessing: session.has_completed_reprocessing
      };
      
      res.json(responseSession);
    } catch (error: any) {
      console.error('Error starting session:', error);
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}