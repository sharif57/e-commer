// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { useState, useMemo } from "react";
// import { Search } from 'lucide-react';
// import { Input } from "@/components/ui/input";
// import { FilterDropdown } from "@/components/filter-dropdown";
// import Breadcrumb from "@/components/Breadcrumb";
// import { OrderCard } from "./order-card";
// import { useOrderHistoryQuery } from "@/redux/feature/buyer/orderProductSlice";

// type FilterOption = {
//   id: string
//   label: string
//   checked: boolean
// }

// interface OrderItem {
//   _id: string;
//   userId: string;
//   productId: {
//     _id: string;
//     title: string;
//     price: number;
//     brand: string;
//     image: string[];
//     des: string;
//   };
//   quantity: number;
//   price: number;
//   paymentStatus: "pending" | "completed" | "failed";
//   deliveryStatus: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
//   orderId: string;
//   firstName: string;
//   lastName: string;
//   streetName: string;
//   area: string;
//   city: string;
//   zip: number;
//   state: string;
//   country: string;
//   color: string;
//   size: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function PurchaseHistory() {
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const { data: orderResponse, isLoading, error } = useOrderHistoryQuery({ page: currentPage });

//   const [statusFilters, setStatusFilters] = useState<FilterOption[]>([
//     { id: 'placed', label: 'In progress', checked: true },
//     { id: 'delivered', label: 'Delivered', checked: true },
//     { id: 'cancelled', label: 'Canceled', checked: false },
//   ]);

//   // Get raw orders from API
//   const orders: OrderItem[] = orderResponse?.data?.result || [];
//   const meta = orderResponse?.data?.meta || {};
//   const totalOrders = meta?.total || 0;
//   const totalPages = meta?.totalPages || 1;

//   // Filter orders based on search and status
//   const filteredOrders = useMemo(() => {
//     return orders.filter((order) => {
//       // Search filter
//       const searchLower = search.toLowerCase();
//       const matchesSearch =
//         order.productId.title.toLowerCase().includes(searchLower) ||
//         order.orderId.toLowerCase().includes(searchLower) ||
//         order.firstName.toLowerCase().includes(searchLower);

//       // Status filter
//       const selectedStatuses = statusFilters
//         .filter((f) => f.checked)
//         .map((f) => f.id);

//       // Map deliveryStatus to filter status
//       const orderStatus = order.deliveryStatus === 'placed' ? 'placed' : order.deliveryStatus;
//       const matchesStatus =
//         selectedStatuses.length === 0 || selectedStatuses.includes(orderStatus);

//       return matchesSearch && matchesStatus;
//     });
//   }, [orders, search, statusFilters]);

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // Map API data to OrderCard props
//   const mappedOrders = filteredOrders.map((order) => ({
//     id: order._id,
//     status: (order.deliveryStatus === 'placed' ? 'in-progress' : order.deliveryStatus === 'cancelled' ? 'canceled' : order.deliveryStatus) as 'in-progress' | 'delivered' | 'canceled',
//     deliveryDate: formatDate(order.createdAt),
//     productImage: order.productId.image?.[0] || '/placeholder.svg',
//     productQuantity: order.quantity,
//     orderTotal: order.price * order.quantity,
//   }));

