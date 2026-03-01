/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { Search, ChevronDown, Edit, Trash2, X, Upload, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useDeleteProductMutation, useGetSellerProductsQuery, useGetSingleProductSellerQuery, useUpdateProductMutation } from "@/redux/feature/seller/productSellerSlice"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

interface InventoryItem {
  _id: string
  title: string
  price: number
  brand: string
  sku: string
  categoryId: {
    title: string
  }
  subCategoryId: {
    title: string
  }
  image: string[]
  inStock: boolean
  status: string
  des: string
  size: string[]
  color: string[]
  rating?: number
  createdAt: string
  updatedAt: string
  return?: string
  deliveryChargeInDc?: string
  deliveryChargeOutOfDc?: string
  carrier?: string
  closureType?: string
  origin?: string
  careInsturction?: string
  frbricType?: string
}

export default function ManageInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showStockDropdown, setShowStockDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProductIdForDelete, setSelectedProductIdForDelete] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>({})
  const [newImages, setNewImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Prepare query params based on stock filter
  const queryParams: { page: number; inStock?: boolean } = { page: currentPage };
  if (stockFilter === "in-stock") {
    queryParams.inStock = true;
  } else if (stockFilter === "out-of-stock") {
    queryParams.inStock = false;
  }

  const { data, isLoading } = useGetSellerProductsQuery(queryParams);
  const products: InventoryItem[] = data?.data?.result || [];
  const totalProducts = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalProducts / 10);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleEdit = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setSelectedProduct(product);
      setEditFormData({
        title: product.title,
        price: product.price,
        brand: product.brand,
        size: product.size,
        des: product.des,
        return: product.return || "7 days return available",
        deliveryChargeInDc: product.deliveryChargeInDc || "50",
        deliveryChargeOutOfDc: product.deliveryChargeOutOfDc || "100",
        carrier: product.carrier || "RedX",
        sku: product.sku,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        closureType: product.closureType || "",
        origin: product.origin || "",
        careInsturction: product.careInsturction || "",
        frbricType: product.frbricType || "",
        color: product.color,
        inStock: product.inStock,
        status: product.status
      });
      setExistingImages(product.image || []);
      setNewImages([]);
      setImagePreviews([]);
      setIsEditModalOpen(true);
    }
  }

  const handleDeleteClick = (productId: string) => {
    setSelectedProductIdForDelete(productId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedProductIdForDelete) return
    try {
     const res = await deleteProduct(selectedProductIdForDelete).unwrap()
      setIsDeleteModalOpen(false)
      setSelectedProductIdForDelete(null)
      toast.success(res?.data?.message || "Product deleted successfully!")
    } catch (error: any) {
      console.error("Failed to delete product", error)
      toast.error(error?.data?.message || "Failed to delete product. Please try again.")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (field: string, value: any) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setEditFormData((prev: any) => ({ ...prev, [field]: array }));
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const formData = new FormData();



      // Add existing images that weren't removed
      // formData.append('', JSON.stringify(existingImages));
      formData.append('data', JSON.stringify({
        title: editFormData.title,
        price: editFormData.price,
        brand: editFormData.brand,
        des: editFormData.des,
        return: editFormData.return,
        deliveryChargeInDc: editFormData.deliveryChargeInDc,
        deliveryChargeOutOfDc: editFormData.deliveryChargeOutOfDc,
        carrier: editFormData.carrier,
        sku: editFormData.sku,
        categoryId: editFormData.categoryId,
        subCategoryId: editFormData.subCategoryId,
        closureType: editFormData.closureType,
        origin: editFormData.origin,
        careInsturction: editFormData.careInsturction,
        frbricType: editFormData.frbricType,
        color: editFormData.color,
        inStock: editFormData.inStock,
        status: editFormData.status,
        size: editFormData.size,
        image: existingImages,
      })
      )

      // Add new images
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      await updateProduct({ productId: selectedProduct._id, data: formData, image: newImages }).unwrap();

      setIsEditModalOpen(false);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  return (
    <main className="min-h-screen ">
      <div className="w-full ">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000] mb-6">Manage inventory</h1>

          {/* Search Bar */}
          <div className="relative mb-4 lg:w-2/5 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search inventory by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-[#171717] bg-[#1717170F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              onClick={() => {
                setCategoryFilter("all")
                setStockFilter("all")
                setCurrentPage(1) // Reset to first page when clearing filters
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 sm:px-5 py-2 rounded-full font-medium text-xs sm:text-sm transition-colors"
            >
              All
            </Button>

            {/* Category Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-400 px-4 sm:px-5 py-2 rounded-full font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                By category <ChevronDown className="h-4 w-4" />
              </Button>
              {showCategoryDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-max">
                  <button
                    onClick={() => {
                      setCategoryFilter("all")
                      setShowCategoryDropdown(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    All Categories
                  </button>
                  <button
                    onClick={() => {
                      setCategoryFilter("Electronics")
                      setShowCategoryDropdown(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Electronics
                  </button>
                </div>
              )}
            </div>

            {/* Stock Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowStockDropdown(!showStockDropdown)}
                className={`hover:bg-gray-50 border border-gray-400 px-4 sm:px-5 py-2 rounded-full font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors ${stockFilter !== "all"
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-white text-gray-700"
                  }`}
              >
                {stockFilter === "in-stock"
                  ? "In Stock"
                  : stockFilter === "out-of-stock"
                    ? "Out of Stock"
                    : "Stock Filter"}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showStockDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-max">
                  <button
                    onClick={() => {
                      setStockFilter("all")
                      setShowStockDropdown(false)
                      setCurrentPage(1) // Reset to first page
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStockFilter("in-stock")
                      setShowStockDropdown(false)
                      setCurrentPage(1) // Reset to first page
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => {
                      setStockFilter("out-of-stock")
                      setShowStockDropdown(false)
                      setCurrentPage(1) // Reset to first page
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Out of Stock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container - Responsive */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Product</th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    productId
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Price (USD)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Stock Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((item: InventoryItem, index: number) => (
                    <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image && item.image.length > 0 ? (
                            <Image
                              src={item.image[0]}
                              alt={item.title}
                              height={100}
                              width={100}
                              className="h-10 w-10 object-cover rounded bg-gray-100"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.des?.substring(0, 30)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item._id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.categoryId?.title}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${item.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${item.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/best_deal/${item._id}`}

                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="view product"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Link>
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      {isLoading ? "Loading products..." : "No products found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden">
            {products && products.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <p className="text-base">{isLoading ? "Loading products..." : "No products found"}</p>
              </Card>
            ) : (
              <div className="space-y-4 p-4">
                {products?.map((item: InventoryItem) => (
                  <Card key={item._id} className="p-4 border border-gray-200">
                    <div className="flex gap-3 mb-3">
                      {item.image && item.image.length > 0 ? (
                        <img
                          src={item.image[0]}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded bg-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 uppercase">SKU: {item.sku}</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.brand}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{item.categoryId?.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock</p>
                        <p className={`font-semibold ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                          {item.inStock ? "In Stock" : "Out"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className={`font-semibold ${item.status === "active" ? "text-blue-600" : "text-gray-600"}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs font-medium text-white"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {/* {products && products.length === 0 && !isLoading && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm md:text-base">No products found</p>
          </div>
        )} */}

        {/* Pagination */}
        {products && products.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{products.length}</span> of{" "}
                  <span className="font-medium">{totalProducts}</span> products
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pageNum === currentPage
                            ? "z-10 bg-yellow-400 text-black focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }`}
                        >
                          {pageNum}
                        </button>
                      )
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                        >
                          ...
                        </span>
                      )
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Product</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Images Section */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img src={img} alt="Product" className="w-full h-24 object-cover rounded border" />
                      <button
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {/* New Images Preview */}
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded border" />
                      <button
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {/* Upload Button */}
                  <label className="border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-yellow-400 h-24">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400" />
                      <span className="text-xs text-gray-500">Add Image</span>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    value={editFormData.title || ''}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Product title"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editFormData.price || ''}
                    onChange={(e) => handleFormChange('price', Number(e.target.value))}
                    placeholder="Product price"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand*</Label>
                  <Input
                    id="brand"
                    value={editFormData.brand || ''}
                    onChange={(e) => handleFormChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU*</Label>
                  <Input
                    id="sku"
                    value={editFormData.sku || ''}
                    onChange={(e) => handleFormChange('sku', e.target.value)}
                    placeholder="Product SKU"
                  />
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <Label htmlFor="size">Sizes (comma separated)*</Label>
                  <Input
                    id="size"
                    value={editFormData.size?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('size', e.target.value)}
                    placeholder="S, M, L, XL"
                  />
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <Label htmlFor="color">Colors (comma separated)*</Label>
                  <Input
                    id="color"
                    value={editFormData.color?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('color', e.target.value)}
                    placeholder="black, white, yellow"
                  />
                </div>

                {/* Carrier */}
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input
                    id="carrier"
                    value={editFormData.carrier || ''}
                    onChange={(e) => handleFormChange('carrier', e.target.value)}
                    placeholder="RedX"
                  />
                </div>

                {/* Return Policy */}
                <div className="space-y-2">
                  <Label htmlFor="return">Return Policy</Label>
                  <Input
                    id="return"
                    value={editFormData.return || ''}
                    onChange={(e) => handleFormChange('return', e.target.value)}
                    placeholder="7 days return available"
                  />
                </div>

                {/* Delivery Charge In DC */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryChargeInDc">Delivery Charge (In DC)</Label>
                  <Input
                    id="deliveryChargeInDc"
                    value={editFormData.deliveryChargeInDc || ''}
                    onChange={(e) => handleFormChange('deliveryChargeInDc', e.target.value)}
                    placeholder="50"
                  />
                </div>

                {/* Delivery Charge Out of DC */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryChargeOutOfDc">Delivery Charge (Out of DC)</Label>
                  <Input
                    id="deliveryChargeOutOfDc"
                    value={editFormData.deliveryChargeOutOfDc || ''}
                    onChange={(e) => handleFormChange('deliveryChargeOutOfDc', e.target.value)}
                    placeholder="100"
                  />
                </div>

                {/* Closure Type */}
                <div className="space-y-2">
                  <Label htmlFor="closureType">Closure Type</Label>
                  <Input
                    id="closureType"
                    value={editFormData.closureType || ''}
                    onChange={(e) => handleFormChange('closureType', e.target.value)}
                    placeholder="Closure type"
                  />
                </div>

                {/* Origin */}
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={editFormData.origin || ''}
                    onChange={(e) => handleFormChange('origin', e.target.value)}
                    placeholder="Country of origin"
                  />
                </div>

                {/* Fabric Type */}
                <div className="space-y-2">
                  <Label htmlFor="frbricType">Fabric Type</Label>
                  <Input
                    id="frbricType"
                    value={editFormData.frbricType || ''}
                    onChange={(e) => handleFormChange('frbricType', e.target.value)}
                    placeholder="Fabric type"
                  />
                </div>

                {/* Stock Status */}
                <div className="space-y-2">
                  <Label htmlFor="inStock">Stock Status</Label>
                  <select
                    id="inStock"
                    value={editFormData.inStock ? 'true' : 'false'}
                    onChange={(e) => handleFormChange('inStock', e.target.value === 'true')}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editFormData.status || 'active'}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="des">Description*</Label>
                <Textarea
                  id="des"
                  value={editFormData.des || ''}
                  onChange={(e) => handleFormChange('des', e.target.value)}
                  placeholder="Product description"
                  rows={4}
                />
              </div>

              {/* Care Instructions - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="careInsturction">Care Instructions</Label>
                <Textarea
                  id="careInsturction"
                  value={editFormData.careInsturction || ''}
                  onChange={(e) => handleFormChange('careInsturction', e.target.value)}
                  placeholder="Care instructions"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProduct}
                  disabled={isUpdating}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  {isUpdating ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Delete Product</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedProductIdForDelete(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
