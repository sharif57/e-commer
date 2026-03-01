/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useGetNotificationsQuery } from "@/redux/feature/notificationSlice";

export default function DashboardRightbar() {
  const [isOpen, setIsOpen] = useState(true); // default open

  const { data, isLoading, error } = useGetNotificationsQuery(undefined);

  const formatTime = (createdAt: string) => {
    const notificationDate = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return notificationDate.toLocaleDateString();
  };

  const notifications = data?.data?.result?.map((notif: any) => ({
    title: notif.text,
    time: formatTime(notif.createdAt),
    read: notif.read,
  })) || [];



  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col h-full">

      {/* Header */}
      <div className="p-6  flex justify-between items-center">
        <h3 className="font-semibold text-lg">Notifications</h3>

        <button onClick={() => setIsOpen(!isOpen)}>
          <ChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {/* Content (collapsible) */}
      <div
        className={`transition-all duration-300 overflow-hidden flex-1 ${isOpen ? "opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-4 space-y-6 h-full overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Recent {data?.data?.unredCount ? `(${data.data.unredCount})` : ""}
            </h4>
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-xs text-gray-500">Loading notifications...</p>
              ) : error ? (
                <p className="text-xs text-red-500">Failed to load notifications</p>
              ) : notifications.length > 0 ? (
                notifications.map((n: any, i: number) => (
                  <div
                    key={i}
                    className={`flex gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer ${!n.read ? "bg-blue-50" : ""
                      }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex-shrink-0 ${!n.read ? "bg-blue-400" : "bg-gray-300"
                        }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No notifications</p>
              )}
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
