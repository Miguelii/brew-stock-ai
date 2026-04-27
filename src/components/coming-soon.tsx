export function ComingSoon() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background px-6">
            <div className="flex flex-col items-center text-center max-w-md gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-semibold tracking-widest uppercase mb-2">
                        Coming Soon
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-foreground">
                        <span>StockBrew</span>
                        <span className="text-accent-blue font-mono">AI</span>
                    </div>
                    <p className="text-sm text-primary-muted leading-relaxed">
                        We&apos;re brewing something new. Institutional-grade AI stock analysis for
                        less than a coffee. ☕
                    </p>
                </div>
            </div>
        </div>
    )
}
