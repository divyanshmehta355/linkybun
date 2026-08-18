import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

/* 
 * RAZORPAY SIGNATURE VERIFICATION EXPLANATION:
 * 
 * Razorpay ensures that the payment response originates from them and wasn't tampered 
 * with by generating a signature using your RAZORPAY_KEY_SECRET.
 * 
 * To verify this signature on the server:
 * 1. We concatenate the `razorpay_order_id` and the `razorpay_payment_id` 
 *    with a pipe ("|") character.
 * 2. We generate an HMAC (Hash-based Message Authentication Code) using the SHA-256 
 *    hashing algorithm.
 * 3. We use our private `RAZORPAY_KEY_SECRET` as the cryptographic key for this HMAC.
 * 4. We compare our generated HMAC hex string against the `razorpay_signature` provided 
 *    by the client. 
 * 
 * If they match perfectly, we can cryptographically guarantee that the payment payload 
 * is authentic and hasn't been spoofed by the client, making it safe to upgrade the user's 
 * account to Pro status in our database.
 */
export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const expectedBuffer = Buffer.from(generatedSignature, "utf-8");
    const providedBuffer = Buffer.from(razorpay_signature, "utf-8");

    // Securely compare the signatures using timingSafeEqual to prevent timing attacks
    let isValid = false;
    if (expectedBuffer.length === providedBuffer.length) {
      isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Signature is valid. Upgrade the user in Supabase.
    // Ensure the user calling this is authenticated (could also rely on webhook events in production, 
    // but client-triggered server verification is acceptable if session is verified).
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update is_pro = true
    const { error } = await supabase
      .from("profiles")
      .update({ is_pro: true })
      .eq("id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
