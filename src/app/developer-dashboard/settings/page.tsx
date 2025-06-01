'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function DeveloperSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    projectUpdates: true,
    paymentAlerts: true,
    systemMaintenance: false
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
          Manage your developer account and preferences
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
                  defaultValue="John" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue="Doe" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="john.doe@solardeveloper.com" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input 
                  id="phone" 
                  defaultValue="+234 80 1234 5678" 
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
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-[#3D9970]" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="text-white">Company Name</Label>
              <Input 
                id="companyName" 
                defaultValue="Green Energy Solutions Ltd" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="companyAddress" className="text-white">Company Address</Label>
              <Input 
                id="companyAddress" 
                defaultValue="123 Solar Street, Victoria Island, Lagos" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationNumber" className="text-white">Registration Number</Label>
                <Input 
                  id="registrationNumber" 
                  defaultValue="RC-1234567" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="taxId" className="text-white">Tax ID</Label>
                <Input 
                  id="taxId" 
                  defaultValue="TIN-98765432" 
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API & Integration */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-[#3D9970]" />
              API & Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey" className="text-white">API Key</Label>
              <div className="flex space-x-2 mt-1">
                <Input 
                  id="apiKey" 
                  type={showApiKey ? "text" : "password"}
                  defaultValue="og_sk_1234567890abcdef1234567890abcdef" 
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Use this key to integrate with OnGrid Protocol APIs
              </p>
            </div>
            <div>
              <Label htmlFor="webhookUrl" className="text-white">Webhook URL</Label>
              <Input 
                id="webhookUrl" 
                placeholder="https://your-domain.com/webhook" 
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Receive real-time updates about your projects
              </p>
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
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Project Updates</p>
                    <p className="text-sm text-gray-400">Installation progress and milestones</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.projectUpdates}
                  onCheckedChange={(value) => handleNotificationChange('projectUpdates', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">Payment Alerts</p>
                    <p className="text-sm text-gray-400">Funding and payment notifications</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(value) => handleNotificationChange('paymentAlerts', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">System Maintenance</p>
                    <p className="text-sm text-gray-400">Platform updates and maintenance</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.systemMaintenance}
                  onCheckedChange={(value) => handleNotificationChange('systemMaintenance', value)}
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
              Security Settings
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
                <p className="text-white">Session Management</p>
                <p className="text-sm text-gray-400">View and manage active sessions</p>
              </div>
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Manage Sessions
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