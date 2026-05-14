"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mnProfile } from "@/lib/i18n/mn-profile";

import { HelpChallengesWins } from "./HelpChallengesWins";
import { HelpRootCauseCharts } from "./HelpRootCauseCharts";
import { HelpTechStack } from "./HelpTechStack";
import { ProfileTeamList } from "./ProfileTeamList";

const accordionShell =
  "w-full min-w-0 max-w-full rounded-xl border border-[#ead9bb] bg-[#fffdf7]/60 px-2 dark:border-[#37464f] dark:bg-transparent";

export function ProfileHelpSection() {
  return (
    <section
      id="help"
      className="scroll-mt-24 rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]"
    >
      <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f] dark:text-[#9ba3a7]">
        {mnProfile.helpTitle}
      </h2>
      <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-[#706552] dark:text-[#b8b0a4]">
        {mnProfile.helpAppIntro}
      </p>

      <Accordion
        type="multiple"
        defaultValue={["team"]}
        className={`${accordionShell}`}
      >
        <AccordionItem
          value="team"
          className="border-[#ead9bb] px-1 dark:border-[#37464f]"
        >
          <AccordionTrigger className="text-[#2a241e] hover:no-underline dark:text-[#f0ebe3]">
            <span className="pr-2 text-left text-sm font-semibold">
              {mnProfile.helpAccordionTeamTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[#5c5346] dark:text-[#c4bcb0]">
            <ProfileTeamList />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="root-cause"
          className="border-[#ead9bb] px-1 dark:border-[#37464f]"
        >
          <AccordionTrigger className="text-[#2a241e] hover:no-underline dark:text-[#f0ebe3]">
            <span className="pr-2 text-left text-sm font-semibold">
              {mnProfile.helpAccordionWhyTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[#5c5346] dark:text-[#c4bcb0]">
            {mnProfile.helpRootCauseLead.trim() !== "" ? (
              <p className="mb-3 text-sm font-semibold leading-snug text-[#2a241e] dark:text-[#f0ebe3]">
                {mnProfile.helpRootCauseLead}
              </p>
            ) : null}
            <div className="mb-1 space-y-3 text-sm leading-relaxed">
              {mnProfile.helpRootCauseParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <HelpRootCauseCharts />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="challenges-wins"
          className="border-[#ead9bb] px-1 dark:border-[#37464f]"
        >
          <AccordionTrigger className="text-[#2a241e] hover:no-underline dark:text-[#f0ebe3]">
            <span className="pr-2 text-left text-sm font-semibold">
              {mnProfile.helpAccordionChallengesTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[#5c5346] dark:text-[#c4bcb0]">
            <HelpChallengesWins />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="tech-stack"
          className="border-[#ead9bb] px-1 dark:border-[#37464f]"
        >
          <AccordionTrigger className="text-[#2a241e] hover:no-underline dark:text-[#f0ebe3]">
            <span className="pr-2 text-left text-sm font-semibold">
              {mnProfile.helpAccordionTechTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[#5c5346] dark:text-[#c4bcb0]">
            <HelpTechStack />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
