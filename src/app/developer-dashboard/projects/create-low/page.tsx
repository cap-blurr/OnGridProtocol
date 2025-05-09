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
import { Sun, Home, MapPin, DollarSign, Upload, Check, ArrowLeft } from "lucide-react";

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
  homeCount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Number of homes must be a positive number.",
  }),
});

export default function CreateResidentialProject() {
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
      homeCount: "",
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
        
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Residential Solar Project
        </h1>
        <p className="text-zinc-400">
          Set up a new residential solar installation project to attract investors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative border-b border-zinc-800/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Sun className="h-5 w-5 text-emerald-500" />
                Project Details
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Fill in all the details for your residential solar project
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
                              placeholder="e.g. Sunrise Residential Solar Array" 
                              {...field} 
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Choose a descriptive and appealing name.
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
                              placeholder="e.g. San Diego County, CA" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Specify the city, county, or region.
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
                            placeholder="Describe the project, its benefits, and impact..." 
                            {...field}
                            className="bg-black/50 border-zinc-700 text-white min-h-[120px] focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500">
                          Provide a detailed description of the residential project.
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
                              placeholder="e.g. 250000" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Total funding needed for the project.
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
                              placeholder="e.g. 12.5" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Estimated annual return on investment.
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
                              <SelectItem value="12">12 Months</SelectItem>
                              <SelectItem value="24">24 Months</SelectItem>
                              <SelectItem value="36">36 Months</SelectItem>
                              <SelectItem value="48">48 Months</SelectItem>
                              <SelectItem value="60">60 Months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-zinc-500">
                            Expected timeline for the project.
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
                          <FormLabel className="text-white">Capacity (kW)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 250" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Total energy generation capacity.
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="homeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Number of Homes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 50" 
                              {...field}
                              className="bg-black/50 border-zinc-700 text-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Homes to be serviced by this project.
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
                          Create Residential Project
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
            
            <CardHeader className="relative">
              <CardTitle className="text-white text-lg">Residential Project Guide</CardTitle>
              <CardDescription className="text-zinc-400">
                Key information for residential solar projects
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-4">
              <div className="flex gap-3">
                <Home className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Residential Focus</h3>
                  <p className="text-zinc-400 text-sm">Projects that install solar panels on residential homes, typically in neighborhoods or communities.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Location Specifics</h3>
                  <p className="text-zinc-400 text-sm">Be specific about the location to help investors understand the solar potential and community impact.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Investment Scale</h3>
                  <p className="text-zinc-400 text-sm">Residential projects typically range from $100,000 to $500,000 depending on the number of homes.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Sun className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Energy Output</h3>
                  <p className="text-zinc-400 text-sm">Clearly explain the expected energy generation capacity and how many homes will benefit.</p>
                </div>
              </div>
              
              <div className="border-t border-zinc-800/50 pt-4 mt-4">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Document Upload</span>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  You'll be prompted to upload supporting documents after creating the project:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Site assessment report
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Homeowner agreements
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Energy production estimates
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300 text-sm">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Financial projections
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 