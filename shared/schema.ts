import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").default(0),
  freeArticlesUsed: integer("free_articles_used").default(0),
  hasOwnApiKey: boolean("has_own_api_key").default(false),
  apiKeys: jsonb("api_keys"), // Store encrypted API keys
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated content table - fingerprint-based
export const generatedContent = pgTable("generated_content", {
  id: varchar("id").primaryKey().notNull(),
  fingerprint: varchar("fingerprint").notNull(),
  ipAddress: varchar("ip_address").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  seoScore: integer("seo_score"),
  metadata: jsonb("metadata"), // topic, audience, keywords, etc.
  paymentMethod: varchar("payment_method"), // 'free', 'credits', 'payment', 'api_key'
  creditsUsed: integer("credits_used"),
  aiModel: varchar("ai_model"),
  contentType: varchar("content_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Keyword research sessions - fingerprint-based
export const keywordSessions = pgTable("keyword_sessions", {
  id: varchar("id").primaryKey().notNull(),
  fingerprint: varchar("fingerprint").notNull(),
  ipAddress: varchar("ip_address").notNull(),
  mainKeyword: varchar("main_keyword").notNull(),
  selectedWebsite: varchar("selected_website"),
  keywords: jsonb("keywords"), // Array of keyword data
  titles: jsonb("titles"), // Array of title data
  outlines: jsonb("outlines"), // Array of outline data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business consultations - fingerprint-based
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().notNull(),
  fingerprint: varchar("fingerprint").notNull(),
  ipAddress: varchar("ip_address").notNull(),
  category: varchar("category").notNull(),
  businessName: varchar("business_name").notNull(),
  industry: varchar("industry").notNull(),
  description: text("description").notNull(),
  specificChallenges: jsonb("specific_challenges"), // Array of strings
  goals: jsonb("goals"), // Array of strings
  timeline: varchar("timeline").notNull(),
  budget: varchar("budget").notNull(),
  analysis: text("analysis"),
  recommendations: jsonb("recommendations"), // Array of strings
  status: varchar("status").default("pending"), // 'pending', 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User websites for keyword research - fingerprint-based
export const userWebsites = pgTable("user_websites", {
  id: varchar("id").primaryKey().notNull(),
  fingerprint: varchar("fingerprint").notNull(),
  domain: varchar("domain").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fraud detection table
export const fraudDetection = pgTable("fraud_detection", {
  id: varchar("id").primaryKey().notNull(),
  fingerprint: varchar("fingerprint").notNull(),
  ipAddress: varchar("ip_address").notNull(),
  userAgent: text("user_agent"),
  requestCount: integer("request_count").default(1),
  contentGenerated: integer("content_generated").default(0),
  creditsUsed: integer("credits_used").default(0),
  suspiciousActivity: boolean("suspicious_activity").default(false),
  vpnDetected: boolean("vpn_detected").default(false),
  proxyDetected: boolean("proxy_detected").default(false),
  countryCode: varchar("country_code"),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertGeneratedContent = typeof generatedContent.$inferInsert;
export type GeneratedContent = typeof generatedContent.$inferSelect;

export type InsertKeywordSession = typeof keywordSessions.$inferInsert;
export type KeywordSession = typeof keywordSessions.$inferSelect;

export type InsertConsultation = typeof consultations.$inferInsert;
export type Consultation = typeof consultations.$inferSelect;

export type InsertUserWebsite = typeof userWebsites.$inferInsert;
export type UserWebsite = typeof userWebsites.$inferSelect;

// Zod schemas for validation
export const ContentGenerationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  audience: z.string().min(1, "Target audience is required"),
  niche: z.string().min(1, "Niche is required"),
  keywords: z.string().min(1, "Keywords are required"),
  wordCount: z.number().min(100).max(5000),
  language: z.string().default("English"),
  tone: z.string().default("professional"),
  contentType: z.string().default("blog"),
  aiModel: z.string().default("default")
});

export const ConsultationRequestSchema = z.object({
  category: z.string().min(1, "Category is required"),
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specificChallenges: z.array(z.string()).min(1, "At least one challenge is required"),
  goals: z.array(z.string()).min(1, "At least one goal is required"),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.string().min(1, "Budget is required")
});

export const KeywordResearchSchema = z.object({
  mainKeyword: z.string().min(1, "Main keyword is required"),
  niche: z.string().optional(),
  audience: z.string().optional(),
  count: z.number().min(1).max(50).default(1)
});

export const WebsiteSchema = z.object({
  domain: z.string().min(1, "Domain is required")
});

export type ContentFormData = z.infer<typeof ContentGenerationSchema>;
export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
export type KeywordResearchRequest = z.infer<typeof KeywordResearchSchema>;
export type WebsiteRequest = z.infer<typeof WebsiteSchema>;