import { mnProfile } from "@/lib/i18n/mn-profile";

export function ProfileHelpSection() {
  return (
    <section
      id="help"
      className="scroll-mt-24 rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]"
    >
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.helpTitle}
      </h2>
      <p className="mb-4 text-sm text-[#706552]">{mnProfile.helpBody}</p>
      <a
        href="mailto:support@mazaalai.learn"
        className="inline-flex rounded-2xl border-3 border-[#1d2b55] bg-transparent px-4 py-2.5 text-sm font-bold text-[#1d2b55] transition-colors hover:border-[#E8920A] hover:text-[#E8920A] dark:border-[#84d8ff] dark:text-[#84d8ff] dark:hover:border-[#84d8ff] dark:hover:text-[#e8e4dc]"
      >
        {mnProfile.helpEmailCta}
      </a>
    </section>
  );
}
