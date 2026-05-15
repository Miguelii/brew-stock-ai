import Link from 'next/link'
import Logo from '@/components/logo'
import * as motion from 'motion/react-client'
import { Button } from '@/components/ui/button'

export function PublicHeader() {
    return (
        <motion.header
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-0 z-50 transition-all duration-300 border-b border-border bg-card backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Logo />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link href="/analysis" prefetch={false}>
                        <Button size="lg" className="px-3 py-1.5 text-sm h-8">
                            Start Analysis
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.header>
    )
}
