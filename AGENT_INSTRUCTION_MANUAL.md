# ContentScale Consulting AI App 1 - Agent Instruction Manual

## Project Overview for Agent Replication

**Application Name**: ContentScale Consulting AI App 1  
**Version**: 1.0.0  
**Type**: AI-Powered Business Consulting Platform  
**Contact**: consultant@contentscale.site  
**Package Size**: 47,682 bytes  

## Step-by-Step Replication Instructions

### Phase 1: Environment Setup

1. **Initialize Node.js Project**
   ```bash
   mkdir contentscale-consulting-ai-app-1
   cd contentscale-consulting-ai-app-1
   npm init -y
   ```

2. **Install Core Dependencies**
   ```bash
   npm install @google/genai@^1.6.0 @hookform/resolvers@^5.1.1 @radix-ui/react-select@^2.2.5 @radix-ui/react-slot@^1.2.3 @radix-ui/react-toast@^1.2.14 @tanstack/react-query@^5.81.2 @types/react@^19.1.8 @types/react-dom@^19.1.6 @vitejs/plugin-react@^4.5.2 autoprefixer@^10.4.21 class-variance-authority@^0.7.1 clsx@^2.1.1 cors@^2.8.5 drizzle-orm@^0.44.2 drizzle-zod@^0.8.2 express@^5.1.0 express-rate-limit@^7.1.5 lucide-react@^0.522.0 postcss@^8.5.6 react@^19.1.0 react-dom@^19.1.0 react-hook-form@^7.58.1 react-icons@^5.5.0 tailwind-merge@^3.3.1 tailwindcss@^4.1.10 tsx@^4.20.3 typescript@^5.8.3 vite@^6.3.5 wouter@^3.7.1 zod@^3.25.67 archiver
   ```

