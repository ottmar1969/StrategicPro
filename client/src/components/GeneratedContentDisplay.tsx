import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, Share2, Star, Clock, User, FileText, Target, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContentProps {
  content: {
    title: string;
    content: string;
    seoScore?: number;
    metadata?: {
      topic?: string;
      audience?: string;
      niche?: string;
      keywords?: string;
      wordCount?: number;
      language?: string;
      tone?: string;
      contentType?: string;
    };
    article?: {
      id?: string;
      createdAt?: string;
      isPaid?: boolean;
      paymentMethod?: string;
    };
  };
}

export default function GeneratedContentDisplay({ content }: GeneratedContentProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content.content);
    toast({
      title: "Content Copied",
      description: "Article content copied to clipboard"
    });
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([content.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Started",
      description: "Article downloaded as text file"
    });
  };

  const getPaymentMethodDisplay = () => {
    if (!content.article || !content.article.paymentMethod) {
      return { text: 'Free', color: 'bg-green-100 text-green-800' };
    }
    switch (content.article.paymentMethod) {
      case 'free': return { text: 'Free', color: 'bg-green-100 text-green-800' };
      case 'free_api': return { text: 'API Key', color: 'bg-blue-100 text-blue-800' };
      case 'credits': return { text: 'Credits', color: 'bg-purple-100 text-purple-800' };
      case 'payment': return { text: 'Paid', color: 'bg-orange-100 text-orange-800' };
      default: return { text: 'Generated', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 leading-tight">
                {content.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {content.article?.createdAt ? new Date(content.article.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {content.metadata?.wordCount || content.content.split(' ').length} words
                </div>
                <Badge className={paymentDisplay.color}>
                  {paymentDisplay.text}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                SEO: {content.seoScore || 85}/100
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </Button>
              <Button onClick={downloadAsText} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Article ID: {content.article?.id ? content.article.id.slice(0, 8) + '...' : 'Generated'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <div 
              className="content-display leading-relaxed text-gray-800 space-y-4"
              style={{
                fontFamily: 'Georgia, serif',
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            >
              {content.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  // Handle headings
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag 
                      key={index} 
                      className={`font-bold mt-8 mb-4 text-gray-900 ${
                        level === 1 ? 'text-3xl' :
                        level === 2 ? 'text-2xl' :
                        level === 3 ? 'text-xl' :
                        'text-lg'
                      }`}
                    >
                      {text}
                    </HeadingTag>
                  );
                } else if (paragraph.includes('•') || paragraph.includes('-')) {
                  // Handle lists
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                      {paragraph.split('\n').map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^[•\-]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                } else {
                  // Regular paragraphs
                  return (
                    <p key={index} className="mb-4 text-justify">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Analysis & Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Target Details
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Topic:</strong> {content.metadata?.topic || 'Not specified'}</div>
                <div><strong>Audience:</strong> {content.metadata?.audience || 'General'}</div>
                <div><strong>Niche:</strong> {content.metadata?.niche || 'General'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Content Settings
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Language:</strong> {content.metadata?.language || 'English'}</div>
                <div><strong>Tone:</strong> {content.metadata?.tone || 'Professional'}</div>
                <div><strong>Type:</strong> {content.metadata?.contentType || 'Article'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                SEO Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>SEO Score:</strong> {content.seoScore || 85}/100</div>
                <div><strong>Word Count:</strong> {content.metadata?.wordCount || content.content.split(' ').length}</div>
                <div><strong>Keywords:</strong> {content.metadata?.keywords ? content.metadata.keywords.slice(0, 50) + '...' : 'AI-optimized'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}