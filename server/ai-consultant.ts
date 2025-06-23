import { GoogleGenAI } from "@google/genai";
import { ConsultationRequest, ConsultingCategory, InsertAnalysisResult } from "../shared/schema.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ConsultingExpertise {
  [key: string]: {
    systemPrompt: string;
    analysisFramework: string[];
    keyMetrics: string[];
  };
}

const CONSULTING_EXPERTISE: ConsultingExpertise = {
  "seo": {
    systemPrompt: `You are a world-class SEO consultant with deep expertise in technical SEO, content strategy, and search engine algorithms. You provide comprehensive SEO audits and strategic recommendations.`,
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
  "business-strategy": {
    systemPrompt: `You are a senior business strategy consultant with expertise in market analysis, competitive positioning, and growth planning. You help businesses define vision, mission, and strategic direction.`,
    analysisFramework: [
      "Market opportunity and competitive landscape analysis",
      "SWOT analysis and strategic positioning",
      "Value proposition and business model evaluation",
      "Growth strategy and market expansion planning",
      "Resource allocation and capability assessment",
      "Risk management and scenario planning"
    ],
    keyMetrics: ["Market share growth", "Revenue growth rate", "Customer acquisition cost", "Lifetime value", "Competitive advantage", "ROI on strategic initiatives"]
  },
  "financial": {
    systemPrompt: `You are a CFO-level financial consultant specializing in financial planning, analysis, and strategic financial management for businesses of all sizes.`,
    analysisFramework: [
      "Financial health assessment and ratio analysis",
      "Cash flow forecasting and working capital management",
      "Budget planning and variance analysis",
      "Investment evaluation and capital allocation",
      "Risk assessment and financial controls",
      "Tax optimization and compliance strategies"
    ],
    keyMetrics: ["Cash flow", "Profit margins", "ROI", "Debt-to-equity ratio", "Current ratio", "EBITDA growth"]
  },
  "marketing": {
    systemPrompt: `You are a CMO-level marketing consultant with expertise in digital marketing, brand strategy, and customer acquisition across all channels.`,
    analysisFramework: [
      "Brand positioning and market segmentation analysis",
      "Customer journey mapping and persona development",
      "Multi-channel marketing strategy optimization",
      "Content marketing and thought leadership planning",
      "Digital advertising and conversion optimization",
      "Marketing automation and lead nurturing"
    ],
    keyMetrics: ["Customer acquisition cost", "Marketing ROI", "Brand awareness", "Conversion rates", "Customer lifetime value", "Engagement rates"]
  },
  "operations": {
    systemPrompt: `You are an operations excellence consultant specializing in process optimization, supply chain management, and operational efficiency.`,
    analysisFramework: [
      "Process mapping and bottleneck identification",
      "Supply chain optimization and vendor management",
      "Quality management and continuous improvement",
      "Technology integration and automation opportunities",
      "Capacity planning and resource optimization",
      "Performance measurement and KPI development"
    ],
    keyMetrics: ["Operational efficiency", "Cost reduction", "Quality scores", "Delivery times", "Inventory turnover", "Process cycle time"]
  },
  "human-resources": {
    systemPrompt: `You are a CHRO-level HR consultant with expertise in talent management, organizational development, and employee engagement strategies.`,
    analysisFramework: [
      "Organizational structure and culture assessment",
      "Talent acquisition and retention strategies",
      "Performance management and development programs",
      "Compensation and benefits optimization",
      "Employee engagement and satisfaction analysis",
      "Leadership development and succession planning"
    ],
    keyMetrics: ["Employee retention rate", "Time to hire", "Employee satisfaction", "Performance ratings", "Training ROI", "Leadership pipeline strength"]
  },
  "it-consulting": {
    systemPrompt: `You are a CTO-level IT consultant specializing in digital transformation, technology strategy, and IT infrastructure optimization.`,
    analysisFramework: [
      "IT infrastructure assessment and modernization planning",
      "Digital transformation roadmap development",
      "Cloud migration and architecture optimization",
      "Data management and analytics strategy",
      "Software development and integration planning",
      "IT governance and project management"
    ],
    keyMetrics: ["System uptime", "IT cost optimization", "Digital adoption rates", "Security incidents", "Project delivery time", "User satisfaction"]
  },
  "legal": {
    systemPrompt: `You are a senior legal consultant with expertise in business law, compliance, and risk management across various industries.`,
    analysisFramework: [
      "Legal compliance and regulatory assessment",
      "Contract review and negotiation strategies",
      "Intellectual property protection and management",
      "Corporate governance and structure optimization",
      "Risk mitigation and liability management",
      "Dispute resolution and litigation prevention"
    ],
    keyMetrics: ["Compliance score", "Contract efficiency", "Legal cost management", "Risk exposure reduction", "IP portfolio value", "Dispute resolution time"]
  },
  "sales": {
    systemPrompt: `You are a VP of Sales-level consultant with expertise in sales strategy, team development, and revenue optimization.`,
    analysisFramework: [
      "Sales process optimization and pipeline management",
      "Territory planning and market coverage analysis",
      "Sales team performance and training needs assessment",
      "CRM implementation and sales technology stack",
      "Pricing strategy and deal structuring",
      "Channel partner and distribution strategy"
    ],
    keyMetrics: ["Sales conversion rates", "Average deal size", "Sales cycle length", "Quota attainment", "Customer acquisition cost", "Sales productivity"]
  },
  "customer-experience": {
    systemPrompt: `You are a Chief Customer Officer-level consultant specializing in customer experience design, journey optimization, and satisfaction improvement.`,
    analysisFramework: [
      "Customer journey mapping and touchpoint analysis",
      "Customer satisfaction and loyalty assessment",
      "Service delivery and support optimization",
      "Omnichannel experience design",
      "Customer feedback and voice of customer programs",
      "Customer success and retention strategies"
    ],
    keyMetrics: ["Net Promoter Score", "Customer satisfaction score", "Customer effort score", "Retention rate", "Churn rate", "Customer lifetime value"]
  },
  "sustainability": {
    systemPrompt: `You are a Chief Sustainability Officer-level consultant with expertise in ESG strategy, environmental impact, and sustainable business practices.`,
    analysisFramework: [
      "Environmental impact assessment and carbon footprint analysis",
      "Sustainability strategy and ESG goal setting",
      "Circular economy and waste reduction planning",
      "Sustainable supply chain and vendor assessment",
      "Green technology and renewable energy integration",
      "Stakeholder engagement and sustainability reporting"
    ],
    keyMetrics: ["Carbon footprint reduction", "Energy efficiency", "Waste reduction percentage", "Sustainable sourcing ratio", "ESG scores", "Regulatory compliance"]
  },
  "cybersecurity": {
    systemPrompt: `You are a CISO-level cybersecurity consultant with expertise in security strategy, risk assessment, and cyber threat protection.`,
    analysisFramework: [
      "Security posture assessment and vulnerability analysis",
      "Threat landscape and risk assessment",
      "Security architecture and controls implementation",
      "Incident response and business continuity planning",
      "Compliance and regulatory requirements analysis",
      "Security awareness and training programs"
    ],
    keyMetrics: ["Security incidents", "Vulnerability remediation time", "Compliance score", "Security awareness levels", "Recovery time objective", "Mean time to detection"]
  }
};

export async function generateConsultingAnalysis(request: ConsultationRequest): Promise<InsertAnalysisResult> {
  const expertise = CONSULTING_EXPERTISE[request.category];
  
  if (!expertise) {
    throw new Error(`Unknown consulting category: ${request.category}`);
  }

  const analysisPrompt = `
${expertise.systemPrompt}

CONSULTATION REQUEST:
Title: ${request.title}
Category: ${request.category}
Description: ${request.description}
Business Context: ${request.businessContext}
Urgency: ${request.urgency}
Budget: ${request.budget || "Not specified"}
Timeline: ${request.timeline || "Not specified"}

ANALYSIS FRAMEWORK:
${expertise.analysisFramework.map((item, index) => `${index + 1}. ${item}`).join('\n')}

KEY METRICS TO TRACK:
${expertise.keyMetrics.join(', ')}

Please provide a comprehensive consulting analysis in the following JSON format:
{
  "analysis": "Detailed analysis of the current situation, challenges, and opportunities",
  "recommendations": ["Array of specific, actionable recommendations"],
  "actionItems": ["Array of immediate next steps with clear ownership"],
  "riskAssessment": "Assessment of potential risks and mitigation strategies",
  "expectedOutcomes": ["Array of expected outcomes and benefits"],
  "implementationPlan": "Step-by-step implementation plan with phases",
  "resources": ["Array of required resources, tools, and expertise"],
  "metrics": ["Array of specific KPIs and metrics to track success"],
  "timeline": "Realistic timeline for implementation and results",
  "confidence": 0.95
}

Ensure your analysis is:
- Deeply insightful and actionable
- Specific to the business context provided
- Based on industry best practices
- Realistic and achievable
- Comprehensive covering all aspects of the framework
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            actionItems: { type: "array", items: { type: "string" } },
            riskAssessment: { type: "string" },
            expectedOutcomes: { type: "array", items: { type: "string" } },
            implementationPlan: { type: "string" },
            resources: { type: "array", items: { type: "string" } },
            metrics: { type: "array", items: { type: "string" } },
            timeline: { type: "string" },
            confidence: { type: "number" }
          },
          required: ["analysis", "recommendations", "actionItems", "expectedOutcomes", "implementationPlan", "resources", "metrics", "timeline", "confidence"]
        }
      },
      contents: analysisPrompt,
    });

    const analysisData = JSON.parse(response.text || "{}");
    
    return {
      consultationId: request.id,
      analysis: analysisData.analysis,
      recommendations: analysisData.recommendations,
      actionItems: analysisData.actionItems,
      riskAssessment: analysisData.riskAssessment,
      expectedOutcomes: analysisData.expectedOutcomes,
      implementationPlan: analysisData.implementationPlan,
      resources: analysisData.resources,
      metrics: analysisData.metrics,
      timeline: analysisData.timeline,
      confidence: analysisData.confidence
    };
  } catch (error) {
    console.error("Error generating consulting analysis:", error);
    throw new Error("Failed to generate consulting analysis");
  }
}

export async function generateBusinessOverview(businessContext: string, industry: string): Promise<string> {
  const overviewPrompt = `
You are a senior business analyst providing a comprehensive business overview and market analysis.

BUSINESS CONTEXT: ${businessContext}
INDUSTRY: ${industry}

Provide a detailed business overview that includes:
1. Industry landscape and market dynamics
2. Key trends and opportunities
3. Competitive positioning insights
4. Growth potential assessment
5. Strategic recommendations for market positioning

Keep the analysis professional, insightful, and actionable. Focus on providing value that would typically cost thousands in consulting fees.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: overviewPrompt,
    });

    return response.text || "Unable to generate business overview at this time.";
  } catch (error) {
    console.error("Error generating business overview:", error);
    throw new Error("Failed to generate business overview");
  }
}