'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const parentLoginSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
});

type ParentLoginFormData = z.infer<typeof parentLoginSchema>;

const mockStudents = [
  {
    rollNumber: 'STU001',
    phoneNumber: '+1234567890',
    student: {
      name: 'Emma Johnson',
      class: 'Grade 10-A',
    },
    parent: {
      id: '3',
      name: 'Robert Johnson',
      email: 'parent@school.edu',
      phone: '+1234567890',
      role: 'parent' as const,
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      createdAt: '2024-02-15',
    },
  },
];

export default function ParentLoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [studentData, setStudentData] = useState<any>(null);
  const { login } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ParentLoginFormData>({
    resolver: zodResolver(parentLoginSchema),
  });

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const onSubmit = useCallback(
    async (data: ParentLoginFormData) => {
      setError('');
      setSuccess('');

      const student = mockStudents.find(
        (s) =>
          s.rollNumber.toLowerCase() === data.rollNumber.toLowerCase() &&
          s.phoneNumber === data.phoneNumber
      );

      if (!student) {
        setError('Invalid roll number or phone number');
        return;
      }

      const otp = generateOTP();
      setGeneratedOtp(otp);
      setStudentData(student);
      setStep('otp');
      setSuccess(`OTP sent to ${data.phoneNumber}. Use: ${otp}`);

      console.log(`Generated OTP: ${otp} for ${data.phoneNumber}`);
    },
    []
  );

  const handleVerifyOTP = useCallback(() => {
    setError('');

    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    if (studentData) {
      login(studentData.parent);
      router.push('/parent/dashboard');
    }
  }, [otp, generatedOtp, studentData, login, router]);

  const handleResendOTP = () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtp('');
    setError('');
    setSuccess(`New OTP sent. Use: ${newOtp}`);
    console.log(`Resent OTP: ${newOtp}`);
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setSuccess('');
    setGeneratedOtp('');
    setStudentData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">TRACKLY</h1>
              <p className="text-muted-foreground">Parent Portal Login</p>
            </div>
          </CardHeader>

          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Student Roll Number</Label>
                  <Input
                    id="rollNumber"
                    placeholder="Enter roll number (e.g., STU001)"
                    {...register('rollNumber')}
                    className="h-11"
                  />
                  {errors.rollNumber && (
                    <p className="text-sm text-destructive">{errors.rollNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Registered Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phoneNumber"
                      placeholder="+1234567890"
                      {...register('phoneNumber')}
                      className="h-11 pl-10"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-11">
                  Send OTP
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Demo Credentials:
                  </p>
                  <div className="bg-accent/50 p-3 rounded-lg text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Roll Number:</span> STU001
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> +1234567890
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-medium">{getValues('phoneNumber')}</span>
                  </p>
                </div>

                {success && (
                  <Alert>
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-center block">Enter 6-Digit OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                          setOtp(value);
                          setError('');
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6}
                    className="w-full h-11"
                  >
                    Verify & Login
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>

                {studentData && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Student Information:</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Name:</span>{' '}
                      {studentData.student.name}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Class:</span>{' '}
                      {studentData.student.class}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Login as Staff or Teacher
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">@ DM Solution. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
