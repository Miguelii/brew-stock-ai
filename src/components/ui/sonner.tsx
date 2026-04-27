'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    OctagonXIcon,
    Loader2Icon,
} from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: 'cn-toast',
                    success:
                        'bg-green-100! border-green-200! text-green-700! [&>[data-icon]]:text-green-600! [&_[data-description]]:text-green-900!',
                    error: 'bg-red-100! border-red-200! text-red-900! [&>[data-icon]]:text-red-600! [&_[data-description]]:text-red-700!',
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
