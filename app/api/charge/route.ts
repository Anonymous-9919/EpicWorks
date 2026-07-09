import { NextResponse } from "next/server";

const UPAYMENTS_SANDBOX = "https://sandboxapi.upayments.com/api/v1/charge";

// Maps our frontend payment method names to UPayments gateway source values
const GATEWAY_SRC: Record<string, string> = {
  knet: "knet",
  "credit-card": "cc",
  "apple-pay": "apple-pay",
  "google-pay": "google-pay",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.UPAYMENTS_API_KEY || "jtest123";

    // Map the payment gateway source
    const gatewaySrc = GATEWAY_SRC[body.paymentGateway?.src] || body.paymentGateway?.src || "knet";

    const orderId = (body.order.id || "").slice(0, 35);
    const payload = {
      order: {
        id: orderId,
        reference: body.order.reference || orderId.slice(0, 12),
        description: body.order.description,
        currency: body.order.currency || "KWD",
        amount: body.order.amount,
      },
      paymentGateway: { src: gatewaySrc },
      language: body.language || "en",
      reference: {
        id: (body.reference?.id || orderId).slice(0, 35),
      },
      customer: {
        uniqueId: body.customer?.uniqueId || body.customer?.email,
        name: body.customer?.name,
        email: body.customer?.email,
        mobile: body.customer?.mobile,
      },
      returnUrl: body.returnUrl,
      cancelUrl: body.cancelUrl,
      notificationUrl: body.notificationUrl,
    };

    const response = await fetch(UPAYMENTS_SANDBOX, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.status && data.data?.link) {
      return NextResponse.json({
        status: true,
        message: "Payment link generated successfully (sandbox)",
        data: {
          link: data.data.link,
          trackId: data.data.trackId || body.order.id,
        },
      });
    }

    // Sandbox returned an error — pass it through
    return NextResponse.json(
      {
        status: false,
        message: data.message || "Payment gateway error",
        data: data.data || null,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Charge API error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Payment service unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}
