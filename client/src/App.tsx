import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/AuthPage";
import Home from "@/pages/Home";
import Watch from "@/pages/Watch";
import Upload from "@/pages/Upload";
import Profile from "@/pages/Profile";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import WatchHistory from "@/pages/WatchHistory";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import EditProfile from "@/pages/EditProfile";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Guest users can browse everything, auth only required for specific actions
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/watch/:id" component={Watch} />
      <Route path="/upload" component={Upload} />
      <Route path="/profile/:username?" component={Profile} />
      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route path="/admin" component={SuperAdminDashboard} />
      <Route path="/history" component={WatchHistory} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/trending" component={Home} />
      <Route path="/search" component={Home} />
      <Route path="/category/:category" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
