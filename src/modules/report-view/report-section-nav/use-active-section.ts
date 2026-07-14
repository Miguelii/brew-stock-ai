import { useEffect, useRef, useState } from 'react'

export function useActiveSection<T extends string>(sections: readonly { id: T }[], offset = 120) {
    const [activeId, setActiveId] = useState<T>(sections[0].id)
    const lockRef = useRef(false)

    useEffect(() => {
        const intersecting = new Set<string>()

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) intersecting.add(entry.target.id)
                    else intersecting.delete(entry.target.id)
                }
                if (lockRef.current) return
                const active = sections.find((s) => intersecting.has(s.id))
                if (active) setActiveId(active.id)
            },
            { rootMargin: `-${offset}px 0px -40% 0px`, threshold: 0 }
        )

        for (const { id } of sections) {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        }

        return () => observer.disconnect()
    }, [sections, offset])

    const scrollTo = (id: T) => {
        const el = document.getElementById(id)
        if (!el) return
        setActiveId(id)
        lockRef.current = true
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
        setTimeout(() => {
            lockRef.current = false
        }, 800)
    }

    return [activeId, scrollTo] as const
}
