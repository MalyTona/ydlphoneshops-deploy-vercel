// src/components/BackToTopButton.tsx
'use client';

import { Button } from '@/components/ui/button'; // Using your Shadcn Button
import { cn } from '@/lib/utils'; // For classnames
import { ArrowUp } from 'lucide-react'; // Using Lucide icon
import { useEffect, useState } from 'react';

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            // Show button after scrolling 300px (adjust as needed)
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the scroll behavior to smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    variant="default" // Or any other variant you prefer
                    size="icon" // For a compact icon button
                    className={cn(
                        'fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full p-0 shadow-lg transition-opacity duration-300 hover:opacity-90 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-900',
                        // Your YDLPhoneShop accent colors
                        'bg-orange-500 text-white hover:bg-orange-600',
                        'dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700',
                    )}
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-6 w-6" />
                </Button>
            )}
        </>
    );
}
