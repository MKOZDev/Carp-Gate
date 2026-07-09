import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, locale } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        groups: [process.env.MAILERLITE_GROUP_ID],
        fields: { language: locale || "nl" },
      }),
    });

    if (res.status === 409) {
      return NextResponse.json({ error: "exists" }, { status: 400 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
