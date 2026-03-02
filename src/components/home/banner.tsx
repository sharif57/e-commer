"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import Image from "next/image"

interface Slide {
  id: string
  image: string
}

const slides: Slide[] = [
  { id: "1", image: "/images/9742750.jpg" },
  { id: "2", image: "/images/9650177.jpg" },
  { id: "3", image: "/images/1_wire_29_09_2020_12.jpg" },
  { id: "4", image: "/images/233.jpg" },
  { id: "5", image: "/images/product.jpg" },
]

export default function Banner() {


  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const dynamicSlides: Slide[] = slides

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

  // Return null if no slides available
  if (!dynamicSlides || dynamicSlides.length === 0) {
    return null
  }

  const slide = dynamicSlides[currentSlide]

  return (
    <section className="w-full overflow-hidden px-3 sm:px-4 lg:px-6">
      <main className="mx-auto w-full max-w-screen-2xl">
        <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[460px] xl:h-[540px] rounded-b-xl overflow-hidden">
          <Image
            src={slide.image}
            alt="Banner image"
            fill
            priority
            sizes="100vw"
            className="h-full object-cover"
          />

          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/85 hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/85 hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-gray-800" />
          </button>

          <button
            onClick={togglePlay}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 p-2 rounded-full bg-black/45 hover:bg-black/60 text-white transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {dynamicSlides.map((_, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
    </section>
  )
}
