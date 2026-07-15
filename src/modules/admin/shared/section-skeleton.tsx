export function SectionSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-20 bg-muted border border-border rounded-none" />
                ))}
            </div>
            <div className="h-48 bg-muted border border-border rounded-none" />
        </div>
    )
}
