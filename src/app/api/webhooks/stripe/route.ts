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

    const session = event.data.object as Stripe.Checkout.Session

    const isCompletedAndPaid =
        event.type === 'checkout.session.completed' && session.payment_status === 'paid'
    const isAsyncPaymentSucceeded = event.type === 'checkout.session.async_payment_succeeded'

    if (event.type === 'checkout.session.completed' && session.payment_status !== 'paid') {
        console.log(
            `[stripe-webhook] skipping checkout.session.completed: payment_status=${session.payment_status} session=${session.id}`
        )
        return NextResponse.json({ received: true })
    }

    if (isCompletedAndPaid || isAsyncPaymentSucceeded) {
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

        if (response.error) {
            console.error('[stripe-webhook] add_credits error', response.error)
            return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
        }

        console.log(
            `[stripe-webhook] credited ${credits} to ${userId} via ${event.type} session=${session.id}`
        )
    }

    return NextResponse.json({ received: true })
}
