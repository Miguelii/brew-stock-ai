import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'

export default function NotFound() {
    return (
        <main className="flex flex-1 items-center justify-center px-6 py-24">
            <div className="flex flex-col items-center text-center max-w-sm gap-6">
                <p className="text-8xl font-bold font-mono text-accent-blue">404</p>

                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-foreground">
                        Even our AI couldn&apos;t find this one
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The page you&apos;re looking for has gone dark. Probably a bad trade.
                    </p>
                </div>

                <Link href="/" className="contents">
                    <Button className="bg-accent-blue hover:bg-accent-blue-dark text-background">
                        <ArrowLeftIcon />
                        Back to analysis
                    </Button>
                </Link>
            </div>
        </main>
    )
}
