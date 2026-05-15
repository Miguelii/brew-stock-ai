import { PublicHeader } from '@/components/public-header'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicHeader />
            {children}
        </>
    )
}
