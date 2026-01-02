'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path
        ? 'nav-link active'
        : 'nav-link';

    return (
        <nav className="nav-bar">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    OurSavings
                </Link>
                <div className="nav-links">
                    <Link href="/" className={isActive('/')}>Home</Link>
                    <Link href="/history" className={isActive('/history')}>History</Link>
                    <Link href="/settings" className={isActive('/settings')}>Settings</Link>
                </div>
            </div>
        </nav>
    );
}
