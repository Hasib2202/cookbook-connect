"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertCircle, Key, Mail, Shield, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import toast from "react-hot-toast"

const emailChangeSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required for security")
})

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm your new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type EmailChangeFormData = z.infer<typeof emailChangeSchema>
type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
}

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const emailForm = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      password: ""
    }
  })

  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  const handleEmailChange = async (data: EmailChangeFormData) => {
    setIsChangingEmail(true)

    try {
      const response = await fetch("/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success("Email change verification sent to your new email address!")
        emailForm.reset()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to send verification email")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success("Password updated successfully!")
        passwordForm.reset()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update password")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Account deleted successfully")
        // Redirect to home page or login
        window.location.href = "/"
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete account")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="space-y-8">
      {/* Email Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Email Settings
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-email">Current Email</Label>
            <Input 
              id="current-email"
              value={user.email}
              disabled
              className="mt-1 bg-gray-50"
            />
          </div>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailChange)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter new email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={emailForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your current password for security"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" variant="outline" disabled={isChangingEmail}>
                {isChangingEmail ? "Sending..." : "Change Email"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <Separator />

      {/* Password Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Password & Security
        </h3>
        <div className="space-y-4">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter new password (min 8 characters)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" variant="outline" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <Separator />

      {/* Security Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security & Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Login Sessions</p>
              <p className="text-sm text-gray-600">
                Manage your active login sessions
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Download Your Data</p>
              <p className="text-sm text-gray-600">
                Get a copy of your account data
              </p>
            </div>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        <div className="border border-red-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-red-600 mb-2">Delete Account</p>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>All your recipes will be permanently deleted</li>
                <li>Your reviews and ratings will be removed</li>
                <li>Your favorites collection will be lost</li>
                <li>This action cannot be reversed</li>
              </ul>
            </div>
          </div>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="delete-confirmation">
                    Type <strong>DELETE</strong> to confirm
                  </Label>
                  <Input 
                    id="delete-confirmation"
                    placeholder="Type DELETE here"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE"}
                >
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
