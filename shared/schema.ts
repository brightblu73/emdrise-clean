import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStatus: text("subscription_status").default("trial"), // trial, active, cancelled, expired
  preferredTherapist: text("preferred_therapist").default("female"), // female, male
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentScript: integer("current_script").notNull().default(1), // 1: Welcome, 2: Calm Place, 3: Target Setup, 4: Reprocessing, 5: Reprocessing Continued, 6: Installation, 7: Installation Continued, 8: Body Scan, 9: Calm Place Return, 10: Aftercare
  phase: text("phase").notNull().default("introduction"), // introduction, calm_place_setup, target_setup, reprocessing, installation, body_scan, calm_place_return, aftercare
  status: text("status").notNull().default("active"), // active, paused, complete
  targetId: integer("target_id"),
  calmPlaceId: integer("calm_place_id"),
  loopCount: integer("loop_count").default(0), // Tracks repetitions for scripts 5 and 7
  sudsRating: integer("suds_rating"), // Current SUDS rating (0-10)
  vocRating: integer("voc_rating"), // Current VOC rating (1-7)
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

export const targets = pgTable("targets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: integer("session_id"),
  targetMemory: text("target_memory").notNull(),
  worstPartImage: text("worst_part_image"),
  negativeCognition: text("negative_cognition"),
  positiveCognition: text("positive_cognition"),
  initialVoc: decimal("initial_voc", { precision: 2, scale: 1 }),
  finalVoc: decimal("final_voc", { precision: 2, scale: 1 }),
  emotions: text("emotions"),
  initialSuds: integer("initial_suds"),
  finalSuds: integer("final_suds"),
  bodyLocation: text("body_location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calmPlaces = pgTable("calm_places", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: integer("session_id"),
  imageDescription: text("image_description").notNull(),
  sensoryDetails: text("sensory_details").notNull(),
  positiveEmotion: text("positive_emotion").notNull(),
  bodyLocation: text("body_location").notNull(),
  cueWord: text("cue_word").notNull(),
  reminderPrompt: text("reminder_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // safe_place, wise_figure, protective_figure
  name: text("name").notNull(),
  description: text("description").notNull(),
  visualization: text("visualization"),
  qualities: text("qualities").array(),
  strengthRating: integer("strength_rating"), // 1-10
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bilateralSessions = pgTable("bilateral_sessions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  type: text("type").notNull(), // visual, auditory, tactile
  duration: integer("duration"), // in seconds
  speed: text("speed").default("medium"), // slow, medium, fast
  direction: text("direction"), // horizontal, vertical, diagonal
  setsCompleted: integer("sets_completed").default(24), // Changed from 22 to 24 sets
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});



export const scriptProgression = pgTable("script_progression", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  scriptNumber: integer("script_number").notNull(), // 1-10: Welcome, Calm Place, Target Setup, Reprocessing, Reprocessing Continued, Installation, Installation Continued, Body Scan, Calm Place Return, Aftercare
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  userInput: jsonb("user_input"), // Store ratings, responses, notes
  status: text("status").notNull().default("in_progress"), // in_progress, completed, skipped
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  targets: many(targets),
  calmPlaces: many(calmPlaces),
  resources: many(resources),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  target: one(targets, {
    fields: [sessions.targetId],
    references: [targets.id],
  }),
  calmPlace: one(calmPlaces, {
    fields: [sessions.calmPlaceId],
    references: [calmPlaces.id],
  }),
  bilateralSessions: many(bilateralSessions),
  scriptProgressions: many(scriptProgression),
}));

export const targetsRelations = relations(targets, ({ one, many }) => ({
  user: one(users, {
    fields: [targets.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [targets.sessionId],
    references: [sessions.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  user: one(users, {
    fields: [resources.userId],
    references: [users.id],
  }),
}));

export const bilateralSessionsRelations = relations(bilateralSessions, ({ one }) => ({
  session: one(sessions, {
    fields: [bilateralSessions.sessionId],
    references: [sessions.id],
  }),
}));



export const calmPlacesRelations = relations(calmPlaces, ({ one }) => ({
  user: one(users, {
    fields: [calmPlaces.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [calmPlaces.sessionId],
    references: [sessions.id],
  }),
}));

export const scriptProgressionRelations = relations(scriptProgression, ({ one }) => ({
  session: one(sessions, {
    fields: [scriptProgression.sessionId],
    references: [sessions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

// Extended user schema for internal operations (like test user creation)
export const insertUserExtendedSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startedAt: true,
});

export const insertTargetSchema = createInsertSchema(targets).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertBilateralSessionSchema = createInsertSchema(bilateralSessions).omit({
  id: true,
  createdAt: true,
});



export const insertCalmPlaceSchema = createInsertSchema(calmPlaces).omit({
  id: true,
  createdAt: true,
});

export const insertScriptProgressionSchema = createInsertSchema(scriptProgression).omit({
  id: true,
  startedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Target = typeof targets.$inferSelect;
export type InsertTarget = z.infer<typeof insertTargetSchema>;
export type CalmPlace = typeof calmPlaces.$inferSelect;
export type InsertCalmPlace = z.infer<typeof insertCalmPlaceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type BilateralSession = typeof bilateralSessions.$inferSelect;
export type InsertBilateralSession = z.infer<typeof insertBilateralSessionSchema>;

export type ScriptProgression = typeof scriptProgression.$inferSelect;
export type InsertScriptProgression = z.infer<typeof insertScriptProgressionSchema>;
