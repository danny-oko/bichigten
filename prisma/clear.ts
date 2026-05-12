import { PrismaClient } from "@prisma/client";

// Use the direct DB URL, NOT the Accelerate one
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL, // your raw postgresql:// URL
    },
  },
});

async function main() {
  await prisma.userLessonProgress.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lessonContent.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();

  console.log("All tables cleared ✅");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
