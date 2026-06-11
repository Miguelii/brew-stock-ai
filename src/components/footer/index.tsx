import Link from 'next/link'
import Logo from '@/components/logo'

const footerLinks = [
    {
        label: 'Product',
        links: [
            { label: 'Analysis', href: '/analysis' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Reports', href: '/example-report' },
            { label: 'Change Log', href: '/changelog' },
        ],
    },
    {
        label: 'Learn',
        links: [{ label: 'Education Hub', href: '/education-hub' }],
    },
    {
        label: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { label: 'Risk Disclosure', href: '/disclaimer' },
            { label: 'Privacy Notice', href: '/privacy' },
        ],
    },
] as const

export function Footer() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Logo />
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Institutional-grade stock analysis powered by AI. For less than a
                            coffee.
                        </p>
                    </div>
                    {footerLinks.map((group) => (
                        <div key={group.label}>
                            <p className="text-sm font-semibold mb-4">{group.label}</p>
                            <ul className="flex flex-col gap-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            prefetch={false}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} BrewStockAI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
