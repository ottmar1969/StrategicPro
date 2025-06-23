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

export const AnalysisResultSchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  category: z.enum(ConsultingCategories),
  analysis: z.string(),
  recommendations: z.array(z.string()),
  createdAt: z.string(),
  status: z.enum(['completed', 'failed']),
});

export const BusinessOverviewSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  overview: z.string(),
  keyInsights: z.array(z.string()),
  createdAt: z.string(),
});

export const ContentGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000),
  category: z.enum(ConsultingCategories),
  businessContext: z.object({
    businessName: z.string().optional(),
    industry: z.string().optional(),
    targetAudience: z.string().optional(),
    goals: z.array(z.string()).optional(),
  }).optional(),
});

// Form validation schemas
export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Valid email is required'),
  company: z.string().min(1, 'Company is required').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type BusinessOverview = z.infer<typeof BusinessOverviewSchema>;
export type ContentGeneration = z.infer<typeof ContentGenerationSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type AdminLogin = z.infer<typeof AdminLoginSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;

// Utility functions
export function validateConsultingCategory(category: string): category is ConsultingCategory {
  return ConsultingCategories.includes(category as ConsultingCategory);
}

export function getCategoryDisplayName(category: ConsultingCategory): string {
  const displayNames: Record<ConsultingCategory, string> = {
    seo: 'SEO & Digital Marketing',
    business_strategy: 'Business Strategy',
    financial: 'Financial Planning',
    marketing: 'Marketing Strategy',
    operations: 'Operations Management',
    hr: 'Human Resources',
    it: 'Information Technology',
    legal: 'Legal & Compliance',
    sales: 'Sales Strategy',
    customer_experience: 'Customer Experience',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity'
  };
  
  return displayNames[category] || category;
}

export function getTimelineDisplayName(timeline: string): string {
  const displayNames: Record<string, string> = {
    immediate: 'Immediate (ASAP)',
    '1-3_months': '1-3 Months',
    '3-6_months': '3-6 Months',
    '6-12_months': '6-12 Months',
    '12+_months': '12+ Months'
  };
  
  return displayNames[timeline] || timeline;
}

export function getBudgetDisplayName(budget: string): string {
  const displayNames: Record<string, string> = {
    under_5k: 'Under $5,000',
    '5k-15k': '$5,000 - $15,000',
    '15k-50k': '$15,000 - $50,000',
    '50k-100k': '$50,000 - $100,000',
    '100k+': '$100,000+'
  };
  
  return displayNames[budget] || budget;
}

