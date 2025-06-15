import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { Facebook, Send } from 'lucide-react';

export default function FooterV2() {
    return (
        <footer className="w-full bg-white dark:bg-gray-900">
            <div className="container px-4 py-16 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Section 1: Brand and Social */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <svg // Brand SVG Icon
                                className="h-8 w-8 text-orange-500 dark:text-orange-400" // Orange in light, orange accent in dark
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Pagedone</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Trusted in more than 100 countries & 5 million customers. Have any query? contact us we are here for you.
                        </p>
                        <div className="flex space-x-4">
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

                    {/* Section 2: Get In Touch */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Get In Touch</h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <p>support@pagedone.com</p>
                            <p>+91 945 658 3256</p>
                            <p>61-A, Elm street, Gujarat, India.</p>
                        </div>
                    </div>

                    {/* Section 3: Quick Links */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Links</h3>
                            <nav className="flex flex-col space-y-2 text-sm">
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Home
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    FAQs
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Price Plan
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Features
                                </Link>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h3 className="invisible text-lg font-bold text-gray-900 dark:text-white">Links</h3> {/* Kept invisible */}
                            <nav className="flex flex-col space-y-2 text-sm">
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Careers
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    About
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Contact
                                </Link>
                                <Link
                                    className="text-gray-700 hover:text-orange-500 hover:underline dark:text-gray-300 dark:hover:text-orange-400"
                                    href="#"
                                >
                                    Products
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Section 4: Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Newsletter</h3>
                        <form className="space-y-2">
                            <Input
                                className="border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                                placeholder="Enter email.."
                                type="email"
                            />
                            <Button
                                className="w-full bg-gray-800 text-white hover:bg-orange-500 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600"
                                type="submit"
                            >
                                Subscribe
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 dark:border-gray-700/50">
                <div className="container flex flex-col items-center justify-center gap-4 py-6 text-center text-sm md:h-16 md:flex-row md:py-0">
                    <div className="text-gray-500 dark:text-gray-400">
                        <p className="gradient-text-light">© {new Date().getFullYear()} YDLPHONESHOP All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
