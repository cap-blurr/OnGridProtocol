"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, 
  Check, 
  AlertCircle,
  Shield,
  Building2,
  UserCheck,
  FileText,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DeveloperKYCPage() {
  const [kycProgress, setKycProgress] = useState(30);
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update progress based on current tab
    if (activeTab === "company") {
      setKycProgress(60);
      setActiveTab("documents");
    } else if (activeTab === "documents") {
      setKycProgress(100);
      setActiveTab("review");
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="relative pt-32">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative">
        <div className="mb-12">
          <div className="relative pl-6">
            {/* Thin accent line */}
            <div className="absolute -left-4 top-0 h-full w-px bg-emerald-700/30" />
            
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-emerald-500 mb-2 relative">
              Organization Verification
              <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-2">
              Complete <span className="text-emerald-400">KYC</span> <br className="hidden md:block" />
              Verification
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl">
              Verify your organization to unlock project creation and funding features
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 mb-12 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-emerald-900/5 pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-emerald-500" />
              Verification Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Progress</span>
                <span>{kycProgress}% Complete</span>
              </div>
              <Progress value={kycProgress} className="h-2 bg-zinc-800/70" indicatorClassName="bg-emerald-500" />
              
              <div className="flex justify-between mt-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kycProgress >= 30 ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {kycProgress >= 30 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${kycProgress >= 30 ? 'text-emerald-400' : 'text-zinc-400'}`}>Company Information</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kycProgress >= 60 ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {kycProgress >= 60 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${kycProgress >= 60 ? 'text-emerald-400' : 'text-zinc-400'}`}>Document Verification</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kycProgress === 100 ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {kycProgress === 100 ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${kycProgress === 100 ? 'text-emerald-400' : 'text-zinc-400'}`}>Review & Submission</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* KYC Forms */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 max-w-2xl mx-auto">
          <TabsList className="bg-black/50 border border-zinc-800 p-1 w-full flex">
            <TabsTrigger 
              value="company" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              Company Info
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5" 
              disabled={kycProgress < 60}
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5" 
              disabled={kycProgress < 100}
            >
              Review
            </TabsTrigger>
          </TabsList>
          
          {/* Company Information Tab */}
          <TabsContent value="company">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white font-bold">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Company Information
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Provide details about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form id="company-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-zinc-300">Company Name</Label>
                      <Input id="companyName" placeholder="Enter legal company name" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber" className="text-zinc-300">Registration Number</Label>
                      <Input id="registrationNumber" placeholder="Business registration number" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yearFounded" className="text-zinc-300">Year Founded</Label>
                      <Input id="yearFounded" type="number" placeholder="YYYY" min="1900" max="2024" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyType" className="text-zinc-300">Company Type</Label>
                      <Select defaultValue="private">
                        <SelectTrigger className="h-10 bg-zinc-900/70 border-zinc-700 text-white">
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="private">Private Limited Company</SelectItem>
                          <SelectItem value="public">Public Limited Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                          <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-zinc-300">Country of Registration</Label>
                      <Select defaultValue="us">
                        <SelectTrigger className="h-10 bg-zinc-900/70 border-zinc-700 text-white">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxId" className="text-zinc-300">Tax ID Number</Label>
                      <Input id="taxId" placeholder="Enter tax identification number" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500" />
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-zinc-800/60" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-zinc-300">Registered Business Address</Label>
                    <Input id="address" placeholder="Street Address Line 1" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-zinc-300">City</Label>
                      <Input id="city" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-zinc-300">State/Province</Label>
                      <Input id="state" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postal" className="text-zinc-300">Postal/ZIP Code</Label>
                      <Input id="postal" required className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" />
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-zinc-800/60" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription" className="text-zinc-300">Business Description</Label>
                    <Textarea 
                      id="businessDescription" 
                      placeholder="Briefly describe your company's business activities, focus areas, and experience in renewable energy." 
                      className="min-h-[120px] bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-zinc-300">Does your company currently operate any renewable energy projects?</Label>
                    <RadioGroup defaultValue="yes" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" className="text-emerald-500 border-zinc-600" />
                        <Label htmlFor="yes" className="text-zinc-300">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" className="text-emerald-500 border-zinc-600" />
                        <Label htmlFor="no" className="text-zinc-300">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-800/60 pt-6 relative">
                <Button variant="outline" disabled className="border-zinc-700 text-zinc-400">
                  Back
                </Button>
                <Button 
                  type="submit" 
                  form="company-form" 
                  disabled={isSubmitting} 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-6 py-2.5 flex items-center group"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white font-bold">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Document Verification
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Upload the required documents to verify your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form id="documents-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-dashed border-emerald-700/30 rounded-lg hover:border-emerald-600 transition-colors group">
                      <div className="text-center py-6 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto group-hover:bg-emerald-500/30 transition-colors">
                          <FileText className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Certificate of Incorporation</h3>
                          <p className="text-xs text-zinc-400">PDF or scanned image (JPEG, PNG)</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashed border-emerald-700/30 rounded-lg hover:border-emerald-600 transition-colors group">
                      <div className="text-center py-6 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto group-hover:bg-emerald-500/30 transition-colors">
                          <Building2 className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Articles of Organization</h3>
                          <p className="text-xs text-zinc-400">PDF or scanned image (JPEG, PNG)</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashed border-emerald-700/30 rounded-lg hover:border-emerald-600 transition-colors group">
                      <div className="text-center py-6 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto group-hover:bg-emerald-500/30 transition-colors">
                          <UserCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Proof of Address</h3>
                          <p className="text-xs text-zinc-400">Utility bill, bank statement, or official document (less than 3 months old)</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashed border-emerald-700/30 rounded-lg hover:border-emerald-600 transition-colors group">
                      <div className="text-center py-6 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto group-hover:bg-emerald-500/30 transition-colors">
                          <CreditCard className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Financial Statements</h3>
                          <p className="text-xs text-zinc-400">Last 2 years of financial statements or tax returns</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-zinc-800/60" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalDocuments" className="text-zinc-300">Additional Supporting Documents (Optional)</Label>
                    <p className="text-xs text-zinc-400 mb-2">Upload any additional documents that may help verify your organization's status and operations.</p>
                    <div className="p-4 border border-dashed border-emerald-700/30 rounded-lg hover:border-emerald-600 transition-colors">
                      <div className="text-center py-6 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                        >
                          Add Additional Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-800/60 pt-6 relative">
                <Button 
                  variant="outline"
                  className="border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/40 text-zinc-300" 
                  onClick={() => setActiveTab("company")}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  form="documents-form" 
                  disabled={isSubmitting} 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-6 py-2.5 flex items-center group"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Review Tab */}
          <TabsContent value="review">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white font-bold">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Review & Submit
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Review your information and submit for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-4 hover:bg-emerald-500/15 transition-colors">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Company Information Completed</h3>
                      <p className="text-sm text-zinc-400">All required company details have been provided</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-4 hover:bg-emerald-500/15 transition-colors">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Documents Uploaded</h3>
                      <p className="text-sm text-zinc-400">All required verification documents have been uploaded</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-4 hover:bg-amber-500/15 transition-colors">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Verification Pending</h3>
                      <p className="text-sm text-zinc-400">Your submission will be reviewed within 1-3 business days</p>
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-zinc-800/60" />
                  
                  <div className="space-y-3">
                    <Label htmlFor="termsAgreement" className="text-zinc-300">Terms & Conditions</Label>
                    <div className="p-4 bg-black/50 border border-zinc-800 rounded-lg text-sm text-zinc-400 max-h-48 overflow-y-auto">
                      <p className="mb-2">By submitting this KYC verification form, you agree and acknowledge that:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All information provided is accurate, complete, and truthful.</li>
                        <li>You have the authority to submit this verification on behalf of your organization.</li>
                        <li>OnGrid Protocol may verify the information with third-party services.</li>
                        <li>Your documents will be securely stored in accordance with our Privacy Policy.</li>
                        <li>You will update OnGrid Protocol if any material changes occur to the provided information.</li>
                      </ul>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="termsAgreement" 
                        className="text-emerald-600 focus:ring-emerald-500 h-4 w-4 rounded border-zinc-600 bg-zinc-900" 
                        required
                      />
                      <Label htmlFor="termsAgreement" className="text-sm text-zinc-300">
                        I agree to the terms and conditions
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-800/60 pt-6 relative">
                <Button 
                  variant="outline"
                  className="border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/40 text-zinc-300" 
                  onClick={() => setActiveTab("documents")}
                >
                  Back
                </Button>
                <div className="inline-flex relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-md blur opacity-30"></div>
                  <Button 
                    className="relative bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-6 py-2.5 flex items-center group"
                  >
                    Submit Verification
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}