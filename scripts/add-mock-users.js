// Run with: bun scripts/add-mock-users.js (Bun loads .env automatically.)
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

function randomXp() {
  return Math.floor(Math.random() * (4200 - 120 + 1)) + 120;
}

async function main() {
  const targetTotal = 30;
  const currentCount = await prisma.user.count();
  const missingCount = Math.max(0, targetTotal - currentCount);

  if (missingCount === 0) {
    console.log(`Already have ${currentCount} users. Nothing to add.`);
    return;
  }

  const now = Date.now();
  const usersToInsert = [];

  for (let i = 1; i <= missingCount; i++) {
    const n = currentCount + i;
    usersToInsert.push({
      id: `mock-user-${now}-${i}`,
      name: `User ${n}`,
      email: `user${n}.${now}@example.com`,
      userName: `user_${n}_${now}`,
      avatarUrl: `https://ui-avatars.com/api/?name=User+${n}&background=000000&color=FFFFFF`,
      totalXp: randomXp(),
    });
  }

  const result = await prisma.user.createMany({
    data: usersToInsert,
    skipDuplicates: true,
  });

  const finalCount = await prisma.user.count();
  console.log(`Added ${result.count} users. Total users now: ${finalCount}.`);
}

main()
  .catch((error) => {
    console.error("Failed to add mock users:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
