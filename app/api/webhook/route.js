import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail, sendAdminAlert } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const submissionId = session.metadata.submission_id;

    const db = supabaseAdmin();

    // Mark as paid
    await db.from("submissions").update({ paid: true }).eq("id", submissionId);

    // Fetch full submission for emails
    const { data: submission } = await db
      .from("submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (submission) {
      const formatted = {
        id: submission.id,
        role: submission.role,
        firstName: submission.first_name,
        lastName: submission.last_name,
        email: submission.email,
        phone: submission.phone,
        propertyAddress: submission.property_address,
        closeDate: submission.close_date,
        utilities: submission.utilities,
        fee: submission.fee,
        pmDirection: submission.pm_direction,
      };

      // Send both emails in parallel
      await Promise.all([
        sendConfirmationEmail({ to: submission.email, submission: formatted }),
        sendAdminAlert({ submission: formatted }),
      ]);
    }
  }

  return new Response("ok", { status: 200 });
}

// Required: tell Next.js to use raw body for Stripe signature verification
export const dynamic = "force-dynamic";
