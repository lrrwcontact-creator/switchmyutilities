import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req) {
  const { id, status, notes } = await req.json();
  const db = supabaseAdmin();

  const updates = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const { error } = await db.from("submissions").update(updates).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
