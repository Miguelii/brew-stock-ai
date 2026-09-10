import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        <footer data-tone="paper" className="bg-paper pt-14 pb-10">
            <div className="section-shell">
                <div className="surface bg-card p-7 sm:p-11">
                    <div className="mb-9 border-b-2 border-ink/8 pb-7">
                        <Logo />
                    </div>

                    <div className="grid grid-cols-2 gap-9 md:grid-cols-4 lg:grid-cols-[repeat(4,1fr)_auto]">
                        {footerLinks.map((group) => (
                            <div key={group.label}>
                                <p className="eyebrow mb-4 text-ink/50">{group.label}</p>
                                <ul className="flex flex-col gap-2.5">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                prefetch={false}
                                                className="text-[15px] font-bold text-ink transition-colors duration-200 hover:text-blue"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-4 lg:col-span-1 lg:max-w-[28ch] lg:items-end lg:text-right">
                            <p className="text-[15px] leading-snug opacity-70">
                                Institutional-grade stock analysis. For less than a coffee.
                            </p>
                            <Link href="/analysis" prefetch={false}>
                                <Button
                                    variant="ink"
                                    className="group h-12 px-6 text-[15px] font-bold"
                                >
                                    Start analysis
                                    <ArrowUpRight className="size-4 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                                </Button>
                            </Link>
                            <p className="font-mono text-[13px] leading-snug text-ink/50">
                                Research and education only. Not investment advice.
                            </p>
                        </div>
                    </div>
                </div>

                <p className="eyebrow mt-8 text-center text-ink/50">
                    © {new Date().getFullYear()} BrewStockAI · Privacy · Terms
                </p>
            </div>
        </footer>
    )
}
