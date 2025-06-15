'use client';
// ProductDetail.tsx
import SimilarProducts from '@/components/frontend/SimilarProducts'; // Assuming this path is correct
import { Button as ShadcnButton } from '@/components/ui/button'; // For consistency
import ShopFrontLayout from '@/layouts/shop-front-layout'; // Assuming this is for page layout
import { cn } from '@/lib/utils';
import { SimilarProduct } from '@/types/products'; // Assuming this type path is correct
import { Link } from '@inertiajs/react'; // Added for Inertia links
import { Check, ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Star } from 'lucide-react'; // Added more icons
import { useState } from 'react'; // Removed useRef as it wasn't used from original

// Updated Product interface for a phone shop
interface PhoneProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    brand: string; // Added brand
    shortDescription: string; // Shorter description for top area
    fullDescription: string; // Longer description
    features: string[];
    images: string[]; // Renamed from imgs for clarity
    colors: {
        name: string;
        hexValue: string; // e.g., '#FFFFFF'
        classValue?: string; // Optional: e.g., 'bg-slate-900' if hex isn't enough for complex colors
    }[];
    storageOptions: string[]; // Changed from sizes
    inStock: boolean;
    slug: string; // For generating links
}

// Mock data for a phone product
const phoneProductData: PhoneProduct = {
    id: 'ydl-phone-001',
    name: 'Galaxy Stellaris S25 Pro',
    brand: 'Samsung',
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.7,
    reviewCount: 312,
    shortDescription: 'Next-gen AI capabilities, stunning 200MP camera, and dynamic AMOLED 3X display.',
    fullDescription:
        'Experience the future with the Galaxy Stellaris S25 Pro. Powered by the latest Snapdragon Gen X processor, it delivers unparalleled performance and efficiency. The advanced AI enhances every interaction, from photography to productivity. Its pro-grade camera system captures breathtaking detail, while the vibrant display brings content to life. All-day battery and super-fast charging keep you connected.',
    features: [
        '6.8" Dynamic AMOLED 3X Display, 120Hz',
        'Snapdragon Gen X Processor',
        '200MP Wide, 50MP Telephoto, 12MP Ultrawide',
        '12GB RAM, AI Co-processor',
        '5000mAh Battery with 65W SuperFast Charging',
        'Integrated S-Pen Stylus',
        'Titanium Armor Frame',
    ],
    images: [
        // Replace with your actual product images or better Unsplash links
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Galaxy Fold like
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Generic smartphone
        'https://images.unsplash.com/photo-1603625954800-86f905630933?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Camera lens detail
        'https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Another smartphone
    ],
    colors: [
        { name: 'Phantom Black', hexValue: '#1C1C1C', classValue: 'bg-slate-900' },
        { name: 'Titanium Gray', hexValue: '#8D949A', classValue: 'bg-slate-500' },
        { name: 'Cosmic Blue', hexValue: '#3B5998', classValue: 'bg-blue-700' },
        { name: 'Aurora Green', hexValue: '#4CAF50', classValue: 'bg-green-600' },
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    inStock: true,
    slug: 'galaxy-stellaris-s25-pro',
};

// Sample Similar Products (Phones)
const sampleSimilarProducts: SimilarProduct[] = [
    {
        id: 'sim-001',
        name: 'iPhone Alpha Pro',
        price: 1099.0,
        rating: 4.9,
        reviewCount: 280,
        img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        slug: 'iphone-alpha-pro',
    },
    {
        id: 'sim-002',
        name: 'Pixel Nova X',
        price: 899.0,
        rating: 4.6,
        reviewCount: 150,
        img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        slug: 'pixel-nova-x',
    },
    {
        id: 'sim-003',
        name: 'OnePlus Voyager',
        price: 799.0,
        rating: 4.7,
        reviewCount: 190,
        img: 'https://images.unsplash.com/photo-1600090306850-847610161AA7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        slug: 'oneplus-voyager',
    },
    {
        id: 'sim-004',
        name: 'Xiaomi Dragon Max',
        price: 699.0,
        rating: 4.5,
        reviewCount: 220,
        img: 'https://images.unsplash.com/photo-1620282453069-4058dfaa16c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        slug: 'xiaomi-dragon-max',
    },
];

const ProductDetails = () => {
    const product = phoneProductData; // Use the phone-specific data
    const similarProductsData = sampleSimilarProducts; // Use phone-specific similar products

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedStorageIndex, setSelectedStorageIndex] = useState(0); // Changed from selectedSize
    const [quantity, setQuantity] = useState(1);

    // Theme classes
    const textColor = 'text-slate-700 dark:text-slate-300';
    const headingColor = 'text-slate-900 dark:text-slate-50';
    const subtleTextColor = 'text-slate-500 dark:text-slate-400';
    const borderColor = 'border-gray-200 dark:border-slate-700';
    const interactiveRingColor = 'ring-orange-500 dark:ring-orange-400';
    const interactiveBgColor = 'bg-orange-50 dark:bg-orange-900/30';
    const interactiveTextColor = 'text-orange-600 dark:text-orange-300';

    return (
        <ShopFrontLayout>
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {' '}
                <nav className={cn('mb-6 flex text-xs sm:text-sm', subtleTextColor)}>
                    <Link href="/" className="hover:text-orange-500 dark:hover:text-orange-400">
                        Home
                    </Link>
                    <ChevronRight className="mx-1.5 h-4 w-4 self-center" />
                    <Link href="/phones" className="hover:text-orange-500 dark:hover:text-orange-400">
                        {product.brand}
                    </Link>{' '}
                    {/* Dynamic brand */}
                    <ChevronRight className="mx-1.5 h-4 w-4 self-center" />
                    <span className={cn('font-medium', textColor)}>{product.name}</span>
                </nav>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4 sm:space-y-6">
                        <div className={cn('relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm dark:bg-slate-800', borderColor)}>
                            <img
                                src={product.images[selectedImageIndex]}
                                alt={product.name}
                                className="h-full w-full object-contain transition-all duration-300 hover:scale-105" // Changed to object-contain for product images
                            />
                        </div>
                        <div className="flex space-x-2 overflow-auto pb-2 sm:space-x-3">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={cn(
                                        'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md focus:outline-none sm:h-20 sm:w-20',
                                        borderColor,
                                        selectedImageIndex === index
                                            ? `ring-2 ring-offset-2 dark:ring-offset-slate-900 ${interactiveRingColor}`
                                            : 'hover:opacity-80',
                                    )}
                                >
                                    <img src={img} alt={`${product.name} - View ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 sm:space-y-5">
                        <div>
                            <h1 className={cn('text-2xl font-bold sm:text-3xl', headingColor)}>{product.name}</h1>
                            <div className={cn('mt-1.5 flex items-center', textColor)}>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                'h-4 w-4 sm:h-5 sm:w-5',
                                                i < Math.floor(product.rating)
                                                    ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300'
                                                    : 'text-gray-300 dark:text-slate-600',
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="ml-2 text-xs sm:text-sm">
                                    {product.rating} ({product.reviewCount} reviews)
                                </p>
                            </div>
                            <p className={cn('mt-2 text-sm leading-relaxed sm:text-base', textColor)}>{product.shortDescription}</p>
                        </div>

                        <div className={cn('border-y py-3 sm:py-4', borderColor)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={cn('text-2xl font-bold sm:text-3xl', headingColor)}>${product.price.toFixed(2)}</p>
                                    {product.originalPrice && (
                                        <p className={cn('text-sm line-through', subtleTextColor)}>${product.originalPrice.toFixed(2)}</p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={cn(
                                            `mr-1.5 h-2.5 w-2.5 rounded-full sm:mr-2`,
                                            product.inStock ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400',
                                        )}
                                    ></div>
                                    <p
                                        className={cn(
                                            `text-xs font-medium sm:text-sm`,
                                            product.inStock ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300',
                                        )}
                                    >
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <h3 className={cn('mb-1.5 text-sm font-medium sm:mb-2', headingColor)}>
                                    Color: <span className={cn('font-normal', textColor)}>{product.colors[selectedColorIndex].name}</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColorIndex(index)}
                                            className={cn(
                                                'relative h-8 w-8 rounded-full border-2 transition-all focus:outline-none',
                                                selectedColorIndex === index
                                                    ? `ring-2 ring-offset-2 dark:ring-offset-slate-900 ${interactiveRingColor} border-transparent`
                                                    : `${borderColor} hover:border-slate-400 dark:hover:border-slate-500`,
                                            )}
                                            title={color.name}
                                        >
                                            <span className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color.hexValue }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className={cn('mb-1.5 text-sm font-medium sm:mb-2', headingColor)}>
                                    Storage: <span className={cn('font-normal', textColor)}>{product.storageOptions[selectedStorageIndex]}</span>
                                </h3>{' '}
                                {/* Changed "Size" to "Storage" */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {product.storageOptions.map(
                                        (
                                            storage,
                                            index, // Changed from sizes to storageOptions
                                        ) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedStorageIndex(index)}
                                                className={cn(
                                                    'flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none sm:text-sm',
                                                    selectedStorageIndex === index
                                                        ? `${interactiveBgColor} ${interactiveTextColor} ${borderColor} border-opacity-50 ring-1 ${interactiveRingColor}`
                                                        : `${borderColor} ${textColor} hover:bg-gray-100 dark:hover:bg-slate-700`,
                                                )}
                                            >
                                                {storage}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className={cn('mb-1.5 text-sm font-medium sm:mb-2', headingColor)}>Quantity</h3>
                                <div className={cn('mt-2 flex w-28 items-center rounded-md border', borderColor)}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className={cn('rounded-l-md px-3 py-1.5 hover:bg-gray-100 sm:py-2 dark:hover:bg-slate-700', textColor)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className={cn('flex-1 text-center text-sm', textColor)}>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className={cn('rounded-r-md px-3 py-1.5 hover:bg-gray-100 sm:py-2 dark:hover:bg-slate-700', textColor)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 pt-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <ShadcnButton
                                size="lg"
                                className={cn(
                                    'flex-1 text-sm font-semibold',
                                    'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
                                    'h-12 text-base sm:h-11 sm:text-sm', // Bigger on mobile
                                )}
                            >
                                {/* Orange Button */}
                                <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add to Cart
                            </ShadcnButton>
                            <ShadcnButton
                                size="lg"
                                variant="outline"
                                className={cn(
                                    'flex-1 text-sm font-semibold',
                                    `border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-slate-900`,
                                    'h-12 text-base sm:h-11 sm:text-sm', // Bigger on mobile
                                )}
                            >
                                {/* Orange Outline Button */}
                                <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add to Wishlist
                            </ShadcnButton>
                            <ShadcnButton
                                variant="ghost"
                                size="icon"
                                className={cn('hidden sm:inline-flex', textColor, 'hover:bg-gray-100 dark:hover:bg-slate-700')}
                            >
                                <Share2 className="h-5 w-5" />
                            </ShadcnButton>
                        </div>

                        <div className={cn('mt-4 border-t pt-4', borderColor)}>
                            <h3 className={cn('mb-2 text-sm font-medium', headingColor)}>Product Description</h3>
                            <p className={cn('text-sm leading-relaxed', textColor)}>{product.fullDescription}</p>
                        </div>

                        <div>
                            <h3 className={cn('mb-2 text-sm font-medium', headingColor)}>Key Features</h3>
                            <ul className="space-y-1.5">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start text-sm">
                                        <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
                                        <span className={textColor}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <SimilarProducts similarProducts={similarProductsData} />
            </div>
        </ShopFrontLayout>
    );
};

export default ProductDetails;
