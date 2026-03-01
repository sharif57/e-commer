/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDraftProductUpdateMutation, useGetDraftProductsQuery, useDeleteProductMutation } from "@/redux/feature/seller/productSellerSlice"
import { toast } from "sonner"


export default function DraftItems() {
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [newStatus, setNewStatus] = useState<string>("draft")

    const { data } = useGetDraftProductsQuery(undefined);
    const products = data?.data?.result || [];

    const [draftProductUpdate, { isLoading: isUpdating }] = useDraftProductUpdateMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const handleDelete = async (id: string) => {
        try {
        const res =    await deleteProduct(id).unwrap()
        toast.success(res?.data?.message || 'deleted successfully')
        } catch (err : any) {
            toast.error(err?.data?.message || 'something wrong' )
            // Optional: surface error to user
            console.error("Failed to delete product", err)
        } finally {
            setDeleteConfirm(null)
        }
    }

    const handleEdit = (item: any) => {
        setSelectedProduct(item)
        setNewStatus(item?.status ?? "draft")
        setIsEditOpen(true)
    }

    const handleUpdateStatus = async () => {
        if (!selectedProduct?._id) return
        try {
        const res =   await draftProductUpdate({ productId: selectedProduct._id, data: { status: newStatus } }).unwrap();
            toast.success(res?.data?.message || "Status updated successfully")
            setIsEditOpen(false)
            setSelectedProduct(null)
        } catch (err: any) {
            toast.error(err?.data?.message || 'failed to update status')
            console.error("Failed to update status", err)
        }
    }

    return (
        <main className="min-h-screen ">
            <div className="">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#000000] mb-6">Draft items</h1>
                </div>

                {/* Draft Items List */}
                <div className="space-y-4 md:space-y-6 border rounded-lg  p-4">
                    <div className="p-4 ">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Review your items</h2>
                        <p className="text-sm sm:text-base text-gray-600">Prepare your incomplete items to get sold</p>
                    </div>
                    {products?.length === 0 ? (
                        <Card className="p-8 text-center text-gray-500">
                            <p className="text-base md:text-lg">No draft items</p>
                        </Card>
                    ) : (
                        products?.map((item: any) => (
                            <div
                                key={item?._id}
                                className="p-4 sm:p-5 md:p-6  border-none"
                            >
                                <div className="flex flex-col sm:flex-row  gap-4 sm:gap-5 md:gap-6">
                                    <div className="flex items-center gap-4">
                                        {/* Product Image */}
                                        <img
                                            src={item?.image[0] || "/placeholder.svg"}
                                            alt={item?.title}
                                            className="h-32 w-32 sm:h-32 sm:w-32 md:h-40 md:w-40 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                        />
                                        {/* Product Info */}
                                        <div className="flex-1 w-2/5 flex flex-col justify-between min-w-0">
                                            <div className="mb-4">
                                                <p className="text-xs sm:text-sm text-gray-500 mb-2">Category: {item?.categoryId?.title}</p>
                                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 break-words">
                                                    {item?.title}
                                                </h3>
                                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-3">
                                                    ${item?.price}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Status: {item?.status ?? "draft"}</p>
                                            </div>

                                            {/* Action Buttons */}

                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4 ">
                                    <Button
                                        onClick={() => handleEdit(item)}
                                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-400 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-initial"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => (deleteConfirm === item?._id ? handleDelete(item?._id) : setDeleteConfirm(item?._id))}
                                        disabled={isDeleting}
                                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-initial ${deleteConfirm === item?._id
                                            ? "bg-[#F26E50] hover:bg-red-800 text-white"
                                            : "bg-[#F26E50] hover:bg-red-600 text-white"
                                            }`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {deleteConfirm === item?._id ? (isDeleting ? "Deleting..." : "Confirm") : "Delete item"}
                                    </Button>
                                    {deleteConfirm === item?._id && (
                                        <Button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors flex-1 sm:flex-initial"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Edit Status Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Update Item Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedProduct?.image?.[0] || "/placeholder.svg"}
                                    alt={selectedProduct?.title}
                                    className="h-16 w-16 object-cover rounded"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">{selectedProduct?.categoryId?.title}</p>
                                    <p className="text-base font-medium">{selectedProduct?.title}</p>
                                </div>
                            </div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                onClick={() => { setIsEditOpen(false); setSelectedProduct(null); }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateStatus}
                                disabled={isUpdating}
                                className="bg-black text-white hover:bg-black/80"
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
