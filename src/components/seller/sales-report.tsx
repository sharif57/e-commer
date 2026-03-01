/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"

import { useMemo, useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { BarChart3 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAllSalesReportQuery } from "@/redux/feature/seller/accountSetting"
import SalesReportSkeleton from "../Skeleton/SalesReportSkeleton"

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
]

export default function SalesReport() {
    const [period, setPeriod] = useState("Monthly")
    const [hoveredData, setHoveredData] = useState<{
        month: string
        value: number
    } | null>(null)

    const { data, isLoading } = useAllSalesReportQuery(undefined)

    /* ------------------ DATA TRANSFORMATION ------------------ */
    const chartData = useMemo(() => {
        const monthlyReport = data?.data?.monthlyReport || {}

        return MONTHS.map((month) => ({
            month,
            value: monthlyReport[month] ?? 0,
            highlight: month === "Jun",
        }))
    }, [data])

    const totalRevenue = data?.data?.totalAmount || 0

    const handleTooltip = (state: any) => {
        if (state.activePayload?.length) {
            const payload = state.activePayload[0].payload
            setHoveredData({
                month: payload.month,
                value: payload.value,
            })
        }
    }

    if (isLoading) {
        return <div ><SalesReportSkeleton /></div>
    }

    return (
        <div className="bg-white rounded-lg border p-4">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Sales Report</h2>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{period}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {["Daily", "Weekly", "Monthly", "Yearly"].map((p) => (
                            <DropdownMenuItem key={p} onClick={() => setPeriod(p)}>
                                {p}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Revenue */}
            <div className="mt-3">
                <span className="text-xl font-semibold">
                    ${totalRevenue.toLocaleString()}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">Revenue</span>
            </div>

            {/* Chart */}
            <div className="mt-4">
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                        data={chartData}
                        onMouseMove={handleTooltip}
                        onMouseLeave={() => setHoveredData(null)}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7ee8c0" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#7ee8c0" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#7ee8c0"
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {hoveredData && (
                    <div className="mt-2 text-center text-sm">
                        <span className="text-muted-foreground">{hoveredData.month}</span>{" "}
                        <span className="font-semibold">
                            ${hoveredData.value.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>

            {/* Month Buttons */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
                {chartData.map((item) => (
                    <span
                        key={item.month}
                        className={`px-3 py-1 rounded-full text-xs ${item.highlight
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                    >
                        {item.month}
                    </span>
                ))}
            </div>
        </div>
    )
}
