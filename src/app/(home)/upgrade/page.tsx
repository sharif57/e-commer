// /* eslint-disable @typescript-eslint/no-explicit-any */

// 'use client'
// import { useGetAllPackageQuery, useSubscriptionCheckOutMutation } from '@/redux/feature/seller/packageSlice';
// import React from 'react';


// // SVG Icon for included features
// const CheckIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0"
//     viewBox="0 0 20 20"
//     fill="currentColor"
//   >
//     <path
//       fillRule="evenodd"
//       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//       clipRule="evenodd"
//     />
//   </svg>
// );



// // Individual Pricing Card Component for dynamic package
// const PricingCard: React.FC<{ pkg: any; onCheckout: (pkg: any) => void; loadingId: string | null }> = ({ pkg, onCheckout, loadingId }) => {
//   const isLoading = loadingId === pkg._id;
//   return (
//     <div
//       className={`relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl border-gray-200 dark:border-zinc-700 hover:border-blue-400`}
//     >
//       <h3 className="text-2xl font-bold mb-4" style={{ color: '#29845A' }}>{pkg.name}</h3>
//       <p className="text-4xl font-bold mb-2" style={{ color: '#29845A' }}>
//         ${pkg.unitAmount}
//         <span className="text-lg font-medium" style={{ color: '#29845A', opacity: 0.7 }} >/{pkg.interval}</span>
//       </p>
//       <ul className="space-y-4 mb-8 mt-6">
//         {pkg.description.map((desc: string, i: number) => (
//           <li key={i} className="flex items-center text-gray-700 dark:text-zinc-300">
//             <CheckIcon />
//             <span>{desc}</span>
//           </li>
//         ))}
//       </ul>
//       <button
//         className="w-full py-3 px-6 rounded-lg font-medium mt-auto transition-all duration-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
//         style={{
//           backgroundColor: '#29845A',
//           color: '#fff',
//           boxShadow: '0 4px 24px 0 rgba(41, 132, 90, 0.15)',
//         }}
//         onClick={() => onCheckout(pkg)}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center gap-2">
//             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
//             Processing...
//           </span>
//         ) : 'Choose Plan'}
//       </button>
//     </div>
//   );
// };


// // Main Pricing Section Component
// const PricingSection: React.FC = () => {
//   // http://localhost:3000/upgrade?id=697e3e0bfeb44c9c2c9bb3ee
//    const queryParams = new URLSearchParams(window.location.search);
//    const upgradeId = queryParams.get('id');
//    console.log('Upgrade ID from URL:', upgradeId);
//   const becomeASellerId = upgradeId || null;
//   const { data, isLoading, error } = useGetAllPackageQuery(undefined);
//   const [subscriptionCheckOut] = useSubscriptionCheckOutMutation();
//   const [errorMsg, setErrorMsg] = React.useState("");
//   const [loadingId, setLoadingId] = React.useState<string | null>(null);

//   const handleCheckout = async (pkg: any) => {
//     setErrorMsg("");
//     if (!becomeASellerId) {
//       setErrorMsg("User not loaded.");
//       return;
//     }
//     setLoadingId(pkg._id);
//     try {
//       const res: any = await subscriptionCheckOut({
//         packageId: pkg._id,
//         becomeASellerId: becomeASellerId,
//       }).unwrap();
//       if (res?.url) {
//         window.open(res.url, "_blank");
//       } else {
//         setErrorMsg("Failed to get payment URL.");
//       }
//     } catch (err: any) {
//       setErrorMsg(err?.data?.message || "Subscription failed. Try again.");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <section id="pricing" className="relative py-16 sm:py-24 overflow-hidden">
//       {/* Subtle pattern overlay */}
//       <div className="absolute inset-0 opacity-30 dark:opacity-20">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `
//               radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
//               radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
//             `
//           }}
//         />
//       </div>

//       <div className="relative container mx-auto px-4">
//         <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-6 tracking-tight">
//             Seller Subscription Plans for Your E-Commerce Growth
//           </h2>
//           <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
//             Select the best subscription to unlock powerful e-commerce features and grow your business as a seller. No hidden fees, no surprises—just tools to help you succeed online.
//           </p>
//         </div>

