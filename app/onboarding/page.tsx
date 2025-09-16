'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { schoolsApi } from '@/lib/api/multi-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Building2, Users, Settings, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().min(1, 'Currency is required'),
  academicYearStart: z.string().min(1, 'Academic year start is required'),
  academicYearEnd: z.string().min(1, 'Academic year end is required'),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

const steps = [
  { id: 1, title: 'School Information', icon: Building2 },
  { id: 2, title: 'Academic Settings', icon: GraduationCap },
  { id: 3, title: 'User Setup', icon: Users },
  { id: 4, title: 'Configuration', icon: Settings },
  { id: 5, title: 'Complete', icon: CheckCircle },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      timezone: 'UTC',
      currency: 'USD',
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SchoolFormData) => {
    setLoading(true);
    try {
      const school = await schoolsApi.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website || undefined,
        timezone: data.timezone,
        currency: data.currency,
        academic_year_start: data.academicYearStart,
        academic_year_end: data.academicYearEnd,
      });

      toast({
        title: "School created successfully!",
        description: "Your school has been set up. Redirecting to dashboard...",
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating school:', error);
      toast({
        title: "Setup failed",
        description: "Failed to create school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TRACKLY</h1>
          <p className="text-gray-600">Let's set up your school management system</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors',
                    isActive ? 'bg-purple-600 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    'text-xs text-center',
                    isActive ? 'text-purple-600 font-semibold' :
                    isCompleted ? 'text-green-600' :
                    'text-gray-500'
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">School Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter school name"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@school.edu"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://school.edu"
                        {...register('website')}
                      />
                      {errors.website && (
                        <p className="text-sm text-red-600">{errors.website.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter school address"
                      {...register('address')}
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select onValueChange={(value) => setValue('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select onValueChange={(value) => setValue('currency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academicYearStart">Academic Year Start *</Label>
                      <Input
                        id="academicYearStart"
                        type="date"
                        {...register('academicYearStart')}
                      />
                      {errors.academicYearStart && (
                        <p className="text-sm text-red-600">{errors.academicYearStart.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="academicYearEnd">Academic Year End *</Label>
                      <Input
                        id="academicYearEnd"
                        type="date"
                        {...register('academicYearEnd')}
                      />
                      {errors.academicYearEnd && (
                        <p className="text-sm text-red-600">{errors.academicYearEnd.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Admin Account Setup
                    </h3>
                    <p className="text-gray-600">
                      Your admin account will be created with the email address you provided.
                      You'll receive login credentials via email.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Settings className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Final Configuration
                    </h3>
                    <p className="text-gray-600">
                      We're setting up your school with default configurations.
                      You can customize these later in the settings.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Setup Complete!
                    </h3>
                    <p className="text-gray-600">
                      Your school management system is ready to use.
                      You can now start adding students, teachers, and classes.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={currentStep === 2 ? handleSubmit(nextStep) : nextStep}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}