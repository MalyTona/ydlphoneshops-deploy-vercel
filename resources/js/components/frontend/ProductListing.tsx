'use client';
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart, Tag } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'; // Added useCallback
// NOTE: For links to work in your Inertia project, you'd typically use:
import { Link } from '@inertiajs/react';
// And for consistent button styling, you might use:
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// For now, I am keeping your existing HTML buttons and a tags as per "only remove bg"

// Product type definition
type Product = {
    id: string;
    name: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    description: string;
    image: string;
    category: string;
    rating: number;
    isNew?: boolean;
    favorite?: boolean;
    inCart?: boolean;
    stock: number;
};

// Sample product data with Unsplash images
const sampleProducts: Product[] = [
    {
        id: '1',
        name: 'Italian Leather Crossbody Bag',
        originalPrice: 249.99,
        discountPrice: 189.99,
        discountPercentage: 24,
        description: 'Handcrafted in Florence with premium full-grain leather',
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        rating: 4.9,
        isNew: true,
        stock: 15,
    },
    {
        id: '2',
        name: 'Automatic Chronograph Watch',
        originalPrice: 599.99,
        discountPrice: 449.99,
        discountPercentage: 25,
        description: 'Swiss-made movement with sapphire crystal and exhibition caseback',
        image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Watches',
        rating: 4.8,
        stock: 8,
    },
    {
        id: '3',
        name: 'Premium Wireless Earbuds',
        originalPrice: 199.99,
        discountPrice: 149.99,
        discountPercentage: 25,
        description: 'Active noise cancellation with 30-hour battery life',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        rating: 4.7,
        stock: 22,
    },
    {
        id: '4',
        name: 'Pure Cashmere Sweater',
        originalPrice: 299.99,
        discountPrice: 199.99,
        discountPercentage: 33,
        description: 'Ultra-soft, sustainably sourced cashmere in a relaxed fit',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Clothing',
        rating: 4.6,
        stock: 10,
    },
    {
        id: '5',
        name: 'Smart Home Security Camera',
        originalPrice: 179.99,
        discountPrice: 129.99,
        discountPercentage: 28,
        description: '4K resolution with night vision and two-way audio',
        image: 'https://images.unsplash.com/photo-1580745294621-2914fd8fee67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        rating: 4.5,
        isNew: true,
        stock: 18,
    },
    {
        id: '6',
        name: 'Artisanal Ceramic Pour-Over Set',
        originalPrice: 89.99,
        discountPrice: 64.99,
        discountPercentage: 28,
        description: 'Hand-thrown ceramic pour-over coffee dripper with matching cup',
        image: 'https://images.unsplash.com/photo-1516543647435-f8c78a45081f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Home & Kitchen',
        rating: 4.7,
        stock: 12,
    },
    {
        id: '7',
        name: 'Designer Sunglasses',
        originalPrice: 159.99,
        discountPrice: 99.99,
        discountPercentage: 38,
        description: 'Polarized lenses with premium acetate frames',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        rating: 4.8,
        stock: 9,
    },
    {
        id: '8',
        name: 'Luxury Scented Candle',
        originalPrice: 69.99,
        discountPrice: 49.99,
        discountPercentage: 29,
        description: 'Hand-poured soy wax with essential oils, 60-hour burn time',
        image: 'https://images.unsplash.com/photo-1602178141046-c9fe5b7eade4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        category: 'Home & Decor',
        rating: 4.6,
        stock: 20,
    },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-amber-400 dark:text-amber-300' : i < rating ? 'text-amber-400 dark:text-amber-300' : 'text-gray-300 dark:text-slate-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-xs text-gray-600 dark:text-slate-400">{rating.toFixed(1)}</span>
        </div>
    );
};

