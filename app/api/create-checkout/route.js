import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      role, firstName, lastName, email, phone,
      propertyAddress, propertyType, closeDate,
      forwardingAddress, currentHolder, pmDirection,
      utilities,
    } = body;

    // Calculate fee
    const fee = utilities.length <= 3 ? 79 : 99;

    // Generate submission ID
    const db = supabaseAdmin();
    const { count } = await db.from("submissions").select("*", { count: "exact", head: true });
    const id = `SMU-${String((count || 0) + 1).padStart(4, "0")}`;

    // Save pending submission to Supabase (paid: false until webhook confirms)
    const { error: dbError } = await db.from("submissions").insert({
      id,
      role,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      property_address: propertyAddress,
      property_type: propertyType,
      close_date: closeDate || null,
      forwarding_address: forwardingAddress || null,
      current_holder: currentHolder || null,
      pm_direction: pmDirection || null,
      utilities,
      fee,
      status: "New",
      paid: false,
    });

    if (dbError) throw new Error(dbError.message);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Utility Transfer Service",
              description: `${utilities.length} utilit${utilities.length === 1 ? "y" : "ies"} · ${propertyAddress}`,
            },
            unit_amount: fee * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: { submission_id: id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true&id=${id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?cancelled=true`,
    });

    // Store session ID on submission
    await db.from("submissions").update({ stripe_session_id: session.id }).eq("id", id);

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
