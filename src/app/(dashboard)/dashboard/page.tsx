
'use client';
import PurchaseHistory from '@/components/dashboard/buyer/purchase-history'
import React, { useEffect, useState } from 'react'
import DashboardOverview from './overview/page';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import SubscriptionRequiredModal from '@/components/dashboard/subscription-required-modal';

export default function Dashboard() {
  const { data, isLoading } = useGetUsersQuery(undefined);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const userRole = data?.data?.role?.toUpperCase();
  const hasSubscription = data?.data?.subscription;
  const userName = data?.data?.firstName || 'User';

  useEffect(() => {
    // Check if user is a seller without subscription
    if (userRole === 'SELLER' && hasSubscription === false) {
      setShowSubscriptionModal(true);
    }
  }, [userRole, hasSubscription]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <title>{userRole === 'BUYER' ? 'Purchase History' : 'Seller Dashboard'}</title>

      {/* Show buyer dashboard */}
      {userRole === 'BUYER' && <PurchaseHistory />}

      {/* Show seller dashboard only if subscribed */}
      {userRole === 'SELLER' && hasSubscription && <DashboardOverview />}

      {/* Show locked state for sellers without subscription */}
      {userRole === 'SELLER' && !hasSubscription && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Locked</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to unlock full access to your seller dashboard and start managing your business.
            </p>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      )}

      {/* Subscription Required Modal - Cannot close when subscription is false */}
      <SubscriptionRequiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        userName={userName}
        canClose={hasSubscription === true}
      />
    </div>
  )
}
