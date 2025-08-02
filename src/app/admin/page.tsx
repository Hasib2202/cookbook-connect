'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  name: string | null
  email: string
  emailVerified: string | null
  createdAt: string
}

interface VerificationToken {
  identifier: string
  token: string
  expires: string
  isExpired: boolean
}

interface DatabaseData {
  counts: {
    totalUsers: number
    totalRecipes: number
    totalSessions: number
    totalVerificationTokens: number
  }
  recentUsers: User[]
  verificationTokens: VerificationToken[]
  message: string
}

export default function AdminPage() {
  const [data, setData] = useState<DatabaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/debug/database')
      if (!response.ok) {
        throw new Error('Failed to fetch database data')
      }
      const result = await response.json()
      setData(result)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading database information...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database Admin Panel</h1>
        <Button onClick={fetchData}>Refresh</Button>
      </div>

      {/* Database Counts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.counts.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.counts.totalRecipes || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.counts.totalSessions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verification Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.counts.totalVerificationTokens || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentUsers && data.recentUsers.length > 0 ? (
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{user.name || 'No name'}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {user.emailVerified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                  </div>
                  {user.emailVerified && (
                    <p className="text-xs text-green-600 mt-1">
                      Verified: {new Date(user.emailVerified).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </CardContent>
      </Card>

      {/* Verification Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.verificationTokens && data.verificationTokens.length > 0 ? (
            <div className="space-y-4">
              {data.verificationTokens.map((token, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{token.identifier}</p>
                      <p className="text-sm text-gray-600 font-mono">{token.token}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(token.expires).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {token.isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="default">Valid</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No verification tokens found</p>
          )}
        </CardContent>
      </Card>

      {/* Database Message */}
      <Card>
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data?.message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
