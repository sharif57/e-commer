"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Crumb {
    label: string;     // visible text
    href?: string;     // if provided, breadcrumb becomes clickable
}

interface BreadcrumbProps {
    items?: Crumb[];   // optional → if not given, will generate from pathname
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const pathname = usePathname();
    const [crumbs, setCrumbs] = useState<Crumb[]>([]);

    // Auto-generate breadcrumb when items not passed
    useEffect(() => {
        if (!items) {
            const segments = pathname.split("/").filter(Boolean);

            const autoCrumbs = segments.map((seg, index) => ({
                label: seg.charAt(0).toUpperCase() + seg.slice(1).replace("-", " "),
                href: "/" + segments.slice(0, index + 1).join("/")
            }));

            setCrumbs([{ label: "Dashboard", href: "/" }, ...autoCrumbs]);
        } else {
            setCrumbs(items);
        }
    }, [pathname, items]);

    return (
        <div className="flex items-center space-x-2 text-sm ">
            {crumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                    {/* clickable link if href exists */}
                    {crumb.href ? (
                        <Link
                            href={crumb.href}
                            className={`${index === crumbs.length - 1
                                    ? "text-black font-medium"
                                    : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span
                            className={`${index === crumbs.length - 1
                                    ? "text-black font-medium"
                                    : "text-gray-400"
                                }`}
                        >
                            {crumb.label}
                        </span>
                    )}

                    {/* divider */}
                    {index < crumbs.length - 1 && (
                        <span className="mx-2 text-gray-300">/</span>
                    )}
                </div>
            ))}
        </div>
    );
}
