'use client';

import BackToTopButton from '@/components/BackToTopButton';
import ShopFooter from '@/components/frontend/ShopFooter';
import ShopHeader from '@/components/frontend/ShopHeader';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function ShopFrontLayout({ children }: { children: ReactNode }) {
    // This provides a clean base: white in light mode, and a dark slate in dark mode.
    const layoutBackground = 'bg-white dark:bg-slate-900';
    return (
        <div className={cn('flex min-h-screen flex-col', layoutBackground)}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ShopHeader />

                <main className="w-full flex-grow">
                    {/* Main content area */}
                    {children}
                </main>
                <ShopFooter />
                <BackToTopButton />
            </ThemeProvider>
        </div>
    );
}
