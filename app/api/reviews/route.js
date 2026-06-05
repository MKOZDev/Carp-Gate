import { NextResponse } from "next/server";
import { submitReview } from "@/lib/api";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("BODY:", body);
    const { productId, name, email, rating, review } = body;

    if (!productId || !name || !email || !rating || !review) {
      console.log("WALIDACJA FAIL:", {
        productId,
        name,
        email,
        rating,
        review,
      });
      return NextResponse.json(
        { error: "Brak wymaganych pól" },
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Ocena musi być 1-5" },
        { status: 400 },
      );
    }
    // usuń te 3 linie:
    if (review.length < 5) {
      return NextResponse.json(
        { error: "Recenzja za krótka" },
        { status: 400 },
      );
    }

    const result = await submitReview({
      productId,
      name,
      email,
      rating,
      review,
    });
    console.log("WP response:", result);
    return NextResponse.json({ success: true, id: result.id });
  } catch (e) {
    console.error("Review error:", e);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
