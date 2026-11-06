import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion/reveal'
import { BrandName } from '@/components/brand-name'

export function McpHero() {
    return (
        <section className="section-shell pt-10 pb-16 lg:pt-16 lg:pb-20">
            <Reveal className="flex flex-col">
                <span className="eyebrow text-blue">MCP server · Claude Code plugin</span>
                <h1 className="display display-hero mt-6 max-w-[16ch]">
                    Stock research in your AI assistant
                </h1>
                <p className="mt-6 max-w-[56ch] text-lg leading-snug opacity-75">
                    Connect <BrandName /> to Claude Code and ask about any stock in plain language.
                    Our server brings the live market data and the analyst method, your assistant
                    writes the report.
                </p>

                <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-fit sm:flex-row sm:items-center">
                    <Link href="/contact" prefetch={false} className="contents">
                        <Button size="xl" variant="ink" className="group">
                            Request access
                            <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                        </Button>
                    </Link>
                    <a href="#setup" className="contents">
                        <Button size="xl" variant="outline-ink">
                            See the setup
                            <ArrowDown className="size-5" />
                        </Button>
                    </a>
                </div>
            </Reveal>
        </section>
    )
}
