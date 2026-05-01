import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-border py-8 bg-card">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                    © 2026 StockBrewAI. All rights reserved.
                </p>
                <Link
                    href="/privacy"
                    className="underline text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    Privacy Notice
                </Link>
            </div>
        </footer>
    )
}
