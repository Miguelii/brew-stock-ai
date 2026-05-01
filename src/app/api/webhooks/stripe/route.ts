import { NextResponse } from 'next/server'
import StripeClient, { type Stripe } from 'stripe'
import { ServerEnv } from '@/env/server'
import { createSbAdminClient } from '@/lib/utils.server'

export async function POST(request: Request) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const stripe = new StripeClient(ServerEnv.STRIPE_SECRET_KEY!)

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, ServerEnv.STRIPE_WEBHOOK_SECRET!)
    } catch {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const credits = Number(session.metadata?.credits)

        if (!userId || !credits || credits <= 0) {
            return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
        }

        const supabase = createSbAdminClient()

        const response = await supabase.rpc('add_credits', {
            p_user_id: userId,
            p_credits: credits,
        })

        console.log('ADDD CREDITS!')

        console.log({ response: response })

        if (response.error) {
            console.error('[stripe-webhook] add_credits error', response.error)
            return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
