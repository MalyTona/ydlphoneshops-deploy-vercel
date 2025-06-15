'use client';

import { Button as ShadcnButton } from '@/components/ui/button'; // Renamed to avoid conflict
import { cn } from '@/lib/utils';
import { CategoryItemData } from '@/types/categories';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export default function ShopCategories({ categories }: { categories: CategoryItemData[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [visibleItems, setVisibleItems] = useState(6);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleItems(3);
            else if (window.innerWidth < 768) setVisibleItems(4);
            else if (window.innerWidth < 1024) setVisibleItems(5);
            else if (window.innerWidth < 1280) setVisibleItems(6);
            else setVisibleItems(8);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(categories.length / visibleItems);
    const maxIndex = totalPages > 0 ? totalPages - 1 : 0;

    const goToNext = useCallback(() => {
        if (sliding || totalPages <= 1) return;
        setSliding(true);
        setActiveIndex((current) => (current === maxIndex ? 0 : current + 1));
        setTimeout(() => setSliding(false), 500);
    }, [sliding, totalPages, maxIndex]);

    const goToPrev = useCallback(() => {
        if (sliding || totalPages <= 1) return;
        setSliding(true);
        setActiveIndex((current) => (current === 0 ? maxIndex : current - 1));
        setTimeout(() => setSliding(false), 500);
    }, [sliding, totalPages, maxIndex]);

    const goToPage = useCallback(
        (index: number) => {
            if (sliding || index === activeIndex || totalPages <= 1) return;
            setSliding(true);
            setActiveIndex(index);
            setTimeout(() => setSliding(false), 500);
        },
        [sliding, activeIndex, totalPages],
    );

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd || totalPages <= 1) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) goToNext();
        if (distance < -50) goToPrev();
        setTouchStart(0);
        setTouchEnd(0);
    };

    const getVisibleCategories = () => {
        if (categories.length === 0) return [];
        const startIdx = activeIndex * visibleItems;
        return categories.slice(startIdx, startIdx + visibleItems);
    };

    const visibleCategoriesToDisplay = getVisibleCategories();

    const titleColor = 'text-gray-800 dark:text-slate-100';
    const subtitleColor = 'text-gray-500 dark:text-slate-400';
    const buttonBg = 'bg-white dark:bg-slate-700';
    const buttonBorder = 'border-gray-200 dark:border-slate-600'; // Changed from amber to gray
    const buttonText = 'text-gray-600 dark:text-slate-300';
    const buttonHoverBg = 'hover:bg-gray-100 dark:hover:bg-slate-600'; // Changed from amber
    const buttonHoverBorder = 'hover:border-gray-300 dark:hover:border-slate-500'; // Changed from amber

    const categoryNameText = 'text-gray-700 dark:text-slate-200'; // Adjusted for general readability
    const categoryNameHoverText = 'group-hover:text-orange-600 dark:group-hover:text-orange-400';
    const categoryInnerBg = 'bg-white dark:bg-slate-700';

    const dotActiveBg = 'bg-orange-500 dark:bg-orange-400'; // Kept orange accent
    const dotInactiveBg = 'bg-gray-300 dark:bg-slate-600';
    const dotInactiveHoverBg = 'hover:bg-gray-400 dark:hover:bg-slate-500';

    const viewAllButtonBg = 'bg-white dark:bg-slate-700';
    const viewAllButtonBorder = 'border-gray-300 dark:border-slate-600'; // Changed from amber
    const viewAllButtonText = 'text-orange-600 dark:text-orange-400';
    const viewAllButtonHoverBg = 'hover:bg-gray-100 dark:hover:bg-slate-600';
    const viewAllButtonHoverText = 'hover:text-orange-700 dark:hover:text-orange-300';

    return (
        <div className="mx-auto w-full max-w-7xl px-4">
            {' '}
            <div className={cn('mb-8 flex items-center justify-between transition-opacity duration-1000', isVisible ? 'opacity-100' : 'opacity-0')}>
                <div>
                    <div className="flex items-center">
                        <div className={cn('mr-3 h-8 w-1.5 rounded-full bg-orange-500 dark:bg-orange-400')}></div>
                        <h2 className={cn('text-xl font-bold md:text-2xl', titleColor)}>Shop by Category</h2>
                    </div>
                    <p className={cn('mt-1 ml-4 text-sm', subtitleColor)}>Explore our YDL PhoneShop collections</p>
                </div>

                {totalPages > 1 && (
                    <div className="flex w-full justify-end space-x-2 sm:space-x-3">
                        {' '}
                        {/* Moved nav buttons to right if title is removed from here */}
                        <button
                            onClick={goToPrev}
                            disabled={sliding}
                            className={cn(
                                'rounded-full border bg-orange-500 p-2 shadow-sm transition-all hover:scale-105 active:scale-95 sm:p-2.5',
                                buttonBg,
                                buttonBorder,
                                buttonText,
                                buttonHoverBg,
                                buttonHoverBorder,
                            )}
                            aria-label="Previous categories"
                        >
                            <ChevronLeft className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={sliding}
                            className={cn(
                                'rounded-full border p-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 sm:p-2.5',
                                buttonBg,
                                buttonBorder,
                                buttonText,
                                buttonHoverBg,
                                buttonHoverBorder,
                            )}
                            aria-label="Next categories"
                        >
                            <ChevronRight className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                )}
            </div>
            <div className="relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div
                    className={cn('flex transition-transform duration-500 ease-in-out', isVisible ? 'opacity-100' : 'opacity-0')}
                    style={{ transform: `translateX(0%)`, width: '100%', transitionDelay: '0.2s' }}
                >
                    <div className={cn('grid w-full grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-5 lg:grid-cols-6 xl:grid-cols-8')}>
                        {visibleCategoriesToDisplay.map((category, idx) => (
                            <Link
                                key={category.id}
                                className="group flex flex-col items-center rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400" // Added padding for focus ring
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                style={{ transition: 'all 0.5s ease', transitionDelay: `${idx * 0.05}s` }}
                                href={''}
                            >
                                <div
                                    className={cn(
                                        'aspect-square w-full transform overflow-hidden rounded-full p-1 transition-all duration-300 sm:p-1.5',
                                        category.color,
                                        hoveredCategory === category.id
                                            ? 'ring-opacity-50 scale-105 shadow-md ring-2 ring-amber-300 dark:ring-orange-500'
                                            : 'shadow-sm',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'relative flex h-full w-full items-center justify-center overflow-hidden rounded-full',
                                            categoryInnerBg,
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/10 dark:to-black/20"></div>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 text-center sm:mt-3">
                                    <h3
                                        className={cn(
                                            'line-clamp-2 text-xs font-medium transition-colors sm:text-sm',
                                            categoryNameText,
                                            categoryNameHoverText,
                                        )}
                                    >
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2 sm:space-x-3">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={cn(
                                `h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-orange-400 dark:focus-visible:ring-offset-current`, // Ensure offset works on current bg
                                activeIndex === index
                                    ? cn('w-8 sm:w-10', dotActiveBg, 'shadow-sm')
                                    : cn('w-2 sm:w-2.5', dotInactiveBg, dotInactiveHoverBg),
                            )}
                            aria-label={`Go to page ${index + 1}`}
                            aria-current={activeIndex === index}
                        />
                    ))}
                </div>
            )}
            <div
                className={cn('mt-8 flex justify-center transition-opacity duration-1000', isVisible ? 'opacity-100' : 'opacity-0')}
                style={{ transitionDelay: '0.4s' }}
            >
                <ShadcnButton
                    asChild
                    variant="outline"
                    className={cn(
                        'inline-flex items-center rounded-full px-5 py-2 text-sm shadow-sm transition-all hover:scale-105 hover:shadow active:scale-95 sm:px-6 sm:py-2.5 sm:text-base',
                        viewAllButtonBg,
                        viewAllButtonBorder,
                        viewAllButtonText,
                        viewAllButtonHoverBg,
                        viewAllButtonHoverText,
                    )}
                >
                    <Link href="/categories">
                        {' '}
                        View All Categories <ChevronRight className="ml-1.5 h-4 w-4 text-orange-500" />
                    </Link>
                </ShadcnButton>
            </div>
        </div>
    );
}
