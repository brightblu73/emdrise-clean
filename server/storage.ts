import { 
  users, sessions, targets, calmPlaces, resources, bilateralSessions, scriptProgression,
  type User, type InsertUser, type Session, type InsertSession,
  type Target, type InsertTarget, type CalmPlace, type InsertCalmPlace, type Resource, type InsertResource,
  type BilateralSession, type InsertBilateralSession, type ScriptProgression, type InsertScriptProgression
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserSubscriptionStatus(id: number, status: string): Promise<User>;
  updateUserTrialEndDate?(id: number, trialEndDate: Date): Promise<User>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getUserSessions(userId: number): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  updateSession(id: number, updates: Partial<InsertSession>): Promise<Session>;
  
  // Target methods
  createTarget(target: InsertTarget): Promise<Target>;
  getUserTargets(userId: number): Promise<Target[]>;
  getTarget(id: number): Promise<Target | undefined>;
  updateTarget(id: number, updates: Partial<InsertTarget>): Promise<Target>;
  
  // Calm place methods
  createCalmPlace(calmPlace: InsertCalmPlace): Promise<CalmPlace>;
  getUserCalmPlaces(userId: number): Promise<CalmPlace[]>;
  getCalmPlace(id: number): Promise<CalmPlace | undefined>;
  updateCalmPlace(id: number, updates: Partial<InsertCalmPlace>): Promise<CalmPlace>;
  
  // Resource methods
  createResource(resource: InsertResource): Promise<Resource>;
  getUserResources(userId: number): Promise<Resource[]>;
  getUserResourcesByType(userId: number, type: string): Promise<Resource[]>;
  updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: number): Promise<void>;
  
  // Bilateral session methods
  createBilateralSession(bilateralSession: InsertBilateralSession): Promise<BilateralSession>;
  getSessionBilateralSessions(sessionId: number): Promise<BilateralSession[]>;
  updateBilateralSession(id: number, updates: Partial<InsertBilateralSession>): Promise<BilateralSession>;
  

  
  // Script progression methods
  createScriptProgression(progression: InsertScriptProgression): Promise<ScriptProgression>;
  getSessionScriptProgressions(sessionId: number): Promise<ScriptProgression[]>;
  updateScriptProgression(id: number, updates: Partial<InsertScriptProgression>): Promise<ScriptProgression>;
  getCurrentSessionState(userId: number): Promise<Session | undefined>;
  advanceToNextScript(sessionId: number): Promise<Session>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7-day trial
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        trialEndsAt,
        subscriptionStatus: "trial"
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId, stripeSubscriptionId })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscriptionStatus(id: number, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserTrialEndDate(id: number, trialEndDate: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ trialEndsAt: trialEndDate })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId));
    return user || undefined;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const result = await db
      .insert(sessions)
      .values(session)
      .returning();
    return result[0];
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startedAt));
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async updateSession(id: number, updates: Partial<InsertSession>): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }

  async createTarget(target: InsertTarget): Promise<Target> {
    const result = await db
      .insert(targets)
      .values(target)
      .returning();
    return result[0];
  }

  async getUserTargets(userId: number): Promise<Target[]> {
    return await db
      .select()
      .from(targets)
      .where(eq(targets.userId, userId))
      .orderBy(desc(targets.createdAt));
  }

  async getTarget(id: number): Promise<Target | undefined> {
    const [target] = await db.select().from(targets).where(eq(targets.id, id));
    return target || undefined;
  }

  async updateTarget(id: number, updates: Partial<InsertTarget>): Promise<Target> {
    const [target] = await db
      .update(targets)
      .set(updates)
      .where(eq(targets.id, id))
      .returning();
    return target;
  }

  async createCalmPlace(calmPlace: InsertCalmPlace): Promise<CalmPlace> {
    const result = await db
      .insert(calmPlaces)
      .values(calmPlace)
      .returning();
    return result[0];
  }

  async getUserCalmPlaces(userId: number): Promise<CalmPlace[]> {
    return await db
      .select()
      .from(calmPlaces)
      .where(eq(calmPlaces.userId, userId))
      .orderBy(desc(calmPlaces.createdAt));
  }

  async getCalmPlace(id: number): Promise<CalmPlace | undefined> {
    const [calmPlace] = await db.select().from(calmPlaces).where(eq(calmPlaces.id, id));
    return calmPlace || undefined;
  }

  async updateCalmPlace(id: number, updates: Partial<InsertCalmPlace>): Promise<CalmPlace> {
    const [calmPlace] = await db
      .update(calmPlaces)
      .set(updates)
      .where(eq(calmPlaces.id, id))
      .returning();
    return calmPlace;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }

  async getUserResources(userId: number): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.userId, userId))
      .orderBy(desc(resources.createdAt));
  }

  async getUserResourcesByType(userId: number, type: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(and(eq(resources.userId, userId), eq(resources.type, type)))
      .orderBy(desc(resources.createdAt));
  }

  async updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource> {
    const [resource] = await db
      .update(resources)
      .set(updates)
      .where(eq(resources.id, id))
      .returning();
    return resource;
  }

  async deleteResource(id: number): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  async createBilateralSession(bilateralSession: InsertBilateralSession): Promise<BilateralSession> {
    const [newBilateralSession] = await db
      .insert(bilateralSessions)
      .values(bilateralSession)
      .returning();
    return newBilateralSession;
  }

  async getSessionBilateralSessions(sessionId: number): Promise<BilateralSession[]> {
    return await db
      .select()
      .from(bilateralSessions)
      .where(eq(bilateralSessions.sessionId, sessionId))
      .orderBy(desc(bilateralSessions.createdAt));
  }

  async updateBilateralSession(id: number, updates: Partial<InsertBilateralSession>): Promise<BilateralSession> {
    const [bilateralSession] = await db
      .update(bilateralSessions)
      .set(updates)
      .where(eq(bilateralSessions.id, id))
      .returning();
    return bilateralSession;
  }



  // Script progression methods
  async createScriptProgression(progression: InsertScriptProgression): Promise<ScriptProgression> {
    const [newProgression] = await db
      .insert(scriptProgression)
      .values(progression)
      .returning();
    return newProgression;
  }

  async getSessionScriptProgressions(sessionId: number): Promise<ScriptProgression[]> {
    return await db
      .select()
      .from(scriptProgression)
      .where(eq(scriptProgression.sessionId, sessionId))
      .orderBy(scriptProgression.scriptNumber);
  }

  async updateScriptProgression(id: number, updates: Partial<InsertScriptProgression>): Promise<ScriptProgression> {
    const [progression] = await db
      .update(scriptProgression)
      .set(updates)
      .where(eq(scriptProgression.id, id))
      .returning();
    return progression;
  }

  async getCurrentSessionState(userId: number): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, "active")))
      .orderBy(desc(sessions.startedAt))
      .limit(1);
    return session;
  }

  async advanceToNextScript(sessionId: number, forceNext: boolean = false): Promise<Session> {
    // Get current session
    const [currentSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!currentSession) {
      throw new Error("Session not found");
    }

    // Define script progression logic
    const scriptFlow: { [key: number]: { nextScript: number; phase: string } } = {
      1: { nextScript: 2, phase: "calm_place_setup" },      // Welcome → Calm Place Setup
      2: { nextScript: 3, phase: "target_setup" },          // Calm Place → Target Memory Setup
      3: { nextScript: 4, phase: "desensitisation_setup" }, // Target Setup → Desensitisation Setup
      4: { nextScript: 5, phase: "processing" },            // Desensitisation Setup → Processing Continued
      5: { nextScript: 5, phase: "processing" },            // Processing Loop (can repeat)
      6: { nextScript: 7, phase: "installation" },          // Installation → Installation Continued
      7: { nextScript: 7, phase: "installation" },          // Installation Loop (can repeat)
      8: { nextScript: 9, phase: "closure" },               // Body Scan → Calm Place Return
      9: { nextScript: 10, phase: "aftercare" },            // Calm Place → Aftercare
      10: { nextScript: 10, phase: "completed" }            // Aftercare (final)
    };

    const currentScript = currentSession.currentScript;
    const nextFlow = scriptFlow[currentScript];

    if (!nextFlow) {
      throw new Error("Invalid script progression");
    }

    // Manual progression for "Finished Processing" button (Script 5 → Script 6)
    if (currentScript === 5 && forceNext) {
      const [updatedSession] = await db
        .update(sessions)
        .set({
          currentScript: 6,
          phase: "installation",
          loopCount: 0
        })
        .where(eq(sessions.id, sessionId))
        .returning();
      return updatedSession;
    }

    // Manual progression for "Finished Installation" button (Script 7 → Script 8)
    if (currentScript === 7 && forceNext) {
      const [updatedSession] = await db
        .update(sessions)
        .set({
          currentScript: 8,
          phase: "body_scan",
          loopCount: 0
        })
        .where(eq(sessions.id, sessionId))
        .returning();
      return updatedSession;
    }

    // Automatic progression after minimum loops (fallback for automatic progression)
    if (currentScript === 5 && (currentSession.loopCount || 0) >= 3) {
      // After enough processing loops, move to installation
      const [updatedSession] = await db
        .update(sessions)
        .set({
          currentScript: 6,
          phase: "installation",
          loopCount: 0
        })
        .where(eq(sessions.id, sessionId))
        .returning();
      return updatedSession;
    }

    // Automatic progression after minimum loops (fallback for automatic progression)
    if (currentScript === 7 && (currentSession.loopCount || 0) >= 2) {
      // After enough installation loops, move to body scan
      const [updatedSession] = await db
        .update(sessions)
        .set({
          currentScript: 8,
          phase: "body_scan",
          loopCount: 0
        })
        .where(eq(sessions.id, sessionId))
        .returning();
      return updatedSession;
    }

    // Regular script progression
    const updates: any = {
      currentScript: nextFlow.nextScript,
      phase: nextFlow.phase
    };

    // Increment loop count for repeating scripts
    if (currentScript === nextFlow.nextScript) {
      updates.loopCount = (currentSession.loopCount || 0) + 1;
    } else {
      updates.loopCount = 0;
    }

    // Mark session as complete if we reach closure
    if (nextFlow.nextScript === 9 && currentScript === 9) {
      updates.status = "complete";
      updates.completedAt = new Date();
    }

    const [updatedSession] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, sessionId))
      .returning();

    return updatedSession;
  }
}

export const storage = new DatabaseStorage();
