import { z } from "zod"

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  prepTime: z.number().min(1, "Prep time must be at least 1 minute"),
  cookTime: z.number().min(1, "Cook time must be at least 1 minute"),
  servings: z.number().min(1, "Servings must be at least 1"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.string().min(1, "Category is required"),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    unit: z.string().min(1)
  })).min(1, "At least one ingredient is required"),
  instructions: z.array(z.object({
    step: z.number(),
    instruction: z.string().min(1)
  })).min(1, "At least one instruction is required"),
  images: z.array(z.string()).min(1, "At least one image is required")
}).transform((data) => ({
  ...data,
  images: JSON.stringify(data.images),
  ingredients: JSON.stringify(data.ingredients),
  instructions: JSON.stringify(data.instructions)
}))

export type RecipeFormData = z.infer<typeof recipeSchema>