import type { SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { courseType } from "./courseType";
import { lessonType } from "./lessonType";
import { moduleType } from "./moduleType";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [courseType, moduleType, lessonType, categoryType],
};