3. **Create TypeScript Configuration**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["./client/src/*"],
         "@shared/*": ["./shared/*"],
         "@assets/*": ["./client/src/assets/*"]
       }
     },
     "include": ["client/src", "shared", "server"]
   }
   ```

### Phase 2: Project Structure Creation

4. **Create Directory Structure**
   ```bash
   mkdir -p client/src/{components/ui,pages,contexts,hooks,lib}
   mkdir -p client/public/downloads
   mkdir -p server
   mkdir -p shared
   ```

5. **Create Configuration Files**
   ```javascript
   // tailwind.config.ts
   import type { Config } from "tailwindcss";
   
   const config: Config = {
     darkMode: ["class"],
     content: ["./client/src/**/*.{js,ts,jsx,tsx,mdx}", "./client/index.html"],
     theme: {
       container: { center: true, padding: "2rem" },
       extend: {
         colors: {
           border: "hsl(var(--border))",
           background: "hsl(var(--background))",
           foreground: "hsl(var(--foreground))",
           primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }
         }
       }
     }
   };
   export default config;
   ```

### Phase 3: Shared Schema Implementation

6. **Create Data Schemas** (`shared/schema.ts`)
   ```typescript
   import { z } from "zod";
   import { createInsertSchema } from "drizzle-zod";
   
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
   
   // Add AnalysisResult and BusinessProfile schemas following same pattern
   ```

### Phase 4: Backend Implementation

7. **Create Storage System** (`server/storage.ts`)
   ```typescript
   import { ConsultationRequest, AnalysisResult, BusinessProfile } from "../shared/schema.js";
   
   export interface IStorage {
     createConsultationRequest(data: any): Promise<ConsultationRequest>;
     getConsultationRequest(id: string): Promise<ConsultationRequest | null>;
     getAllConsultationRequests(): Promise<ConsultationRequest[]>;
     updateConsultationRequestStatus(id: string, status: string): Promise<void>;
     // Add all CRUD operations for each entity
   }
   
   export class MemStorage implements IStorage {
     private consultationRequests = new Map<string, ConsultationRequest>();
     private analysisResults = new Map<string, AnalysisResult>();
     private businessProfiles = new Map<string, BusinessProfile>();
     
     private generateId(): string {
       return Math.random().toString(36).substring(2) + Date.now().toString(36);
     }
     
     // Implement all interface methods
   }
   ```

8. **Create AI Integration** (`server/ai-consultant.ts`)
   ```typescript
   import { GoogleGenAI } from "@google/genai";
   import { ConsultationRequest, InsertAnalysisResult } from "../shared/schema.js";
   
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
   
   const CONSULTING_EXPERTISE = {
     "seo": {
       systemPrompt: "You are a world-class SEO consultant...",
       analysisFramework: ["Technical SEO audit", "Keyword research", ...],
       keyMetrics: ["Organic traffic growth", "Keyword rankings", ...]
     },
     // Add all 12 consulting categories with detailed prompts
   };
   
   export async function generateConsultingAnalysis(request: ConsultationRequest): Promise<InsertAnalysisResult> {
     // Implementation with Gemini API call and JSON response parsing
   }
   ```

9. **Create API Routes** (`server/routes.ts`)
   ```typescript
   import express from "express";
   import { storage } from "./storage.js";
   import { generateConsultingAnalysis } from "./ai-consultant.js";
   
   const router = express.Router();
   
   router.post("/api/consultations", async (req, res) => {
     // Validate input, create consultation, trigger analysis
   });
   
   router.get("/api/consultations", async (req, res) => {
     // Return all consultations
   });
   
   // Add all API endpoints
   ```

10. **Create Agent API** (`server/agent-api.ts`)
    ```typescript
    import express from 'express';
    import { storage } from './storage.js';
    
    const router = express.Router();
    
    router.get('/api/agent/status', (req, res) => {
      res.json({
        status: 'active',
        name: 'ContentScale Consulting AI App',
        version: '1.0.0',
        capabilities: ['business-consulting', 'ai-analysis', 'report-generation'],
        categories: ['seo', 'business-strategy', /* all 12 categories */],
        contact: 'consultant@contentscale.site'
      });
    });
    
    // Add batch processing, export, quick analysis endpoints
    ```

11. **Create Security Middleware** (`server/security.ts`)
    ```typescript
    import { Request, Response, NextFunction } from 'express';
    
    export const createRateLimit = (windowMs: number, max: number) => {
      // Custom rate limiting implementation
    };
    
    export const corsOptions = {
      origin: ["http://localhost:3000", "http://localhost:5173", /* more origins */],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    };
    
    // Add all security middleware functions
    ```

### Phase 5: Frontend Implementation

12. **Create UI Components** (`client/src/components/ui/`)
    ```typescript
    // button.tsx, card.tsx, form.tsx, input.tsx, select.tsx, textarea.tsx, badge.tsx, toast.tsx
    // Use shadcn/ui component patterns with Tailwind CSS styling
    ```

13. **Create Theme Context** (`client/src/contexts/ThemeContext.tsx`)
    ```typescript
    import React, { createContext, useContext, useEffect, useState } from "react";
    
    type Theme = "light" | "dark";
    
    interface ThemeContextProps {
      theme: Theme;
      toggleTheme: () => void;
    }
    
    // Implementation with localStorage persistence
    ```

14. **Create Page Components**
    - `client/src/pages/Home.tsx` - Landing page with hero, features, categories
    - `client/src/pages/Dashboard.tsx` - Stats and consultation management
    - `client/src/pages/ConsultationForm.tsx` - Multi-step consultation creation
    - `client/src/pages/AnalysisResults.tsx` - Detailed analysis display
    - `client/src/pages/BusinessProfile.tsx` - Company profile management
    - `client/src/pages/Download.tsx` - Package download interface

15. **Create Navigation** (`client/src/components/Navigation.tsx`)
    ```typescript
    import { Link, useLocation } from "wouter";
    import { useTheme } from "@/contexts/ThemeContext";
    
    export default function Navigation() {
      // Implementation with responsive design and theme toggle
    }
    ```

16. **Create Main App** (`client/src/App.tsx`)
    ```typescript
    import { Route, Router } from "wouter";
    import { ThemeProvider } from "./contexts/ThemeContext";
    
    function App() {
      return (
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <Router>
              <Route path="/" component={Home} />
              <Route path="/dashboard" component={Dashboard} />
              {/* All routes */}
            </Router>
          </div>
        </ThemeProvider>
      );
    }
    ```

### Phase 6: Development Server Setup

17. **Create Development Server** (`dev-server.ts`)
    ```typescript
    import express from "express";
    import cors from "cors";
    import path from "path";
    import { createServer as createViteServer } from "vite";
    import routes from "./server/routes.js";
    import agentRoutes from "./server/agent-api.js";
    import { corsOptions, securityHeaders, sanitizeInput, agentAuth, createRateLimit } from "./server/security.js";
    
    async function startServer() {
      const app = express();
      
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
        root: "./client",
        resolve: {
          alias: {
            "@": "/src",
            "@shared": "../shared",
            "@assets": "/src/assets",
          },
        },
      });
      
      // Security middleware
      app.use(cors(corsOptions));
      app.use(securityHeaders);
      app.use(sanitizeInput);
      app.use(agentAuth);
      app.use('/api/', createRateLimit(15 * 60 * 1000, 100));
      app.use('/api/agent/', createRateLimit(5 * 60 * 1000, 50));
      
      app.use(express.json());
      app.use(vite.ssrFixStacktrace);
      
      // API routes
      app.use(routes);
      app.use(agentRoutes);
      
      // Vite middleware
      app.use(vite.middlewares);
      
      const port = process.env.PORT || 5173;
      app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 ContentScale running on http://0.0.0.0:${port}`);
        console.log(`📧 Contact: consultant@contentscale.site`);
      });
    }
    
    startServer().catch(console.error);
    ```

### Phase 7: Frontend Entry Point

18. **Create HTML Template** (`client/index.html`)
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ContentScale - Professional Business Consulting</title>
        <meta name="description" content="ContentScale provides expert business consulting across SEO, strategy, finance, marketing, operations, HR, IT, legal, sales, customer experience, sustainability, and cybersecurity." />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
    ```

