/**
 * Shared layout for the generated Open Graph cards.
 *
 * `ImageResponse` renders this in Satori, which resolves no CSS variables and no
 * Tailwind, so the brand palette is repeated here as literals. Keep these in sync
 * with `src/styles/theme.css` by hand.
 */
export const OG_SIZE = { width: 1200, height: 630 }

export const OG_CONTENT_TYPE = 'image/png'

const PAPER = '#f7f4ee'
const INK = '#17181c'
const BLUE = '#0047cc'

type Props = {
    /** Small line above the title, e.g. the ticker or the article theme. */
    eyebrow: string
    title: string
    description?: string
}

export function OgCard({ eyebrow, title, description }: Props) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: PAPER,
                padding: '72px 80px',
                fontFamily: 'sans-serif',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 26,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: BLUE,
                    }}
                >
                    {eyebrow}
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: title.length > 60 ? 62 : 78,
                        lineHeight: 1.08,
                        fontWeight: 700,
                        letterSpacing: -2,
                        color: INK,
                    }}
                >
                    {title}
                </div>
                {description ? (
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 30,
                            lineHeight: 1.35,
                            color: INK,
                            opacity: 0.66,
                        }}
                    >
                        {description}
                    </div>
                ) : null}
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 28,
                    color: INK,
                }}
            >
                <div style={{ display: 'flex', fontWeight: 700 }}>BrewStock</div>
                <div style={{ display: 'flex', opacity: 0.55 }}>Educational, not advice</div>
            </div>
        </div>
    )
}
