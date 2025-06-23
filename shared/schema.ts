import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Consulting Categories
export const ConsultingCategory = z.enum([
  "seo",
  "business-strategy",
  "financial",
  "marketing",
  "operations",
  "human-resources",
  "it-consulting",
  "legal",
  "sales",
  "customer-experience",
  "sustainability",
  "cybersecurity"
]);

export type ConsultingCategory = z.infer<typeof ConsultingCategory>;

// Consultation Request Schema
export const ConsultationRequestSchema = z.object({
  id: z.string(),
  category: ConsultingCategory,
  title: z.string(),
  description: z.string(),
  businessContext: z.string(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  status: z.enum(["pending", "analyzing", "completed"]).default("pending"),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InsertConsultationRequestSchema = ConsultationRequestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true
});

export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
export type InsertConsultationRequest = z.infer<typeof InsertConsultationRequestSchema>;

// AI Analysis Result Schema
export const AnalysisResultSchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  analysis: z.string(),
  recommendations: z.array(z.string()),
  actionItems: z.array(z.string()),
  riskAssessment: z.string().optional(),
  expectedOutcomes: z.array(z.string()),
  implementationPlan: z.string(),
  resources: z.array(z.string()),
  metrics: z.array(z.string()),
  timeline: z.string(),
  confidence: z.number().min(0).max(1),
  createdAt: z.date()
});

export const InsertAnalysisResultSchema = AnalysisResultSchema.omit({
  id: true,
  createdAt: true
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type InsertAnalysisResult = z.infer<typeof InsertAnalysisResultSchema>;

// Business Profile Schema
export const BusinessProfileSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  industry: z.string(),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"]),
  revenue: z.string().optional(),
  location: z.string().optional(),
  description: z.string(),
  currentChallenges: z.array(z.string()),
  goals: z.array(z.string()),
  competitors: z.array(z.string()),
  targetMarket: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InsertBusinessProfileSchema = BusinessProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
export type InsertBusinessProfile = z.infer<typeof InsertBusinessProfileSchema>;

// Export validation schemas for forms
export const ConsultationFormSchema = InsertConsultationRequestSchema.extend({
  category: ConsultingCategory,
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  businessContext: z.string().min(30, "Business context must be at least 30 characters"),
  urgency: z.enum(["low", "medium", "high", "critical"])
});

export const BusinessProfileFormSchema = InsertBusinessProfileSchema.extend({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be specified"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  targetMarket: z.string().min(10, "Target market must be specified")
});