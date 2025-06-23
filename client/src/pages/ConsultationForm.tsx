import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, Send, Brain, TrendingUp, Shield, Users, Briefcase, DollarSign, Settings, Scale, ShoppingCart, Heart, Leaf, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConsultationFormSchema, ConsultingCategory } from "@shared/schema";
import type { z } from "zod";

type FormData = z.infer<typeof ConsultationFormSchema>;

const consultingCategories = [
  { value: "seo", label: "SEO Consulting", icon: TrendingUp, description: "Search engine optimization and digital visibility" },
  { value: "business-strategy", label: "Business Strategy", icon: Brain, description: "Strategic planning and market positioning" },
  { value: "financial", label: "Financial Consulting", icon: DollarSign, description: "Financial planning and investment strategies" },
  { value: "marketing", label: "Marketing Consulting", icon: Users, description: "Brand strategy and customer engagement" },
  { value: "operations", label: "Operations Consulting", icon: Settings, description: "Process optimization and efficiency" },
  { value: "human-resources", label: "Human Resources", icon: Heart, description: "Talent management and organizational development" },
  { value: "it-consulting", label: "IT Consulting", icon: Settings, description: "Technology strategy and digital transformation" },
  { value: "legal", label: "Legal Consulting", icon: Scale, description: "Compliance and business regulations" },
  { value: "sales", label: "Sales Consulting", icon: ShoppingCart, description: "Sales strategy and performance optimization" },
  { value: "customer-experience", label: "Customer Experience", icon: Heart, description: "Customer satisfaction and journey optimization" },
  { value: "sustainability", label: "Sustainability Consulting", icon: Leaf, description: "Environmental impact and CSR strategies" },
  { value: "cybersecurity", label: "Cybersecurity Consulting", icon: Shield, description: "Security assessment and risk management" },
];

export default function ConsultationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(ConsultationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      businessContext: "",
      urgency: "medium",
      budget: "",
      timeline: "",
    },
  });

  const createConsultation = useMutation({
    mutationFn: (data: FormData) => apiRequest("/api/consultations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      toast({
        title: "Consultation Created",
        description: "Your consultation request has been submitted and is being analyzed.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createConsultation.mutate(data);
  };

  const selectedCategoryData = consultingCategories.find(cat => cat.value === selectedCategory);
  const CategoryIcon = selectedCategoryData?.icon || Brain;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">New Business Consultation</h1>
        <p className="text-muted-foreground">
          Get expert AI-powered insights for your business challenges
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
              <CardDescription>
                Provide detailed information about your business challenge for the best analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consulting Category</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                          }} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a consulting area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {consultingCategories.map((category) => {
                              const Icon = category.icon;
                              return (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center space-x-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the primary area where you need consulting expertise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consultation Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief description of your business challenge" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, concise title that summarizes your main concern
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your specific challenges, what you've tried, and what outcomes you're seeking..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more detail you provide, the better our analysis will be
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessContext"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Context</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your business: industry, size, target market, current situation..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Help us understand your business environment and constraints
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low - Planning ahead</SelectItem>
                              <SelectItem value="medium">Medium - Need guidance soon</SelectItem>
                              <SelectItem value="high">High - Urgent decision needed</SelectItem>
                              <SelectItem value="critical">Critical - Immediate action required</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Need results in 2 weeks"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., $10,000 - $50,000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Help us tailor recommendations to your budget constraints
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createConsultation.isPending}
                  >
                    {createConsultation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Consultation...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Consultation Request
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {selectedCategoryData && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedCategoryData.label}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {selectedCategoryData.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Deep Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive evaluation of your situation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Actionable Recommendations</p>
                  <p className="text-xs text-muted-foreground">
                    Specific steps you can implement immediately
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Implementation Plan</p>
                  <p className="text-xs text-muted-foreground">
                    Timeline and resources needed for success
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Performance Metrics</p>
                  <p className="text-xs text-muted-foreground">
                    KPIs to track your progress and success
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}