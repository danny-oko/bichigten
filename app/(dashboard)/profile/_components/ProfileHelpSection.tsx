import { mnProfile } from "@/lib/i18n/mn-profile";

export function ProfileHelpSection() {
  return (
    <section
      id="help"
      className="scroll-mt-24 rounded-3xl border border-[#ead9bb] bg-linear-to-br from-[#f8fbff] to-[#fffefb] p-4 shadow-sm md:p-5"
    >
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.helpTitle}
      </h2>
      <p className="mb-4 text-sm text-[#706552]">{mnProfile.helpBody}</p>
      <a
        href="mailto:support@mazaalai.learn"
        className="inline-flex rounded-2xl bg-linear-to-r from-[#1d2b55] to-[#2a4080] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:brightness-110"
      >
        {mnProfile.helpEmailCta}
      </a>
    </section>
  );
}
