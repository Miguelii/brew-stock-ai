'use client'

import { Loader2Icon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Action = {
    label: string
    onClick: () => void
}

type Props = {
    icon: React.ReactNode
    title: string
    description: React.ReactNode
    primaryAction: Action
    secondaryAction: Action
    onDismiss?: () => void
    isPending?: boolean
}

export function PromptCard({
    icon,
    title,
    description,
    primaryAction,
    secondaryAction,
    onDismiss,
    isPending,
}: Props) {
    return (
        <div className="fixed bottom-4 right-4 z-50 w-72 bg-card border border-border shadow-lg p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <p className="text-sm font-medium leading-tight">{title}</p>
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label="Dismiss"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed">{description}</div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    className="flex-1 bg-accent-blue hover:bg-accent-blue-dark text-background rounded-none text-xs"
                    onClick={primaryAction.onClick}
                    disabled={isPending}
                >
                    {isPending ? <Loader2Icon className="animate-spin w-3 h-3" /> : null}
                    {primaryAction.label}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-none text-xs"
                    onClick={secondaryAction.onClick}
                    disabled={isPending}
                >
                    {secondaryAction.label}
                </Button>
            </div>
        </div>
    )
}
