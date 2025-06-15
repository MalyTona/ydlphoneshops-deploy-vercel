'use client';

import { ChevronDown, Facebook, Menu as MenuIcon, Minus, Phone, Plus, Search, Send, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ModeToggle } from '../mode-toggle';

const initialCartItems = [
    { id: 1, name: 'Premium Noise-Cancelling Headphones', price: 299.99, quantity: 1, image: '/placeholder.svg?height=80&width=80' },
    { id: 2, name: 'Smart Watch Ultra Series', price: 429.99, quantity: 1, image: '/placeholder.svg?height=80&width=80' },
];

const yourPhoneShopNavLinks = [
    { href: '/new-phones', label: 'New Phones' },
    { href: '/used-phones', label: 'Used Phones' },
    { href: '/repairs', label: 'Repair Service' },
    { href: '/accessories', label: 'Accessories' },
];

const searchDropdownCategories = ['All', 'Smartphones', 'Accessories', 'Repairs'];

export default function ShopHeader() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchMobileOpen, setSearchMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const updateQuantity = (id: number, increment: boolean) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) } : item,
            ),
        );
    };
    const removeItem = (id: number) => {
        setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
    };
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotalDisplay = `$${calculateTotal().toFixed(2)}`;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (searchMobileOpen) setSearchMobileOpen(false);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }
        };
        document.body.style.overflow = isMobileMenuOpen || searchMobileOpen ? 'hidden' : 'auto';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchMobileOpen, isMobileMenuOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            // Replace with your Inertia search logic
            setSearchMobileOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    // Theme classes
    const topBarBg = 'bg-gray-100 dark:bg-slate-800';
    const topBarText = 'text-gray-700 dark:text-slate-300';

    const mainNavWrapperBg = 'bg-white dark:bg-slate-900';
    const mainNavBorder = 'border-gray-200 dark:border-slate-700';
    const mainNavTextGeneral = 'text-slate-700 dark:text-slate-200';
    const logoTextColor = 'text-slate-900 dark:text-white';

    // **FIXED HERE** Changed dark:bg-slate-850 to dark:bg-slate-800 (or another valid dark shade)
    const categoryNavBg = 'bg-white dark:bg-slate-800';
    const categoryNavBorder = 'border-gray-200 dark:border-slate-700';
    const categoryNavTextGeneral = 'text-gray-700 dark:text-slate-300';
    const categoryNavLinkHover = 'hover:text-orange-600 dark:hover:text-orange-400';
    const categoryNavLinkLineColor = 'bg-orange-500 dark:bg-orange-400';

    return (
        <header className={cn('sticky top-0 z-50 w-full', mainNavWrapperBg, isScrolled && 'shadow-lg')}>
            {/* 1. Your Top Contact Bar */}
            <div className={cn('py-2 text-sm font-medium', topBarBg, topBarText)}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between gap-1 sm:flex-row sm:gap-4">
                        <div className="flex items-center">
                            <Phone className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-center text-xs sm:text-left">Tel: 071 600 8881 / 071 222 7781 / 096 684 4498</span>
                        </div>
                        <div className="flex items-center text-xs">
                            <a
                                href="https://web.facebook.com/love.cambodia.9440234"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center transition-opacity hover:opacity-75"
                            >
                                <Facebook className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                <span>យ៉ត ដាឡែន</span>
                            </a>
                            <a
                                href="https://t.me/Yoth_Dalen"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center transition-opacity hover:opacity-75"
                            >
                                <Send className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                <span>យ៉ត ដាឡែន</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Navigation Bar */}
            <nav className={cn('w-full transition-shadow duration-300', isScrolled && 'shadow-md')}>
                <div className={cn('border-b', mainNavBorder)}>
                    <div
                        className={cn(
                            'container mx-auto flex items-center justify-between px-4 transition-all duration-300',
                            isScrolled ? 'py-2' : 'py-3',
                        )}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn('hover:bg-gray-100 md:hidden dark:hover:bg-slate-700', mainNavTextGeneral)}
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <MenuIcon className="h-5 w-5" />
                        </Button>

                        <Link href="/" className="group flex flex-1 items-center md:flex-none" aria-label="YDL Phone Shop Home">
                            <div className="flex h-8 items-center">
                                <img src="/images/ydllogo.png" alt="YDL Logo" className="h-full w-auto" />
                            </div>
                            <span className={cn('ml-2 hidden text-xl font-bold sm:inline', logoTextColor)}>YDL PhoneShop</span>
                        </Link>

                        <div className="mx-6 hidden max-w-xl flex-1 md:flex">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex w-full overflow-hidden rounded-md border border-gray-300 dark:border-slate-600"
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex h-10 items-center rounded-r-none border-r border-gray-300 bg-gray-50 px-4 text-gray-700 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                        >
                                            All <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[200px] border-gray-200 bg-white dark:border-slate-600 dark:bg-slate-700"
                                    >
                                        {searchDropdownCategories.map((category) => (
                                            <DropdownMenuItem
                                                key={category}
                                                className="text-slate-700 hover:!bg-slate-100 dark:text-slate-200 dark:hover:!bg-slate-600"
                                            >
                                                {category}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="relative flex-1">
                                    <Input
                                        placeholder="I'm shopping for..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 rounded-none border-0 bg-white text-slate-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                                    />
                                    <Button
                                        type="submit"
                                        className="absolute top-0 right-0 h-full rounded-l-none bg-orange-500 px-3 transition-colors hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                                        aria-label="Search"
                                    >
                                        <Search className="h-4 w-4 text-white" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <ModeToggle />

                            <Link
                                href={route('login')}
                                className={cn('group relative flex cursor-pointer items-center p-1', mainNavTextGeneral)}
                                aria-label="My account"
                                method="get"
                            >
                                <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                                <div className="ml-2 hidden flex-col items-start lg:flex">
                                    <span className="text-xs text-gray-500 dark:text-slate-400">Login</span>
                                    <span className="text-xs font-medium">My Account</span>
                                </div>
                            </Link>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn('group relative flex h-auto items-center p-1', mainNavTextGeneral)}
                                        aria-label="Shopping cart"
                                    >
                                        <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] leading-tight text-white">
                                                {cartCount}
                                            </span>
                                        )}
                                        <span className="ml-2 hidden text-xs font-medium lg:block">{cartTotalDisplay}</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="flex w-full max-w-md flex-col bg-white p-0 dark:bg-slate-950">
                                    <SheetHeader className="border-b p-4 dark:border-slate-800">
                                        <SheetTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                                            Your Cart ({cartCount} items)
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-auto px-4 py-6">
                                        {cartItems.length === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                                                <ShoppingCart className="mb-4 h-16 w-16 text-gray-300 dark:text-slate-600" />
                                                <p className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-200">Your cart is empty</p>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                                    Looks like you haven't added anything yet.
                                                </p>
                                                <SheetClose asChild>
                                                    <Button asChild className="mt-6 bg-orange-500 text-white hover:bg-orange-600">
                                                        <Link href="/">Continue Shopping</Link>
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        ) : (
                                            <div className="grid gap-6">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="grid grid-cols-[80px_1fr] items-start gap-4">
                                                        <div className="aspect-square overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                                                            <img
                                                                src={item.image || '/placeholder.svg'}
                                                                alt={item.name}
                                                                width={80}
                                                                height={80}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <div className="flex items-start justify-between">
                                                                <h3 className="text-sm leading-tight font-medium text-slate-900 dark:text-slate-100">
                                                                    {item.name}
                                                                </h3>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="-mt-1 -mr-1 h-7 w-7 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                                    onClick={() => removeItem(item.id)}
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">Remove</span>
                                                                </Button>
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">${item.price.toFixed(2)}</p>
                                                            <div className="mt-1 flex items-center gap-2">
                                                                <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-700">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                                        onClick={() => updateQuantity(item.id, false)}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                        <span className="sr-only">Decrease</span>
                                                                    </Button>
                                                                    <span className="w-7 text-center text-xs font-medium text-slate-900 dark:text-slate-100">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                                        onClick={() => updateQuantity(item.id, true)}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                        <span className="sr-only">Increase</span>
                                                                    </Button>
                                                                </div>
                                                                <div className="ml-auto text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {cartItems.length > 0 && (
                                        <SheetFooter className="border-t p-4 dark:border-slate-800">
                                            <div className="w-full space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        ${calculateTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Shipping</span>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">Calculated at checkout</span>
                                                </div>
                                                <div className="flex items-center justify-between border-t pt-3 text-base dark:border-slate-700">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">Total</span>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        ${calculateTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="grid gap-2 pt-2">
                                                    <Button
                                                        asChild
                                                        className="w-full bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                                                    >
                                                        <Link href="/checkout">Proceed to Checkout</Link>
                                                    </Button>
                                                    <SheetClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                        >
                                                            Continue Shopping
                                                        </Button>
                                                    </SheetClose>
                                                </div>
                                            </div>
                                        </SheetFooter>
                                    )}
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* 3. Category Links Bar */}
                <div
                    className={cn(
                        'border-b px-4 py-2 transition-all duration-300',
                        categoryNavBg,
                        categoryNavBorder,
                        isScrolled ? 'hidden md:hidden' : 'block',
                    )}
                >
                    <div className="container mx-auto">
                        <div className="relative mb-1 w-full md:hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'flex w-full justify-start rounded-md border-gray-300 py-1.5 pr-4 pl-3 text-gray-600 hover:bg-gray-100 hover:text-black dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                                    'bg-white dark:bg-slate-700' /* Explicit BG for this button */,
                                )}
                                onClick={() => setSearchMobileOpen(true)}
                            >
                                <Search className="mr-2 h-4 w-4" /> <span className="text-sm">Search products...</span>
                            </Button>
                        </div>
                        <div className="hidden items-center justify-center md:flex md:justify-between">
                            <div className="flex items-center space-x-6 lg:space-x-8">
                                {yourPhoneShopNavLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'group relative py-1 text-sm font-medium transition-colors',
                                            categoryNavTextGeneral,
                                            categoryNavLinkHover,
                                        )}
                                    >
                                        {link.label}
                                        <span
                                            className={cn(
                                                'absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full',
                                                categoryNavLinkLineColor,
                                            )}
                                        ></span>
                                    </Link>
                                ))}
                            </div>
                            <div className={cn('hidden text-xs lg:block', categoryNavTextGeneral)}>
                                <span>មានទទួល ជួសជុលទូរសព្ទ ដោះកូដដៃ បុកប្រូក្រាម អ៊ុតកញ្ចក់ថាច់.ល. 071 600 8881</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile search overlay */}
            {searchMobileOpen && (
                <div
                    className="animate-in fade-in-0 fixed inset-0 z-[60] bg-black/40 md:hidden dark:bg-black/60"
                    onClick={() => setSearchMobileOpen(false)}
                >
                    <div
                        className={cn('animate-in slide-in-from-top fixed top-0 right-0 left-0 p-4 shadow-lg duration-300', mainNavWrapperBg)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-gray-300 bg-white pr-16 text-slate-900 focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-orange-400"
                                autoFocus
                            />
                            <div className="absolute top-0 right-0 flex h-full items-center pr-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className={cn(
                                        'mr-1 h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-black dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
                                    )}
                                    onClick={() => setSearchMobileOpen(false)}
                                    aria-label="Close search"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-8 w-8 rounded-md bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                                    aria-label="Search"
                                >
                                    <Search className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile menu drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="animate-in fade-in-0 fixed inset-0 z-[60] bg-black/50 md:hidden dark:bg-black/70"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div
                        className={cn(
                            'animate-in slide-in-from-left fixed inset-y-0 left-0 z-[70] flex w-[280px] flex-col overflow-y-auto shadow-xl duration-300 md:hidden',
                            mainNavWrapperBg,
                            mainNavTextGeneral,
                        )}
                    >
                        <div className={cn('flex items-center justify-between border-b p-4', mainNavBorder)}>
                            <Link href="/" className="group flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                                <img src="/images/ydllogo.png" alt="YDL Logo" className="h-7 w-auto" />
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('hover:bg-gray-100 dark:hover:bg-slate-700')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className={cn('border-b p-4', mainNavBorder)}>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-gray-300 bg-white pr-10 text-slate-900 placeholder:text-gray-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                                />
                                <Button
                                    type="submit"
                                    className="absolute top-0 right-0 h-full rounded-l-none bg-orange-500 px-3 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                                    aria-label="Search"
                                >
                                    <Search className="h-4 w-4 text-white" />
                                </Button>
                            </form>
                        </div>
                        <div className="flex flex-1 flex-col p-2">
                            {yourPhoneShopNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn('rounded-md px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-slate-700')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className={cn('border-t p-4', mainNavBorder)}>
                            <div className="flex flex-col space-y-3">
                                <Link
                                    // href="/account"
                                    href={route('login')}
                                    className={cn(
                                        'flex items-center rounded-md px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700',
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="mr-3 h-5 w-5" /> My Account
                                </Link>
                                <Link
                                    href="/cart"
                                    className={cn(
                                        'flex items-center rounded-md px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700',
                                    )}
                                    onClick={() => {
                                        setIsMobileMenuOpen(false); /* Consider opening cart sheet here */
                                    }}
                                >
                                    {' '}
                                    <ShoppingCart className="mr-3 h-5 w-5" /> View Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
