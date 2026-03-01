"use client"

import type React from "react"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import MailBox from "@/components/icon/mailbox"
import Phone from "@/components/icon/phone"
import Chart from "@/components/icon/chart"
import Breadcrumb from "@/components/Breadcrumb"

interface Reminder {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    enabled: boolean
}

export default function SetRemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([
        {
            id: "email-purchase",
            title: "Email when purchase an item",
            description: "Get notified via email when you placed an order",
            icon: <MailBox />,
            enabled: true,
        },
        {
            id: "push-new-items",
            title: "Push notifications for new items",
            description: "Receive instant push notifications when new item added",
            icon: <Phone />,
            enabled: true,
        },
        {
            id: "weekly-deals",
            title: "Weekly deals",
            description: "Get notified via email for weekly deals",
            icon: <Chart />,
            enabled: false,
        },
    ])

    const toggleReminder = (id: string) => {
        setReminders(
            reminders.map((reminder) => (reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder)),
        )
    }

    return (
        <div className="">
            <div className="">
                <div className="mb-6 space-y-6">
                    <Breadcrumb items={[
                        { label: "Account management", href: "/dashboard" },
                        { label: "Reminders" }
                    ]} />
                </div>
                {/* Header */}
                <h1 className="text-lg md:text-xl font-bold text-[#000000] mb-8">Set Reminders</h1>

                {/* Reminders Container */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    {reminders.map((reminder, index) => (
                        <div
                            key={reminder.id}
                            className={`flex items-center justify-between p-6 md:p-8 ${index !== reminders.length - 1 ? "border-b border-border" : ""
                                }`}
                        >
                            {/* Icon and Content */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="text-muted-foreground flex-shrink-0 mt-1">{reminder.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold text-[#171717]">{reminder.title}</h2>
                                    <p className="text-xs text-[#171717B2] font-normal mt-1">{reminder.description}</p>
                                </div>
                            </div>

                            <Switch />


                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
