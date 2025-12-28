import { sanityFetch } from "@/sanity/lib/live";
import { tool } from "ai";
import { defineQuery } from "next-sanity";
import { z } from "zod";

// Simple but effective search query - searches all courses and filters in JS for reliability
const ALL_COURSES_WITH_CONTENT_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  tier,
  "category": category->title,
  modules[]-> {
    _id,
    title,
    description,
    lessons[]-> {
      _id,
      title,
      "slug": slug.current,
      description,
      "contentText": pt::text(content)
    }
  }
}`);

const courseSearchSchema = z.object({
    query: z
        .string()
        .describe(
            "The topic, skill, technology, or learning goal the user wants to learn about"
        ),
});

interface Lesson {
    _id: string;
    title: string;
    slug: string | null;
    description: string | null;
    contentText: string | null;
}

interface Module {
    _id: string;
    title: string;
    description: string | null;
    lessons?: Lesson[];
}

interface Course {
    _id: string;
    title: string;
    slug: string;
    description: string;
    tier: string;
    category: string | null;
    modules?: Module[];
}

// Generic terms that should match all courses with a low score
const GENERIC_TERMS = ["course", "courses", "program", "programming", "learn", "learning", "all", "everything", "catalog", "academy"];

// Helper function to check if text contains search term (case-insensitive)
function textContains(
    text: string | null | undefined,
    searchTerm: string
): boolean {
    if (!text) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
}

// Score a course based on how well it matches the search query
function scoreCourse(course: Course, searchTerms: string[]): number {
    let score = 0;

    for (const term of searchTerms) {
        const isGeneric = GENERIC_TERMS.includes(term.toLowerCase());

        // If it's a generic term, give a small base score to all courses
        if (isGeneric) {
            score += 10;
        }

        // Title matches are most valuable
        if (textContains(course.title, term)) score += 100;

        // Description matches
        if (textContains(course.description, term)) score += 50;

        // Category matches
        if (textContains(course.category, term)) score += 30;

        // Module matches
        for (const module of course.modules || []) {
            if (textContains(module.title, term)) score += 20;
            if (textContains(module.description, term)) score += 10;

            // Lesson matches
            for (const lesson of module.lessons || []) {
                if (textContains(lesson.title, term)) score += 15;
                if (textContains(lesson.description, term)) score += 8;
                if (textContains(lesson.contentText, term)) score += 5;
            }
        }
    }

    return score;
}

export const searchCoursesTool = tool({
    description:
        "Search through all courses, modules, and lessons by topic, skill, or learning goal. This searches course titles, descriptions, module content, and lesson content to find the most relevant learning material.",
    inputSchema: courseSearchSchema,
    execute: async ({ query }: z.infer<typeof courseSearchSchema>) => {
        
        const { data: allCourses } = await sanityFetch({
            query: ALL_COURSES_WITH_CONTENT_QUERY,
        });

       
        const searchTerms = query
            .toLowerCase()
            .split(/\s+/)
            .filter((term) => term.length > 1);

        if (searchTerms.length === 0) {
            return {
                found: false,
                message: "Please provide a search term.",
                courses: [],
            };
        }

        
        const scoredCourses = (allCourses as Course[])
            .map((course) => ({
                course,
                score: scoreCourse(course, searchTerms),
            }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        if (scoredCourses.length === 0) {
            return {
                found: false,
                message: "No courses, modules, or lessons found matching your query.",
                courses: [],
            };
        }

        // Format the results with full content details
        const formattedCourses = scoredCourses.map(({ course }) => {
            const modules = course.modules || [];
            const moduleDetails = modules.map((module) => {
                const lessons = module.lessons || [];
                return {
                    title: module.title,
                    description: module.description,
                    lessons: lessons.map((lesson) => ({
                        title: lesson.title,
                        slug: lesson.slug,
                        description: lesson.description,
                        // Include lesson content for the AI to answer questions from
                        // Larger preview to give AI enough context to answer questions
                        contentPreview: lesson.contentText
                            ? lesson.contentText.slice(0, 2000) +
                            (lesson.contentText.length > 2000 ? "..." : "")
                            : null,
                        lessonUrl: lesson.slug ? `/lessons/${lesson.slug}` : null,
                    })),
                };
            });

            return {
                id: course._id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                tier: course.tier,
                category: course.category,
                url: `/courses/${course.slug}`,
                moduleCount: moduleDetails.length,
                lessonCount: moduleDetails.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0
                ),
                modules: moduleDetails,
            };
        });

        return {
            found: true,
            message: `Found ${scoredCourses.length} course${scoredCourses.length === 1 ? "" : "s"} with relevant content.`,
            courses: formattedCourses,
        };
    },
});