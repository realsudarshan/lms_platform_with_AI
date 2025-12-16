import { BookIcon, UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "details", title: "Details", icon: BookIcon, default: true },
    { name: "modules", title: "Modules" },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      validation: (Rule) => [
        Rule.required().error("Course title is required"),
        Rule.max(100).warning("Keep course titles concise for better display"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      description: "Compelling description of what students will learn",
      validation: (Rule) => [
        Rule.required().error(
          "Description helps students understand the course"
        ),
        Rule.min(50).warning("Add more detail to help students decide"),
        Rule.max(1000).warning("Keep descriptions focused and scannable"),
      ],
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      group: "details",
      description:
        "Course thumbnail image (16:9 ratio recommended). If not provided, a placeholder will be shown.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
      description: "Primary category for this course",
      validation: (Rule) => [
        Rule.required().error("Category helps students find your course"),
      ],
    }),
    defineField({
      name: "tier",
      type: "string",
      group: "settings",
      description: "Access tier required to view this course",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "Pro", value: "pro" },
          { title: "Ultra", value: "ultra" },
        ],
        layout: "radio",
      },
      initialValue: "free",
      validation: (Rule) => [
        Rule.required().error("Select an access tier for this course"),
      ],
    }),
    defineField({
      name: "modules",
      type: "array",
      group: "modules",
      description: "Course modules in order",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "module" }],
        }),
      ],
      validation: (Rule) => [
        Rule.unique().error("Each module can only appear once in a course"),
        Rule.min(1).warning("Add at least one module to your course"),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "settings",
      description: "Feature this course on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description: "List of user IDs who have completed the entire course",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      thumbnail: "thumbnail",
      tier: "tier",
      featured: "featured",
      modules: "modules",
    },
    prepare({ title, thumbnail, tier, featured, modules }) {
      const moduleCount = modules?.length ?? 0;
      const tierEmojiMap: Record<string, string> = {
        free: "🆓",
        pro: "⭐",
        ultra: "💎",
      };
      const tierEmoji = (tier && tierEmojiMap[tier]) || "";
      const featuredLabel = featured ? " • Featured" : "";

      return {
        title: `${tierEmoji} ${title || "Untitled Course"}`,
        subtitle: `${moduleCount} module${moduleCount === 1 ? "" : "s"}${featuredLabel}`,
        media: thumbnail || BookIcon,
      };
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Recently Updated",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
});