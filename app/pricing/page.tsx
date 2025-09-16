'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for small schools',
    monthlyPrice: 49,
    yearlyPrice: 490,
    icon: Star,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    features: [
      'Up to 100 students',
      'Up to 10 teachers',
      'Up to 20 classes',
      'Basic reporting',
      'Email support',
      'Student management',
      'Attendance tracking',
      'Grade management',
    ],
    limits: {
      students: 100,
      teachers: 10,
      classes: 20,
      storage: '1GB',
    },
  },
  {
    name: 'Standard',
    description: 'Great for growing schools',
    monthlyPrice: 99,
    yearlyPrice: 990,
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    popular: true,
    features: [
      'Up to 500 students',
      'Up to 50 teachers',
      'Up to 100 classes',
      'Advanced reporting',
      'Priority support',
      'All Basic features',
      'Fee management',
      'Transport management',
      'Library management',
      'Parent portal',
    ],
    limits: {
      students: 500,
      teachers: 50,
      classes: 100,
      storage: '10GB',
    },
  },
  {
    name: 'Premium',
    description: 'For large institutions',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      'Unlimited students',
      'Unlimited teachers',
      'Unlimited classes',
      'Custom reporting',
      '24/7 phone support',
      'All Standard features',
      'Hostel management',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'White-label options',
    ],
    limits: {
      students: 'Unlimited',
      teachers: 'Unlimited',
      classes: 'Unlimited',
      storage: '100GB',
    },
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
    // Handle plan selection - integrate with Stripe
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scale your school management with our flexible pricing plans
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={cn('text-sm', !isYearly ? 'font-semibold' : 'text-gray-500')}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={cn('text-sm', isYearly ? 'font-semibold' : 'text-gray-500')}>
              Yearly
            </span>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Save 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const Icon = plan.icon;
            
            return (
              <Card 
                key={plan.name}
                className={cn(
                  'relative overflow-hidden transition-all duration-200 hover:shadow-xl',
                  plan.popular && 'ring-2 ring-purple-500 scale-105'
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-purple-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={cn('text-center', plan.popular && 'pt-12')}>
                  <div className={cn('w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4', plan.bgColor)}>
                    <Icon className={cn('w-8 h-8', plan.color)} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-green-600">
                      Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice} per year
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Plan Limits</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="font-medium">{plan.limits.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teachers:</span>
                        <span className="font-medium">{plan.limits.teachers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classes:</span>
                        <span className="font-medium">{plan.limits.classes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-medium">{plan.limits.storage}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      'w-full',
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    )}
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial for all plans. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data is safely stored for 30 days after cancellation, giving you time to export or reactivate.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer custom plans?
              </h3>
              <p className="text-gray-600">
                Yes, we offer custom enterprise plans for large institutions with specific requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect plan for your school.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}