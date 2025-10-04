'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeesData {
  totalFees: number;
  paidAmount: number;
  outstandingAmount: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  nextDueDate: string;
}

const mockFees: FeesData = {
  totalFees: 15000,
  paidAmount: 10000,
  outstandingAmount: 5000,
  lastPaymentDate: '2025-09-15',
  lastPaymentAmount: 5000,
  nextDueDate: '2025-10-15'
};

export default function FeesSummaryCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Fees Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Outstanding Amount</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">${mockFees.outstandingAmount}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Due Date: {mockFees.nextDueDate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Fees</p>
              <p className="text-lg font-bold text-card-foreground">${mockFees.totalFees}</p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Paid</p>
              <p className="text-lg font-bold text-green-600">${mockFees.paidAmount}</p>
            </div>
          </div>

          <div className="p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Payment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ${mockFees.lastPaymentAmount} on {mockFees.lastPaymentDate}
            </p>
          </div>

          <Link href="/account/fees">
            <Button className="w-full" size="lg">
              Pay Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
