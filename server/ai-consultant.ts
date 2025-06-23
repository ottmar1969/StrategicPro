import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'demo-key');

interface ConsultationRequest {
  id: string;
  category: string;
  businessName: string;
  industry: string;
  description: string;
  specificChallenges: string[];
  goals: string[];
  timeline: string;
  budget: string;
}

interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  challenges: string[];
  goals: string[];
}

class AIConsultant {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  private consultingCategories = {
    seo: 'Search Engine Optimization and Digital Marketing',
    business_strategy: 'Business Strategy and Planning',
    financial: 'Financial Planning and Analysis',
    marketing: 'Marketing and Brand Strategy',
    operations: 'Operations and Process Optimization',
    hr: 'Human Resources and Talent Management',
    it: 'Information Technology and Digital Transformation',
    legal: 'Legal and Compliance Advisory',
    sales: 'Sales Strategy and Customer Acquisition',
    customer_experience: 'Customer Experience and Service Design',
    sustainability: 'Sustainability and Environmental Strategy',
    cybersecurity: 'Cybersecurity and Risk Management'
  };

  async generateAnalysis(consultation: ConsultationRequest) {
    try {
      const categoryExpertise = this.consultingCategories[consultation.category as keyof typeof this.consultingCategories] || 'General Business Consulting';
      
      const prompt = `
        As an expert ${categoryExpertise} consultant, provide a comprehensive analysis for the following business consultation request:

        Business: ${consultation.businessName}
        Industry: ${consultation.industry}
        Description: ${consultation.description}
        
        Specific Challenges:
        ${consultation.specificChallenges.map(challenge => `- ${challenge}`).join('\n')}
        
        Goals:
        ${consultation.goals.map(goal => `- ${goal}`).join('\n')}
        
        Timeline: ${consultation.timeline}
        Budget: ${consultation.budget}

        Please provide:
        1. Executive Summary
        2. Current Situation Analysis
        3. Key Challenges Assessment
        4. Strategic Recommendations (prioritized)
        5. Implementation Roadmap
        6. Success Metrics
        7. Risk Assessment
        8. Next Steps

        Format your response as a structured business analysis report.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();

      return {
        id: `analysis_${consultation.id}`,
        consultationId: consultation.id,
        category: consultation.category,
        analysis,
        recommendations: this.extractRecommendations(analysis),
        createdAt: new Date().toISOString(),
        status: 'completed'
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      throw new Error('Failed to generate analysis');
    }
  }

  async generateBusinessOverview(profile: BusinessProfile) {
    try {
      const prompt = `
        Create a comprehensive business overview for:

        Company: ${profile.name}
        Industry: ${profile.industry}
        Size: ${profile.size}
        Description: ${profile.description}
        
        Current Challenges:
        ${profile.challenges.map(challenge => `- ${challenge}`).join('\n')}
        
        Business Goals:
        ${profile.goals.map(goal => `- ${goal}`).join('\n')}

        Please provide:
        1. Business Summary
        2. Market Position Analysis
        3. Competitive Landscape
        4. Growth Opportunities
        5. Strategic Priorities
        6. Recommended Focus Areas

        Format as a professional business overview document.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const overview = response.text();

      return {
        id: `overview_${profile.id}`,
        businessId: profile.id,
        overview,
        keyInsights: this.extractKeyInsights(overview),
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating business overview:', error);
      throw new Error('Failed to generate business overview');
    }
  }

  async generateContent(prompt: string, category: string, businessContext?: any) {
    try {
      const categoryExpertise = this.consultingCategories[category as keyof typeof this.consultingCategories] || 'General Business';
      
      const enhancedPrompt = `
        You are a world-class SEO content writer and ${categoryExpertise} expert. Your task is to create content that achieves a perfect 10/10 RankMath SEO score using the advanced CRAFT framework and Google's helpful content guidelines.

        CRAFT FRAMEWORK IMPLEMENTATION:
        C - CUT THE FLUFF: Eliminate unnecessary words and phrases that don't add value. Focus on delivering information concisely and with clarity. Use short sentences (2.5 words max per sentence).
        R - REVIEW, EDIT & OPTIMIZE: Review overall structure and flow. Ensure headings and subheadings guide readers effectively. Optimize for SEO by including relevant keywords naturally.
        A - ADD VISUALS, IMAGES, OR MEDIA: Incorporate suggestions for visuals like images, infographics, or videos to break up text and enhance engagement.
        F - FACT-CHECK: Verify accuracy of all information. Include researched statistics with outbound links to authoritative sources (government URLs, .edu, .org, official organizations).
        T - TRUST-BUILD WITH PERSONAL STORY, TONE & LINKS: Maintain consistent, engaging tone. Include links to credible sources. Add personal anecdotes where appropriate.

        GOOGLE'S HELPFUL CONTENT GUIDELINES:
        - Create helpful, reliable, people-first content (https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
        - Focus on user satisfaction and experience
        - Demonstrate first-hand expertise and depth of knowledge
        - Avoid content created primarily for search engines

        RANKMATH 100/100 SCORE REQUIREMENTS (https://rankmath.com/kb/score-100-in-tests/):
        - Focus keyword appears in title, meta description, URL, and first paragraph
        - Target keyword density: 0.5-2.5% (natural integration)
        - Title length: 50-60 characters with focus keyword
        - Meta description: 120-160 characters, compelling and keyword-rich
        - Proper H1, H2, H3 structure with keywords in headings
        - Content length: 2000+ words for comprehensive coverage
        - Include LSI keywords and semantic variations
        - Add internal linking opportunities (3-5 internal links)
        - Include 2-3 external links to authoritative sources
        - Schema markup suggestions for rich snippets
        - Image alt text optimization
        - Table of contents for long-form content
        - Related keywords and entities Google associates with topic

        REQUIRED STATISTICAL RESEARCH:
        - Always include researched statistics with source citations
        - Prioritize government sources (.gov), educational institutions (.edu), official organizations (.org)
        - Avoid competitor websites as sources
        - Format statistics with proper attribution and links
        - Use colored quotes for important statistics and data points

        GOOGLE AI OVERVIEW OPTIMIZATION:
        - Structure content to answer specific user queries comprehensively
        - Include FAQ sections that address "People Also Ask" questions
        - Format with clear headings, bullet points, and numbered lists
        - Provide direct, actionable answers to user questions
        - Optimize for featured snippets with concise, authoritative answers
        - Include semantic keywords and related terms naturally

        ADVANCED SEO TECHNIQUES:
        - Write for E-A-T (Expertise, Authoritativeness, Trustworthiness)
        - Optimize for voice search with conversational queries
        - Structure for Core Web Vitals optimization
        - Add social proof and credibility indicators
        - Include trending and newsworthy angles when applicable
        - Location-specific content where relevant

        WRITING STYLE REQUIREMENTS:
        - Short sentences (maximum 2.5 words - CRITICAL)
        - Clear, concise language
        - Active voice preferred
        - Scannable format with bullet points and subheadings
        - Colored quotes for important statistics and key points
        - Personal tone while maintaining authority

        CONTENT REQUEST:
        ${prompt}
        
        ${businessContext ? `Business Context: ${JSON.stringify(businessContext, null, 2)}` : ''}

        MANDATORY DELIVERABLES:
        1. SEO-optimized article (2000-3000 words)
        2. Meta title (50-60 characters) and meta description (120-160 characters)
        3. H1, H2, H3 heading structure with focus keyword integration
        4. FAQ section optimized for Google AI Overview
        5. Table of contents for navigation
        6. Key takeaways summary with actionable insights
        7. 2-3 external links to government/authoritative sources (.gov, .edu, .org)
        8. 3-5 internal linking suggestions
        9. Schema markup recommendations
        10. Image suggestions with optimized alt text
        11. Social media snippets for promotion
        12. Researched statistics with proper source attribution

        Create content that achieves 100/100 RankMath score, ranks #1 on Google, and gets featured in AI overviews. Focus on user intent, comprehensive coverage, and technical SEO excellence following Google's helpful content guidelines.
        
        Please ensure the content is:
        - Professional and actionable
        - Tailored to the specific business context
        - Well-structured and easy to understand
        - Includes practical examples where relevant
        - Fraud-free and ethically sound
      `;

      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const content = response.text();

      return {
        id: `content_${Date.now()}`,
        category,
        prompt,
        content,
        createdAt: new Date().toISOString(),
        fraudCheck: this.performFraudCheck(content)
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  private extractRecommendations(analysis: string): string[] {
    // Simple extraction logic - in production, this could be more sophisticated
    const lines = analysis.split('\n');
    const recommendations: string[] = [];
    
    let inRecommendationsSection = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('recommendation')) {
        inRecommendationsSection = true;
        continue;
      }
      
      if (inRecommendationsSection && line.trim().startsWith('-')) {
        recommendations.push(line.trim().substring(1).trim());
      }
      
      if (inRecommendationsSection && line.trim() === '') {
        break;
      }
    }
    
    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  private extractKeyInsights(overview: string): string[] {
    // Simple extraction logic for key insights
    const lines = overview.split('\n');
    const insights: string[] = [];
    
    for (const line of lines) {
      if (line.includes('key') || line.includes('important') || line.includes('critical')) {
        insights.push(line.trim());
      }
    }
    
    return insights.slice(0, 3); // Top 3 insights
  }

  private performFraudCheck(content: string): { passed: boolean; flags: string[] } {
    const flags: string[] = [];
    const suspiciousPatterns = [
      /guaranteed.*money/i,
      /get.*rich.*quick/i,
      /no.*risk/i,
      /100%.*profit/i,
      /secret.*formula/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        flags.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }

    return {
      passed: flags.length === 0,
      flags
    };
  }
}

export const aiConsultant = new AIConsultant();