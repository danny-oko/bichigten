/** Grouped labels for the profile help «Tech stack» accordion (outline badges). */
export type TechStackGroupId = "engine" | "ai" | "management";

export const TECH_STACK_GROUPS: {
  id: TechStackGroupId;
  labels: readonly string[];
}[] = [
  {
    id: "engine",
    labels: [
      "Next.js",
      "Clerk",
      "Tailwind CSS",
      "Next API",
      "Zod",
      "Prisma",
      "PostgreSQL",
      "TS",
      "Vercel",
      "Shadcn",
      "Lottie-react",
    ],
  },
  {
    id: "ai",
    labels: ["Chimege AI (STT-Long)", "Levenshtein-distance"],
  },
  {
    id: "management",
    labels: [
      "GitHub Projects",
      "Trello",
      "Figma / FigJam",
      "Stitch Design",
    ],
  },
];
