
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useAllBuyerAndSellerOrderQuery,
  useCreateInboxMutation,
} from '@/redux/feature/socket/messageSlice';
import { initSocket } from '@/lib/socket';

interface OrderItem {
  orderId: string;
  userId: string;
  name: string;
  image?: string | null;
  email: string;
}

interface OrdersMeta {
  page: number;
  limit: number;
  total: number;
}

interface MessageRow {
  id: string;           // orderId
  receiverId: string;   // ← the real user ID we need
  sender: string;
  avatar: string;
  image?: string | null;
  message: string;
  timestamp: string;
  isNew: boolean;
  isUnread: boolean;
}

export default function MessagesPage() {
  const router = useRouter();

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [creatingFor, setCreatingFor] = useState<string | null>(null);

  const [createInbox] = useCreateInboxMutation();

  const { data, isLoading } = useAllBuyerAndSellerOrderQuery(page);

  useEffect(() => {
    initSocket();
  }, []);

  const orders: OrderItem[] = data?.data?.data || [];
  const meta: OrdersMeta | undefined = data?.data?.meta;
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;

  const messages: MessageRow[] = useMemo(() => {
    return orders.map((order) => {
      const initials =
        order.name
          ?.split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join('') || 'US';

      return {
        id: order.orderId,
        receiverId: order.userId,
        sender: order.name || 'Unknown',
        avatar: initials,
        image: order.image,
        message: order.email || 'No email available',
        timestamp: 'Just now',
        isNew: true,
        isUnread: true,
      };
    });
  }, [orders]);

  const handleOpenConversation = async (msg: MessageRow) => {
    if (!msg.receiverId) return;
    if (creatingFor === msg.id) return;

    setCreatingFor(msg.id);

    try {
  
      const result = await createInbox(msg.receiverId).unwrap();

      const inboxId = typeof result === 'string' ? result : result?.data?._id;

      if (!inboxId) {
        throw new Error('No inbox ID received from server');
      }

      const params = new URLSearchParams({
        name: msg.sender || 'User',
        image: msg.image || '',
        receiverId: msg.receiverId,
        // orderId: msg.id,     // ← optional
      });

      router.push(`/dashboard/message/${inboxId}?senderId=${msg.receiverId}&${params.toString()}`);
    } catch (err: any) {
      console.error('Create inbox failed:', err?.data?.message || err.message || err);
      // toast.error?.("Could not start conversation. Please try again.");
    } finally {
      setCreatingFor(null);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...messages];

    if (showUnreadOnly) {
      list = list.filter((m) => m.isUnread);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.sender.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'name') return a.sender.localeCompare(b.sender);
      if (sortBy === 'oldest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      // recent
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    return list;
  }, [messages, showUnreadOnly, sortBy, searchQuery]);

  const unreadCount = messages.filter((m) => m.isUnread).length;
  const totalConversations = meta?.total ?? messages.length;

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & filters */}
        <div className="border-b bg-white py-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

          <div className="mt-5 space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Show unread only</span>
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-6 text-sm text-gray-600">
                <span>{totalConversations} conversations</span>
                {unreadCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading...</div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No messages found</div>
          ) : (
            filteredAndSorted.map((msg) => {
              const isCreating = creatingFor === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => !isCreating && handleOpenConversation(msg)}
                  className={`group flex gap-4 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 ${
                    isCreating ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.image ? (
                      <img
                        src={msg.image}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-base font-semibold text-gray-600">
                        {msg.avatar}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-gray-900">{msg.sender}</h3>
                      {msg.isNew && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-white px-4 py-4 sm:px-6">
            <div className="text-sm text-gray-600">
              Page {meta?.page ?? page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? page) <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? page) >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}