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
    <section className="relative overflow-hidden rounded-3xl border border-[#e6dece] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <button
        type="button"
        onClick={() => setIsEditing((prev) => !prev)}
        className="absolute right-5 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d8deea] bg-white text-[#1C2B4A] shadow-sm hover:bg-[#f8faff] md:top-6"
        aria-label={isEditing ? "Close edit profile" : "Edit profile"}
      >
        <Pencil className="h-4 w-4" />
      </button>

      <div className="px-5 pb-5 pr-16 md:px-8 md:pr-20">
        <div className="flex flex-col gap-4 pt-5 md:flex-row md:items-start md:justify-between md:pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#f3ead9] bg-[#E8920A] text-3xl font-bold text-white shadow md:h-22 md:w-22">
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
            <div className="pt-2">
              <h1 className="text-2xl font-extrabold leading-tight text-[#1f1c18] md:text-3xl">
                {name}
              </h1>
              <p className="text-sm text-[#706552]">
                @{username} · Joined {memberSince}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold md:hidden">
                <span className="rounded-full border border-[#e7dbc2] bg-[#f8f1e3] px-3 py-1 text-[#8a6a2d]">
                  {rankTitle}
                </span>
                <span className="rounded-full border border-[#d3def3] bg-[#ebf2ff] px-3 py-1 text-[#1C2B4A]">
                  {language}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 pt-2 text-xs font-semibold md:flex">
            <span className="rounded-full border border-[#e7dbc2] bg-[#f8f1e3] px-3 py-1 text-[#8a6a2d]">
              {rankTitle}
            </span>
            <span className="rounded-full border border-[#d3def3] bg-[#ebf2ff] px-3 py-1 text-[#1C2B4A]">
              {language}
            </span>
          </div>
        </div>
        {isEditing ? (
          <form
            onSubmit={onSave}
            className="mt-5 grid gap-3 rounded-2xl border border-[#ECE7DE] bg-[#FFFCF5] p-4 md:grid-cols-3"
          >
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Display name</span>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 outline-none focus:border-[#E8920A]"
                disabled={busy}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Username</span>
              <input
                value={formUserName}
                onChange={(e) => setFormUserName(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 outline-none focus:border-[#E8920A]"
                disabled={busy}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#6f6658]">Avatar URL</span>
              <input
                value={formAvatarUrl}
                onChange={(e) => setFormAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 outline-none focus:border-[#E8920A]"
                disabled={busy}
              />
            </label>
            <div className="md:col-span-3 flex items-center justify-between gap-3">
              <p className="text-sm text-[#D63F3F]">{error}</p>
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-[#E8920A] px-4 py-2 text-sm font-bold text-white hover:bg-[#cf7d09] disabled:opacity-60"
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
