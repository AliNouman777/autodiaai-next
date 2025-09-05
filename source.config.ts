// source.config.ts
import { defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

// Allow either absolute URL or site-absolute path
const urlOrPath = z
  .string()
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Must be a full URL (https://...) or a path starting with /",
  });

export const blog = defineDocs({
  dir: "blog/content",
  docs: {
    schema: frontmatterSchema.extend({
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(155).optional(),
      title: z.string(),
      description: z.string(),
      author: z.string().optional(),
      date: z.union([z.string(), z.date()]),
      modified: z.union([z.string(), z.date()]).optional(),
      tags: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      cover: urlOrPath.optional(), 
      readTime: z.string().optional(),
    }),
  },
});
