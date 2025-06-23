# ContentScale Consulting AI App 1 - Technical Specifications

## Application Architecture

### High-Level System Design
```
┌─────────────────────────────────────────────────────────────┐
│                    ContentScale App                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Vite)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    Home     │ │  Dashboard  │ │ Consultation│           │
│  │    Page     │ │    View     │ │    Forms    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Analysis   │ │  Business   │ │  Download   │           │
│  │  Results    │ │  Profile    │ │    Page     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  Backend (Express + TypeScript)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    API      │ │   Agent     │ │  Security   │           │
│  │   Routes    │ │   Routes    │ │ Middleware  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Storage   │ │     AI      │ │   Export    │           │
│  │   System    │ │ Consultant  │ │   System    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │   Google    │ │   Agent     │                           │
│  │  Gemini AI  │ │Integration  │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Component Specifications

### Frontend Components

#### 1. Navigation Component (`client/src/components/Navigation.tsx`)
```typescript
interface NavigationProps {
  // Uses wouter for routing
  // Displays current location highlight
  // Theme toggle functionality
  // Contact email display
}

Features:
- Responsive design with mobile collapse
- Active route highlighting
- Dark/light theme toggle
- Brand logo with ContentScale branding
```

#### 2. Home Page (`client/src/pages/Home.tsx`)
```typescript
interface HomePageSections {
  hero: {
    title: "Professional Business Consulting"
    subtitle: "Powered by AI"
    primaryCTA: "Start Free Consultation"
    secondaryCTA: "View Dashboard"
  }
  features: {
    items: string[] // 6 key features
    layout: "grid"
  }
  consultingAreas: {
    categories: ConsultingCategory[] // 12 categories
    display: "card-grid"
  }
  download: {
    component: "DownloadButton"
    prominence: "high"
  }
  contact: {
    email: "consultant@contentscale.site"
    finalCTA: "Transform Your Business"
  }
}
```

#### 3. Dashboard (`client/src/pages/Dashboard.tsx`)
```typescript
interface DashboardComponents {
  statistics: {
    totalConsultations: number
    completedAnalyses: number
    pendingRequests: number
    analyzingCount: number
  }
  consultationList: {
    sorting: "createdAt DESC"
    statusFiltering: boolean
    pagination: false // All shown
    actions: ["viewAnalysis", "downloadReport"]
  }
  statusIndicators: {
    completed: "green"
    analyzing: "yellow"
    pending: "gray"
    icons: "lucide-react"
  }
}
```

#### 4. Consultation Form (`client/src/pages/ConsultationForm.tsx`)
```typescript
interface ConsultationFormFields {
  category: {
    type: "select"
    options: ConsultingCategory[]
    icons: "per-category"
    descriptions: "detailed"
  }
  title: {
    type: "text"
    validation: "min 10 chars"
    placeholder: "Brief description of challenge"
  }
  description: {
    type: "textarea"
    validation: "min 50 chars"
    placeholder: "Detailed challenge description"
  }
  businessContext: {
    type: "textarea"
    validation: "min 30 chars"
    placeholder: "Business environment and constraints"
  }
  urgency: {
    type: "select"
    options: ["low", "medium", "high", "critical"]
    descriptions: "per-level"
  }
  budget: {
    type: "text"
    optional: true
    placeholder: "e.g., $10,000 - $50,000"
  }
  timeline: {
    type: "text"
    optional: true
    placeholder: "e.g., Need results in 2 weeks"
  }
}
```

#### 5. Analysis Results (`client/src/pages/AnalysisResults.tsx`)
```typescript
interface AnalysisResultsLayout {
  header: {
    consultationTitle: string
    category: string
    timestamp: string
    confidenceScore: number
    downloadButton: "prominent"
  }
  mainContent: {
    executiveAnalysis: "prose-formatted"
    recommendations: "numbered-list"
    implementationPlan: "structured-text"
    expectedOutcomes: "bulleted-list"
  }
  sidebar: {
    actionItems: "checkbox-list"
    requiredResources: "icon-list"
    successMetrics: "bulleted-list"
    riskAssessment: "conditional-display"
  }
  downloadFeature: {
    format: "text-file"
    naming: "category-date.txt"
    content: "complete-report"
  }
}
```

### Backend API Specifications

#### 1. Main Routes (`server/routes.ts`)
```typescript
interface APIEndpoints {
  consultations: {
    "POST /api/consultations": {
      input: ConsultationFormSchema
      process: "create -> analyze -> complete"
      output: ConsultationRequest
    }
    "GET /api/consultations": {
      output: ConsultationRequest[]
      sorting: "createdAt DESC"
    }
    "GET /api/consultations/:id": {
      output: ConsultationRequest | 404
    }
  }
  analysis: {
    "GET /api/analysis/:consultationId": {
      output: AnalysisResult | 404
    }
    "GET /api/analysis": {
      output: AnalysisResult[]
    }
  }
  businessProfiles: {
    "POST /api/business-profiles": {
      input: BusinessProfileFormSchema
      output: BusinessProfile
    }
    "GET /api/business-profiles": {
      output: BusinessProfile[]
    }
    "GET /api/business-profiles/:id": {
      output: BusinessProfile | 404
    }
  }
  businessOverview: {
    "POST /api/business-overview": {
      input: { businessContext: string, industry: string }
      output: { overview: string }
    }
  }
}
```

#### 2. Agent Routes (`server/agent-api.ts`)
```typescript
interface AgentAPIEndpoints {
  "GET /api/agent/status": {
    output: {
      status: "active"
      name: "ContentScale Consulting AI App"
      version: "1.0.0"
      capabilities: string[]
      categories: ConsultingCategory[]
      contact: "consultant@contentscale.site"
    }
  }
  "POST /api/agent/batch-consultations": {
    input: { consultations: InsertConsultationRequest[] }
    output: {
      processed: number
      results: Array<{
        consultationId: string
        status: "completed" | "error"
        analysis?: AnalysisResult
        error?: string
      }>
    }
  }
  "GET /api/agent/export-data": {
    output: {
      exportedAt: string
      summary: {
        totalConsultations: number
        completedAnalyses: number
        businessProfiles: number
      }
      data: {
        consultations: ConsultationRequest[]
        analyses: AnalysisResult[]
        profiles: BusinessProfile[]
      }
    }
  }
  "POST /api/agent/quick-analysis": {
    input: {
      category: ConsultingCategory
      title: string
      description: string
      businessContext: string
      urgency?: "low" | "medium" | "high" | "critical"
    }
    output: {
      consultationId: string
      analysis: AnalysisResult
      status: "completed"
    }
  }
  "GET /api/agent/health": {
    output: {
      status: "healthy"
      timestamp: string
      uptime: number
      memory: NodeJS.MemoryUsage
      environment: string
    }
  }
}
```

### AI Integration Specifications

#### Gemini AI Configuration (`server/ai-consultant.ts`)
```typescript
interface GeminiConfig {
  model: "gemini-2.5-pro"
  apiKey: process.env.GEMINI_API_KEY
  responseFormat: "application/json"
  
