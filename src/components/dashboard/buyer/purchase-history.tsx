

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
        order?.productId?.title?.toLowerCase().includes(searchLower) ||
        order?.orderId?.toLowerCase().includes(searchLower) ||
        order?.firstName?.toLowerCase().includes(searchLower);

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
                key={order?._id}
                id={order?._id}
                status={
                  order?.deliveryStatus === "placed"
                    ? "in-progress"
                    : order?.deliveryStatus === "cancelled"
                    ? "canceled"
                    : "delivered"
                }
                deliveryDate={formatDate(order?.createdAt)}
                productImage={order?.productId?.image?.[0]}
                productQuantity={order?.quantity}
                orderTotal={order?.price * order?.quantity}
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
