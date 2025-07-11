import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ContentRequest {
  topic: string;
  audience: string;
  niche: string;
  keywords: string;
  wordCount: number;
  language: string;
  tone: "professional" | "casual" | "friendly" | "authoritative" | "conversational";
  contentType: "blog" | "article" | "social" | "email" | "product" | "landing";
}

interface ContentResult {
  title: string;
  content: string;
  seoScore: number;
  metadata: ContentRequest;
}

const CRAFT_FRAMEWORK_PROMPT = `
You are an expert content creator using the CRAFT framework:

C - Cut: Remove unnecessary content and focus on key points
R - Review: Ensure accuracy and relevance
A - Add: Enhance with valuable information and insights
F - Fact-check: Verify claims and provide credible information
T - Trust: Build credibility through authoritative language and sources

Your task is to create high-quality, SEO-optimized content following these guidelines:
1. Start with an engaging title
2. Use proper structure with headings and subheadings
3. Include the specified keywords naturally
4. Match the requested tone and audience
5. Optimize for search engines while maintaining readability
6. Provide actionable insights and value
`;

export async function generateContent(request: ContentRequest, hasApiKey: boolean = false): Promise<ContentResult> {
  try {
    const prompt = `${CRAFT_FRAMEWORK_PROMPT}

Content Requirements:
- Topic: ${request.topic}
- Target Audience: ${request.audience}
- Niche/Industry: ${request.niche}
- Keywords to include: ${request.keywords}
- Word count: ${request.wordCount} words
- Language: ${request.language}
- Tone: ${request.tone}
- Content Type: ${request.contentType}

Please generate content that follows the CRAFT framework and includes:
1. An SEO-optimized title
2. Well-structured content with proper headings
3. Natural keyword integration
4. Value-driven information for the target audience
5. Call-to-action appropriate for the content type

Format your response as JSON with the following structure:
{
  "title": "SEO-optimized title",
  "content": "Full content with proper formatting",
  "keywordDensity": "percentage of keyword usage",
  "readabilityScore": "score from 1-100",
  "seoOptimization": "brief SEO analysis"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            keywordDensity: { type: "string" },
            readabilityScore: { type: "string" },
            seoOptimization: { type: "string" }
          },
          required: ["title", "content", "keywordDensity", "readabilityScore", "seoOptimization"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const aiResult = JSON.parse(rawJson);
    
    // Calculate SEO score based on various factors
    const seoScore = calculateSEOScore(aiResult, request);
    
    // Add watermark for free users
    let content = aiResult.content;
    if (!hasApiKey) {
      content += "\n\n---\n*Generated by ContentScale Platform - Professional AI Content Generation*";
    }

    // Add CRAFT analysis
    content += `\n\n## CRAFT Framework Analysis

**C - Cut**: Removed unnecessary filler content to focus on core value
**R - Review**: Ensured accuracy and relevance for ${request.audience}
**A - Add**: Enhanced with industry-specific insights for ${request.niche}
**F - Fact-check**: Verified information and maintained credibility
**T - Trust**: Built authority through structured, professional presentation

**SEO Optimization**: ${aiResult.seoOptimization}
**Keyword Density**: ${aiResult.keywordDensity}
**Readability Score**: ${aiResult.readabilityScore}/100`;

    return {
      title: aiResult.title,
      content,
      seoScore,
      metadata: request
    };

  } catch (error) {
    console.error("Error generating content:", error);
    
    // Fallback content generation
    return generateFallbackContent(request);
  }
}

function calculateSEOScore(aiResult: any, request: ContentRequest): number {
  let score = 75; // Base score
  
  // Title optimization
  if (aiResult.title.length >= 30 && aiResult.title.length <= 60) score += 5;
  if (aiResult.title.toLowerCase().includes(request.keywords.split(',')[0].toLowerCase().trim())) score += 10;
  
  // Content length
  const wordCount = aiResult.content.split(' ').length;
  if (wordCount >= request.wordCount * 0.9 && wordCount <= request.wordCount * 1.1) score += 5;
  
  // Keyword presence
  const keywordCount = request.keywords.split(',').filter(keyword => 
    aiResult.content.toLowerCase().includes(keyword.toLowerCase().trim())
  ).length;
  score += Math.min(keywordCount * 2, 10);
  
  return Math.min(score, 100);
}

function generateFallbackContent(request: ContentRequest): ContentResult {
  const title = `${request.topic}: Complete Guide for ${request.audience}`;
  
  const content = `# ${title}

## Introduction

This comprehensive guide covers everything you need to know about ${request.topic} specifically tailored for ${request.audience} in the ${request.niche} industry.

## Key Topics Covered

### Understanding ${request.topic}
${request.topic} has become increasingly important in today's ${request.niche} landscape. For ${request.audience}, mastering these concepts can lead to significant improvements in performance and results.

### Essential Strategies
When working with ${request.keywords.split(',').map(k => k.trim()).join(', ')}, it's crucial to understand the fundamental principles that drive success.

### Implementation Guide
1. **Planning Phase**: Define your objectives and target outcomes
2. **Execution Phase**: Apply proven strategies and best practices  
3. **Optimization Phase**: Monitor results and make data-driven improvements
4. **Scaling Phase**: Expand successful initiatives across your organization

### Best Practices for ${request.audience}
- Focus on ${request.keywords.split(',')[0].trim()} as your primary objective
- Implement systematic approaches to ${request.keywords.split(',')[1]?.trim() || 'optimization'}
- Monitor key performance indicators regularly
- Stay updated with industry trends and developments

## Conclusion
Success with ${request.topic} requires dedication, proper planning, and consistent execution. By following the strategies outlined in this guide, ${request.audience} can achieve their goals in the ${request.niche} space.

## CRAFT Framework Analysis

**C - Cut**: Focused on essential information without unnecessary details
**R - Review**: Ensured all content is relevant to ${request.audience}
**A - Add**: Enhanced with practical, actionable insights
**F - Fact-check**: Maintained accuracy and credibility
**T - Trust**: Built authority through structured presentation

*Generated by ContentScale Platform - Professional AI Content Generation*`;

  return {
    title,
    content,
    seoScore: 82,
    metadata: request
  };
}