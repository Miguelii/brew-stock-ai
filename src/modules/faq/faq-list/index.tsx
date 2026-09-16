import * as m from 'motion/react-m'
import { FAQ_GROUPS } from '@/modules/faq/faq-content'
import { BrandText } from '@/components/brand-name'

export function FaqList() {
    return (
        <div className="space-y-14">
            {FAQ_GROUPS.map((group) => (
                <m.section
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
                                <h3 className="text-lg font-semibold mb-2">
                                    <BrandText text={item.question} />
                                </h3>
                                <p className="text-primary-muted leading-relaxed">
                                    <BrandText text={item.answer} />
                                </p>
                            </div>
                        ))}
                    </div>
                </m.section>
            ))}
        </div>
    )
}
