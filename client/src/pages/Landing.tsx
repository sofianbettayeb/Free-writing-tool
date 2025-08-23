import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Journal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your personal journaling companion with rich text editing, image support, and secure cloud storage.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Rich text editor with multiple fonts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Image upload and management</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Writing timer for focused sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>Export to multiple formats</span>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full"
            data-testid="button-login"
          >
            Sign In to Continue
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Secure authentication powered by Replit
          </p>
        </CardContent>
      </Card>
    </div>
  );
}