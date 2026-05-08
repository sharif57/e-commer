import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/icon/logo';

interface BecomeSellerWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const BecomeSellerWrapper: React.FC<BecomeSellerWrapperProps> = ({
  children,
  title = "Welcome back, Seller.",
  subtitle = "Sign in to manage your store and grow your business.",
}) => {
  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}
      <header className="px-6 py-6 lg:px-12">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex flex-col lg:flex-row gap-12 items-start justify-between">

        {/* Left Side: Content & Form */}
        <div className="w-full lg:w-1/2 max-w-[540px]">
          <div className="mb-10">
            <h1 className="text-xl lg:text-[36px] text-[#000000] font-bold mb- tracking-tight">
              {title}
            </h1>
            <p className="text-[14px] text-[#000000] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white   p-8 mb-8">
            {children}
          </div>

          {/* Support Section */}
          <div className="bg-[#1717170F] rounded-2xl p-6 flex items-center justify-center gap-5">
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image
                src="/image 2.png"
                alt="Support"
                width={56}
                height={56}
                className="object-contain"
                onError={(e) => {
                  // Fallback if the specific icon isn't found
                  const target = e.target as HTMLImageElement;
                  target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135706.png";
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Support U.S. takes</h3>
              <p className="text-sm text-gray-500 font-medium">24/7 U.S. support</p>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center lg:sticky lg:top-10">
          <div className="relative w-full max-w-[650px] aspect-[4/3]">
            <Image
              src="/images/become.png"
              alt="Become a seller illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BecomeSellerWrapper;
