import { BlockContentIcon, BookIcon, PlayIcon, TagIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("LMS Content")
    .items([
      S.listItem()
        .title("Course")
        .icon(BookIcon)
        .child(S.documentTypeList("course").title("Course")),
      S.listItem()
        .title("Module")
        .icon(BlockContentIcon)
        .child(S.documentTypeList("module").title("Module")),
      S.listItem()
        .title("Lesson")
        .icon(PlayIcon)
        .child(S.documentTypeList("lesson").title("Lesson")),
      S.divider(),
      S.listItem()
        .title("Category")
        .icon(TagIcon)
        .child(
          S.documentTypeList("category")
            .title("Category")
            .child((categoryId) =>
              S.list()
                .title("Category")
                .items([
                  S.listItem()
                    .title("Category Details")
                    .icon(TagIcon)
                    .child(
                      S.document().schemaType("category").documentId(categoryId)
                    ),
                  S.listItem()
                    .title("Course in Category")
                    .icon(BookIcon)
                    .child(
                      S.documentList()
                        .title("Course")
                        .filter(
                          '_type == "course" && category._ref == $categoryId'
                        )
                        .params({ categoryId })
                    ),
                ])
            )
        ),
    ]);