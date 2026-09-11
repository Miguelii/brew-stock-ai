import Link from 'next/link'
import Logo from '@/components/logo'
import { FOOTER_LINKS } from './constants'

export function Footer() {
    return (
        <footer data-tone="paper" className="bg-paper pt-14 pb-10">
            <div className="section-shell">
                <div className="surface bg-card p-7 sm:p-11">
                    <div className="mb-9 border-b-2 border-ink/8 pb-7">
                        <Logo />
                    </div>

                    <div className="grid grid-cols-2 gap-9 md:grid-cols-4 lg:grid-cols-[repeat(4,1fr)_auto]">
                        {FOOTER_LINKS.map((group) => (
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
                            <p className="font-mono text-[13px] leading-snug text-ink/50">
                                Research and education only. Not investment advice.
                            </p>
                        </div>
                    </div>
                </div>

                <p className="eyebrow mt-8 text-center text-ink/50">
                    © {new Date().getFullYear()} BrewStockAI
                </p>
            </div>
        </footer>
    )
}
