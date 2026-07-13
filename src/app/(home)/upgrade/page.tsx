
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
// import {
//   useGetAllPackageQuery,
//   useSubscriptionCheckOutMutation,
//   useUpdateSubscriptionMutation
// } from '@/redux/feature/seller/packageSlice';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import { useGetAllPackageQuery, useSubscriptionCheckOutMutation, useUpdateSubscriptionMutation } from '@/redux/feature/seller/packageSlice';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ConfirmModal: React.FC<{
  pkg: any;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ pkg, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Switch Plan?</h3>
      <p className="text-gray-600 dark:text-zinc-400 mb-1">
        You are switching to <span className="font-semibold text-[#29845A]">{pkg.name}</span>.
      </p>
      <p className="text-gray-600 dark:text-zinc-400 mb-6 text-sm">
        Your current subscription will be replaced immediately.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#29845A' }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating...
            </span>
          ) : 'Confirm Switch'}
        </button>
      </div>
    </div>
  </div>
);

const SuccessToast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-800 text-gray-800 dark:text-zinc-100 px-5 py-3.5 rounded-xl shadow-lg">
    <span className="text-green-500 text-xl">✓</span>
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 text-lg leading-none">×</button>
  </div>
);

const PricingCard: React.FC<{
  pkg: any;
  onCheckout: (pkg: any) => void;
  onUpdate: (pkg: any) => void;
  loadingId: string | null;
  hasExistingSubscription: boolean;
  currentPackageId?: string;
}> = ({ pkg, onCheckout, onUpdate, loadingId, hasExistingSubscription, currentPackageId }) => {
  const isLoading = loadingId === pkg._id;
  const isCurrentPlan = hasExistingSubscription && currentPackageId === pkg._id;

  return (
    <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl border-gray-200 dark:border-zinc-700 hover:border-blue-400">
      <h3 className="text-2xl font-bold mb-4" style={{ color: '#29845A' }}>{pkg.name}</h3>
      <p className="text-4xl font-bold mb-2" style={{ color: '#29845A' }}>
        ${pkg.unitAmount}
        <span className="text-lg font-medium" style={{ color: '#29845A', opacity: 0.7 }}>/{pkg.interval}</span>
      </p>
      <ul className="space-y-4 mb-8 mt-6">
        {pkg.description.map((desc: string, i: number) => (
          <li key={i} className="flex items-center text-gray-700 dark:text-zinc-300">
            <CheckIcon />
            <span>{desc}</span>
          </li>
        ))}
      </ul>
      <button
        className="w-full py-3 px-6 rounded-lg font-medium mt-auto transition-all duration-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isCurrentPlan ? '#A3A3A3' : '#29845A',
          color: '#fff',
          boxShadow: isCurrentPlan ? 'none' : '0 4px 24px 0 rgba(41, 132, 90, 0.15)'
        }}
        onClick={() => hasExistingSubscription ? onUpdate(pkg) : onCheckout(pkg)}
        disabled={isLoading || isCurrentPlan}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing...
          </span>
        ) : isCurrentPlan ? 'Current Plan' : (hasExistingSubscription ? 'Switch Plan' : 'Choose Plan')}
      </button>
    </div>
  );
};

function PricingSection() {
  const searchParams = useSearchParams();
  const upgradeId = searchParams.get('id'); // becomeASeller id
  const becomeASellerId = upgradeId || null;

  // ── profile থেকে subscription status check ───────────────────────────────
  const { data: profile, isLoading: profileLoading, refetch } = useGetUsersQuery(undefined);
  const hasExistingSubscription = profile?.data?.subscription === true;
  const currentPackageId = profile?.data?.packageId?._id || profile?.data?.packageId;

  const { data, isLoading, error } = useGetAllPackageQuery(undefined);
  const [subscriptionCheckOut] = useSubscriptionCheckOutMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const [errorMsg, setErrorMsg] = React.useState('');
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [confirmPkg, setConfirmPkg] = React.useState<any>(null);
  const [successMsg, setSuccessMsg] = React.useState('');

  // ── New Checkout ──────────────────────────────────────────────────────────
  const handleCheckout = async (pkg: any) => {
    setErrorMsg('');
    // if (!becomeASellerId) { setErrorMsg('Seller ID not found. Please try again.'); return; }
    setLoadingId(pkg._id);
    try {
      const res: any = await subscriptionCheckOut({
        packageId: pkg._id,
        becomeASellerId,
      }).unwrap();
      if (res?.url) {
        window.open(res.url, '_blank');
      } else {
        setErrorMsg('Failed to get payment URL.');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Subscription failed. Try again.');
    } finally {
      setLoadingId(null);
    }
  };

  // ── Update: modal খোলে ────────────────────────────────────────────────────
  const handleUpdateClick = (pkg: any) => {
    setErrorMsg('');
    setConfirmPkg(pkg);
  };

  // ── Update: confirm চাপলে API call ────────────────────────────────────────
  const handleConfirmUpdate = async () => {
    if (!confirmPkg) return;
    setLoadingId(confirmPkg._id);
    try {
      await updateSubscription({
        newPackageId: confirmPkg._id,
      }).unwrap();
      setSuccessMsg(`Successfully switched to ${confirmPkg.name}!`);
      setConfirmPkg(null);
      refetch();
      // Reload the page programmatically after a short delay so the success toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Update failed. Try again.');
      setConfirmPkg(null);
    } finally {
      setLoadingId(null);
    }
  };

  // ── Profile load হওয়া পর্যন্ত wait ──────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-[#29845A] border-t-transparent" />
      </div>
    );
  }

  return (
    <section id="pricing" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
          `
        }} />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-6 tracking-tight">
            Seller Subscription Plans for Your E-Commerce Growth
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Select the best subscription to unlock powerful e-commerce features and grow your business as a seller.
          </p>
        </div>

        {errorMsg && (
          <div className="text-center text-red-500 mb-4">{errorMsg}</div>
        )}

        <div className={`grid gap-4 max-w-5xl mx-auto justify-items-center ${data?.data?.length === 2
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center'
          : 'grid-cols-1 lg:grid-cols-3'
          }`}>
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading packages...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">Failed to load packages.</div>
          ) : (
            data?.data?.map((pkg: any) => (
              <PricingCard
                key={pkg._id}
                pkg={pkg}
                onCheckout={handleCheckout}
                onUpdate={handleUpdateClick}
                loadingId={loadingId}
                hasExistingSubscription={hasExistingSubscription}
                currentPackageId={currentPackageId}
              />
            ))
          )}
        </div>
      </div>

      {confirmPkg && (
        <ConfirmModal
          pkg={confirmPkg}
          onConfirm={handleConfirmUpdate}
          onCancel={() => setConfirmPkg(null)}
          isLoading={loadingId === confirmPkg._id}
        />
      )}

      {successMsg && (
        <SuccessToast
          message={successMsg}
          onClose={() => setSuccessMsg('')}
        />
      )}
    </section>
  );
}

export default function PricingSectionWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PricingSection />
    </Suspense>
  );
}