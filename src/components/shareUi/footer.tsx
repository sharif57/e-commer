'use client';
import Link from "next/link"
import { Linkedin, Twitter, Youtube } from "lucide-react"
import Logo from "../icon/logo"
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {

  const pathname = usePathname();


  if (pathname === "/upgrade") {
    return null;
  }

  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-14 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="flex flex-col">
            <div className="mb-4">
              <Logo />
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-5 font-medium">
              Largest product search engine with smart categories, trusted sellers, and fast delivery to your doorstep.
            </p>

            <div className="inline-flex items-center gap-2 w-fit rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 mb-5">
              <Image
                src="/images/image.png"
                alt="United States Flag"
                width={200}
                height={200}
                className=" w-10 h-5 object-cover"
              />
              <span>United States</span>
              <span className="text-slate-500">|</span>
              <span>English (US)</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Electronics</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Fashion</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Home & Living</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Health & Beauty</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Sports & Outdoor</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Toys, Kids & Baby</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Groceries & Essentials</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Books & Media</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Automotive</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Deals & Clearance</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Security</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-700 font-medium text-center sm:text-left">
            Copyright © ebakx Inc. {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-700 font-medium">
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
