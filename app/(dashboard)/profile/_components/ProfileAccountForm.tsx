"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProfileAccountFormProps = {
  initialName: string;
  initialUserName: string;
  initialAvatarUrl: string;
};

export function ProfileAccountForm({
  initialName,
  initialUserName,
  initialAvatarUrl,
}: ProfileAccountFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [userName, setUserName] = useState(initialUserName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setBusy(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          userName: userName.trim(),
          avatarUrl: avatarUrl.trim() || null,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Could not save.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      id="account"
      className="scroll-mt-24 rounded-2xl border border-[#e6dece] bg-white p-4 md:p-5"
    >
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        Account details
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel
              htmlFor="profile-name"
              className="text-sm font-semibold text-[#E8920A]"
            >
              Display name
            </FieldLabel>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={busy}
              className="rounded-2xl border-amber-300/80 bg-[#F8F4E3]"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="profile-username"
              className="text-sm font-semibold text-[#E8920A]"
            >
              Username
            </FieldLabel>
            <Input
              id="profile-username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              disabled={busy}
              className="rounded-2xl border-amber-300/80 bg-[#F8F4E3]"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="profile-avatar"
              className="text-sm font-semibold text-[#E8920A]"
            >
              Avatar URL
            </FieldLabel>
            <Input
              id="profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              disabled={busy}
              className="rounded-2xl border-amber-300/80 bg-[#F8F4E3]"
            />
          </Field>
          <FieldError>{error}</FieldError>
          {saved ? (
            <p className="text-sm text-emerald-700" role="status">
              Saved.
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-[#E8920A] hover:bg-[#cf7d09] sm:w-auto"
          >
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
