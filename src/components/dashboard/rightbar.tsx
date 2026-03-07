/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { Bell, ChevronRight } from "lucide-react";
import { useGetNotificationsQuery } from "@/redux/feature/notificationSlice";

interface DashboardRightbarProps {
  onToggle: () => void;
}

export default function DashboardRightbar({ onToggle }: DashboardRightbarProps) {

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
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
          aria-label="Collapse right sidebar"
          title="Collapse right sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-hidden flex-1">
        <div className="p-4 space-y-6 h-full overflow-y-auto scrollbar-hide">
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
                      className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${!n.read ? "bg-blue-100" : "bg-gray-300"
                        }`}
                    >
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
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
