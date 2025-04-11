"use client";

import {
  Globe,
  ArrowLeft,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  Zap,
  Home,
  Building2,
  Factory,
  Sun,
  Battery,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupplierProfile() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-80">
        <Image
          src="https://images.unsplash.com/photo-1592263904934-b00851dc93eb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29sYXIlMjBpbnN0YWxsYXRpb258ZW58MHx8MHx8fDA%3D"
          alt="SolarTech Solutions banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <Link href="/suppliers">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-zinc-700 bg-zinc-900/80 text-white backdrop-blur-sm hover:bg-zinc-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Suppliers
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="relative -mt-16 mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border-4 border-zinc-900 bg-zinc-800 sm:h-24 sm:w-24">
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl text-white">
                  SolarTech Solutions
                </h1>
                <Badge className="bg-emerald-500 text-white">Verified</Badge>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                >
                  Certified
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500/30 bg-blue-500/10 text-blue-400"
                >
                  Experienced
                </Badge>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-400"
                >
                  Top Performer
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:gap-3 md:mt-0 md:w-auto">
            <Button className="bg-oga-green">Request Installation</Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Company Overview</CardTitle>
                <CardDescription className="text-zinc-300">
                  SolarTech Solutions is a leading provider of solar
                  installation services with over 8 years of experience in the
                  renewable energy sector.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-zinc-300">
                  SolarTech Solutions specializes in designing, installing, and
                  maintaining high-efficiency solar power systems for
                  residential and commercial properties. Our team of certified
                  professionals is committed to delivering sustainable energy
                  solutions that reduce carbon footprints while providing
                  significant cost savings to our clients. We pride ourselves on
                  using cutting-edge technology and premium materials to ensure
                  optimal performance and longevity of all our installations.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Years in Business
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-white">8</span>
                      <span className="ml-1 text-zinc-400">years</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Installations
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-white">
                        1,234
                      </span>
                      <span className="ml-1 text-zinc-400">completed</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Total Funding
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-white">850K</span>
                      <span className="ml-1 text-zinc-400">USDT</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Client Rating
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-white">4.8</span>
                      <span className="ml-1 text-zinc-400">/5</span>
                      <div className="ml-2 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              star <= 4
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="services" className="mt-8">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
                <TabsTrigger
                  value="services"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Services & Capabilities
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Past Projects
                </TabsTrigger>
                <TabsTrigger
                  value="testimonials"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Testimonials
                </TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Services & Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-lg font-medium text-white">
                        Installation Capacities
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 text-white">
                          <Home className="h-5 w-5 text-emerald-400" />
                          <span>Residential</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 text-white">
                          <Building2 className="h-5 w-5 text-blue-400" />
                          <span>Commercial</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 text-white">
                          <Factory className="h-5 w-5 text-purple-400" />
                          <span>Industrial</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-medium text-white">
                        Technologies
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Sun className="mt-1 h-5 w-5 text-amber-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Photovoltaic Panels
                            </h4>
                            <p className="text-sm text-zinc-300">
                              High-efficiency monocrystalline and
                              polycrystalline solar panels from top
                              manufacturers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Battery className="mt-1 h-5 w-5 text-green-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Battery Storage
                            </h4>
                            <p className="text-sm text-zinc-300">
                              Advanced lithium-ion battery systems for energy
                              storage and backup power
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Zap className="mt-1 h-5 w-5 text-yellow-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Smart Inverters
                            </h4>
                            <p className="text-sm text-zinc-300">
                              Grid-tied and hybrid inverters with monitoring
                              capabilities and smart home integration
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Shield className="mt-1 h-5 w-5 text-red-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Monitoring Systems
                            </h4>
                            <p className="text-sm text-zinc-300">
                              Real-time performance monitoring and analytics for
                              optimal system management
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="projects" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Past Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((project) => (
                        <div
                          key={project}
                          className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/50 transition-all hover:border-zinc-700"
                        >
                          <div className="relative h-40 w-full sm:h-48">
                            <Image
                              src="https://images.unsplash.com/photo-1592263904934-b00851dc93eb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29sYXIlMjBpbnN0YWxsYXRpb258ZW58MHx8MHx8fDA%3D"
                              alt={`Project ${project}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-white">
                              Residential Installation {project}
                            </h4>
                            <p className="mt-1 text-sm text-zinc-300">
                              {project % 2 === 0
                                ? "10kW system with battery backup"
                                : "15kW system with smart home integration"}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-zinc-400">
                              <MapPin className="mr-1 h-3 w-3" />
                              {project % 3 === 0
                                ? "Kisumu, KA"
                                : project % 2 === 0
                                ? "Abuja, NG"
                                : "Lagos, NG"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="testimonials" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Client Testimonials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          name: "Michael Johnson",
                          role: "Homeowner",
                          quote:
                            "SolarTech Solutions provided exceptional service from consultation to installation. Our energy bills have decreased by 85% since installing their system.",
                        },
                        {
                          name: "Sarah Williams",
                          role: "Business Owner",
                          quote:
                            "The commercial installation for our office building was completed ahead of schedule and has exceeded our ROI expectations. Highly recommended!",
                        },
                        {
                          name: "David Chen",
                          role: "Property Developer",
                          quote:
                            "We've partnered with SolarTech on multiple projects. Their expertise and professionalism make them our go-to solar provider.",
                        },
                        {
                          name: "Emily Rodriguez",
                          role: "Homeowner",
                          quote:
                            "The battery backup system has been a lifesaver during power outages. The team was knowledgeable and the installation was flawless.",
                        },
                      ].map((testimonial, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-4 sm:p-5 backdrop-blur-sm"
                        >
                          <div className="mb-3 flex items-center gap-1 sm:gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <p className="mb-4 text-sm sm:text-base italic text-zinc-200">
                            "{testimonial.quote}"
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-700">
                              <div className="flex h-full w-full items-center justify-center text-base sm:text-lg font-medium text-white">
                                {testimonial.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {testimonial.name}
                              </div>
                              <div className="text-xs sm:text-sm text-zinc-300">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Financial & Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator className="bg-zinc-800" />

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-300">
                      Minimum Allocation
                    </div>
                    <div className="text-lg font-medium text-white">
                      50 USDT
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-300">
                      Maximum Allocation
                    </div>
                    <div className="text-lg font-medium text-white">
                      5,000 USDT
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-300">
                      Average Installation Cost
                    </div>
                    <div className="text-lg font-medium text-white">
                      0.85 USDT / watt
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <h3 className="mb-3 text-base font-medium text-white">
                    Payment Methods
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
                      <div className="mb-1 font-medium text-white">
                        Crypto Wallet
                      </div>
                      <div className="text-sm text-zinc-300 break-all">
                        0xE62D0B...7204727c
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
                      <div className="mb-1 font-medium text-white">
                        Bank Transfer
                      </div>
                      <div className="text-sm text-zinc-300">
                        Available upon request
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-zinc-400" />
                  <a href="#" className="text-blue-400 hover:underline">
                    www.solartechsolutions.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <a
                    href="mailto:info@solartechsolutions.com"
                    className="text-blue-400 hover:underline"
                  >
                    info@solartechsolutions.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-zinc-400" />
                  <span className="text-white">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-zinc-400" />
                  <span className="text-white">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                  <span className="text-white">Established 2015</span>
                </div>
                <Button className="mt-2 w-full bg-oga-green">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
