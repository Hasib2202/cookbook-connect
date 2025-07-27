"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import toast from "react-hot-toast"

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})

type RatingFormData = z.infer<typeof ratingSchema>

interface RatingFormProps {
  recipeId: string
  existingRating?: {
    rating: number
    comment: string | null
  }
}

export function RatingForm({ recipeId, existingRating }: RatingFormProps) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: existingRating?.rating || 0,
      comment: existingRating?.comment || ""
    }
  })

  const watchedRating = form.watch("rating")

  async function onSubmit(data: RatingFormData) {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(existingRating ? "Rating updated!" : "Rating submitted!")
        // Optionally refresh the page or update the UI
        window.location.reload()
      } else {
        toast.error("Failed to submit rating")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="focus:outline-none"
                      onMouseEnter={() => setHoveredStar(i + 1)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => field.onChange(i + 1)}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < (hoveredStar || watchedRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts about this recipe..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!watchedRating || isLoading}>
          {isLoading 
            ? "Submitting..." 
            : existingRating 
              ? "Update Rating" 
              : "Submit Rating"
          }
        </Button>
      </form>
    </Form>
  )
}