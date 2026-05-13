"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { mnUi } from "@/lib/i18n/mn-ui";

type ProfileHeroEditableProps = {
  name: string;
  username: string;
  memberSince: string;
  avatarUrl: string | null;
  avatarInitial: string;
  rankTitle: string;
  language: string;
  initialName: string;
  initialUserName: string;
  initialAvatarUrl: string;
};

export default function ProfileHeroEditable({
  name,
  username,
  memberSince,
  avatarUrl,
  avatarInitial,
  rankTitle,
  language,
  initialName,
  initialUserName,
  initialAvatarUrl,
}: ProfileHeroEditableProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(initialName);
  const [formUserName, setFormUserName] = useState(initialUserName);
  const [formAvatarUrl, setFormAvatarUrl] = useState(initialAvatarUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          userName: formUserName.trim(),
          avatarUrl: formAvatarUrl.trim() || null,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Could not save changes.");
        return;
      }
      setIsEditing(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-transparent shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <button
        type="button"
        onClick={() => setIsEditing((prev) => !prev)}
        className="absolute right-5 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border-3 border-[#d8deea] bg-transparent text-[#1C2B4A] md:top-6 dark:border-[#37464f] dark:text-[#cbd5e1]"
        aria-label={isEditing ? "Close edit profile" : "Edit profile"}
      >
        <Pencil className="h-4 w-4" />
      </button>

      <div className="px-5 pb-5 pr-16 md:px-8 md:pr-20">
        <div className="flex min-w-0 flex-col gap-4 pt-5 md:flex-row md:items-start md:justify-between md:pt-6">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#f3ead9] bg-[#E8920A] text-2xl font-bold text-white shadow sm:h-20 sm:w-20 sm:text-3xl md:h-22 md:w-22">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={80}
                  height={80}
                  className="size-full object-cover"
                  unoptimized
                />
              ) : (
                avatarInitial
              )}
            </div>
            <div className="min-w-0 flex-1 pt-2">
              <h1 className="wrap-break-word text-xl font-extrabold leading-tight text-[#1f1c18] sm:text-2xl md:text-3xl">
                {name}
              </h1>
              <p className="wrap-break-word text-xs text-[#706552] sm:text-sm">
                @{username} · Joined {memberSince}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold md:hidden">
                <span className="rounded-full border border-[#e7dbc2] bg-transparent px-3 py-1 text-[#8a6a2d]">
                  {rankTitle}
                </span>
                <span className="rounded-full border border-[#d3def3] bg-transparent px-3 py-1 text-[#1C2B4A]">
                  {language}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 pt-2 text-xs font-semibold md:flex">
            <span className="rounded-full border border-[#e7dbc2] bg-transparent px-3 py-1 text-[#8a6a2d]">
              {rankTitle}
            </span>
            <span className="rounded-full border border-[#d3def3] bg-transparent px-3 py-1 text-[#1C2B4A]">
              {language}
            </span>
          </div>
        </div>
        {isEditing ? (
          <form
            onSubmit={onSave}
            className="mt-5 grid gap-3 rounded-2xl border-3 border-[#ECE7DE] bg-transparent p-4 dark:border-[#37464f] md:grid-cols-3"
          >
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Display name</span>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-xl border-3 border-[#E5E5E5] bg-transparent px-3 py-2 outline-none focus:border-[#E8920A] dark:border-[#37464f] dark:text-[#e8e4dc]"
                disabled={busy}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Username</span>
              <input
                value={formUserName}
                onChange={(e) => setFormUserName(e.target.value)}
                className="w-full rounded-xl border-3 border-[#E5E5E5] bg-transparent px-3 py-2 outline-none focus:border-[#E8920A] dark:border-[#37464f] dark:text-[#e8e4dc]"
                disabled={busy}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Avatar URL</span>
              <input
                value={formAvatarUrl}
                onChange={(e) => setFormAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border-3 border-[#E5E5E5] bg-transparent px-3 py-2 outline-none focus:border-[#E8920A] dark:border-[#37464f] dark:text-[#e8e4dc]"
                disabled={busy}
              />
            </label>
            <div className="flex flex-col gap-3 md:col-span-3 md:flex-row md:items-center md:justify-between">
              <p className="min-w-0 text-sm text-[#D63F3F]">{error}</p>
              <button
                type="submit"
                disabled={busy}
                className="w-full shrink-0 rounded-xl bg-[#E8920A] px-4 py-2 text-sm font-bold text-white hover:bg-[#cf7d09] disabled:opacity-60 md:w-auto"
              >
                {busy ? mnUi.saving : mnUi.saveProfile}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
