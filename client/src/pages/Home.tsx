import { Link } from "wouter";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          <h1 className="text-5xl font-bold mb-6">
            Professional Business Consulting
            <span className="block text-primary-foreground/80">Powered by AI</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-foreground/90">
            Get expert-level consulting across 12 key business areas including SEO, strategy, finance, 
            marketing, operations, HR, IT, legal, sales, customer experience, sustainability, and cybersecurity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/consultation">
              <Button size="lg" variant="secondary" className="text-primary">
                Start Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ContentScale?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform delivers professional-grade consulting insights 
              that would typically cost thousands in consulting fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
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

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
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