//   const handleStatusApply = (selected: FilterOption[]) => {
//     setStatusFilters(selected);
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <Breadcrumb items={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Purchase history" }
//         ]} />
//         <div className="flex items-center justify-center py-12">
//           <p className="text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <Breadcrumb items={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Purchase history" }
//         ]} />
//         <div className="flex items-center justify-center py-12">
//           <p className="text-red-600">Error loading orders. Please try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <Breadcrumb items={[
//         { label: "Dashboard", href: "/dashboard" },
//         { label: "Purchase history" }
//       ]} />
//       <div>
//         <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2">
//           Purchase history
//         </h1>
//         <p className="text-gray-600 text-sm">
//           Total Orders: {totalOrders}
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col flex-wrap gap-3 items-start">
//         {/* Search Bar */}
//         <div className="relative flex-1 w-full sm:w-1/3">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             type="text"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1); // Reset to first page when searching
//             }}
//             placeholder="Search by product name or order ID..."
//             className="pl-10 bg-[#f1f1f1] border-[#171717]"
//           />
//         </div>

//         {/* Filter Buttons */}
//         <div className="w-full p-6 bg-gray-50 rounded-lg">
//           <div className="flex items-center gap-3 flex-wrap">
//             {/* All Button */}
//             <button
//               onClick={() => {
//                 const allChecked = statusFilters.every((f) => f.checked);
//                 setStatusFilters(
//                   statusFilters.map((f) => ({ ...f, checked: !allChecked }))
//                 );
//                 setCurrentPage(1);
//               }}
//               className="px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-full hover:bg-yellow-500 transition-colors"
//             >
//               All
//             </button>

//             {/* Status Dropdown */}
//             <FilterDropdown
//               title="Status"
//               options={statusFilters}
//               onApply={handleStatusApply}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Orders List */}
//       {filteredOrders.length === 0 ? (
//         <div className="flex items-center justify-center py-12 bg-white rounded-lg border">
//           <p className="text-gray-600">No orders found.</p>
//         </div>
//       ) : (
//         <>
//           <div className="space-y-4 border rounded-lg overflow-hidden">
//             {mappedOrders.map((order) => (
//               <OrderCard key={order.id} {...order} />
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 0 && (
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6">
//               {/* First Button */}
//               <button
//                 onClick={() => setCurrentPage(1)}
//                 disabled={currentPage === 1 || isLoading}
//                 className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
//               >
//                 First
//               </button>

//               {/* Previous Button */}
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1 || isLoading}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//               >
//                 Previous
//               </button>

//               {/* Page Numbers */}
//               <div className="flex items-center gap-1">
//                 {/* First Page */}
//                 {currentPage > 3 && (
//                   <>
//                     <button
//                       onClick={() => setCurrentPage(1)}
//                       disabled={isLoading}
//                       className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                     >
//                       1
//                     </button>
//                     {currentPage > 4 && (
//                       <span className="px-2 text-gray-600">...</span>
//                     )}
//                   </>
//                 )}

//                 {/* Page Range Around Current Page */}
//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(page => {
//                     if (totalPages <= 7) return true;
//                     if (page === 1 || page === totalPages) return false;
//                     return Math.abs(page - currentPage) <= 1;
//                   })
//                   .map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       disabled={isLoading}
//                       className={`px-3 py-2 rounded-md transition-colors min-w-[40px] ${currentPage === page
//                           ? 'bg-primary text-white font-semibold'
//                           : 'border border-gray-300 hover:bg-gray-50'
//                         }`}
//                     >
//                       {page}
//                     </button>
//                   ))}

//                 {/* Last Page */}
//                 {currentPage < totalPages - 2 && (
//                   <>
//                     {currentPage < totalPages - 3 && (
//                       <span className="px-2 text-gray-600">...</span>
//                     )}
//                     <button
//                       onClick={() => setCurrentPage(totalPages)}
//                       disabled={isLoading}
//                       className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                     >
//                       {totalPages}
//                     </button>
//                   </>
//                 )}
//               </div>

//               {/* Next Button */}
//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages || isLoading}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//               >
//                 Next
//               </button>

//               {/* Last Button */}
//               <button
//                 onClick={() => setCurrentPage(totalPages)}
//                 disabled={currentPage === totalPages || isLoading}
//                 className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
//               >
//                 Last
//               </button>
//             </div>
//           )}

//           {/* Results Info */}
//           <div className="text-center text-sm text-gray-600">
//             Page {currentPage} of {totalPages} | Total Orders: {totalOrders}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/filter-dropdown";
import Breadcrumb from "@/components/Breadcrumb";
import { OrderCard } from "./order-card";
import { useOrderHistoryQuery } from "@/redux/feature/buyer/orderProductSlice";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type FilterOption = {
  id: string;
  label: string;
  checked: boolean;
};

interface OrderItem {
  _id: string;
  orderId: string;
  firstName: string;
  quantity: number;
  price: number;
  deliveryStatus: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  productId: {
    title: string;
    image: string[];
  };
}

const LIMIT = 10; // MUST match backend limit

export default function PurchaseHistory() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useOrderHistoryQuery({
    page: currentPage,
  });

  const orders: OrderItem[] = data?.data?.result || [];
  const totalOrders = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalOrders / LIMIT);

  const [statusFilters, setStatusFilters] = useState<FilterOption[]>([
    { id: "placed", label: "In progress", checked: true },
    { id: "delivered", label: "Delivered", checked: true },
    { id: "cancelled", label: "Canceled", checked: false },
  ]);

  /* 🔍 Filter logic */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        order.productId.title.toLowerCase().includes(searchLower) ||
        order.orderId.toLowerCase().includes(searchLower) ||
        order.firstName.toLowerCase().includes(searchLower);

      const selectedStatuses = statusFilters
        .filter((s) => s.checked)
        .map((s) => s.id);

      return (
        matchesSearch &&
        (selectedStatuses.length === 0 ||
          selectedStatuses.includes(order.deliveryStatus))
      );
    });
  }, [orders, search, statusFilters]);

  /* 📄 Pagination handler */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* 🗓 Date format */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return <p className="text-center py-10">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">Failed to load orders</p>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Purchase history" },
        ]}
      />

      <h1 className="text-2xl font-bold">Purchase history</h1>
      <p className="text-sm text-gray-600">Total Orders: {totalOrders}</p>

      {/* 🔎 Search */}
      <div className="relative w-full sm:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by product or order ID"
          className="pl-10"
        />
      </div>

      {/* 🧾 Orders */}
      {filteredOrders.length === 0 ? (
        <p className="text-center py-10 text-gray-600">No orders found</p>
      ) : (
        <>
          <div className="space-y-4 border rounded-lg p-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                id={order._id}
                status={
                  order.deliveryStatus === "placed"
                    ? "in-progress"
                    : order.deliveryStatus === "cancelled"
                    ? "canceled"
                    : "delivered"
                }
                deliveryDate={formatDate(order.createdAt)}
                productImage={order.productId.image?.[0]}
                productQuantity={order.quantity}
                orderTotal={order.price * order.quantity}
              />
            ))}
          </div>

          {/* 🔢 Pagination */}
          {totalPages > 1 && (
            <>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 1
                    )
                    .map((page, index, arr) => (
                      <PaginationItem key={page}>
                        {index > 0 && page - arr[index - 1] > 1 && (
                          <PaginationEllipsis />
                        )}
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-center text-sm text-gray-600 mt-2">
                Page {currentPage} of {totalPages}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
