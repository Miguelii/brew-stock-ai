import { useEffect, type RefObject } from 'react'

type Indicator = { left: number; width: number; top: number; height: number }

export function useUpdateSliding(
    activeId: string,
    sections: readonly { id: string }[],
    buttonRefs: RefObject<(HTMLButtonElement | null)[]>,
    onUpdate: (indicator: Indicator) => void
) {
    useEffect(() => {
        const index = sections.findIndex((s) => s.id === activeId)

        const measure = () => {
            const btn = buttonRefs.current[index]
            if (!btn) return
            onUpdate({
                left: btn.offsetLeft,
                width: btn.offsetWidth,
                top: btn.offsetTop,
                height: btn.offsetHeight,
            })
        }

        measure()

        // The row wraps at narrow widths and the display font lands after first
        // paint, so a measure-once indicator drifts out of place.
        const observer = new ResizeObserver(measure)
        const btn = buttonRefs.current[index]
        if (btn?.parentElement) observer.observe(btn.parentElement)

        void document.fonts?.ready.then(measure)

        return () => observer.disconnect()
    }, [activeId, sections, buttonRefs, onUpdate])
}
