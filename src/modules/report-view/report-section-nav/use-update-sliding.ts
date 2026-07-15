import { useEffect, type RefObject } from 'react'

type Indicator = { left: number; width: number }

export function useUpdateSliding(
    activeId: string,
    sections: readonly { id: string }[],
    buttonRefs: RefObject<(HTMLButtonElement | null)[]>,
    onUpdate: (indicator: Indicator) => void
) {
    useEffect(() => {
        const index = sections.findIndex((s) => s.id === activeId)
        const btn = buttonRefs.current[index]
        if (!btn) return
        onUpdate({ left: btn.offsetLeft, width: btn.offsetWidth })
    }, [activeId, sections, buttonRefs, onUpdate])
}
