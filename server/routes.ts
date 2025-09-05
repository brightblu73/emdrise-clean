import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { SupabaseAPI, UserProgress, EmdrSession } from "./supabase-client";
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

  // Get user memory count (for Progress menu)
  app.get("/api/memory-count", requireAuth, async (req, res) => {
    try {
      const userProgress = await SupabaseAPI.getUserProgress(req.user!.id);
      const memoriesCleared = userProgress?.memories_cleared || 0;
      
      res.json({ 
        memoriesCleared,
        success: true 
      });
    } catch (error: any) {
      console.error('Error fetching memory count:', error);
      res.status(500).json({ message: "Failed to fetch memory count" });
    }
  });

  // Increment memory count (called when session completes with reprocessing)
  app.post("/api/increment-memory-count", requireAuth, async (req, res) => {
    try {
      const updatedProgress = await SupabaseAPI.incrementMemoryCount(req.user!.id);
      
      console.log(`Incremented memory count for ${req.user!.email} to ${updatedProgress.memories_cleared}`);
      res.json({ 
        memoriesCleared: updatedProgress.memories_cleared,
        success: true 
      });
    } catch (error: any) {
      console.error('Error incrementing memory count:', error);
      res.status(500).json({ message: "Failed to increment memory count" });
    }
  });

  // Create new EMDR session
  app.post("/api/sessions", requireAuth, async (req, res) => {
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