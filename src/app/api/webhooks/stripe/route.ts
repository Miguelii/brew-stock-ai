import { NextResponse } from 'next/server'
import StripeClient, { type Stripe } from 'stripe'
import { ServerEnv } from '@/env/server'
import { createSbAdminClient } from '@/lib/utils.server'
import { Logger } from '@/lib/logger'

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

    const userId = session.metadata?.userId

    const isCompletedAndPaid =
        event.type === 'checkout.session.completed' && session.payment_status === 'paid'
    const isAsyncPaymentSucceeded = event.type === 'checkout.session.async_payment_succeeded'

    if (event.type === 'checkout.session.completed' && session.payment_status !== 'paid') {
        Logger({
            prefix: 'stripe-webhook',
            level: 'info',
            message: 'skipping checkout.session.completed',
            metadata: { payment_status: session.payment_status, session_id: session.id },
            userId: userId ?? undefined,
        })
        return NextResponse.json({ received: true })
    }

    if (isCompletedAndPaid || isAsyncPaymentSucceeded) {
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
            Logger({
                prefix: 'stripe-webhook',
                level: 'error',
                message: 'add_credits failed',
                error: response.error,
                metadata: { user_id: userId, credits, session_id: session.id },
                userId: userId ?? undefined,
            })
            return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
        }

        Logger({
            prefix: 'stripe-webhook',
            level: 'info',
            message: 'credits added',
            metadata: {
                user_id: userId,
                credits,
                event_type: event.type,
                session_id: session.id,
            },
            userId: userId ?? undefined,
        })
    }

    return NextResponse.json({ received: true })
}