//         {errorMsg && <div className="text-center text-red-500 mb-4">{errorMsg}</div>}

//         <div
//           className={`grid gap-4 max-w-5xl mx-auto justify-items-center ${data?.data?.length === 2
//             ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center'
//             : 'grid-cols-1 lg:grid-cols-3'
//             }`}
//         >
//           {isLoading ? (
//             <div className="col-span-full text-center text-gray-500">Loading packages...</div>
//           ) : error ? (
//             <div className="col-span-full text-center text-red-500">Failed to load packages.</div>
//           ) : (
//             data?.data?.map((pkg: any, idx: number) => (
//               <PricingCard key={pkg._id} pkg={pkg} onCheckout={handleCheckout} loadingId={loadingId} />
//             ))
//           )}
//         </div>


//       </div>
//     </section>
//   );
// };

// export default PricingSection;

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { useGetAllPackageQuery, useSubscriptionCheckOutMutation } from '@/redux/feature/seller/packageSlice';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';


// SVG Icon for included features
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);



// Individual Pricing Card Component for dynamic package
const PricingCard: React.FC<{ pkg: any; onCheckout: (pkg: any) => void; loadingId: string | null }> = ({ pkg, onCheckout, loadingId }) => {
  const isLoading = loadingId === pkg._id;
  return (
    <div
      className={`relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl border-gray-200 dark:border-zinc-700 hover:border-blue-400`}
    >
      <h3 className="text-2xl font-bold mb-4" style={{ color: '#29845A' }}>{pkg.name}</h3>
      <p className="text-4xl font-bold mb-2" style={{ color: '#29845A' }}>
        ${pkg.unitAmount}
        <span className="text-lg font-medium" style={{ color: '#29845A', opacity: 0.7 }} >/{pkg.interval}</span>
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
          backgroundColor: '#29845A',
          color: '#fff',
          boxShadow: '0 4px 24px 0 rgba(41, 132, 90, 0.15)',
        }}
        onClick={() => onCheckout(pkg)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Processing...
          </span>
        ) : 'Choose Plan'}
      </button>
    </div>
  );
};


// Main Pricing Section Component
function PricingSection() {
  // http://localhost:3000/upgrade?id=697e3e0bfeb44c9c2c9bb3ee
  const searchParams = useSearchParams();
  const upgradeId = searchParams.get('id');
  console.log('Upgrade ID from URL:', upgradeId);
  
  const becomeASellerId = upgradeId || null;
  const { data, isLoading, error } = useGetAllPackageQuery(undefined);
  const [subscriptionCheckOut] = useSubscriptionCheckOutMutation();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleCheckout = async (pkg: any) => {
    setErrorMsg("");
    if (!becomeASellerId) {
      setErrorMsg("User not loaded.");
      return;
    }
    setLoadingId(pkg._id);
    try {
      const res: any = await subscriptionCheckOut({
        packageId: pkg._id,
        becomeASellerId: becomeASellerId,
      }).unwrap();
      if (res?.url) {
        window.open(res.url, "_blank");
      } else {
        setErrorMsg("Failed to get payment URL.");
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Subscription failed. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section id="pricing" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-6 tracking-tight">
            Seller Subscription Plans for Your E-Commerce Growth
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Select the best subscription to unlock powerful e-commerce features and grow your business as a seller. No hidden fees, no surprises—just tools to help you succeed online.
          </p>
        </div>

        {errorMsg && <div className="text-center text-red-500 mb-4">{errorMsg}</div>}

        <div
          className={`grid gap-4 max-w-5xl mx-auto justify-items-center ${data?.data?.length === 2
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center'
            : 'grid-cols-1 lg:grid-cols-3'
            }`}
        >
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading packages...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">Failed to load packages.</div>
          ) : (
            data?.data?.map((pkg: any) => (
              <PricingCard key={pkg._id} pkg={pkg} onCheckout={handleCheckout} loadingId={loadingId} />
            ))
          )}
        </div>
      </div>
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