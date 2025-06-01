'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User,
  Wallet,
  Bell,
  Shield,
  CreditCard,
  TrendingUp,
  Smartphone,
  Mail,
  DollarSign,
  BarChart3,
  Save,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';

export default function InvestorSettings() {
  const [showBalance, setShowBalance] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    investmentUpdates: true,
    priceAlerts: true,
    portfolioReports: true,
    carbonCreditUpdates: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-zinc-400">
          Manage your investor account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-[#3D9970]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue="Jane" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue="Smith" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="jane.smith@investor.com" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input 
                  id="phone" 
                  defaultValue="+234 90 8765 4321" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="timezone" className="text-white">Timezone</Label>
                <Input 
                  id="timezone" 
                  defaultValue="Africa/Lagos" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="investorType" className="text-white">Investor Type</Label>
              <Input 
                id="investorType" 
                defaultValue="Individual Investor" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
                readOnly
              />
              <p className="text-xs text-gray-400 mt-1">
                Contact support to change your investor classification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#3D9970]" />
              Investment Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="riskTolerance" className="text-white">Risk Tolerance</Label>
                <Input 
                  id="riskTolerance" 
                  defaultValue="Moderate" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="investmentHorizon" className="text-white">Investment Horizon</Label>
                <Input 
                  id="investmentHorizon" 
                  defaultValue="Long-term (5+ years)" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minInvestment" className="text-white">Minimum Investment Alert</Label>
                <Input 
                  id="minInvestment" 
                  defaultValue="$1,000" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="autoInvest" className="text-white">Auto-invest Amount</Label>
                <Input 
                  id="autoInvest" 
                  defaultValue="$500" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="preferredSectors" className="text-white">Preferred Sectors</Label>
              <Input 
                id="preferredSectors" 
                defaultValue="Solar, Wind, Residential" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple sectors with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wallet & Payment */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-[#3D9970]" />
              Wallet & Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="walletAddress" className="text-white">Connected Wallet Address</Label>
              <div className="flex space-x-2 mt-1">
                <Input 
                  id="walletAddress" 
                  type={showBalance ? "text" : "password"}
                  defaultValue="0x742d35Cc7c...4B8d9E67a1F" 
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredCurrency" className="text-white">Preferred Currency</Label>
                <Input 
                  id="preferredCurrency" 
                  defaultValue="USDC" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gasFee" className="text-white">Gas Fee Preference</Label>
                <Input 
                  id="gasFee" 
                  defaultValue="Standard" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Auto-approve Transactions</p>
                <p className="text-sm text-gray-400">Automatically approve small transactions under $100</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#3D9970]" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates via SMS</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(value) => handleNotificationChange('sms', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Investment Updates</p>
                    <p className="text-sm text-gray-400">New opportunities and performance updates</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.investmentUpdates}
                  onCheckedChange={(value) => handleNotificationChange('investmentUpdates', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Price Alerts</p>
                    <p className="text-sm text-gray-400">Significant price movements and returns</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.priceAlerts}
                  onCheckedChange={(value) => handleNotificationChange('priceAlerts', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Portfolio Reports</p>
                    <p className="text-sm text-gray-400">Monthly and quarterly portfolio summaries</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.portfolioReports}
                  onCheckedChange={(value) => handleNotificationChange('portfolioReports', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Carbon Credit Updates</p>
                    <p className="text-sm text-gray-400">Carbon credit rewards and environmental impact</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.carbonCreditUpdates}
                  onCheckedChange={(value) => handleNotificationChange('carbonCreditUpdates', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#3D9970]" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Button 
                variant="outline"
                className="border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
              >
                Enable 2FA
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Change Password</p>
                <p className="text-sm text-gray-400">Update your account password</p>
              </div>
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Change Password
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Download Portfolio Data</p>
                <p className="text-sm text-gray-400">Export your investment history and returns</p>
              </div>
              <Button 
                variant="outline"
                className="border-[#FFDC00]/50 text-[#FFDC00] hover:bg-[#FFDC00]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Data Privacy Settings</p>
                <p className="text-sm text-gray-400">Manage how your data is used</p>
              </div>
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Reset Changes
          </Button>
          <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
} 