import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Handle authenticated layout setup and redirect
  useEffect(() => {
    // Add the scroll lock class when authenticated layout mounts
    document.body.classList.add('app-locked-scroll');
    
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    // Remove scroll lock class when component unmounts
    return () => {
      document.body.classList.remove('app-locked-scroll');
    };
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">Free writing</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{((user as any).firstName || (user as any).email) as string}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}