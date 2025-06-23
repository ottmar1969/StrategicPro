import { Route, Router } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ConsultationForm from "./pages/ConsultationForm";
import AnalysisResults from "./pages/AnalysisResults";
import BusinessProfile from "./pages/BusinessProfile";
import DownloadPage from "./pages/Download";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/consultation" component={ConsultationForm} />
          <Route path="/analysis/:id" component={AnalysisResults} />
          <Route path="/business-profile" component={BusinessProfile} />
          <Route path="/download" component={DownloadPage} />
        </Router>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;