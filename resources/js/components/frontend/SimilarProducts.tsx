// src/components/frontend/SimilarProducts.tsx
'use client';

import { cn } from '@/lib/utils'; // For classname utility
import { SimilarProduct } from '@/types/products'; // Assuming this type path is correct
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SimilarProducts({ similarProducts }: { similarProducts: SimilarProduct[] }) {
    // Theme classes for this component
    const titleColor = 'text-gray-900 dark:text-slate-100';

    const navButtonBg = 'bg-white dark:bg-slate-700';
    const navButtonBorder = 'border-gray-300 dark:border-slate-600';
    const navButtonIconColor = 'text-gray-500 dark:text-slate-400';
    const navButtonHoverBg = 'hover:bg-gray-100 dark:hover:bg-slate-600';

    const cardImageBg = 'bg-gray-100 dark:bg-slate-700';
    const cardTextColor = 'text-gray-900 dark:text-slate-100';

    // Note: The prev/next buttons currently don't have carousel functionality.
    // This implementation only styles them. You'd need to add state and logic for a carousel.

    if (!similarProducts || similarProducts.length === 0) {
        return null; // Don't render anything if there are no similar products
    }

    return (
        <div className="mt-12 md:mt-16">
            {' '}
            {/* Increased top margin slightly */}
            <div className="mb-6 flex items-center justify-between md:mb-8">
                <h2 className={cn('text-xl font-bold sm:text-2xl', titleColor)}>You Might Also Like</h2> {/* Changed title slightly */}
                {/* Prev/Next buttons - styled but not functional as a carousel yet */}
                {similarProducts.length > 4 && ( // Show buttons only if there are enough items to potentially scroll (example logic)
                    <div className="flex space-x-2 sm:space-x-3">
                        <button
                            className={cn(
                                'rounded-full border p-2 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none sm:p-2.5 dark:focus:ring-orange-400 dark:focus:ring-offset-slate-900',
                                navButtonBg,
                                navButtonBorder,
                                navButtonHoverBg,
                            )}
                            aria-label="Previous similar products"
                        >
                            <ChevronLeft className={cn('h-4 w-4 sm:h-5 sm:w-5', navButtonIconColor)} />
                        </button>
                        <button
                            className={cn(
                                'rounded-full border p-2 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none sm:p-2.5 dark:focus:ring-orange-400 dark:focus:ring-offset-slate-900',
                                navButtonBg,
                                navButtonBorder,
                                navButtonHoverBg,
                            )}
                            aria-label="Next similar products"
                        >
                            <ChevronRight className={cn('h-4 w-4 sm:h-5 sm:w-5', navButtonIconColor)} />
                        </button>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
                {' '}
                {/* Adjusted grid for 2 columns on small screens */}
                {similarProducts.slice(0, 4).map(
                    (
                        product, // Displaying up to 4 products for now
                    ) => (
                        <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                            <div className={cn('aspect-square w-full overflow-hidden rounded-lg shadow-sm', cardImageBg)}>
                                <img
                                    // Assuming product.img is a string like 'image-name.jpg' and needs /storage/ prefix
                                    // If product.img is already a full URL, you can use it directly.
                                    // If product.img is an array, it should be product.img[0]
                                    src={product.img.startsWith('http') ? product.img : `/storage/${product.img}`}
                                    alt={product.name}
                                    // width={500} // For <img>, width/height props are for intrinsic size, styling handles display size
                                    // height={500}
                                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-3 sm:mt-4">
                                <h3
                                    className={cn(
                                        'line-clamp-2 text-sm font-medium group-hover:text-orange-600 sm:text-base dark:group-hover:text-orange-400',
                                        cardTextColor,
                                    )}
                                >
                                    {product.name}
                                </h3>
                                {/* Price is displayed as number in your type, formatting to currency */}
                                <p className={cn('mt-1 text-sm font-semibold', cardTextColor)}>${product.price.toFixed(2)}</p>
                                {/* Optional: Add star rating here if available in SimilarProduct type */}
                                {/* {product.rating && <StarRating rating={product.rating} />} */}
                            </div>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}
