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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent mb-2">
          Repayment Tracking
        </h1>
        <p className="text-zinc-400">
          Monitor loan repayments for your solar projects
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Loan Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-[#3D9970]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalLoanAmount.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Across all projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Amount Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-green-400">{((totalPaid / totalLoanAmount) * 100).toFixed(1)}% completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFDC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFDC00]">${totalRemaining.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{repaymentData.length}</div>
            <p className="text-xs text-gray-400">Projects with loans</p>
          </CardContent>
        </Card>
      </div>

      {/* Repayment List */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#3D9970]" />
            Project Repayments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {repaymentData.map((project) => (
              <div key={project.id} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{project.projectName}</h3>
                    <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:text-right">
                    <p className="text-sm text-gray-400">Next Payment Due</p>
                    <p className="text-lg font-semibold text-white">{project.nextDue}</p>
                    <p className="text-[#FFDC00] font-bold">${project.nextPayment.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Loan</p>
                    <p className="text-lg font-semibold text-white">${project.totalLoan.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount Paid</p>
                    <p className="text-lg font-semibold text-green-400">${project.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Months Remaining</p>
                    <p className="text-lg font-semibold text-[#FFDC00]">{project.monthsRemaining}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
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
                    className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white"
                  >
                    Make Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
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
  );
} 