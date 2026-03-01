'use client';

import { useGetSellerAboutQuery } from "@/redux/feature/buyer/productSlice";

export default function SellerAbout({ sellerId }: { sellerId: string }) {
  const { data } = useGetSellerAboutQuery(sellerId || '');
  const about = data?.data;
  return (
    <div className="w-full max-w-2xl p-4 md:p-6 lg:p-8">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-[#000000] mb-3">
        About us
      </h2>

      {/* Description */}
      <p className="text-sm md:text-base text-[#000000] font-normal leading-relaxed mb-6">
       {about?.description || "No description available."}
      </p>

      {/* Details Section */}
      <div className="space-y-3 text-sm md:text-base">
        <p>
          <span className="text-gray-600">Location: </span>
          <span className="font-semibold text-[#000000]">{about?.location || "No location available."}</span>
        </p>

        <p>
          <span className="text-gray-600">Member since: </span>
          <span className="font-semibold text-[#000000]">{about?.memberSince || "No member since available."}</span>
        </p>

        <p>
          <span className="text-gray-600">Seller: </span>
          <span className="font-semibold text-[#000000]">{about?.seller || "No seller information available." }</span>
        </p>
      </div>
    </div>
  );
}
