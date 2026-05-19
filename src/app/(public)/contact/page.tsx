import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { ContactForm } from '@/modules/contact/contact-form'

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: 'Contact',
}

export default function ContactPage() {
    return (
        <main className="max-w-5xl mx-auto px-6 py-12 lg:pb-24">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
                <p className="text-sm text-muted-foreground">
                    Have a question or feedback? We&apos;d love to hear from you.
                </p>
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-base font-semibold text-foreground">Get in touch</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Whether you have questions about your account, need help with a report,
                            or just want to share feedback — send us a message and we&apos;ll get
                            back to you as soon as possible.
                        </p>
                    </div>
                </div>

                <ContactForm />
            </div>
        </main>
    )
}
