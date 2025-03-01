"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import {
  Check,
  ChevronRight,
  Upload,
  User,
  MapPin,
  FileText,
  Building2,
  Loader2,
  CalendarIcon,
  InfoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function KycForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accountType, setAccountType] = useState("individual")

  const totalSteps = 4

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: undefined,
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      documentType: "passport",
      accountType: "",
      documentNumber: "",
      companyName: "",
      companyRegistrationNumber: "",
      tradingPurpose: "",
      termsAccepted: false,
    },
  })

  const onSubmit = async (data:any) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted:", data)
      setStep(5)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step > index + 1
                    ? "border-oga-green bg-oga-green text-black"
                    : step === index + 1
                      ? "border-oga-green text-oga-green"
                      : "border-zinc-700 text-zinc-700"
                }`}
              >
                {step > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span
                className={`mt-2 hidden text-xs md:block ${step >= index + 1 ? "text-oga-green" : "text-zinc-600"}`}
              >
                {index === 0 ? "Personal" : index === 1 ? "Address" : index === 2 ? "Identity" : "Additional"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-zinc-800"></div>
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-oga-green transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {renderStepIndicator()}

      <Card className="border-[#2A2D35] bg-zinc-900">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Please provide your personal details for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => setStep(2))} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter last name"
                              className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-zinc-300">Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-[#2A2D35] hover:bg-[#252832] transition-colors duration-200",
                                  !field.value && "text-zinc-500",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {/* <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date > new Date().setFullYear(new Date().getFullYear() - 18)
                              }
                              initialFocus
                              className="border-[#2A2D35] text-white"
                            /> */}
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="text-zinc-500">You must be at least 18 years old</FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5" /> Address Information
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Please provide your current residential address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => setStep(3))} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Address Line 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartment, suite, etc."
                            className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">State/Province</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter state"
                              className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Postal Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter postal code"
                              className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#2A2D35] text-white">
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-[#2A2D35]">
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-0 hover:text-white transition-all duration-200 text-zinc-300"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" /> Identity Verification
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Please upload documents to verify your identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => setStep(4))} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Document Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="passport"
                                id="passport"
                                className="border-[#2A2D35] text-oga-green"
                              />
                              <Label htmlFor="passport" className="text-zinc-300">
                                Passport
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="drivingLicense"
                                id="drivingLicense"
                                className="border-[#2A2D35] text-oga-green"
                              />
                              <Label htmlFor="drivingLicense" className="text-zinc-300">
                                Driving License
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="nationalId"
                                id="nationalId"
                                className="border-[#2A2D35] text-oga-green"
                              />
                              <Label htmlFor="nationalId" className="text-zinc-300">
                                National ID Card
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Document Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter document number"
                            className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <FormLabel className="text-zinc-300">Front Side of Document</FormLabel>
                      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[#2A2D35] bg-zinc-800/50 p-6 text-center">
                        <Upload className="mb-2 h-8 w-8 text-zinc-400" />
                        <p className="mb-2 text-sm text-zinc-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-zinc-500">PNG, JPG or PDF (max. 5MB)</p>
                        <Input
                          type="file"
                          className="mt-2 w-full cursor-pointer border-[#2A2D35] text-white"
                          accept="image/png, image/jpeg, application/pdf"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel className="text-zinc-300">Back Side of Document</FormLabel>
                      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[#2A2D35] bg-zinc-800/50 p-6 text-center">
                        <Upload className="mb-2 h-8 w-8 text-zinc-400" />
                        <p className="mb-2 text-sm text-zinc-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-zinc-500">PNG, JPG or PDF (max. 5MB)</p>
                        <Input
                          type="file"
                          className="mt-2 w-full cursor-pointer border-[#2A2D35] text-white"
                          accept="image/png, image/jpeg, application/pdf"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="text-zinc-300">Selfie with Document</FormLabel>
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[#2A2D35] bg-zinc-800/50 p-6 text-center">
                      <Upload className="mb-2 h-8 w-8 text-zinc-400" />
                      <p className="mb-2 text-sm text-zinc-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-zinc-500">PNG or JPG (max. 5MB)</p>
                      <Input
                        type="file"
                        className="mt-2 w-full cursor-pointer border-[#2A2D35] text-white"
                        accept="image/png, image/jpeg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="border-0 hover:text-white transition-all duration-200 text-zinc-300"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5" /> Additional Information
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Please provide additional details about your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Account Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value)
                              setAccountType(value)
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="individual"
                                id="individual"
                                className="border-[#2A2D35] text-oga-green"
                              />
                              <Label htmlFor="individual" className="text-zinc-300">
                                Individual
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="business"
                                id="business"
                                className="border-[#2A2D35] text-oga-green"
                              />
                              <Label htmlFor="business" className="text-zinc-300">
                                Business
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {accountType === "business" && (
                    <>
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Company Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter company name"
                                className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyRegistrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Company Registration Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter registration number"
                                className="border-[#2A2D35] text-white placeholder:text-zinc-500"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="tradingPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Purpose of Carbon Credit Trading</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe why you want to trade carbon credits"
                            className="min-h-[100px] resize-none border-[#2A2D35] text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-zinc-950 rounded-lg border border-[#2A2D35] mt-4">
                    <div className="flex items-center gap-2 text-yellow-500 mb-3">
                      <InfoIcon className="h-5 w-5" />
                      <h3 className="font-medium">Important Note</h3>
                    </div>
                    <p className="text-sm text-zinc-400">
                      By completing this KYC process, you agree to our terms of service and privacy policy. Your
                      information will be securely stored and used only for verification purposes.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#2A2D35] data-[state=checked]:bg-oga-green data-[state=checked]:text-white"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-zinc-300">I accept the terms and conditions</FormLabel>
                          <FormDescription className="text-zinc-500">
                            By checking this box, you agree to our{" "}
                            <a href="#" className="text-oga-green hover:text-oga-green-dark">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-oga-green hover:text-oga-green-dark">
                              Privacy Policy
                            </a>
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(3)}
                      className="border-0 hover:text-white transition-all duration-200 text-zinc-300"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Verification"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 5 && (
          <>
            <CardHeader>
              <CardTitle className="text-center text-white">Verification Submitted!</CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Thank you for completing your KYC verification. We will review your information and get back to you
                shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-oga-green/10">
                <Check className="h-12 w-12 text-oga-green" />
              </div>
              <p className="mb-4 text-zinc-300">
                Your verification request has been submitted successfully. Our team will review your documents and
                information within 1-3 business days.
              </p>
              <p className="text-zinc-300">
                You will receive an email notification once your verification is complete. If we need any additional
                information, we will contact you.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

