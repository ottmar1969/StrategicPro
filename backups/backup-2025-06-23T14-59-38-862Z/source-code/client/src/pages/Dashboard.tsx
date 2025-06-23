import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsultationRequest } from "@shared/schema";

export default function Dashboard() {
  const { data: consultations, isLoading } = useQuery<ConsultationRequest[]>({
    queryKey: ["/api/consultations"],
  });

  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ["/api/analysis"],
  });

  const stats = {
    total: consultations?.length || 0,
    completed: consultations?.filter(c => c.status === "completed").length || 0,
    pending: consultations?.filter(c => c.status === "pending").length || 0,
    analyzing: consultations?.filter(c => c.status === "analyzing").length || 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "analyzing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20";
      case "analyzing":
        return "text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-900/20";
      default:
        return "text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-900/20";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Consulting Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your consultations and view analysis results
          </p>
        </div>
        <Link href="/consultation">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyzing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.analyzing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
          <CardDescription>
            Your latest consultation requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consultations && consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.slice(0, 10).map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{consultation.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {consultation.category.charAt(0).toUpperCase() + consultation.category.slice(1).replace('-', ' ')} • {formatDate(consultation.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(consultation.status)}`}>
                      {getStatusIcon(consultation.status)}
                      <span className="capitalize">{consultation.status}</span>
                    </div>
                    
                    {consultation.status === "completed" ? (
                      <Link href={`/analysis/${consultation.id}`}>
                        <Button size="sm" variant="outline">
                          View Analysis
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        {consultation.status === "analyzing" ? "Processing..." : "Pending"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No consultations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first consultation to get expert business insights
              </p>
              <Link href="/consultation">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Consultation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}