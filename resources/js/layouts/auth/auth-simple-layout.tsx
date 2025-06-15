import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}
export function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    // YDLPhoneShop Themed Colors
    const pageBackgroundGradient = 'bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900/50'; // Dark base with subtle orange
    const dotPatternColor = 'white'; // Keep dots white for contrast on dark BG

    const floatingElementBorder = 'border-white/10 dark:border-slate-700/30';
    const floatingElementBg = 'bg-white/5 dark:bg-slate-700/10';
    const floatingElementAccentBg = 'bg-white/10 dark:bg-slate-600/15';

    const cardBg = 'bg-slate-700/30 dark:bg-slate-800/50 backdrop-blur-xl'; // Glassmorphism card
    const cardBorder = 'border-slate-600/50 dark:border-slate-700/50';

    // const logoContainerBg = 'bg-gradient-to-br from-orange-500 to-orange-600'; // YDL Orange
    const logoPulseBg = 'bg-gradient-to-r from-orange-500/30 to-pink-500/30'; // Retaining a hint of pink for pulse, or change to orange/amber
    const logoTextColor = 'text-white';
    const logoTaglineColor = 'text-orange-300 dark:text-orange-400';

    const titleOnCardColor = 'text-white dark:text-slate-50';
    const descriptionOnCardColor = 'text-gray-300 dark:text-slate-300';

    const bottomTextColor = 'text-slate-400 dark:text-slate-500';
    const bottomPingColor = 'bg-orange-400 dark:bg-orange-500';

    return (
        <div className="relative flex min-h-svh items-center justify-center p-4 md:p-10">
            {/* Background Layer */}
            <div className={cn('absolute inset-0', pageBackgroundGradient)}>
                {/* Mobile Grid Pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-[0.07]">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, ${dotPatternColor} 1px, transparent 1px),
                                            radial-gradient(circle at 75% 75%, ${dotPatternColor} 1px, transparent 1px)`,
                            backgroundSize: '50px 50px', // Slightly smaller grid
                        }}
                    ></div>
                </div>

                {/* Phone-shaped Decorative Elements */}
                <div className={cn('absolute top-10 right-10 hidden h-32 w-20 rounded-2xl md:block', floatingElementBorder, floatingElementBg)}></div>
                <div
                    className={cn(
                        'absolute bottom-20 left-10 hidden h-28 w-16 rotate-12 rounded-2xl md:block',
                        floatingElementBorder,
                        floatingElementBg,
                    )}
                ></div>
            </div>

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-sm">
                <div className={cn('rounded-2xl p-6 shadow-2xl sm:p-8', cardBg, cardBorder)}>
                    {' '}
                    {/* Adjusted padding */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-4 sm:gap-5">
                            {' '}
                            {/* Increased gap */}
                            <Link
                                href={route('home')}
                                className="group flex flex-col items-center gap-2.5 transition-transform hover:scale-105 sm:gap-3"
                            >
                                <div className="relative">
                                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shadow-lg sm:h-14 sm:w-14')}>
                                        <AppLogoIcon />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={cn('mb-0.5 text-base font-bold sm:text-lg', logoTextColor)}>
                                        {import.meta.env.VITE_APP_NAME || 'YDL'}
                                    </div>
                                    <div className={cn('text-xs font-medium tracking-wider', logoTaglineColor)}>TECH EXCELLENCE</div>
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>
                            <div className="space-y-2 text-center sm:space-y-2.5">
                                {' '}
                                {/* Adjusted spacing */}
                                <h1 className={cn('text-xl font-semibold sm:text-2xl sm:font-bold', titleOnCardColor)}>{title}</h1>
                                <p className={cn('text-sm leading-relaxed text-balance', descriptionOnCardColor)}>{description}</p>
                            </div>
                        </div>
                        <div className="space-y-3">{children}</div>
                    </div>
                </div>
                <div className={cn('mt-4 flex items-center justify-center gap-4 text-xs', bottomTextColor)}>
                    <span className="flex items-center gap-1.5">
                        <div className={cn('h-1.5 w-1.5 animate-ping rounded-full', bottomPingColor)}></div>
                        Secure
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className={cn('h-1.5 w-1.5 animate-ping rounded-full delay-500', bottomPingColor)}></div> {/* Added delay to one ping */}
                        Encrypted
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AuthSimpleLayout;
