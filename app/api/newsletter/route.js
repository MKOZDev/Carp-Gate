import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, locale } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const res = await fetch(
      `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          language: locale || "nl",
          tags: ["website"],
        }),
      },
    );

    const data = await res.json();

    if (data.title === "Member Exists") {
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
