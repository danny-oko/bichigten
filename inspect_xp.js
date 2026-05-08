require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
(async () => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
    const users = await prisma.user.findMany({ select: { id: true, email: true, userName: true, totalXp: true } });
    console.log('USERS', JSON.stringify(users, null, 2));
    const progress = await prisma.userLessonProgress.findMany({ select: { id: true, userId: true, lessonId: true, xpEarned: true, mistakeCount: true, status: true, completedAt: true } });
    console.log('PROGRESS', JSON.stringify(progress, null, 2));
    await prisma.$disconnect();
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
