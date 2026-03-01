
// 'use client';

// import Header from '@/components/seller/header';
// import ProductCatalog from '@/components/seller/product-catalog';
// import SellerFeedback from '@/components/seller/seller-feedback';
// import SellerAbout from '@/components/seller/SellerAbout';
// import { Suspense, useState } from 'react';

// type Page = 'catalog' | 'about' | 'feedback' ;

//  function SellerProfile() {
//   const queryParams = new URLSearchParams(window.location.search);
//   const sellerId = queryParams.get('id');
  
//   const [currentPage, setCurrentPage] = useState<Page>('catalog');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   return (
//     <div className="min-h-screen bg-background">
//       <Header
//         sellerId={sellerId || ''}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         selectedCategory={selectedCategory}
//         onCategoryChange={setSelectedCategory}
//       />

//       <main className="">
//         {currentPage === 'catalog' && (
//           <ProductCatalog
//             sellerId={sellerId || ''}
//             searchTerm={searchTerm}
//             selectedCategory={selectedCategory}
//           />
//         )}
//         {currentPage === 'about' && <SellerAbout sellerId={sellerId || ''} />}
//         {currentPage === 'feedback' && <SellerFeedback sellerId={sellerId || ''} />}
//       </main>
//     </div>
//   );
// }

// export default function SellerProfileWrapper() {
//     return <Suspense fallback={<div>Loading...</div>}><SellerProfile /></Suspense>;
// }
'use client';

import Header from '@/components/seller/header';
import ProductCatalog from '@/components/seller/product-catalog';
import SellerFeedback from '@/components/seller/seller-feedback';
import SellerAbout from '@/components/seller/SellerAbout';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Page = 'catalog' | 'about' | 'feedback';

function SellerProfile() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('id');
  
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-background">
      <Header
        sellerId={sellerId || ''}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="">
        {currentPage === 'catalog' && (
          <ProductCatalog
            sellerId={sellerId || ''}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        )}
        {currentPage === 'about' && <SellerAbout sellerId={sellerId || ''} />}
        {currentPage === 'feedback' && <SellerFeedback sellerId={sellerId || ''} />}
      </main>
    </div>
  );
}

export default function SellerProfileWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <SellerProfile />
        </Suspense>
    );
}