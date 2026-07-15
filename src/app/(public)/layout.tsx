import { PublicHeader } from '@/components/public-header'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function HomeLayout({ children }: Props) {
    return (
        <>
            <PublicHeader />
            <div className="pt-8 lg:pt-12">{children}</div>
        </>
    )
}
