import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

let client;

async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("art-verse");
}

export async function GET() {
  try {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    
    // Fetch from MongoDB instead of Stripe directly
    const subscriptions = await db
      .collection("subscriptions")
      .find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Map the MongoDB docs to the format expected by the frontend
    const result = subscriptions.map((sub) => ({
      id: sub._id.toString(),
      plan: sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1),
      status: sub.status || "active",
      amount: sub.amount || 0,
      currency: sub.currency || "usd",
      createdAt: sub.createdAt,
      transactionId: sub.transactionId || sub._id.toString(),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Subscription fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
