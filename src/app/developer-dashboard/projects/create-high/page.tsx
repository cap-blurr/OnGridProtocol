"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Building2, MapPin, DollarSign, Upload, Check, ArrowLeft, BarChart3, Calendar } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  targetInvestment: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Target investment must be a positive number.",
  }),
  roiEstimate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ROI estimate must be a positive number.",
  }),
  duration: z.string().min(1, {
    message: "Please select a duration.",
  }),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Capacity must be a positive number.",
  }),
  landArea: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Land area must be a positive number.",
  }),
  businessType: z.string().min(1, {
    message: "Please select a business type.",
  }),
  carbonOffset: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Carbon offset estimate must be a positive number.",
  }),
});

export default function CreateCommercialProject() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      location: "",
      description: "",
      targetInvestment: "",
      roiEstimate: "",
      duration: "",
      capacity: "",
      landArea: "",
      businessType: "",
      carbonOffset: "",
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    console.log(values);
    
    // Simulate delay and success
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/developer-dashboard");
    }, 1500);
  }

  return (
    <div className="relative pb-16">
      {/* Background styling */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      <div className="mb-8 relative pl-6">
        <div className="absolute -left-4 top-0 h-full w-px bg-emerald-700/30" />
        
        <Button 
          variant="ghost" 
          className="mb-6 text-zinc-400 hover:text-white -ml-2 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <span className="inline-block font-mono text-xs uppercase tracking-widest text-emerald-500 mb-2 relative">
          Solar Project Creation
          <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
        </span>
        
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">
            Create Commercial Solar Project
          </h1>
          <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
            High Investment
          </Badge>
        </div>
        <p className="text-zinc-400">
          Set up a large-scale commercial solar installation project for businesses or industrial applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative border-b border-zinc-800/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-500" />
                Commercial Project Details
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Complete all fields to create your high-investment commercial solar project
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Solaris Commercial Solar Farm" 
                              {...field} 
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Choose a name that highlights the commercial scale.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Industrial Park, Phoenix, AZ" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Specify the commercial location details.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the commercial project scale, benefits, and expected outcomes..." 
                            {...field}
                            className="bg-black/50 border-zinc-700 text-white min-h-[120px] focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500">
                          Provide comprehensive details that will appeal to larger investors.
                        </FormDescription>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="targetInvestment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Target Investment ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 2500000" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Total capital needed for the commercial project.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="roiEstimate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">ROI Estimate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 14.5" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Expected annual return on investment percentage.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-zinc-700 text-white focus:ring-emerald-500">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black/90 border-zinc-700 text-white">
                              <SelectItem value="36">36 Months</SelectItem>
                              <SelectItem value="48">48 Months</SelectItem>
                              <SelectItem value="60">60 Months</SelectItem>
                              <SelectItem value="84">84 Months</SelectItem>
                              <SelectItem value="120">120 Months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-zinc-500">
                            Commercial projects typically have longer durations.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Capacity (MW)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 5.5" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Commercial projects are measured in megawatts.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="landArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Land Area (acres)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 25" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Total land area required for installation.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Business Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-zinc-700 text-white focus:ring-emerald-500">
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black/90 border-zinc-700 text-white">
                              <SelectItem value="utility">Utility Scale</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                              <SelectItem value="agricultural">Agricultural</SelectItem>
                              <SelectItem value="commercial">Commercial Building</SelectItem>
                              <SelectItem value="government">Government/Municipal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-zinc-500">
                            Type of business or sector this project serves.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="carbonOffset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Carbon Offset (tons/year)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 3500" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Estimated annual carbon emissions reduction.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Creating Project</span>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </>
                      ) : (
                        <>
                          Create Commercial Project
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative border-b border-zinc-800/50">
              <CardTitle className="text-white text-lg">Commercial Project Guidelines</CardTitle>
              <CardDescription className="text-zinc-400">
                Information for successful commercial solar projects
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-4 pt-4">
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Large-Scale Installation</h3>
                  <p className="text-zinc-400 text-sm">Commercial projects typically provide power to businesses, factories, warehouses, or utility-scale installations.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Higher Investment</h3>
                  <p className="text-zinc-400 text-sm">Commercial projects require capital in the range of $1M-$10M with longer payback periods.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Longer Timeline</h3>
                  <p className="text-zinc-400 text-sm">These projects typically have development cycles of 8-24 months before becoming operational.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <BarChart3 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Higher ROI Potential</h3>
                  <p className="text-zinc-400 text-sm">Commercial projects can offer 14-18% ROI with economies of scale and tax incentives.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative border-b border-zinc-800/50">
              <CardTitle className="text-white text-lg">Required Documentation</CardTitle>
              <CardDescription className="text-zinc-400">
                Prepare these documents for your project
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative pt-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Land lease or ownership documentation
                </li>
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Environmental impact assessment
                </li>
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Grid connection approval
                </li>
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Detailed engineering specifications
                </li>
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Financial pro forma (10+ year projection)
                </li>
                <li className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Permit applications and approvals
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 