import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { PLAN_PRICE_ID, stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';




export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData = await request.formData()
    const plan_Id = formData.get('planId')
    const priceId = PLAN_PRICE_ID[plan_Id];

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
        customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      metadata:{
        priceId: priceId,
        newPlan: plan_Id,
        userId: user?.id || user?._id,
        role: user?.role,
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