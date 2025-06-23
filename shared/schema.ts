import { z } from 'zod';

// Consulting categories
export const ConsultingCategories = [
  'seo',
  'business_strategy',
  'financial',
  'marketing',
  'operations',
  'hr',
  'it',
  'legal',
  'sales',
  'customer_experience',
  'sustainability',
  'cybersecurity'
] as const;

export type ConsultingCategory = typeof ConsultingCategories[number];

// Base schemas
export const ConsultationRequestSchema = z.object({
  category: z.enum(ConsultingCategories),
  businessName: z.string().min(1, 'Business name is required').max(100),
  industry: z.string().min(1, 'Industry is required').max(50),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  specificChallenges: z.array(z.string().min(1).max(200)).min(1, 'At least one challenge is required').max(10),
  goals: z.array(z.string().min(1).max(200)).min(1, 'At least one goal is required').max(10),
  timeline: z.enum(['immediate', '1-3_months', '3-6_months', '6-12_months', '12+_months']),
  budget: z.enum(['under_5k', '5k-15k', '15k-50k', '50k-100k', '100k+']),
});

export const BusinessProfileSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  industry: z.string().min(1, 'Industry is required').max(50),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  challenges: z.array(z.string().min(1).max(200)).max(20),
  goals: z.array(z.string().min(1).max(200)).max(20),
});

// Type exports
export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;