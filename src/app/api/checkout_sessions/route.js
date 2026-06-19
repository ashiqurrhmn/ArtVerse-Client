import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';




export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const userSession = await auth.api.getSession({
        headers: await headers()
    }) 
    const user = userSession?.user;

    if (!userSession || user?.role !== "buyer") {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
        customer_email: userSession?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1Tk5HF3pA2swKjtHqJfhQ8sY',
          quantity: 1,
        },
      ],
      metadata:{
        priceId: 'price_1Tk5HF3pA2swKjtHqJfhQ8sY',
        userId: user?._id,
        role: user?.role,
        plan: user?.plan,
        userEmail: user?.email
      },
      mode: 'subscription',
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}