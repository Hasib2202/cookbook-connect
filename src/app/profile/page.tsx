import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { ProfileForm } from "@/components/profile/profile-form"
import { AccountSettings } from "@/components/profile/account-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, Shield } from "lucide-react"

async function getUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          recipes: true,
          favorites: true,
          ratings: true
        }
      }
    }
  })
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await getUser(session.user.id)
  
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProfileForm user={user} />
                    </CardContent>
                  </Card>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Recipes Created</span>
                        <span className="font-semibold">{user._count.recipes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Favorite Recipes</span>
                        <span className="font-semibold">{user._count.favorites}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Reviews Given</span>
                        <span className="font-semibold">{user._count.ratings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-semibold">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccountSettings user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Data & Privacy</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Profile Visibility</p>
                            <p className="text-sm text-gray-600">
                              Control who can see your profile information
                            </p>
                          </div>
                          <select className="border rounded-md px-3 py-2">
                            <option>Public</option>
                            <option>Private</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Recipe Visibility</p>
                            <p className="text-sm text-gray-600">
                              Default visibility for new recipes
                            </p>
                          </div>
                          <select className="border rounded-md px-3 py-2">
                            <option>Public</option>
                            <option>Private</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">
                              Receive emails about recipe updates and community activity
                            </p>
                          </div>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                      <div className="border border-red-200 rounded-lg p-4">
                        <p className="font-medium text-red-600 mb-2">Delete Account</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
