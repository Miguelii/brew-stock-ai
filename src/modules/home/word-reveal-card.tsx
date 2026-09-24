import { Reveal } from '@/components/ui/motion/reveal'
import { GiantWord } from '@/modules/home/giant-word'
import { GIANT_WORDS } from '@/modules/home/constants'

type Props = {
    lede: string
    /** One giant word per line. Keep them short: they are set at up to 210px. */
    words?: readonly string[]
}

export function WordRevealCard({ lede, words = GIANT_WORDS }: Props) {
    return (
        <section data-tone="paper" className="overflow-hidden bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <div className="grid items-end gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
                    <div className="text-blue">
                        {words.map((word) => (
                            <GiantWord key={word} word={word} />
                        ))}
                    </div>

                    <Reveal className="lg:pb-6">
                        <p className="max-w-[38ch] text-xl leading-snug font-bold">{lede}</p>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
