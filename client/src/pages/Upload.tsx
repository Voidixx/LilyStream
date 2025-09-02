import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import UploadForm from "@/components/UploadForm";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Upload() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Upload Video</h1>
          
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <UploadForm onSuccess={() => {
                toast({
                  title: "Success!",
                  description: "Your video has been uploaded successfully",
                });
                setLocation('/');
                queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
              }} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
