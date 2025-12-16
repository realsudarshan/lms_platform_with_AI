import { BlockContentIcon, UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const moduleType = defineType({
  name: "module",
  title: "Module",
  type: "document",
  icon: BlockContentIcon,
  groups: [
    {
      name: "content",
      title: "Content",
      icon: BlockContentIcon,
      default: true,
    },
    { name: "lessons", title: "Lessons" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => [
        Rule.required().error("Module title is required"),
        Rule.max(100).warning("Keep module titles concise"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "content",
      description: "Brief overview of what this module covers",
      validation: (Rule) => [
        Rule.max(500).warning("Keep descriptions under 500 characters"),
      ],
    }),
    defineField({
      name: "lessons",
      type: "array",
      group: "lessons",
      description: "Lessons in this module",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "lesson" }],
        }),
      ],
      validation: (Rule) => [
        Rule.unique().error("Each lesson can only appear once in a module"),
      ],
    }),
    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description:
        "List of user IDs who have completed all lessons in this module",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      lessons: "lessons",
    },
    prepare({ title, lessons }) {
      const lessonCount = lessons?.length ?? 0;

      return {
        title: title || "Untitled Module",
        subtitle: `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
        media: BlockContentIcon,
      };
    },
  },
});