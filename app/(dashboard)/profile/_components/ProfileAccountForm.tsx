"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { mnLabels } from "@/lib/i18n/mn-copy";
import { mnProfile } from "@/lib/i18n/mn-profile";
import { mnUi } from "@/lib/i18n/mn-ui";
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
        setError(data.message ?? mnProfile.saveFailed);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError(mnProfile.networkError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      id="account"
      className="scroll-mt-24 rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]"
    >
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.accountSectionTitle}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel
              htmlFor="profile-name"
              className="text-sm font-semibold text-[#E8920A]"
            >
              {mnProfile.displayName}
            </FieldLabel>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={busy}
              className="rounded-2xl border-3 border-[#ead9bb] bg-transparent dark:border-[#37464f]"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="profile-username"
              className="text-sm font-semibold text-[#E8920A]"
            >
              {mnLabels.username}
            </FieldLabel>
            <Input
              id="profile-username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              disabled={busy}
              className="rounded-2xl border-3 border-[#ead9bb] bg-transparent dark:border-[#37464f]"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="profile-avatar"
              className="text-sm font-semibold text-[#E8920A]"
            >
              {mnProfile.avatarUrl}
            </FieldLabel>
            <Input
              id="profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder={mnProfile.urlPlaceholder}
              disabled={busy}
              className="rounded-2xl border-3 border-[#ead9bb] bg-transparent dark:border-[#37464f]"
            />
          </Field>
          <FieldError>{error}</FieldError>
          {saved ? (
            <p className="text-sm text-emerald-700" role="status">
              {mnProfile.saved}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-[#E8920A] hover:bg-[#cf7d09] sm:w-auto"
          >
            {busy ? mnUi.saving : mnUi.saveChanges}
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
