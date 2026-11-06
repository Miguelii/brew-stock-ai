import { Reveal } from '@/components/ui/motion/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { BrandName } from '@/components/brand-name'
import { EXAMPLE_PROMPTS, MCP_TOOLS } from '@/modules/mcp/constants'

export function UsageSection() {
    return (
        <section className="section-shell section-pad-tight">
            <SectionHeader
                eyebrow="Usage"
                title="Then just ask"
                lede="No commands to learn. Ask about a stock in your own words, in any language. Claude picks the analysis type, fetches the brief and writes the report."
            />

            <Reveal className="surface bg-card p-7 sm:p-10">
                <p className="eyebrow text-ink/50">Try one of these</p>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {EXAMPLE_PROMPTS.map(({ prompt, analysisType }) => (
                        <li
                            key={prompt}
                            className="flex flex-col gap-2 rounded-[var(--radius-surface-inner)] bg-muted p-5"
                        >
                            <span className="text-lg leading-snug font-bold">
                                &ldquo;{prompt}&rdquo;
                            </span>
                            <span className="font-mono text-xs text-ink/50 uppercase">
                                {analysisType}
                            </span>
                        </li>
                    ))}
                </ul>
            </Reveal>

            <Reveal className="surface mt-6 bg-card p-7 sm:p-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
                    <div>
                        <p className="eyebrow text-blue">Under the hood</p>
                        <h3 className="mt-4 text-2xl leading-tight font-extrabold">
                            Your assistant writes, <BrandName /> supplies the facts
                        </h3>
                        <p className="mt-3 leading-snug opacity-70">
                            The server never calls an AI model. It returns the data and the method,
                            and your assistant writes the analysis on your own plan. Figures come
                            only from the brief, so nothing is invented.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-6">
                        {MCP_TOOLS.map(({ name, description }) => (
                            <li key={name} className="flex flex-col gap-2">
                                <code className="w-fit rounded-full bg-blue-soft px-3 py-1 font-mono text-sm text-blue-deep">
                                    {name}
                                </code>
                                <p className="leading-snug opacity-70">{description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </section>
    )
}
