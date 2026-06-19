import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { MongoClient, ObjectId } from "mongodb";

let client;

async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("art-verse");
}

export async function POST(request) {
  try {
    const { session_id } = await request.json();
    if (!session_id) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Stripe session:", session.id, "Status:", session.payment_status);
    console.log("Metadata:", session.metadata);

    if (session.payment_status === 'paid') {
      const newPlan = session.metadata?.newPlan;
      const userId = session.metadata?.userId;
      const userEmail = session.metadata?.userEmail || session.customer_email;

      if (newPlan && (userId || userEmail)) {
        const db = await getDb();

        // Build filter with multiple ways to find the user
        const orConditions = [];
        if (userId) {
          orConditions.push({ id: userId });
          orConditions.push({ _id: userId });
          if (ObjectId.isValid(userId)) {
            orConditions.push({ _id: new ObjectId(userId) });
          }
        }
        if (userEmail) {
          orConditions.push({ email: userEmail });
        }

        const result = await db.collection('user').updateOne(
          { $or: orConditions },
          { $set: { plan: newPlan } }
        );
        console.log("DB Update - matched:", result.matchedCount, "modified:", result.modifiedCount);

        // Record the subscription transaction in the database
        const subscriptionRecord = {
          userId: userId || null,
          userEmail: userEmail,
          plan: newPlan,
          status: 'active',
          transactionId: session.payment_intent || session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          createdAt: new Date().toISOString(),
        };

        await db.collection('subscriptions').insertOne(subscriptionRecord);

        return NextResponse.json({ success: true, plan: newPlan, modified: result.modifiedCount });
      } else {
        console.log("Missing newPlan or userId/email in metadata");
        return NextResponse.json({ success: false, error: "Missing metadata" }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, status: session.payment_status });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