const ProductCard: React.FC<{
    product: Product;
    onFavoriteToggle: (id: string) => void;
    onAddToCart: (id: string) => void;
}> = ({ product, onFavoriteToggle, onAddToCart }) => {
    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-slate-800 dark:shadow-black/20">
            <div className="relative w-full overflow-hidden bg-gray-50 pb-[100%] dark:bg-slate-700">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.discountPercentage > 0 && (
                        <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm dark:bg-red-600">
                            {product.discountPercentage}% OFF
                        </span>
                    )}
                    {product.isNew && (
                        <span className="rounded-lg bg-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-sm dark:bg-emerald-600">NEW</span>
                    )}
                    {product.stock <= 10 && product.stock > 0 && (
                        <span className="rounded-lg bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-sm dark:bg-amber-600">
                            Only {product.stock} left
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="rounded-md bg-slate-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm dark:bg-slate-500">
                            SOLD OUT
                        </span>
                    )}
                </div>
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={() => onFavoriteToggle(product.id)}
                        className="bg-opacity-90 hover:bg-opacity-100 mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 dark:bg-slate-700/80 dark:text-slate-200 dark:hover:bg-slate-600"
                        aria-label="Add to favorites"
                    >
                        <Heart
                            size={16}
                            className={cn(
                                product.favorite
                                    ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
                                    : 'text-gray-700 dark:text-slate-300',
                            )}
                        />
                    </button>
                </div>
                <div className="bg-opacity-0 group-hover:bg-opacity-20 dark:group-hover:bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex translate-y-4 transform gap-2 transition-transform duration-300 group-hover:translate-y-0">
                        <Link
                            href="/detail"
                            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-100 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-300"
                        >
                            <Eye size={16} />
                            <span>Quick View</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-grow flex-col p-4">
                <div className="mb-1">
                    <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">{product.category}</span>
                    <h3 className="mt-1 line-clamp-1 text-sm font-medium text-gray-900 group-hover:text-orange-600 dark:text-slate-100 dark:group-hover:text-orange-400">
                        {product.name}
                    </h3>
                </div>
                <div className="mt-1 mb-3">
                    <StarRating rating={product.rating} />
                </div>
                <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-slate-400">{product.description}</p>
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3 dark:border-slate-700">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through dark:text-slate-500">${product.originalPrice.toFixed(2)}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">${product.discountPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className={cn(
                            `flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium shadow-sm transition-all duration-200`,
                            product.stock === 0
                                ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-400'
                                : product.inCart
                                  ? 'border border-green-300 bg-green-50 text-green-600 dark:border-green-600 dark:bg-green-700/30 dark:text-green-300'
                                  : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
                        )}
                    >
                        <ShoppingCart size={16} />
                        <span>{product.stock === 0 ? 'Out' : product.inCart ? 'Added' : 'Add'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ProductListing() {
    // Kept original export name
    const [products, setProducts] = useState<Product[]>(sampleProducts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(4);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setVisibleProducts(4);
            } else if (window.innerWidth >= 1024) {
                setVisibleProducts(3);
            } else if (window.innerWidth >= 768) {
                setVisibleProducts(2);
            } else {
                setVisibleProducts(1);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = products.length > 0 ? Math.max(0, products.length - visibleProducts) : 0;

    const goToNext = useCallback(() => {
        if (products.length <= visibleProducts) return;
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex, products.length, visibleProducts]);

    const goToPrev = useCallback(() => {
        if (products.length <= visibleProducts) return;
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex, products.length, visibleProducts]);

    useEffect(() => {
        if (products.length <= visibleProducts) return;
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [goToNext, products.length, visibleProducts]);

    const toggleFavorite = (id: string) =>
        setProducts((currentProducts) => currentProducts.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)));
    const addToCart = (id: string) =>
        setProducts((currentProducts) =>
            currentProducts.map((p) =>
                p.id === id ? { ...p, inCart: !p.inCart, stock: p.inCart ? p.stock + 1 : p.stock > 0 ? p.stock - 1 : 0 } : p,
            ),
        );

    // Theme classes for elements within this component
    const titleText = 'text-gray-900 dark:text-slate-100';
    const subtitleText = 'text-gray-500 dark:text-slate-400';
    const badgeBg = 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
    const sectionTitleAccent = 'text-orange-500 dark:text-orange-400';
    const sectionTitleLine = 'bg-orange-500 dark:bg-orange-400';
    const buttonBg = 'bg-white dark:bg-slate-700';
    const buttonBorder = 'border-gray-200 dark:border-slate-600';
    const buttonText = 'text-gray-600 dark:text-slate-300';
    const buttonHoverBg = 'hover:bg-gray-100 dark:hover:bg-slate-600';
    const buttonHoverBorder = 'hover:border-gray-300 dark:hover:border-slate-500';
    const dotInactiveBg = 'bg-gray-300 dark:bg-slate-600';
    const dotActiveBg = 'bg-orange-500 dark:bg-orange-400';
    const viewAllButtonBase = 'rounded-lg border-2 font-medium transition-colors duration-300';
    const viewAllButtonLight = 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white';
    const viewAllButtonDark = 'dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-slate-900';

    if (!products || products.length === 0) {
        return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">Loading products...</div>;
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <div className={cn('mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide', badgeBg)}>YDL PICKS</div>
                    <h2 className={cn('flex items-center gap-2 text-3xl font-bold', titleText)}>
                        <Tag className={cn(sectionTitleAccent)} size={24} />
                        <span className="relative">
                            Featured Products
                            <span className={cn('absolute right-0 -bottom-2 left-0 h-1 rounded-full', sectionTitleLine)}></span>
                        </span>
                    </h2>
                    <p className={cn('mt-2', subtitleText)}>Exclusive deals on premium products. Limited time only.</p>
                </div>
                {products.length > visibleProducts && (
                    <div className="flex space-x-3">
                        <button
                            onClick={goToPrev}
                            className={cn(
                                'rounded-full border p-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 sm:p-2.5',
                                buttonBg,
                                buttonBorder,
                                buttonText,
                                buttonHoverBg,
                                buttonHoverBorder,
                            )}
                            aria-label="Previous products"
                        >
                            <ChevronLeft className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                        <button
                            onClick={goToNext}
                            className={cn(
                                'rounded-full border p-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 sm:p-2.5',
                                buttonBg,
                                buttonBorder,
                                buttonText,
                                buttonHoverBg,
                                buttonHoverBorder,
                            )}
                            aria-label="Next products"
                        >
                            <ChevronRight className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                )}
            </div>
            <div className="relative overflow-hidden" ref={carouselRef}>
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)` }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3 xl:w-1/4"
                            style={{ width: `${100 / visibleProducts}%` }}
                        >
                            <ProductCard product={product} onFavoriteToggle={toggleFavorite} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>
            {products.length > visibleProducts && (
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: Math.max(0, products.length - visibleProducts + 1) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={cn(
                                `h-2 w-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-orange-400 dark:focus-visible:ring-offset-current`,
                                i === currentIndex ? cn('w-6', dotActiveBg) : cn(dotInactiveBg, 'hover:bg-gray-400 dark:hover:bg-slate-500'),
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
            <div className="mt-8 flex justify-center">
                <ShadcnButton
                    asChild
                    variant="outline"
                    className={cn(
                        'rounded-full border px-6 py-2.5 font-medium shadow-sm transition-all duration-300 hover:scale-105 active:scale-95',
                        'border-gray-200 bg-white text-orange-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow',
                        'dark:border-gray-700 dark:bg-gray-800 dark:text-orange-400 dark:hover:border-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-300',
                    )}
                >
                    <Link href="/products" className="inline-flex items-center">
                        <span>View All Sales</span>
                        <ChevronRight className="ml-1 h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </Link>
                </ShadcnButton>
            </div>
        </div>
    );
}
