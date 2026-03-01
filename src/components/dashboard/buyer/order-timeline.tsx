/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Location from '@/components/icon/location'
import Right from '@/components/icon/right'
import Track from '@/components/icon/track'
import { Package } from 'lucide-react'

interface TimelineStep {
    id: string
    label: string
    completed: boolean
    icon: 'placed' | 'preparing' | 'transit' | 'delivered'
}

interface OrderTimelineProps {
    steps: TimelineStep[]
    deliveryStatus?: string
}

export function OrderTimeline({ steps, deliveryStatus }: OrderTimelineProps) {

    // Map delivery status to display text
    const statusDisplayMap: { [key: string]: string } = {
        'placed': 'Placed',
        'preparing': 'Preparing',
        'in_transit': 'In transit',
        'delivered': 'Delivered'
    };

    const currentStatusText = deliveryStatus ? statusDisplayMap[deliveryStatus] : 'In transit';

    // Transform steps to include current state
    const transformedSteps = steps.map((step, index) => {
        const nextStep = steps[index + 1];
        const isCurrent = step.completed && (!nextStep || !nextStep.completed);

        return {
            label: step.label,
            completed: step.completed,
            current: isCurrent
        };
    })

    return (
        <div className=" p-4 sm:p-">

            {/* Header */}
            <div className="flex items-start gap-3 ">
                <div className="flex-shrink-0 bg-[#1717170F] p-2 rounded-full">
                    <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-[#171717B2] font-medium">
                        Delivery from shop
                    </p>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#171717]">
                        {currentStatusText}
                    </h3>
                </div>
            </div>

            <div className="">

                {/* Horizontal timeline (Desktop & Tablet) */}
                <div className="hidden sm:flex items-center justify-between relative">

                    {/* Dotted Line Background */}
                    <div className="absolute left-10 right-10 top-10 h-0.5 border-t-2 border-dashed border-gray-300" />

                    {transformedSteps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center z-10">

                            {/* ICON CIRCLE */}
                            <div
                                className={`
                                        w-20 h-20 rounded-full flex items-center justify-center 
                                        transition-all
                                    `}
                            >
                                {step.completed ? (
                                    <Right />
                                ) : step.current ? (
                                    <Track />
                                ) : (
                                    <Location />
                                )}
                            </div>

                            {/* LABEL */}
                            <p
                                className={`
                                         text-sm font-medium whitespace-nowrap
                                        ${step.completed || step.current ? "text-gray-900" : "text-gray-500"}
                                    `}
                            >
                                {step.label}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}
