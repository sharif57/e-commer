interface StatItem {
    label: string
    value: string
}

interface RatingStatsProps {
    title?: string
    stats: StatItem[]
}

export function RatingStats({ stats }: RatingStatsProps) {
    return (
        <div className="flex items-center justify-start gap-8 md:gap-10">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                    <p className="text-sm md:text-base text-[#000000] font-medium mb-1 md:mb-2">
                        {stat.label}
                    </p>
                    <p className="text-xl md:text-[13px] font-semibold text-[#000000]">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    )
}
