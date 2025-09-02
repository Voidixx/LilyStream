import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginUser, RegisterUser, loginUserSchema, registerUserSchema } from "@shared/schema";
import { Eye, EyeOff, Play, Users, Zap, Star, Shield, Smartphone } from "lucide-react";

export default function Auth() {
  const { loginMutation, registerMutation, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterUser>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      displayName: "",
    },
  });

  const onLogin = (data: LoginUser) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left Side - Hero Section */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Welcome to LilyTube
              </h1>
              <p className="text-xl text-pink-100">
                The next-generation video platform where every creator gets a fair chance to shine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-yellow-300" />
                  <h3 className="font-semibold">Fair Algorithm</h3>
                </div>
                <p className="text-sm text-pink-100">
                  Every video gets a chance to be discovered with our revolutionary fair algorithm.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-300" />
                  <h3 className="font-semibold">Creator-First</h3>
                </div>
                <p className="text-sm text-pink-100">
                  Built by creators, for creators. Upload, schedule, and grow your audience.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-green-300" />
                  <h3 className="font-semibold">Privacy Focused</h3>
                </div>
                <p className="text-sm text-pink-100">
                  Your data is secure. No tracking, no ads based on personal data.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-6 w-6 text-purple-300" />
                  <h3 className="font-semibold">Fast Uploads</h3>
                </div>
                <p className="text-sm text-pink-100">
                  Smart upload technology with progress tracking and time estimates.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Join thousands of creators</span>
              </div>
              <p className="text-sm text-pink-100">
                "LilyTube gave my small channel the visibility it deserved. The fair algorithm actually works!" 
                <span className="block mt-2 text-xs opacity-75">- Sarah K., Content Creator</span>
              </p>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl" data-testid="auth-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">Get Started</CardTitle>
                <CardDescription>
                  Join the revolution of fair video discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                    <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" data-testid="form-login">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} data-testid="input-username" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...field}
                                    data-testid="input-password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    data-testid="button-toggle-password"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          disabled={loginMutation.isPending}
                          data-testid="button-login"
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" data-testid="form-register">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} data-testid="input-firstname" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} data-testid="input-lastname" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe" {...field} data-testid="input-register-username" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} data-testid="input-display-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showRegPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    {...field}
                                    data-testid="input-register-password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                    data-testid="button-toggle-register-password"
                                  >
                                    {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          disabled={registerMutation.isPending}
                          data-testid="button-register"
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="text-center text-white/70 text-sm mt-8">
          © 2025 LilyTube. All rights reserved.
        </div>
      </div>
    </div>
  );
}