"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  image: z.string().url().optional().or(z.literal(""))
})

type ProfileFormData = z.infer<typeof profileSchema>

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
}

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [currentImage, setCurrentImage] = useState(user.image || "")
  const { update } = useSession()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      image: user.image || ""
    }
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImageUploading(true)

    try {
      // Check file size (limit to 5MB for profile images)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        toast.error(`Image is ${fileSizeMB}MB. Please use images under 5MB.`)
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`Please select a valid image file.`)
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "profiles") // Upload to profiles folder

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Upload failed" }))
        throw new Error(errorData.error || "Failed to upload image")
      }

      const { url } = await response.json()
      setCurrentImage(url)
      form.setValue("image", url)
      toast.success("Profile image uploaded successfully!")
      
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsImageUploading(false)
      // Reset the file input
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const removeImage = () => {
    setCurrentImage("")
    form.setValue("image", "")
    toast.success("Profile image removed")
  }

  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // Update the session with new user data to refresh the header
        try {
          await update({
            name: updatedUser.name,
            image: updatedUser.image
          })
        } catch (updateError) {
          console.log("Session update error (this is normal):", updateError)
        }
        
        toast.success("Profile updated successfully!")
        
        // Force a hard refresh to ensure the header image updates
        // This is more reliable than relying on session update
        setTimeout(() => {
          window.location.href = window.location.href
        }, 1000)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentImage} alt={user.name || ""} />
              <AvatarFallback className="text-lg text-white bg-orange-500">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {isImageUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <label htmlFor="profile-image-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    {isImageUploading ? "Uploading..." : "Change Photo"}
                  </span>
                </Button>
              </label>
              {currentImage && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={removeImage}
                  disabled={isImageUploading}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              id="profile-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isImageUploading}
            />
            <p className="text-sm text-gray-500">
              JPG, PNG up to 5MB
            </p>
          </div>
        </div>

        {/* Preview uploaded image */}
        {currentImage && currentImage !== user.image && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center space-x-3">
              <div className="relative w-16 h-16 overflow-hidden rounded-lg">
                <Image
                  src={currentImage}
                  alt="New profile image"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">New profile image uploaded</p>
                <p className="text-xs text-green-600">Save changes to update your profile</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input 
              value={user.email} 
              disabled 
              className="mt-1 bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed here - use Account settings
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                {form.watch("bio")?.length || 0}/200 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || isImageUploading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
