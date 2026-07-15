import * as motion from 'motion/react-client'
import { FAQ_GROUPS } from '@/modules/faq/faq-content'

export function FaqList() {
    return (
        <div className="space-y-14">
            {FAQ_GROUPS.map((group) => (
                <motion.section
                    key={group.heading}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-2xl font-bold tracking-tight mb-6">{group.heading}</h2>
                    <div className="space-y-8">
                        {group.items.map((item) => (
                            <div key={item.question}>
                                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                                <p className="text-primary-muted leading-relaxed">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            ))}
        </div>
    )
}
