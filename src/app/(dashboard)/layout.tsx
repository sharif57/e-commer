
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
import Script from "next/script";

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
    const [isRightbarOpen, setIsRightbarOpen] = useState(true);

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
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header */}
                    {
                        userType === 'buyer' ? (
                            <DashboardHeader
                                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                                isNotificationPanelOpen={isRightbarOpen}
                                onNotificationToggle={() => setIsRightbarOpen((prev) => !prev)}
                            />
                        ) : (
                            // <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                            <HeaderSeller
                                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                                isNotificationPanelOpen={isRightbarOpen}
                                onNotificationToggle={() => setIsRightbarOpen((prev) => !prev)}
                            />
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
                        <div
                            className={`hidden lg:block transition-all duration-300 ${isRightbarOpen ? "w-64" : "w-0"
                                } overflow-hidden`}
                        >
                            {isRightbarOpen && (
                                <DashboardRightbar onToggle={() => setIsRightbarOpen(false)} />
                            )}
                        </div>

                    </div>

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
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            const originalError = console.error;
                            console.error = function(...args) {
                                if (typeof args[0] === 'string' && (args[0].includes('Hydration') || args[0].includes('Minified React error #418') || args[0].includes('Minified React error #423'))) {
                                    return;
                                }
                                originalError.apply(console, args);
                            };
                        `,
                    }}
                /> */}
                <Script
                    id="gtm-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-WMBQ7V9Q');
                        `,
                    }}
                />
            </head>
            <body suppressHydrationWarning className={`${karla.className} antialiased bg-gray-50 min-h-screen`}>
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-WMBQ7V9Q"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
                <Providers>
                    <DashboardContent>{children}</DashboardContent>
                </Providers>
            </body>
        </html>
    );
}