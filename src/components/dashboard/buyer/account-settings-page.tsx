// "use client"

// import type React from "react"

// import { ArrowRight, Edit2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Boxs from "@/components/icon/boxs"
// import { useRouter } from "next/navigation"
// import Breadcrumb from "@/components/Breadcrumb"
// import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/feature/userSlice"

// export default function AccountSettingsPage() {
//     const router = useRouter();

//     const {data} = useGetUsersQuery(undefined);
//     console.log(data,'profile')

//     const [update] = useUpdateUserMutation();

//     const handleEditClick = () => {
//         router.push('/dashboard/my-account/update-profile');
//     }

//     return (
//         <div className=" ">
//             <div className="mb-6 space-y-6">
//                 <Breadcrumb items={[
//                     { label: "Account management", href: "/dashboard" },
//                     { label: "My Account" }
//                 ]} />
//             </div>
//             {/* Header */}
//             <div>
//                 <h1 className="text-xl font-bold text-[#000000] mb-8">Account settings</h1>
//             </div>
//             <div className="border border-border p-4 lg:p-6 mb-8 rounded-lg">
//                 <div className=" ">

//                     {/* Profile Section */}
//                     <div className="">
//                         <p className="text-xl text-[#171717CC] font-normal mb-6">Hi, Good evening!</p>
//                         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">

//                             <div className="flex items-center gap-4">
//                                 <img
//                                     src={data?.data?.image || "/images/Ellipse 1.png"}
//                                     alt="Avatar"
//                                     width={100}
//                                     height={100}
//                                     className="w-16 h-16 rounded-full"
//                                 />
//                                 <div className="flex-1">
//                                     <h2 className="text-xl md:text-2xl font-bold text-[#171717] mb-1">{data?.data?.firstName} {data?.data?.lastName}</h2>
//                                     <p className="text-sm text-muted-foreground">{data?.data?.email}</p>
//                                 </div>
//                             </div>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={handleEditClick}
//                                 className="self-start sm:self-auto gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
//                             >
//                                 <Edit2 className="w-4 h-4 text-black" />
//                                 {"Edit"}
//                             </Button>
//                         </div>
//                     </div>

//                     {/* Orders Card */}
//                     <Card className="border border-border py-2 w-full lg:w-1/2  bg-card cursor-pointer hover:shadow-md transition-shadow">
//                         <div className="flex items-start gap-4 p-4 md:p-6">
//                             <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg  flex items-center justify-center flex-shrink-0">
//                                 <Boxs />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-sm md:text-base text-foreground">
//                                     View all your purchases, manage your orders or start a return.
//                                 </p>
//                             </div>
//                             <ArrowRight className="w-5 h-5 text-[#000000] flex-shrink-0" />
//                         </div>
//                     </Card>
//                 </div>
//             </div>


//         </div>
//     )
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/feature/userSlice"
import {
    Settings,
    CheckCircle2,
    ArrowRight,
    Camera,
    Boxes,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    Shield,
    Crown,
    XCircle
} from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner";



export default function AccountPage() {
    const { data } = useGetUsersQuery(undefined);
    const user = data?.data;
    console.log(user)
    const [updateUser] = useUpdateUserMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
        await uploadImage(file);
    };

    const uploadImage = async (file: File) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await updateUser(formData);
            if (response.data?.success) {
                toast.success(response.data.message || 'Profile image updated successfully');
                setPreview(null);
            } else {
                toast.error('Failed to update image');
                setPreview(null);
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error(error?.data?.message || 'Error uploading image');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const getTimeGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return "Good morning!";
        } else if (currentHour >= 12 && currentHour < 17) {
            return "Good afternoon!";
        } else if (currentHour >= 17 && currentHour < 21) {
            return "Good evening!";
        } else {
            return "Good night!";
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className="min-h-screen pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with title and settings */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">My Account</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Manage your profile and account settings
                        </p>
                    </div>
                    <Link href={'/dashboard/my-account/update-profile'}>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            <span className="text-sm font-medium">Edit Profile</span>
                        </button>
                    </Link>
                </div>

                {/* Greeting Section */}
                <div className="mb-6">
                    <p className="text-lg sm:text-xl text-muted-foreground">
                        Hi, {getTimeGreeting()}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="border border-border rounded-xl p-6 bg-card shadow-sm">
                            {/* Profile Image Section */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl overflow-hidden ring-4 ring-background">
                                        {preview || user?.image ? (
                                            <Image
                                                src={preview || user?.image}
                                                alt={user?.firstName || "Profile"}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{user?.firstName?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleImageClick}
                                        disabled={isUploading}
                                        className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 border-2 border-background rounded-full p-2 hover:bg-muted transition-colors disabled:opacity-50 shadow-lg"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 text-foreground animate-spin" />
                                        ) : (
                                            <Camera className="w-4 h-4 text-foreground" />
                                        )}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                            {user?.firstName} {user?.lastName}
                                        </h2>
                                        {user?.verified && (
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${user?.role === 'BUYER'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                    }`}>
                                    <User className="w-3.5 h-3.5" />
                                    {user?.role || 'User'}
                                </span>

                                {user?.subscription ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md">
                                        <Crown className="w-3.5 h-3.5" />
                                        Premium
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Free Plan
                                    </span>
                                )}

                                {user?.verified ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <Shield className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        <XCircle className="w-3.5 h-3.5" />
                                        Unverified
                                    </span>
                                )}
                            </div>

                            {/* Account Info */}
                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Joined</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {formatDate(user?.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Last Updated</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {formatDate(user?.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact & Address Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information Card */}
                        <div className="border border-border rounded-xl p-6 bg-card shadow-sm">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm sm:text-base text-foreground break-all">
                                            {user?.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm sm:text-base text-foreground">
                                            {user?.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information Card */}
                        <div className="border border-border rounded-xl p-6 bg-card shadow-sm">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                Address Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Street Address
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.address || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Street Name
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.streetName || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Area / District
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.area || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        City
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.city || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        State / Province
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.state || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        ZIP / Postal Code
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground">
                                        {user?.zip || 'Not provided'}
                                    </p>
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Country
                                    </label>
                                    <p className="text-sm sm:text-base text-foreground font-medium">
                                        {user?.country || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                            {/* Full Address Display */}
                            {(user?.address || user?.area || user?.city || user?.country) && (
                                <div className="mt-6 pt-4 border-t border-border">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Complete Address
                                    </label>
                                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-foreground leading-relaxed">
                                            {[
                                                user?.address,
                                                user?.streetName,
                                                user?.area,
                                                user?.city,
                                                user?.state,
                                                user?.zip,
                                                user?.country
                                            ].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Orders Management Card */}
                        <Link
                            href={'/dashboard'}
                            className="block border border-border rounded-xl p-6 bg-card shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all duration-200 group"
                        >
                            <div className="flex items-start gap-4 sm:gap-6">
                                {/* Icon */}
                                <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                    <Boxes className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 group-hover:text-blue-600 transition-colors">
                                        Orders & Purchases
                                    </h3>
                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                        View all your orders, manage deliveries, track shipments, or initiate returns.
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-blue-600 flex-shrink-0 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
