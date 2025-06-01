'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

export default function RepaymentTracking() {
  const repaymentData = [
    {
      id: 1,
      projectName: 'Lagos Solar Farm Alpha',
      totalLoan: 250000,
      paidAmount: 125000,
      nextPayment: 12500,
      nextDue: '2024-02-15',
      status: 'current',
      monthsRemaining: 10
    },
    {
      id: 2,
      projectName: 'Abuja Community Solar',
      totalLoan: 150000,
      paidAmount: 90000,
      nextPayment: 7500,
      nextDue: '2024-02-20',
      status: 'current',
      monthsRemaining: 8
    },
    {
      id: 3,
      projectName: 'Kano Wind Project',
      totalLoan: 400000,
      paidAmount: 80000,
      nextPayment: 20000,
      nextDue: '2024-01-30',
      status: 'overdue',
      monthsRemaining: 16
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const totalLoanAmount = repaymentData.reduce((sum, item) => sum + item.totalLoan, 0);
  const totalPaid = repaymentData.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalRemaining = totalLoanAmount - totalPaid;

  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-oga-green/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-oga-green mb-2 relative">
            Developer Dashboard
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-oga-green" />
          </span>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-oga-green to-oga-yellow bg-clip-text text-transparent mb-2">
            Repayment Tracking
          </h1>
          <p className="text-zinc-400">
            Monitor loan repayments for your solar projects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Loan Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">${totalLoanAmount.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Amount Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">${totalPaid.toLocaleString()}</div>
              <p className="text-xs text-green-400">{((totalPaid / totalLoanAmount) * 100).toFixed(1)}% completed</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Remaining</CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-oga-yellow">${totalRemaining.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Outstanding balance</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{repaymentData.length}</div>
              <p className="text-xs text-oga-green">Projects with loans</p>
            </CardContent>
          </Card>
        </div>

        {/* Repayment List */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-oga-green" />
              Project Repayments
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-6">
              {repaymentData.map((project) => (
                <div key={project.id} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{project.projectName}</h3>
                      <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:text-right">
                      <p className="text-sm text-oga-green">Next Payment Due</p>
                      <p className="text-lg font-semibold text-white">{project.nextDue}</p>
                      <p className="text-oga-yellow font-bold">${project.nextPayment.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-oga-green">Total Loan</p>
                      <p className="text-lg font-semibold text-white">${project.totalLoan.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-oga-green">Amount Paid</p>
                      <p className="text-lg font-semibold text-green-400">${project.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-oga-green">Months Remaining</p>
                      <p className="text-lg font-semibold text-oga-yellow">{project.monthsRemaining}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-oga-green mb-2">
                      <span>Progress</span>
                      <span>{((project.paidAmount / project.totalLoan) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(project.paidAmount / project.totalLoan) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                    >
                      Make Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-oga-green/50 text-oga-green hover:bg-oga-green/10"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Payment History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 