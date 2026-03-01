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
import { Settings, CheckCircle2, ArrowRight, Camera, Boxes, Loader2 } from "lucide-react"
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
    return (
        <main className="min-h-screen ">
            <div className="">
                {/* Header with title and settings */}
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My account</h1>
                </div>

                <div className="border border-border p-4 rounded-lg">

                    {/* Greeting Section */}
                    <div className="mb-8 sm:mb-12 flex items-center justify-between">
                        <p className="text-base sm:text-lg text-muted-foreground">Hi, {getTimeGreeting()}</p>
                        <Link href={'/dashboard/my-account/update-profile'}>
                            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                                <Settings className="w-5 h-5 text-foreground" />
                            </button>
                        </Link>
                    </div>
                    {/* User Profile Card */}
                    <div className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 ">
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Avatar Section */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center text-white font-bold text-2xl sm:text-3xl overflow-hidden">
                                    {preview || user?.image ? (
                                        <Image
                                            src={preview || user?.image}
                                            alt={user?.firstName || "Profile"}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>{user?.firstName?.charAt(0) || 'Z'}</span>
                                    )}
                                </div>
                                <button
                                    onClick={handleImageClick}
                                    disabled={isUploading}
                                    className="absolute bottom-0 right-0 bg-white border border-border rounded-full p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
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

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">{user?.firstName + " " + user?.lastName}</h2>
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Management Card */}
                    <div className="">
                        <Link href={'/dashboard'} className="w-1/2 border border-border rounded-lg p-4 sm:p-6 lg:p-8 flex items-start gap-4 sm:gap-6 group cursor-pointer">
                            {/* Icon */}
                            <div className="flex-shrink-0 p-2 sm:p-3 bg-muted rounded-lg group-hover:bg-accent transition-colors">
                                <Boxes className="w-6 h-6 sm:w-7 sm:h-7 text-[#171717]" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                                    View all your orders, manage your orders or proceed to deliver.
                                </p>
                            </div>

                            {/* Arrow Icon */}
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
