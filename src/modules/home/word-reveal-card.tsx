import * as motion from 'motion/react-client'

type Props = {
    words: string[]
}

export function WordRevealCard({ words }: Props) {
    return (
        <section className="border-b border-border">
            <div className="max-w-4xl mx-auto px-6 py-32 md:py-48">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug">
                    {words.map((word, i) => (
                        <motion.span
                            key={`reveal-word-${word}-${i}`}
                            initial={{ opacity: 0.15 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: '-10%' }}
                            transition={{
                                duration: 0.4,
                                delay: i * 0.04,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="inline-block mr-[0.3em]"
                        >
                            {word}
                        </motion.span>
                    ))}
                </p>
            </div>
        </section>
    )
}
