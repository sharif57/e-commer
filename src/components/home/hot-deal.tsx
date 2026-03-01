/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { ChevronRight } from "lucide-react";
// import Flash from "../icon/flash";
// import { Badge } from "../ui/badge";
// import { useDisableProductQuery } from "@/redux/feature/buyer/productSlice";

// export default function HotDeals() {
//   const { data, isLoading, error } = useDisableProductQuery(undefined);

//   const products = data?.data?.result || [];

//   return (
//     <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//         <div className="flex items-center gap-2">
//           <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
//             Hot Deals
//           </h2>
//           <Badge variant="outline" className="text-xs sm:text-sm">
//             Enjoy up to 40% Off
//           </Badge>
//         </div>
//         <Link
//           href="/deals"
//           className="text-[#1877F2] hover:underline hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
//         >
//           See all
//           <ChevronRight className="w-4 h-4" />
//         </Link>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="text-center py-12">Loading hot deals...</div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="text-center py-12 text-red-500">
//           Failed to load deals. Please try again later.
//         </div>
//       )}

//       {/* Grid Section - Dynamic Products */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product: any, index: number) => (
//           <div
//             key={product._id}
//             className="bg-[#00000008] rounded-xl p-4 flex flex-col hover:shadow-lg transition-shadow"
//           >
//             <Link href={`/best_deal/${product._id}`}>
//               <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-lg">
//                 <Image
//                   src={product.image[0] || "/images/placeholder.png"}
//                   alt={product.title}
//                   fill
//                   sizes="100vw"
//                   className="object-cover transition-transform duration-500 hover:scale-105"
//                 />
//                 {product.discount && (
//                   <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                     {product.discount}% OFF
//                   </div>
//                 )}
//               </div>
//             </Link>

//             <div className="mt-4 space-y-2">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold truncate">{product.title}</h3>
//                 {index === 0 && (
//                   <div className="flex items-center gap-1">
//                     <Flash />
//                     <span className="text-sm text-[#FF5B33] font-semibold">Flash</span>
//                   </div>
//                 )}
//               </div>

//               <p className="text-sm text-gray-600 line-clamp-2">{product.des}</p>

//               <div className="flex items-center gap-3">
//                 <span className="text-xl font-bold text-[#1877F2]">
//                   ৳{(product.price * (1 - (product.discount || 0) / 100)).toFixed(0)}
//                 </span>
//                 {product.discount && (
//                   <span className="text-sm text-gray-500 line-through">
//                     ৳{product.price}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="text-xs">
//                   {product.brand}
//                 </Badge>
//                 {product.inStock ? (
//                   <Badge variant="outline" className="text-xs text-green-600">
//                     In Stock
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="text-xs text-red-600">
//                     Out of Stock
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Flash from "../icon/flash";
import { Badge } from "../ui/badge";
import { useDisableProductQuery } from "@/redux/feature/buyer/productSlice";

export default function HotDeals() {
  const { data } = useDisableProductQuery(undefined);
  const products = data?.data?.result ?? [];
  const flashProduct = products[0];
  const comboProduct = products[1];
  const mixedProduct = products[2];

  const flashImage = flashProduct?.image?.[0] || "/images/image1.png";
  const comboImage1 = comboProduct?.image?.[0] || "/images/image2.png";
  const comboImage2 = comboProduct?.image?.[1] || "/images/images.png";
  const mixedImage1 = mixedProduct?.image?.[0] || "/images/image3.png";
  const mixedImage2 = mixedProduct?.image?.[1] || "/images/image4.png";
  const mixedImage3 = mixedProduct?.image?.[2] || "/images/image5.png";
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Hot Deals
          </h2>
          <Badge variant="outline" className="text-xs sm:text-sm">
            Enjoy up to 40% Off
          </Badge>
        </div>
        <Link
          href="/deals"
          className="text-[#1877F2] hover:underline hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Flash Sale */}
        <div className="bg-[#00000008] rounded-xl p-4 flex flex-col">
          <Link href={flashProduct?._id ? `/best_deal/${flashProduct._id}` : "/best_deal"}>
            <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[520px] overflow-hidden rounded-lg">
              <Image
                src={flashImage}
                alt={flashProduct?.title || "Flash Sale"}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2 mt-4">
            <Flash />
            <h1 className="text-lg sm:text-xl text-[#FF5B33] font-semibold">
              {flashProduct?.title || "Flash Sale"}
            </h1>
          </div>
        </div>

        {/* Combo & Bundle Offer */}
        <div className="bg-[#00000008] rounded-xl p-4 flex flex-col">
          <Link href={comboProduct?._id ? `/best_deal/${comboProduct._id}` : "/best_deal"}>
            <div className="space-y-4">
              <div className="relative w-full h-[200px] sm:h-[250px] overflow-hidden rounded-lg">
                <Image
                  src={comboImage1}
                  alt={comboProduct?.title || "Combo Offer 1"}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="relative w-full h-[200px] sm:h-[250px] overflow-hidden rounded-lg">
                <Image
                  src={comboImage2}
                  alt={comboProduct?.title || "Combo Offer 2"}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold mt-4">
            {comboProduct?.title || "Combo & Bundle Offer"}
          </h1>
        </div>

        {/* Mixed Deals */}
        <div className="bg-[#00000008] rounded-xl p-4 flex flex-col">
          <Link href={mixedProduct?._id ? `/best_deal/${mixedProduct._id}` : "/best_deal"}>
            <div className="relative w-full h-[230px] sm:h-[280px] overflow-hidden rounded-lg">
              <Image
                src={mixedImage1}
                alt={mixedProduct?.title || "Hot Deal"}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-lg">
                <Image
                  src={mixedImage2}
                  alt={mixedProduct?.title || "Deal 4"}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-lg">
                <Image
                  src={mixedImage3}
                  alt={mixedProduct?.title || "Deal 5"}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold mt-4">
            {mixedProduct?.title || "Summer Discount"}
          </h1>
        </div>
      </div>
    </section>
  );
}
