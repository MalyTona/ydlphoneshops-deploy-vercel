import { CategoryItem } from '@/types/categories';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function ShopCategories({ categories }: { categories: CategoryItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [visibleItems, setVisibleItems] = useState(6);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Calculate visible items based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(3);
            } else if (window.innerWidth < 768) {
                setVisibleItems(4);
            } else if (window.innerWidth < 1024) {
                setVisibleItems(5);
            } else if (window.innerWidth < 1280) {
                setVisibleItems(6);
            } else {
                setVisibleItems(8);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate maximum pages
    const totalPages = Math.ceil(categories.length / visibleItems);
    const maxIndex = totalPages - 1;

    // Navigation functions
    const goToNext = () => {
        if (sliding) return;
        setSliding(true);
        setActiveIndex((current) => (current === maxIndex ? 0 : current + 1));
        setTimeout(() => setSliding(false), 500);
    };

    const goToPrev = () => {
        if (sliding) return;
        setSliding(true);
        setActiveIndex((current) => (current === 0 ? maxIndex : current - 1));
        setTimeout(() => setSliding(false), 500);
    };

    const goToPage = (index: number) => {
        if (sliding || index === activeIndex) return;
        setSliding(true);
        setActiveIndex(index);
        setTimeout(() => setSliding(false), 500);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrev();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    // Calculate visible categories based on active index
    const visibleCategories = () => {
        const startIdx = activeIndex * visibleItems;
        return categories.slice(startIdx, startIdx + visibleItems);
    };

    return (
        <div className="relative w-full px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className={`mb-8 flex items-center justify-between transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                        <div className="flex items-center">
                            <div className="mr-3 h-8 w-1.5 rounded-full bg-orange-500"></div>
                            <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">Shop by Category</h2>
                        </div>
                        <p className="mt-1 ml-4 text-sm text-gray-600 dark:text-gray-400">Explore our premium collections</p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={goToPrev}
                            disabled={sliding}
                            className="rounded-full border border-orange-500 bg-white p-2.5 text-gray-600 shadow-sm transition-all hover:scale-105 hover:border-orange-300 hover:bg-orange-50 active:scale-95 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
                            aria-label="Previous categories"
                        >
                            <ChevronLeft className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={sliding}
                            className="rounded-full border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-all hover:scale-105 hover:border-orange-300 hover:bg-orange-50 active:scale-95 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
                            aria-label="Next categories"
                        >
                            <ChevronRight className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>

                {/* Categories Carousel */}
                <div
                    ref={carouselRef}
                    className="relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={`flex transition-transform duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            transform: `translateX(0%)`,
                            width: '100%',
                            transitionDelay: '0.2s',
                        }}
                    >
                        <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 md:gap-6 lg:grid-cols-6 xl:grid-cols-8">
                            {visibleCategories().map((category, idx) => {
                                const imagePath = category.image.startsWith('categories/') ? `/storage/${category.image}` : category.image;
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="group flex flex-col items-center"
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        style={{
                                            transition: 'all 0.5s ease',
                                            transitionDelay: `${idx * 0.05}s`,
                                        }}
                                    >
                                        <div
                                            className={`aspect-square w-full overflow-hidden rounded-full ${category.color} p-1.5 dark:bg-gray-700 ${
                                                hoveredCategory === category.id
                                                    ? 'ring-opacity-50 shadow-md ring-2 ring-orange-400 dark:ring-orange-500'
                                                    : 'shadow-sm'
                                            } transform transition-all duration-300 ${hoveredCategory === category.id ? 'scale-105' : ''}`}
                                        >
                                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-800">
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/10 dark:from-black/0 dark:via-black/0 dark:to-white/10"></div>
                                                <img
                                                    src={imagePath}
                                                    alt={category.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <h3 className="line-clamp-2 text-xs font-medium text-gray-800 transition-colors group-hover:text-orange-600 sm:text-sm dark:text-gray-200 dark:group-hover:text-orange-400">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Enhanced Dot Navigation */}
                <div className="mt-8 flex items-center justify-center space-x-3">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                activeIndex === index
                                    ? 'w-10 bg-gradient-to-r from-orange-400 to-orange-500 shadow-sm'
                                    : 'w-2.5 bg-gray-300 hover:bg-orange-300 dark:bg-gray-600 dark:hover:bg-orange-700'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                            aria-current={activeIndex === index ? 'true' : 'false'}
                        />
                    ))}
                </div>

                {/* View All Categories Button */}
                <div
                    className={`mt-8 flex justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: '0.4s' }}
                >
                    <a
                        href="/categories"
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-orange-600 shadow-sm transition-all hover:scale-105 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-orange-400 dark:hover:border-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
                    >
                        <span className="font-medium">View All Categories</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
