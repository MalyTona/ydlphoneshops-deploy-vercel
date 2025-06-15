// src/components/app-logo-icon.tsx
import { cn } from '@/lib/utils'; // For merging classNames, if needed
import React from 'react'; // React import

// Define props for your component. It will accept standard <img> attributes.
interface AppLogoIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    // You can add any custom props here if needed in the future
}

export default function AppLogoIcon({ className, alt = 'YDL PhoneShop Logo', ...props }: AppLogoIconProps) {
    return (
        <img
            src="/logo.png"
            alt={alt}
            // The className prop passed from layouts (e.g., "size-8") will control the image's dimensions.
            // Tailwind's text color utilities (like text-white, text-orange-500) or fill-current
            // will NOT directly change the colors within a PNG image.
            className={cn(
                'object-contain', // Ensures the image scales correctly within its dimensions
                className, // Applies classes passed as props (e.g., for size)
            )}
            {...props} // Spreads any other <img> attributes like onClick, etc.
        />
    );
}
