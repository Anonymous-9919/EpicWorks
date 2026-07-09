import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const trackId = body.track_id || body.data?.trackId;
    if (trackId) {
      // Verify payment in production
    }

    return NextResponse.json({ status: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: false, message: "Error" }, { status: 500 });
  }
}
