import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Minus, Loader2, Save, Building, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BusinessProfileFormSchema, BusinessProfile as BusinessProfileType } from "@shared/schema";
import type { z } from "zod";

type FormData = z.infer<typeof BusinessProfileFormSchema>;

export default function BusinessProfile() {
  const { toast } = useToast();
  const [overview, setOverview] = useState<string>("");
  const [loadingOverview, setLoadingOverview] = useState(false);

  const { data: profiles } = useQuery<BusinessProfileType[]>({
    queryKey: ["/api/business-profiles"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(BusinessProfileFormSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      size: "small",
      revenue: "",
      location: "",
      description: "",
      currentChallenges: [],
      goals: [],
      competitors: [],
      targetMarket: "",
    },
  });

  const createProfile = useMutation({
    mutationFn: (data: FormData) => apiRequest("/api/business-profiles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-profiles"] });
      toast({
        title: "Profile Created",
        description: "Your business profile has been saved successfully.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create business profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateOverview = async () => {
    const description = form.getValues("description");
    const industry = form.getValues("industry");
    
    if (!description || !industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in the business description and industry fields first.",
        variant: "destructive",
      });
      return;
    }

    setLoadingOverview(true);
    try {
      const response = await apiRequest("/api/business-overview", {
        method: "POST",
        body: JSON.stringify({
          businessContext: description,
          industry: industry,
        }),
      });
      setOverview(response.overview);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate business overview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingOverview(false);
    }
  };

  const onSubmit = (data: FormData) => {
    createProfile.mutate(data);
  };

  const addArrayItem = (fieldName: keyof Pick<FormData, 'currentChallenges' | 'goals' | 'competitors'>) => {
    const currentValues = form.getValues(fieldName) as string[];
    form.setValue(fieldName, [...currentValues, ""] as any);
  };

  const removeArrayItem = (fieldName: keyof Pick<FormData, 'currentChallenges' | 'goals' | 'competitors'>, index: number) => {
    const currentValues = form.getValues(fieldName) as string[];
    form.setValue(fieldName, currentValues.filter((_, i) => i !== index) as any);
  };

  const updateArrayItem = (fieldName: keyof Pick<FormData, 'currentChallenges' | 'goals' | 'competitors'>, index: number, value: string) => {
    const currentValues = form.getValues(fieldName) as string[];
    const newValues = [...currentValues];
    newValues[index] = value;
    form.setValue(fieldName, newValues as any);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Business Profile</h1>
        <p className="text-muted-foreground">
          Create a comprehensive profile of your business for better consulting insights
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Provide detailed information about your business for personalized consulting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Technology, Healthcare, Finance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                              <SelectItem value="small">Small (11-50 employees)</SelectItem>
                              <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                              <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $1M - $10M" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business, products/services, mission, and current market position..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive overview of what your business does
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetMarket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Market</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your ideal customers, market segments, demographics..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Current Challenges */}
                  <div>
                    <FormLabel>Current Challenges</FormLabel>
                    <FormDescription className="mb-3">
                      List the main challenges your business is currently facing
                    </FormDescription>
                    {form.watch("currentChallenges").map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Describe a business challenge"
                          value={form.watch("currentChallenges")[index] || ""}
                          onChange={(e) => updateArrayItem("currentChallenges", index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("currentChallenges", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("currentChallenges")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Challenge
                    </Button>
                  </div>

                  {/* Goals */}
                  <div>
                    <FormLabel>Business Goals</FormLabel>
                    <FormDescription className="mb-3">
                      What are your key business objectives and goals?
                    </FormDescription>
                    {form.watch("goals").map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Describe a business goal"
                          value={form.watch("goals")[index] || ""}
                          onChange={(e) => updateArrayItem("goals", index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("goals", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("goals")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>

                  {/* Competitors */}
                  <div>
                    <FormLabel>Key Competitors</FormLabel>
                    <FormDescription className="mb-3">
                      List your main competitors or companies you benchmark against
                    </FormDescription>
                    {form.watch("competitors").map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Competitor name"
                          value={form.watch("competitors")[index] || ""}
                          onChange={(e) => updateArrayItem("competitors", index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("competitors", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("competitors")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Competitor
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createProfile.isPending}
                  >
                    {createProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Business Profile
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
          {/* AI Business Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Business Overview</CardTitle>
              <CardDescription>
                Get AI-powered insights about your business and industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateOverview}
                disabled={loadingOverview}
                className="w-full mb-4"
                variant="outline"
              >
                {loadingOverview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Overview
                  </>
                )}
              </Button>
              
              {overview && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{overview}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Building className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Be Detailed</p>
                  <p className="text-xs text-muted-foreground">
                    More details lead to better consulting insights
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Know Your Market</p>
                  <p className="text-xs text-muted-foreground">
                    Understanding your target audience is crucial
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Clear Goals</p>
                  <p className="text-xs text-muted-foreground">
                    Specific goals enable targeted recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Profiles */}
          {profiles && profiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profiles.slice(0, 3).map((profile) => (
                    <div key={profile.id} className="p-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{profile.companyName}</p>
                      <p className="text-xs text-muted-foreground">{profile.industry}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}