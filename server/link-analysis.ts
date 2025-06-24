import { Router } from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const router = Router();

interface InternalLink {
  url: string;
  title: string;
  relevanceScore: number;
  anchorText: string[];
  contentType: 'page' | 'post' | 'category' | 'product';
}

interface ExternalLink {
  domain: string;
  url: string;
  domainRating: number;
  relevanceScore: number;
  trustScore: number;
  isCompetitor: boolean;
  linkType: 'authority' | 'citation' | 'resource';
}

interface LinkAnalysisResult {
  internalLinks: InternalLink[];
  externalLinks: ExternalLink[];
  linkingStrategy: string[];
  seoRecommendations: string[];
}

// Crawl internal pages for linking opportunities
async function crawlInternalPages(domain: string, keyword: string): Promise<InternalLink[]> {
  try {
    const internalLinks: InternalLink[] = [];
    
    // Common internal page patterns
    const crawlUrls = [
      `https://${domain}`,
      `https://${domain}/blog`,
      `https://${domain}/articles`,
      `https://${domain}/resources`,
      `https://${domain}/services`,
      `https://${domain}/products`,
      `https://${domain}/about`,
      `https://${domain}/sitemap.xml`
    ];

    for (const url of crawlUrls) {
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'ContentScale Link Analyzer Bot 1.0'
          }
        });

        if (url.includes('sitemap.xml')) {
          // Parse sitemap for more URLs
          const sitemapUrls = extractUrlsFromSitemap(response.data);
          for (const sitemapUrl of sitemapUrls.slice(0, 20)) {
            const pageData = await analyzePage(sitemapUrl, keyword);
            if (pageData) internalLinks.push(pageData);
          }
        } else {
          // Parse HTML page
          const dom = new JSDOM(response.data);
          const document = dom.window.document;
          
          const title = document.querySelector('title')?.textContent || '';
          const content = document.body?.textContent || '';
          
          const relevanceScore = calculateRelevanceScore(content, title, keyword);
          
          if (relevanceScore > 30) {
            internalLinks.push({
              url,
              title: title.trim(),
              relevanceScore,
              anchorText: generateAnchorTexts(keyword, title),
              contentType: determineContentType(url)
            });
          }

          // Extract internal links from page
          const links = document.querySelectorAll('a[href]');
          for (const link of Array.from(links).slice(0, 10)) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') || href.includes(domain)) {
              const fullUrl = href.startsWith('/') ? `https://${domain}${href}` : href;
              const linkData = await analyzePage(fullUrl, keyword);
              if (linkData && linkData.relevanceScore > 25) {
                internalLinks.push(linkData);
              }
            }
          }
        }
      } catch (error) {
        console.log(`Could not crawl ${url}:`, error.message);
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueLinks = internalLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.url === link.url)
    );

    return uniqueLinks
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15);

  } catch (error) {
    console.error('Error crawling internal pages:', error);
    return [];
  }
}

