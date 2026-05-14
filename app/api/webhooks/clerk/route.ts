import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { ensureUser } from "@/lib/server/ensure-user";
import { invalidateAfterUserRowMutation } from "@/lib/server/invalidate-data-cache";

/**
 * Clerk → your database sync.
 *
 * Configure in Clerk Dashboard → Webhooks → Add endpoint:
 *   URL: https://<your-domain>/api/webhooks/clerk
 *   Subscribe to: user.created, user.updated
 *
 * Env: CLERK_WEBHOOK_SECRET = "whsec_..." (Signing secret from that endpoint)
 */
type ClerkEmail = { id: string; email_address: string };

type ClerkWebhookUser = {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmail[];
};

function mapClerkUserToEnsureArgs(data: ClerkWebhookUser) {
  const primary =
    data.email_addresses?.find((e) => e.id === data.primary_email_address_id)
      ?.email_address ?? data.email_addresses?.[0]?.email_address;

  const name =
    [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || null;

  return {
    id: data.id,
    email: primary ?? null,
    username: data.username ?? null,
    name,
    avatarUrl: data.image_url ?? null,
  };
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured: missing CLERK_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();

  let evt: { type: string; data: ClerkWebhookUser };
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: ClerkWebhookUser };
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    await ensureUser(mapClerkUserToEnsureArgs(evt.data));
    invalidateAfterUserRowMutation(evt.data.id);
  }

  return NextResponse.json({ ok: true });
}
