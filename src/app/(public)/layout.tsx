import { PublicHeader } from '@/components/public-header'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicHeader />
            <div className="pt-8 lg:pt-12">{children}</div>
        </>
    )
}
