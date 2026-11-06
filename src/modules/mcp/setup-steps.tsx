import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { CodeSnippet } from '@/modules/mcp/code-snippet'
import { SETUP_STEPS } from '@/modules/mcp/constants'

export function SetupSteps() {
    return (
        <section id="setup" className="section-shell section-pad-tight scroll-mt-24">
            <SectionHeader
                eyebrow="Setup"
                title="Connected in four steps"
                lede="You need Claude Code and a BrewStock MCP token. The whole setup takes about two minutes."
            />

            <ol className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {SETUP_STEPS.map((step, index) => (
                    <li key={step.title} className="flex">
                        <Reveal
                            delay={(index % 2) * 0.08}
                            className="surface flex w-full flex-col bg-card p-7 sm:p-10"
                        >
                            <span className="display display-card text-blue tabular-nums">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-5 text-2xl leading-tight font-extrabold">
                                {step.title}
                            </h3>
                            <p className="mt-3 max-w-[52ch] leading-snug opacity-70">
                                {step.description}
                            </p>

                            <div className="mt-auto pt-6">
                                {step.command ? (
                                    <CodeSnippet code={step.command} />
                                ) : (
                                    <Link href="/contact" prefetch={false} className="contents">
                                        <Button size="lg" variant="default" className="px-5">
                                            Go to the contact page
                                            <ArrowUpRight className="size-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </Reveal>
                    </li>
                ))}
            </ol>
        </section>
    )
}
