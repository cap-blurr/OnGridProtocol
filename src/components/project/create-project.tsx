"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, InfoIcon, Loader2, Plus } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  fundingGoal: z
    .string()
    .min(1, "Funding goal is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid number greater than 0",
    }),
  returnRate: z
    .string()
    .min(1, "Return rate is required")
    .refine(
      (val) => {
        const num = Number(val)
        return !isNaN(num) && num > 0 && num <= 100
      },
      {
        message: "Must be between 0 and 100",
      },
    ),
  minimumInvestment: z
    .string()
    .min(1, "Minimum investment is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid number greater than 0",
    }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function CreateProjectModal() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      fundingGoal: "",
      returnRate: "",
      minimumInvestment: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      // Convert dates to uint64 (Unix timestamp)
      const startTime = Math.floor(values.startDate.getTime() / 1000)
      const endTime = Math.floor(values.endDate.getTime() / 1000)

      // Here you would typically call your contract function
      const projectData = {
        ...values,
        fundingGoal: BigInt(values.fundingGoal),
        returnRate: Number(values.returnRate),
        minimumInvestment: BigInt(values.minimumInvestment),
        startTime,
        endTime,
      }

      console.log("Creating project with data:", projectData)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate contract call

      setOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-oga-yellow-light text-gray-800 hover:bg-gray-800 hover:text-white rounded-full">
          Create Project
          <Plus className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark sm:max-w-[600px] max-h-[90vh] overflow-y-auto text-zinc-100 shadow-2xl shadow-black/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Create New Project</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Launch your funding project. Fill out the information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project name"
                      {...field}
                      className=" border-[#2A2D35] text-white placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project"
                      className="resize-none min-h-[100px]  border-[#2A2D35] text-white placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Project location"
                      {...field}
                      className=" border-[#2A2D35] text-white placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fundingGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Funding Goal (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className=" border-[#2A2D35] text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Return Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0"
                        {...field}
                        className=" border-[#2A2D35] text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="minimumInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Minimum Investment (ETH)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      className=" border-[#2A2D35] text-white placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-zinc-300">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal  border-[#2A2D35] hover:bg-[#252832] transition-colors duration-200",
                              !field.value && "text-zinc-500",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className=" border-[#2A2D35] text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-zinc-300">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal  border-[#2A2D35] hover:bg-[#252832] transition-colors duration-200",
                              !field.value && "text-zinc-500",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || (form.getValues("startDate") && date < form.getValues("startDate"))
                          }
                          initialFocus
                          className=" border-[#2A2D35] text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-[#2A2D35] mt-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-3">
                <InfoIcon className="h-5 w-5" />
                <h3 className="font-medium">Important Note</h3>
              </div>
              <p className="text-sm text-zinc-400">
                All financial values are in ETH. The return rate represents the percentage return investors will
                receive. Make sure your funding goal and minimum investment align with your project needs.
              </p>
            </div>

            <DialogFooter>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-0 hover:text-white transition-all duration-200 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-oga-green hover:bg-oga-green-dark text-white transition-all duration-200"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

