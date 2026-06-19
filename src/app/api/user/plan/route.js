import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { MongoClient } from 'mongodb';

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

    if (!userSession?.user) {
      return NextResponse.json({ plan: "free" });
    }

    // Read plan directly from DB to bypass JWT cache
    const db = await getDb();
    const dbUser = await db.collection('user').findOne({
      $or: [
        { email: userSession.user.email },
        { id: userSession.user.id },
      ]
    });

    return NextResponse.json({ plan: dbUser?.plan || "free" });
  } catch (err) {
    console.error("Error fetching user plan:", err);
    return NextResponse.json({ plan: "free" });
  }
}
