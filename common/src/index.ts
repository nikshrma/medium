import z from "zod";

export const signupInput = z.object({
    username: z.email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>

export const signinInput = z.object({
    username: z.email(),
    password: z.string().min(6),
})

export type SigninInput = z.infer<typeof signinInput>

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
})
export type CreateBlogInput = z.infer<typeof createBlogInput>

export const updateBlogInput = z
  .object({
    id: z.uuid(),
    title: z.string().optional(),
    content: z.string().optional()
  })
  .refine(
    data => data.title !== undefined || data.content !== undefined,
    { message: "At least one field must be updated" }
  );

export type UpdateBlogInput = z.infer<typeof updateBlogInput>

export const updateBlogVisibilityInput = z.object({
  id: z.uuid(),
  published: z.boolean()
});
export type UpdateBlogVisibilityInput = z.infer<typeof updateBlogVisibilityInput>
