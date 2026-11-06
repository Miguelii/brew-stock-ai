import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion/reveal'

export function McpCta() {
    return (
        <section className="section-shell pt-6 pb-24 lg:pb-32">
            <Reveal>
                <div
                    data-tone="navy"
                    className="surface flex flex-col gap-8 bg-tone p-8 text-tone-ink sm:p-12 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div>
                        <span className="eyebrow opacity-70">Private access</span>
                        <h2 className="display display-card mt-4 max-w-[16ch]">Want a token?</h2>
                        <p className="mt-4 max-w-[46ch] text-lg leading-snug opacity-80">
                            The MCP server is in private access for now. Send us a message from the
                            contact page and we will get back to you. Prefer the browser? The web
                            app runs the same analysis.
                        </p>
                    </div>

                    <div className="flex w-full flex-col items-stretch gap-3 sm:w-fit sm:flex-row sm:items-center">
                        <Link href="/contact" prefetch={false} className="contents">
                            <Button size="xl" variant="white" className="group">
                                Request access
                                <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                            </Button>
                        </Link>
                        <Link href="/analysis" prefetch={false} className="contents">
                            <Button
                                size="xl"
                                variant="tone"
                                className="shadow-[inset_0_0_0_2px_var(--on-brand)]"
                            >
                                Use the web app
                            </Button>
                        </Link>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}
