import { PublicHeader } from '@/components/public-header'
import { LenisProvider } from '@/components/motion/lenis-provider'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function HomeLayout({ children }: Props) {
    return (
        <>
            <LenisProvider />
            <PublicHeader />
            {children}
        </>
    )
}
