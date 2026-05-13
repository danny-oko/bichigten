import LessonProgressCard from "@/app/(dashboard)/home/_components/LessonProgressCard";
import { loadProfileAsideLessonProgress } from "@/lib/server/profile-aside-data";

export default async function ProfileAsideLessonProgressWrapper({
  userId,
}: {
  userId: string;
}) {
  const data = await loadProfileAsideLessonProgress(userId);
  return (
    <LessonProgressCard
      completedLessons={data.completedLessons}
      totalLessons={data.totalLessons}
      nextLessonHref={data.nextLessonHref}
      nextLessonTitle={data.nextLessonTitle}
    />
  );
}
