/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Square } from "lucide-react"
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice"
import Link from "next/link"
import Image from "next/image"

interface Slide {
  id: number
  title: string
  description: string
  buttonText: string
  image: string
  bgColor: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Top tech for your game",
    description: "Explore in-game controller, keyboard, and more.",
    buttonText: "Shop now",
    image: "/images/hero.png",
    bgColor: "bg-gray-100",
  },
  {
    id: 2,
    title: "Premium Gaming Gear",
    description: "Discover the latest gaming peripherals and accessories.",
    buttonText: "Explore",
    image: "/images/hero.png",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    title: "Wireless Excellence",
    description: "Experience freedom with our wireless gaming collection.",
    buttonText: "Browse",
    image: "/images/hero.png",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: "RGB Lighting Setup",
    description: "Customize your gaming space with stunning RGB peripherals.",
    buttonText: "Shop Now",
    image: "/images/hero.png",
    bgColor: "bg-pink-50",
  },
  {
    id: 5,
    title: "Pro Gaming Chairs",
    description: "Comfort meets performance in our gaming chair collection.",
    buttonText: "Shop Now",
    image: "/images/hero.png",
    bgColor: "bg-green-50",
  },
  {
    id: 6,
    title: "Monitor Perfection",
    description: "Ultra-fast refresh rates for competitive gaming.",
    buttonText: "Discover",
    image: "/images/hero.png",
    bgColor: "bg-yellow-50",
  },
  {
    id: 7,
    title: "Audio Immersion",
    description: "Crystal clear sound for immersive gaming experience.",
    buttonText: "Listen",
    image: "/images/hero.png",
    bgColor: "bg-orange-50",
  },
]

export default function Banner() {


  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const { data, isLoading } = useGetCategoriesQuery(undefined);
  console.log(data?.data?.result, 'categories in banner')

  // Transform API data to slides format or use fallback
  const dynamicSlides = data?.data?.result?.map((category: any, index: number) => ({
    id: category._id,
    title: category.title,
    description: `Explore ${category.title} products and discover amazing deals.`,
    buttonText: "Shop now",
    image: category.image,
    bgColor: `bg-${['gray', 'blue', 'purple', 'pink', 'green', 'yellow', 'orange'][index % 7]}-50`,
  })) || slides;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && dynamicSlides.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length)
      }, 5000)
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isPlaying, dynamicSlides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length)
    setIsPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const stopSlideshow = () => {
    setIsPlaying(false)
    setCurrentSlide(0)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full container">
              <div className="rounded-2xl bg-gray-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 min-h-80 animate-pulse">
                  <div className="flex-1 w-full flex flex-col justify-center mb-8 lg:mb-0 lg:pr-8">
                    <div className="h-8 sm:h-10 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="h-5 w-full bg-gray-200 rounded mb-3" />
                    <div className="h-5 w-5/6 bg-gray-200 rounded mb-6" />
                    <div className="h-11 w-32 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <div className="w-full max-w-sm h-64 bg-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4 bg-white">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-9 bg-gray-200 rounded-lg ml-2 sm:ml-4" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 px-6 sm:px-8 lg:px-12 py-4 flex-wrap">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-2 w-6 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Return null if no slides available
  if (!dynamicSlides || dynamicSlides.length === 0) {
    return null
  }

  const slide = dynamicSlides[currentSlide]

  return (
    <div className=" overflow-hidden">


      {/* Main Content */}
      <main className="flex-1 flex flex-col ">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 ">
          <div className="w-full container">
            {/* Carousel Container */}
            <div className={` rounded-2xl  overflow-hidden transition-all duration-500`}>
              <div className="flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 min-h-80">
                {/* Left Content */}
                <div className="flex-1 flex flex-col justify-center mb-8 lg:mb-0 lg:pr-8">
                  <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[#000000] mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">{slide.description}</p>
                  <Link href={`/category?category=${slide.title}`} className="w-fit px-6 sm:px-8 py-2.5 sm:py-3 bg-primary hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg inline-block">
                    {slide.buttonText}
                  </Link>
                </div>

                {/* Right Image */}
                <div className="flex-1 flex items-center justify-center">
                  <Image
                    src={slide?.image}
                    alt={slide.title}
                    width={500}
                    height={300}
                    className="w-full max-w-sm h-auto object-contain "
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4 bg-white ">
                {/* Slide Counter */}
                <div className="text-sm font-medium text-gray-600">
                  {currentSlide + 1} of {dynamicSlides.length}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={prevSlide}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>

                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 sm:ml-4"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-gray-700" />
                    ) : (
                      <Play size={20} className="text-gray-700" />
                    )}
                  </button>


                </div>
              </div>

              <div className="flex items-center justify-center gap-2 px-6 sm:px-8 lg:px-12 py-4  flex-wrap">
                {dynamicSlides.map((_: Slide, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
