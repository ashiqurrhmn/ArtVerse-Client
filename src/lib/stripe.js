import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    pro: 'price_1Tk5HF3pA2swKjtHqJfhQ8sY',
    premium: 'price_1Tk4de3pA2swKjtHboDLvH2f',
}