19. **Create React Entry Point** (`client/src/main.tsx`)
    ```typescript
    import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
    import App from './App.tsx'
    import './index.css'
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 5 * 60 * 1000, retry: 1 },
      },
    })
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    )
    ```

20. **Create Global Styles** (`client/src/index.css`)
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    :root {
      --background: hsl(220, 20%, 97%);
      --foreground: hsl(220, 20%, 10%);
      --primary: hsl(221, 83%, 53%);
      --primary-foreground: hsl(210, 40%, 98%);
      /* All CSS custom properties */
    }
    
    .dark {
      --background: hsl(222, 84%, 4%);
      --foreground: hsl(210, 40%, 98%);
      /* Dark mode variables */
    }
    ```

### Phase 8: Consulting Categories Implementation

21. **Implement All 12 Categories in AI Consultant**
    ```typescript
    // In server/ai-consultant.ts
    const CONSULTING_EXPERTISE = {
      "seo": {
        systemPrompt: "You are a world-class SEO consultant with deep expertise in technical SEO, content strategy, and search engine algorithms.",
        analysisFramework: [
          "Technical SEO audit and site structure analysis",
          "Keyword research and competitive analysis",
          "Content gap analysis and optimization opportunities",
          "Link building strategy and authority building", 
          "Local SEO and mobile optimization",
          "Core Web Vitals and page experience factors"
        ],
        keyMetrics: ["Organic traffic growth", "Keyword rankings", "Click-through rates", "Core Web Vitals scores", "Backlink quality", "Conversion rate"]
      },
      // Implement all 12 categories with detailed expertise
    };
    ```

### Phase 9: Testing and Validation

22. **Environment Variable Setup**
    ```bash
    export GEMINI_API_KEY="your_gemini_api_key_here"
    export NODE_ENV="development"
    export PORT="5173"
    ```

23. **Start Development Server**
    ```bash
    tsx dev-server.ts
    ```

24. **Test All Functionality**
    - Navigate to http://localhost:5173
    - Test consultation creation for each category
    - Verify AI analysis generation
    - Test dashboard functionality
    - Validate agent API endpoints
    - Check download functionality

### Phase 10: Package Creation

25. **Create Backup Script** (`backup-script.js`)
    ```javascript
    const archiver = require('archiver');
    const fs = require('fs');
    
    // Create zip with all project files
    // Filename: ContentScale-Consulting-AI-App-1-[timestamp].zip
    ```

26. **Generate Documentation**
    - README.md with installation instructions
    - DEPLOYMENT.md with production setup
    - AGENT_INTEGRATION_GUIDE.md with API documentation

## Critical Implementation Notes

### AI Prompts Must Include:
- Expert-level system prompts for each consulting category
- Structured analysis frameworks (6 points each)
- Industry-specific key performance indicators
- JSON response schema validation
- Confidence scoring system

### Security Requirements:
- Rate limiting: 100 requests/15min general, 50 requests/5min agents
- CORS configuration for agent integration
- Input sanitization for XSS prevention
- API key validation for write operations
- Security headers for production deployment

### Agent Integration Requirements:
- Status endpoint with capabilities and categories
- Batch processing with error handling
- Complete data export functionality
- Quick analysis for single requests
- Health monitoring with system metrics

### UI/UX Requirements:
- Professional gradient design with ContentScale branding
- Responsive design for all screen sizes
- Dark/light theme with system preference detection
- Loading states and error handling
- Download functionality with multiple access methods

## Final Validation Checklist

✅ All 12 consulting categories implemented with unique AI prompts  
✅ Complete CRUD operations for consultations, analyses, and profiles  
✅ Agent API endpoints with proper authentication  
✅ Security middleware with rate limiting and input validation  
✅ Professional UI with responsive design and theming  
✅ Google Gemini AI integration with structured responses  
✅ Download system with backup package creation  
✅ Comprehensive documentation and deployment guides  
✅ Contact information: consultant@contentscale.site  
✅ Application name: ContentScale Consulting AI App 1  

## Success Criteria
The replicated application should be functionally identical to the original, including:
- Exact same consulting categories and AI analysis quality
- Identical API endpoints and response formats
- Same UI design and user experience
- Complete agent integration capabilities
- Professional branding and contact information
- Downloadable package with 47,682 byte size

This manual provides step-by-step instructions for exact replication of the ContentScale Consulting AI App 1.