async function analyzePage(url: string, keyword: string): Promise<InternalLink | null> {
  try {
    const response = await axios.get(url, {
      timeout: 3000,
      headers: {
        'User-Agent': 'ContentScale Link Analyzer Bot 1.0'
      }
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    const title = document.querySelector('title')?.textContent || '';
    const content = document.body?.textContent || '';
    
    const relevanceScore = calculateRelevanceScore(content, title, keyword);
    
    if (relevanceScore > 20) {
      return {
        url,
        title: title.trim(),
        relevanceScore,
        anchorText: generateAnchorTexts(keyword, title),
        contentType: determineContentType(url)
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

function extractUrlsFromSitemap(sitemapXml: string): string[] {
  const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
  if (!urlMatches) return [];
  
  return urlMatches
    .map(match => match.replace(/<\/?loc>/g, ''))
    .filter(url => url.includes('http'))
    .slice(0, 50);
}

function calculateRelevanceScore(content: string, title: string, keyword: string): number {
  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  let score = 0;
  
  // Title relevance (high weight)
  if (lowerTitle.includes(lowerKeyword)) score += 40;
  
  // Keyword variations
  const keywordWords = lowerKeyword.split(' ');
  keywordWords.forEach(word => {
    if (word.length > 3) {
      const wordCount = (lowerContent.match(new RegExp(word, 'g')) || []).length;
      score += Math.min(wordCount * 3, 20);
    }
  });
  
  // Content length factor
  if (content.length > 1000) score += 10;
  if (content.length > 3000) score += 10;
  
  // URL structure
  if (lowerTitle.includes('blog') || lowerTitle.includes('article')) score += 5;
  
  return Math.min(score, 100);
}

function generateAnchorTexts(keyword: string, title: string): string[] {
  const anchors = [
    keyword,
    `learn about ${keyword}`,
    `${keyword} guide`,
    `comprehensive ${keyword}`,
    title.length < 60 ? title : title.substring(0, 57) + '...'
  ];
  
  return anchors.filter(anchor => anchor.length > 3);
}

function determineContentType(url: string): 'page' | 'post' | 'category' | 'product' {
  if (url.includes('/blog/') || url.includes('/post/')) return 'post';
  if (url.includes('/category/') || url.includes('/tag/')) return 'category';
  if (url.includes('/product/') || url.includes('/shop/')) return 'product';
  return 'page';
}

// Find high-authority external linking opportunities
async function findExternalLinkingOpportunities(keyword: string, industry: string): Promise<ExternalLink[]> {
  const externalLinks: ExternalLink[] = [];
  
  // High-authority domains by category
  const authorityDomains = {
    technology: ['github.com', 'stackoverflow.com', 'techcrunch.com', 'wired.com'],
    business: ['harvard.edu', 'forbes.com', 'entrepreneur.com', 'inc.com'],
    health: ['mayoclinic.org', 'webmd.com', 'healthline.com', 'nih.gov'],
    education: ['wikipedia.org', 'coursera.org', 'edx.org', 'khanacademy.org'],
    general: ['reuters.com', 'bbc.com', 'cnn.com', 'nytimes.com']
  };

  const relevantDomains = [
    ...authorityDomains[industry as keyof typeof authorityDomains] || [],
    ...authorityDomains.general,
    ...authorityDomains.education
  ];

  for (const domain of relevantDomains) {
    try {
      // Search for relevant content on the domain
      const searchUrl = `https://${domain}/search?q=${encodeURIComponent(keyword)}`;
      const response = await axios.get(searchUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'ContentScale Link Research Bot 1.0'
        }
      });

      const dom = new JSDOM(response.data);
      const document = dom.window.document;
      
      // Extract relevant links
      const links = document.querySelectorAll('a[href]');
      for (const link of Array.from(links).slice(0, 5)) {
        const href = link.getAttribute('href');
        const linkText = link.textContent?.trim() || '';
        
        if (href && linkText.length > 10) {
          const fullUrl = href.startsWith('/') ? `https://${domain}${href}` : href;
          const relevanceScore = calculateRelevanceScore(linkText, linkText, keyword);
          
          if (relevanceScore > 15) {
            externalLinks.push({
              domain,
              url: fullUrl,
              domainRating: getDomainRating(domain),
              relevanceScore,
              trustScore: getTrustScore(domain),
              isCompetitor: false,
              linkType: 'authority'
            });
          }
        }
      }
    } catch (error) {
      console.log(`Could not analyze ${domain}:`, error.message);
    }
  }

  return externalLinks
    .sort((a, b) => (b.domainRating + b.relevanceScore) - (a.domainRating + a.relevanceScore))
    .slice(0, 10);
}

function getDomainRating(domain: string): number {
  // Simulated domain ratings based on known authority
  const ratings: { [key: string]: number } = {
    'wikipedia.org': 95,
    'github.com': 90,
    'stackoverflow.com': 88,
    'forbes.com': 85,
    'harvard.edu': 92,
    'mayoclinic.org': 88,
    'reuters.com': 87,
    'bbc.com': 89,
    'techcrunch.com': 82,
    'entrepreneur.com': 78
  };
  
  return ratings[domain] || Math.floor(Math.random() * 30) + 50;
}

function getTrustScore(domain: string): number {
  // Educational and government sites get higher trust scores
  if (domain.endsWith('.edu') || domain.endsWith('.gov')) return 95;
  if (domain.endsWith('.org')) return 85;
  if (['forbes.com', 'reuters.com', 'bbc.com'].includes(domain)) return 90;
  return Math.floor(Math.random() * 20) + 70;
}

// API Routes
router.post("/analyze-links", async (req, res) => {
  try {
    const { keyword, domain, industry = "general" } = req.body;

    if (!keyword || !domain) {
      return res.status(400).json({ error: "Keyword and domain are required" });
    }

    console.log(`Analyzing links for keyword: ${keyword}, domain: ${domain}`);

    const [internalLinks, externalLinks] = await Promise.all([
      crawlInternalPages(domain, keyword),
      findExternalLinkingOpportunities(keyword, industry)
    ]);

    const linkingStrategy = [
      `Found ${internalLinks.length} internal linking opportunities`,
      `Identified ${externalLinks.length} high-authority external link targets`,
      `Focus on ${internalLinks.filter(l => l.relevanceScore > 70).length} high-relevance internal pages`,
      `Target ${externalLinks.filter(l => l.domainRating > 80).length} premium authority domains`
    ];

    const seoRecommendations = [
      "Use contextual anchor text that includes target keywords naturally",
      "Link to internal pages with high relevance scores first",
      "Reference authority domains for citations and credibility",
      "Create topic clusters by linking related internal content",
      "Monitor link performance and update anchor text regularly"
    ];

    const result: LinkAnalysisResult = {
      internalLinks,
      externalLinks,
      linkingStrategy,
      seoRecommendations
    };

    res.json(result);
  } catch (error) {
    console.error("Error in link analysis:", error);
    res.status(500).json({ error: "Failed to analyze links" });
  }
});

export default router;