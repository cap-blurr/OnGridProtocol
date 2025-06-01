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
  EyeOff,
  BarChart3
} from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  projectUpdates: boolean;
  paymentAlerts: boolean;
  systemMaintenance: boolean;
}

export default function DeveloperSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    projectUpdates: true,
    paymentAlerts: true,
    systemMaintenance: false
  });

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev: NotificationSettings) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-oga-green/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-oga-green mb-2 relative">
            Developer Dashboard
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-oga-green" />
          </span>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-oga-green to-oga-yellow bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-zinc-400">
            Manage your developer account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-oga-green" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="John" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Doe" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="john.doe@solardeveloper.com" 
                  className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input 
                    id="phone" 
                    defaultValue="+234 80 1234 5678" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-white">Timezone</Label>
                  <Input 
                    id="timezone" 
                    defaultValue="Africa/Lagos" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-oga-green" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-white">Company Name</Label>
                <Input 
                  id="companyName" 
                  defaultValue="Green Energy Solutions Ltd" 
                  className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                />
              </div>
              <div>
                <Label htmlFor="companyAddress" className="text-white">Company Address</Label>
                <Input 
                  id="companyAddress" 
                  defaultValue="123 Solar Street, Victoria Island, Lagos" 
                  className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationNumber" className="text-white">Registration Number</Label>
                  <Input 
                    id="registrationNumber" 
                    defaultValue="RC-1234567" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
                <div>
                  <Label htmlFor="taxId" className="text-white">Tax ID</Label>
                  <Input 
                    id="taxId" 
                    defaultValue="TIN-98765432" 
                    className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API & Integration */}
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-oga-green" />
                API & Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <Label htmlFor="apiKey" className="text-white">API Key</Label>
                <div className="flex space-x-2 mt-1">
                  <Input 
                    id="apiKey" 
                    type={showApiKey ? "text" : "password"}
                    defaultValue="og_sk_1234567890abcdef1234567890abcdef" 
                    className="bg-gray-800 border-oga-green/50 text-white flex-1 focus:border-oga-green"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="border-oga-green/50 text-oga-green hover:bg-oga-green/20 hover:text-oga-green hover:border-oga-green transition-all duration-200"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-oga-green/50 text-oga-green hover:bg-oga-green/20 hover:text-oga-green hover:border-oga-green font-medium transition-all duration-200"
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-oga-green mt-1">
                  Use this key to integrate with OnGrid Protocol APIs
                </p>
              </div>
              <div>
                <Label htmlFor="webhookUrl" className="text-white">Webhook URL</Label>
                <Input 
                  id="webhookUrl" 
                  placeholder="https://your-domain.com/webhook" 
                  className="bg-gray-800 border-oga-green/50 text-white mt-1 focus:border-oga-green"
                />
                <p className="text-xs text-oga-green mt-1">
                  Receive real-time updates about your projects
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-oga-green" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-oga-green" />
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-xs text-oga-green">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value: boolean) => handleNotificationChange('email', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-4 h-4 text-oga-green" />
                    <div>
                      <Label className="text-white">SMS Notifications</Label>
                      <p className="text-xs text-oga-green">Receive updates via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value: boolean) => handleNotificationChange('sms', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-4 h-4 text-oga-green" />
                    <div>
                      <Label className="text-white">Project Updates</Label>
                      <p className="text-xs text-oga-green">Get notified about project status changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(value: boolean) => handleNotificationChange('projectUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-oga-green" />
                    <div>
                      <Label className="text-white">Payment Alerts</Label>
                      <p className="text-xs text-oga-green">Get notified about payments and funding</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(value: boolean) => handleNotificationChange('paymentAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-oga-green" />
                    <div>
                      <Label className="text-white">System Maintenance</Label>
                      <p className="text-xs text-oga-green">Get notified about system updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.systemMaintenance}
                    onCheckedChange={(value: boolean) => handleNotificationChange('systemMaintenance', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white hover:text-white font-medium transition-all duration-200"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 