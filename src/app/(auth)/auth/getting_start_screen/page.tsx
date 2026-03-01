"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import AuthHeader from "@/components/auth/auth-hader"
import Sign from "@/components/icon/sign"
import Logo from "@/components/icon/logo"
import Houese from "@/components/icon/houes"
import Link from "next/link"



const GUIDELINE_STEPS = [
    {
        id: 1,
        title: "Business Information",
        description:
            "For a smooth setup, enter your business information. Be sure to include your Business Name, TIN or ID, and the business type that best describes your company.",
    },
    {
        id: 2,
        title: "Seller Information",
        description: "The person's identity who will operate or represent the business.",
    },
    {
        id: 3,
        title: "Payment Method",
        description: "Confirm the account where you'd like to receive your sales earnings.",
    },
    {
        id: 4,
        title: "Shop Details",
        description: "Enter your shop details e.g. Shop name & upload your shop's profile photo.",
    },
    {
        id: 5,
        title: "Submit for Review",
        description:
            "When you're ready, send your application for review. Confirm your monthly subscription fee of $19.00. Approval takes 48-72 hours.",
    },
]


export default function SellerOnboarding() {

    const [todaySales] = useState(8999.0)

    return (
        <main className="bg-background h-screen overflow-hidden ">
            <AuthHeader />

            <div className="flex flex-col lg:flex-row h-screen">

                {/* LEFT COLUMN - Hero Image */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden h-full">
                    <Image src="/images/grt.png" alt="Seller with package" fill className="object-fit " />

                    {/* Sales Badge (Glass Background) */}
                    <div className="absolute top-[250px] left-[100px] 
    bg-white/20 backdrop-blur-md border border-white/30 
     p-4 px-8 flex items-center gap-4">

                        <div className="">
                            {/* <CheckCircle size={24} className="text-green-600" /> */}
                            <Sign />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Today sales</p>
                            <p className="text-xl font-bold text-[#1C1C1CCC]">
                                £{todaySales.toLocaleString()}
                            </p>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN - Form Content */}
                <div className="flex-1 lg:w-1/2 flex flex-col">
                    {/* Content Area - SCROLLABLE */}
                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-1 overflow-y-auto">
                        {/* Greeting */}
                        <div className="mb-8">
                            <p className="text-[22px] font-normal text-[#000000]">Hey Alex,</p>
                            <h2 className="text-[22px] font-normal flex items-center gap-2 text-[#000000] mt-1">Welcome to <Logo /> shop</h2>
                        </div>

                        {/* Main CTA Section */}
                        <div className="bg-[#29845A0F] rounded-lg lg:w-1/2  p-6 sm:p-8 mb-8 ">
                            <div className="flex justify-center mb-4">
                                <Houese />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold  text-foreground text-start mb-2">
                                Open your shop with ebakx
                            </h3>
                            <p className="text-sm text-muted-foreground text-start mb-6">
                                Join our marketplace to list your products and start selling to millions.
                            </p>
                            <Link href="/auth/step-1">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
                                    Let&apos;s get started →
                                </Button>
                            </Link>
                        </div>

                        {/* Shop Creation Guideline */}
                        <div>
                            <h4 className="text-lg font-semibold text-foreground mb-4">Shop creation Guideline</h4>
                            <p className="text-sm text-muted-foreground mb-6">
                                To open your shop on ebakx, simply complete 5 quick steps to verify your seller account.
                            </p>

                            <div className="flex flex-col mb-[100px] items-start gap-[10px] justify-start w-full">
                                {
                                    GUIDELINE_STEPS.map((line, index) => (
                                        <div key={line.id} className="flex items-start gap-[20px]">
                                            <div className="flex flex-col items-center">
                                                <p className="size-[24px] dark:bg-slate-700 dark:text-[#abc2d3] flex items-center justify-center bg-[#F4C91D] rounded-full text-black text-[1rem]">{index + 1}</p>
                                                <div className="w-[2px] h-[50px] border-l-2 border-dashed border-[#000000] mt-[10px] dark:border-slate-700"></div>
                                            </div>

                                            <div className="">
                                                <h1 className="text-[1.1rem] text-[#000000] dark:text-[#abc2d3]">{line?.title}</h1>
                                                <p className="text-[0.9rem] text-gray-500 dark:text-[#abc2d3]/70">{line?.description}</p>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
