/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import Breadcrumb from '@/components/Breadcrumb';
import { useGetUsersQuery, useUpdateUserMutation } from '@/redux/feature/userSlice';
import { toast } from 'sonner';

export default function Update() {
    const { data } = useGetUsersQuery(undefined);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        streetName: "",
        area: "",
        city: "",
        zip: "",
        state: "",
        country: "",
        phone: "",
        address2: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    const [updateUser] = useUpdateUserMutation();

    useEffect(() => {
        if (data?.data) {
            setFormData({
                fullName: data?.data?.firstName || "",
                email: data?.data?.email || "",
                streetName: data?.data?.streetName || "",
                area: data?.data?.area || "",
                city: data?.data?.city || "",
                zip: data?.data?.zip || "",
                state: data?.data?.state || "",
                country: data?.data?.country || "",
                phone: data?.data?.phone || "",
                address2: data?.data?.address2 || "",
            });
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const userData = {
                firstName: formData.fullName,
                email: formData.email,
                streetName: formData.streetName,
                area: formData.area,
                city: formData.city,
                zip: formData.zip ? parseInt(formData.zip) : undefined,
                state: formData.state,
                country: formData.country,
                phone: formData.phone,
                address2: formData.address2,
            };
            const formDataToSend = new FormData()

            formDataToSend.append('data', JSON.stringify(userData))

            const res = await updateUser(formDataToSend).unwrap();
            toast.success(res?.message || "Profile updated successfully");
            console.log("Profile updated:", res?.data);

        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
            console.error("Update error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="">
                <div className="mb-6 space-y-6">
                    <Breadcrumb items={[
                        { label: "Account management", href: "/dashboard" },
                        { label: "My Account", href: "/dashboard/my-account" },
                        { label: "Edit Information" }
                    ]} />
                </div>
                <h2 className="text-xl font-bold text-[#000000] mb-6">Update information</h2>

                <form className="space-y-6">
                    {/* Full Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                            <Input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full border border-[#171717]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                disabled
                                className="w-full border border-[#171717] bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="pt-2">
                        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">ADDRESS</h3>

                        {/* Street Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">Street Name</label>
                            <Input
                                type="text"
                                name="streetName"
                                placeholder="123 Main Street"
                                value={formData.streetName}
                                onChange={handleInputChange}
                                className="w-full border border-[#171717]"
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">Address Line 2 (Optional)</label>
                            <Input
                                type="text"
                                name="address2"
                                value={formData.address2}
                                onChange={handleInputChange}
                                placeholder="Apt, suite, etc."
                                className="w-full border border-[#171717]"
                            />
                        </div>

                        {/* Area */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">Area</label>
                            <Input type="text" name="area" placeholder="Enter area" value={formData.area} onChange={handleInputChange} className="w-full border border-[#171717]" />
                        </div>

                        {/* City and ZIP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                                <Input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#171717]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">ZIP</label>
                                <Input type="number" name="zip" placeholder="12345" value={formData.zip} onChange={handleInputChange} className="w-full border border-[#171717]" />
                            </div>
                        </div>

                        {/* State */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">State (Optional)</label>
                            <Input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className="w-full border border-[#171717]"
                            />
                        </div>

                        {/* Country */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                            <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                                <SelectTrigger className="w-full border border-[#171717]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Mexico">Mexico</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                    <SelectItem value="France">France</SelectItem>
                                    <SelectItem value="Japan">Japan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border border-[#171717]"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={isLoading}
                            className="bg-primary hover:bg-green-700 text-white font-semibold px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
