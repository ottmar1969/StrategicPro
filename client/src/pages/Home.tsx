import { Link } from "wouter";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DownloadButton from "@/components/DownloadButton";

const consultingAreas = [
  {
    title: "SEO Consulting",
    description: "Technical SEO audits, keyword strategy, and search engine optimization",
    icon: TrendingUp,
    category: "seo"
  },
  {
    title: "Business Strategy",
    description: "Market analysis, competitive positioning, and growth planning",
    icon: Brain,
    category: "business-strategy"
  },
  {
    title: "Financial Consulting",
    description: "Financial planning, budgeting, and investment strategies",
    icon: TrendingUp,
    category: "financial"
  },
  {
    title: "Marketing Consulting",
    description: "Brand strategy, digital marketing, and customer engagement",
    icon: Users,
    category: "marketing"
  },
  {
    title: "Operations Consulting",
    description: "Process optimization, supply chain, and efficiency improvement",
    icon: CheckCircle,
    category: "operations"
  },
  {
    title: "Cybersecurity Consulting",
    description: "Security assessment, risk management, and threat protection",
    icon: Shield,
    category: "cybersecurity"
  }
];

const features = [
  "AI-powered deep analysis across 12 consulting areas",
  "Comprehensive business strategy recommendations",
  "Actionable implementation plans with timelines",
  "Risk assessment and mitigation strategies",
  "Performance metrics and KPI tracking",
  "Professional-grade insights and expertise"
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            ContentScale Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-gray-200">
            AI-powered content generation and professional business consulting in one platform. Create SEO-optimized content and get expert business insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/content-writer">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100">
                Start Writing Content
              </Button>
            </Link>
            <Link href="/consultation">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-black">
                Get Business Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dual-Powered Business Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8 text-primary" />,
                title: "AI Content Generation",
                description: "Create SEO-optimized content with our advanced CRAFT framework. First article free, then $1 with your API key."
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Business Consulting",
                description: "Access 12 specialized consulting areas from SEO to cybersecurity, each with deep industry expertise."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-primary" />,
                title: "Fraud Protection",
                description: "Advanced security with VPN detection, browser fingerprinting, and abuse prevention to protect your business."
              },
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Flexible Pricing",
                description: "Pay-per-use or credit packages. Bring your own API keys for significant savings and higher limits."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: "Fast Results",
                description: "Generate content and receive business analysis within minutes, not hours or days."
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-primary" />,
                title: "Complete Platform",
                description: "Everything you need for content creation and business growth in one integrated solution."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Consulting Areas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deep expertise across all critical business functions with actionable insights and implementation strategies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultingAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index} className="consulting-card">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {area.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/consultation">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Download Complete Application</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the complete ContentScale Consulting AI App 1 package ready for deployment and agent integration.
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <DownloadButton />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have already benefited from our AI-powered consulting platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/consultation">
              <Button size="lg">
                Start Your Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Contact: consultant@contentscale.site
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}