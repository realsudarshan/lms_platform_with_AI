"use client";

import { useAuth } from "@clerk/nextjs";
import { CourseHero } from "./CourseHero";
import { ModuleAccordion } from "./ModuleAccordion";
import { CourseCompleteButton } from "./CourseCompleteButton";
import { GatedFallback } from "./GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";

interface CourseContentProps {
  course: NonNullable<COURSE_WITH_MODULES_QUERYResult>;
  userId: string | null;
}

export function CourseContent({ course, userId }: CourseContentProps) {
  const { isLoaded: isAuthLoaded } = useAuth();
  const userTier = useUserTier();

  // Check if user has access to this course
  const hasAccess = hasTierAccess(userTier, course.tier);

  // Calculate completion stats from actual lesson data
  let totalLessons = 0;
  let completedLessons = 0;

  for (const m of course.modules ?? []) {
    for (const l of m.lessons ?? []) {
      totalLessons++;
      if (userId && l.completedBy?.includes(userId)) {
        completedLessons++;
      }
    }
  }

  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

  if (!isAuthLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description ?? null}
        tier={course.tier}
        thumbnail={course.thumbnail}
        category={course.category}
        moduleCount={course.moduleCount}
        lessonCount={course.lessonCount}
      />

      {hasAccess ? (
        <div className="space-y-8">
          {/* Course completion progress */}
          {userId && (
            <CourseCompleteButton
              courseId={course._id}
              courseSlug={course.slug!.current!}
              isCompleted={isCourseCompleted}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
            />
          )}

          <ModuleAccordion modules={course.modules ?? null} userId={userId} />
        </div>
      ) : (
        <GatedFallback requiredTier={course.tier} />
      )}
    </>
  );
}