  consultingExpertise: {
    [category: string]: {
      systemPrompt: string // Expert-level persona
      analysisFramework: string[] // 6 analysis areas
      keyMetrics: string[] // Success indicators
    }
  }
}

interface AnalysisGeneration {
  input: ConsultationRequest
  processing: {
    1: "Category-specific system prompt"
    2: "Structured analysis framework"
    3: "JSON schema validation"
    4: "Confidence scoring"
  }
  output: {
    analysis: string // Executive summary
    recommendations: string[] // Actionable items
    actionItems: string[] // Immediate steps
    riskAssessment: string // Risk evaluation
    expectedOutcomes: string[] // Predicted results
    implementationPlan: string // Step-by-step guide
    resources: string[] // Required resources
    metrics: string[] // Success KPIs
    timeline: string // Implementation timeline
    confidence: number // 0-1 confidence score
  }
}
```

### Security Implementation

#### Security Middleware (`server/security.ts`)
```typescript
interface SecurityFeatures {
  rateLimiting: {
    implementation: "custom-sliding-window"
    generalAPI: "100 requests / 15 minutes"
    agentAPI: "50 requests / 5 minutes"
    tracking: "IP-based"
  }
  
  corsConfiguration: {
    allowedOrigins: [
      "http://localhost:3000",
      "http://localhost:5173", 
      "https://*.replit.app",
      "https://*.repl.co",
      /\.contentscale\.site$/
    ]
    credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    headers: ["Content-Type", "Authorization", "x-api-key"]
  }
  
