"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "parent"], {
    required_error: "Please select a role",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Mock users for demonstration
const mockUsers = {
  admin: {
    email: "admin@school.edu",
    password: "admin123",
    user: {
      id: "1",
      name: "Priscilla Lily",
      email: "admin@school.edu",
      role: "admin" as const,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  },
  teacher: {
    email: "teacher@school.edu",
    password: "teacher123",
    user: {
      id: "2",
      name: "Dr. Sarah Wilson",
      email: "teacher@school.edu",
      role: "teacher" as const,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  },
  parent: {
    email: "parent@school.edu",
    password: "parent123",
    user: {
      id: "3",
      name: "Robert Johnson",
      email: "parent@school.edu",
      role: "parent" as const,
      avatar:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { login } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setError("");

      startTransition(async () => {
        try {
          const mockUser = mockUsers[data.role];

          if (
            data.email === mockUser.email &&
            data.password === mockUser.password
          ) {
            login(mockUser.user);
            // Immediate redirect without delay
            if (data.role === "admin") {
              router.push("/");
            } else if (data.role === "teacher") {
              router.push("/teacher/dashboard");
            } else if (data.role === "parent") {
              router.push("/parent/dashboard");
            }
          } else {
            setError("Invalid email or password");
          }
        } catch (err) {
          setError("Login failed. Please try again.");
        }
      });
    },
    [login, router, setValue]
  );

  const handleDemoLogin = useCallback(
    (role: "admin" | "teacher" | "parent") => {
      setValue("email", mockUsers[role].email);
      setValue("password", mockUsers[role].password);
      setValue("role", role);
    },
    [setValue]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">SDIK</h1>
              <p className="text-muted-foreground">School Management System</p>
            </div>

              
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select
                  onValueChange={(value) => setValue("role", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-purple-600 hover:bg-purple-700"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Login Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Demo Login Credentials:
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm"
                  onClick={() => handleDemoLogin("admin")}
                >
                  Login as Administrator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm"
                  onClick={() => handleDemoLogin("teacher")}
                >
                  Login as Teacher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm"
                  onClick={() => handleDemoLogin("parent")}
                >
                  Login as Parent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 SDIK School Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
