import { z } from "zod";

// Create reusable schemas for nested objects
const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.string().min(1, "Amount is required"),
  unit: z.string().min(1, "Unit is required"),
});

const instructionSchema = z.object({
  step: z.number(),
  instruction: z.string().min(1, "Instruction is required"),
});

// Form schema (for the frontend form)
export const recipeFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  prepTime: z.number().min(1, "Prep time must be at least 1 minute"),
  cookTime: z.number().min(1, "Cook time must be at least 1 minute"),
  servings: z.number().min(1, "Servings must be at least 1"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.string().min(1, "Category is required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.array(instructionSchema).min(1, "At least one instruction is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

// API schema (for the backend API - transforms arrays to JSON strings)
export const recipeSchema = recipeFormSchema.transform((data) => ({
  ...data,
  // Convert arrays to JSON strings for database storage
  images: JSON.stringify(data.images),
  ingredients: JSON.stringify(data.ingredients),
  instructions: JSON.stringify(data.instructions),
}));

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type RecipeApiData = z.infer<typeof recipeSchema>;