  inputSanitization: {
    xssProtection: "script tag removal"
    urlSanitization: "javascript: protocol removal"
    eventHandlerRemoval: "on* attribute removal"
  }
  
  securityHeaders: {
    "X-Content-Type-Options": "nosniff"
    "X-Frame-Options": "DENY"
    "X-XSS-Protection": "1; mode=block"
    "Referrer-Policy": "strict-origin-when-cross-origin"
    "Content-Security-Policy": "default-src 'self'"
  }
  
  apiKeyValidation: {
    writeOperations: "required"
    minimumLength: 10
    headerNames: ["x-api-key", "apiKey"]
  }
}
```

### Data Schema Specifications

#### Core Schemas (`shared/schema.ts`)
```typescript
// Complete Zod schema definitions
export const ConsultingCategory = z.enum([
  "seo", "business-strategy", "financial", "marketing",
  "operations", "human-resources", "it-consulting", "legal",
  "sales", "customer-experience", "sustainability", "cybersecurity"
]);

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
```

### Storage System Implementation

#### In-Memory Storage (`server/storage.ts`)
```typescript
interface StorageImplementation {
  dataStructures: {
    consultationRequests: "Map<string, ConsultationRequest>"
    analysisResults: "Map<string, AnalysisResult>" // Key: consultationId
    businessProfiles: "Map<string, BusinessProfile>"
  }
  
  idGeneration: {
    algorithm: "Math.random() + Date.now()"
    format: "base36"
    uniqueness: "guaranteed-per-session"
  }
  
  operations: {
    create: "auto-generate ID and timestamps"
    read: "by ID or list all"
    update: "partial updates with timestamp"
    delete: "not implemented (data preservation)"
  }
  
  dataConsistency: {
    timestamps: "automatic"
    statusTracking: "consultation lifecycle"
    relationships: "consultationId linkage"
  }
}
```

### Development Server Configuration

#### Dev Server Setup (`dev-server.ts`)
```typescript
interface DevServerConfig {
  viteIntegration: {
    middlewareMode: true
    appType: "spa"
    root: "./client"
    aliasResolution: {
      "@": "/src"
      "@shared": "../shared"
      "@assets": "/src/assets"
    }
  }
  
  expressSetup: {
    middlewareOrder: [
      "cors",
      "securityHeaders", 
      "sanitizeInput",
      "agentAuth",
      "rateLimiting",
      "express.json",
      "apiRoutes",
      "agentRoutes",
      "viteMiddleware"
    ]
  }
  
  portConfiguration: {
    default: 5173
    binding: "0.0.0.0"
    environment: "process.env.PORT"
  }
}
```

### Build and Deployment

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"],
      "@assets/*": ["./client/src/assets/*"]
    }
  }
}
```

#### Package Dependencies
```json
{
  "dependencies": {
    "@google/genai": "^1.6.0",
    "@hookform/resolvers": "^5.1.1",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-toast": "^1.2.14",
    "@tanstack/react-query": "^5.81.2",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "autoprefixer": "^10.4.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cors": "^2.8.5",
    "drizzle-orm": "^0.44.2",
    "drizzle-zod": "^0.8.2",
    "express": "^5.1.0",
    "express-rate-limit": "^7.1.5",
    "lucide-react": "^0.522.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.58.1",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.10",
    "tsx": "^4.20.3",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "wouter": "^3.7.1",
    "zod": "^3.25.67"
  }
}
```

This technical specification provides complete implementation details for exact replication of the ContentScale Consulting AI App 1.