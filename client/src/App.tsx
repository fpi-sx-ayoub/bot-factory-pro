import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import FriendBot from "./pages/FriendBot";
import CommandsEditor from "./pages/CommandsEditor";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neon-green animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </>
      ) : user.role === "owner" ? (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/owner" component={OwnerDashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/friends" component={FriendBot} />
          <Route path="/commands" component={CommandsEditor} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/friends" component={FriendBot} />
          <Route path="/commands" component={CommandsEditor} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
