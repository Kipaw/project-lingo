import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "../quiz";

type Props = {
  params: Promise<{ lessonId: string }>;
};

const LessonIdPage = async ({ params }: Props) => {
  const { lessonId } = await params;
  const id = Number(lessonId);

  if (Number.isNaN(id)) {
    redirect("/learn");
  }

  const lessonData = getLesson(id);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage = lesson.challenges.length
    ? (lesson.challenges.filter((challenge) => challenge.completed).length /
        lesson.challenges.length) *
      100
    : 0;

  return (
    <Quiz
      key={lesson.id}
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonIdPage;
