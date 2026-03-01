
"use client";

import { Karla } from "next/font/google";
import "../globals.css";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import DashboardRightbar from "@/components/dashboard/rightbar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import HeaderSeller from "@/components/dashboard/seller/header-seller";
import Providers from "@/provider/provider";
import { Toaster } from "sonner";
import { useGetUsersQuery } from "@/redux/feature/userSlice";
import SubscriptionRequiredModal from "@/components/dashboard/subscription-required-modal";

const karla = Karla({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Inner component that uses Redux
function DashboardContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userType, setUserType] = useState('');
    const [mounted, setMounted] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const { data } = useGetUsersQuery(undefined);

    useEffect(() => {
        setMounted(true);
        const userType = localStorage.getItem('accountType');
        setUserType(userType || '');
    }, []);

    useEffect(() => {
        // Check if seller without subscription
        if (data?.data?.role === 'SELLER' && data?.data?.subscription === false) {
            setShowSubscriptionModal(true);
        }
    }, [data]);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Mobile Slide In + Desktop Fixed */}
                <DashboardSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    {
                        userType === 'buyer' ? (
                            <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                        ) : (
                            // <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                            <HeaderSeller onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                        )
                    }
                    {/* <Navbar /> */}

                    {/* Main Content + Right Sidebar */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Scrollable Main Content */}
                        <main className="flex-1 overflow-y-auto pb-10">
                            <div className="p-4 md:p-6 lg:p-8">{children}</div>
                        </main>

                        {/* Right Sidebar - Hidden on Mobile */}

                    </div>

                </div>
                <div className="hidden lg:block">
                    <DashboardRightbar />
                </div>
            </div>

            <Toaster />

            {/* Subscription Modal - Cannot close when subscription is false */}
            <SubscriptionRequiredModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                userName={data?.data?.firstName}
                canClose={data?.data?.subscription === true}
            />
        </>
    );
}

// Outer layout component that provides context
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${karla.className} antialiased bg-gray-50 min-h-screen`}>
                <Providers>
                    <DashboardContent>{children}</DashboardContent>
                </Providers>
            </body>
        </html>
    );
}