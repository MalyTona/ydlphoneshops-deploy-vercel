import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const banners = [
    {
        id: 1,
        imageUrl: '/images/YDL-BANNER.jpg',
        linkUrl: '/anniversary-sale',
        alt: '12 Years Jumia Anniversary Sale',
    },
    {
        id: 2,
        imageUrl: '/images/YDLBanner2.png',
        linkUrl: '/summer-collection',
        alt: 'Summer Collection Now Available',
    },
    {
        id: 3,
        imageUrl: '/images/banner.png',
        linkUrl: '/tech-deals',
        alt: 'Exclusive Tech Deals',
    },
];

export default function ShopBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const slideCount = banners.length;
    const autoPlayDelay = 5000;

    const goToSlide = useCallback(
        (index: number) => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrentSlide(index);
            setTimeout(() => setIsAnimating(false), 500); // Match transition duration
        },
        [isAnimating],
    );

    const goToNextSlide = useCallback(() => {
        const nextSlide = (currentSlide + 1) % slideCount;
        goToSlide(nextSlide);
    }, [currentSlide, goToSlide, slideCount]);

    const goToPrevSlide = useCallback(() => {
        const prevSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(prevSlide);
    }, [currentSlide, goToSlide, slideCount]);

    // Auto-advance slides
    useEffect(() => {
        if (isHovering) return;

        const timer = setTimeout(goToNextSlide, autoPlayDelay);
        return () => clearTimeout(timer);
    }, [currentSlide, isHovering, goToNextSlide]);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="relative overflow-hidden rounded-lg" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                {/* Slides container */}
                <div className="relative aspect-[21/9] sm:aspect-[16/9] lg:aspect-[21/9]">
                    {banners.map((banner, index) => (
                        <Link
                            key={banner.id}
                            href={banner.linkUrl}
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                                index === currentSlide
                                    ? 'z-10 translate-x-0 opacity-100'
                                    : index < currentSlide
                                      ? '-translate-x-full opacity-0'
                                      : 'translate-x-full opacity-0'
                            }`}
                        >
                            <div className="relative h-full w-full overflow-hidden">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.alt}
                                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105 sm:object-cover"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={goToPrevSlide}
                    disabled={isAnimating}
                    className={cn(
                        'absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full border p-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 sm:p-2.5',
                        'bg-white dark:bg-slate-700',
                        'border-gray-200 dark:border-slate-600',
                        'text-gray-600 dark:text-slate-300',
                        'hover:bg-gray-100 dark:hover:bg-slate-600',
                        'hover:border-gray-300 dark:hover:border-slate-500',
                    )}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                </button>

                <button
                    onClick={goToNextSlide}
                    disabled={isAnimating}
                    className={cn(
                        'absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full border p-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 sm:p-2.5',
                        'bg-white dark:bg-slate-700',
                        'border-gray-200 dark:border-slate-600',
                        'text-gray-600 dark:text-slate-300',
                        'hover:bg-gray-100 dark:hover:bg-slate-600',
                        'hover:border-gray-300 dark:hover:border-slate-500',
                    )}
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                </button>

                {/* Slide indicators */}
                <div className="absolute right-0 bottom-4 left-0 z-20 flex justify-center gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentSlide ? 'w-8 bg-orange-500' : 'w-2 bg-orange-300 hover:bg-orange-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
