import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        // Get verification tokens
        const tokens = await prisma.verificationToken.findMany({
            orderBy: { expires: 'desc' }
        })

        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Viewer - Cookbook Connect</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .section { margin-bottom: 30px; }
            .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: #fafafa; }
            .verified { color: green; font-weight: bold; }
            .not-verified { color: red; font-weight: bold; }
            .expired { color: #888; text-decoration: line-through; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; }
            .stat { background: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; }
            h1, h2 { color: #333; }
            .refresh { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        </style>
        <script>
            function refreshPage() { window.location.reload(); }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>📊 Cookbook Connect - Database Viewer</h1>
            <button class="refresh" onclick="refreshPage()">🔄 Refresh Data</button>
            
            <div class="stats">
                <div class="stat">
                    <h3>${users.length}</h3>
                    <p>Total Users</p>
                </div>
                <div class="stat">
                    <h3>${users.filter(u => u.emailVerified).length}</h3>
                    <p>Verified Users</p>
                </div>
                <div class="stat">
                    <h3>${tokens.length}</h3>
                    <p>Verification Tokens</p>
                </div>
                <div class="stat">
                    <h3>${tokens.filter(t => new Date() > t.expires).length}</h3>
                    <p>Expired Tokens</p>
                </div>
            </div>

            <div class="section">
                <h2>👥 Users (${users.length})</h2>
                ${users.length === 0 ? '<p>No users found in database.</p>' : ''}
                ${users.map(user => `
                    <div class="card">
                        <h3>${user.name || 'No Name'} ${user.emailVerified ? '<span class="verified">✅ VERIFIED</span>' : '<span class="not-verified">❌ NOT VERIFIED</span>'}</h3>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>ID:</strong> ${user.id}</p>
                        <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                        ${user.emailVerified ? `<p><strong>Verified:</strong> ${new Date(user.emailVerified).toLocaleString()}</p>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2>🔑 Verification Tokens (${tokens.length})</h2>
                ${tokens.length === 0 ? '<p>No verification tokens found.</p>' : ''}
                ${tokens.map(token => {
            const isExpired = new Date() > token.expires;
            const timeLeft = isExpired ? 'EXPIRED' : Math.floor((token.expires.getTime() - new Date().getTime()) / (1000 * 60)) + ' minutes left';
            return `
                    <div class="card ${isExpired ? 'expired' : ''}">
                        <h3>${token.identifier} ${isExpired ? '⏰ EXPIRED' : '⏳ VALID'}</h3>
                        <p><strong>Token:</strong> ${token.token.substring(0, 16)}...${token.token.substring(token.token.length - 8)}</p>
                        <p><strong>Expires:</strong> ${new Date(token.expires).toLocaleString()}</p>
                        <p><strong>Status:</strong> ${timeLeft}</p>
                    </div>
                `;
        }).join('')}
            </div>

            <div class="section">
                <h2>🔍 Test Links</h2>
                <div class="card">
                    <p><a href="/api/debug/database" target="_blank">📋 JSON Debug Data</a></p>
                    <p><a href="/admin" target="_blank">🛠️ Admin Dashboard</a></p>
                    <p><a href="/register" target="_blank">📝 Registration Page</a></p>
                    <p><a href="/login" target="_blank">🔐 Login Page</a></p>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
                <small>Last updated: ${new Date().toLocaleString()} | Cookbook Connect Database Viewer</small>
            </div>
        </div>
    </body>
    </html>
    `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' }
        })
    } catch (error) {
        console.error("Database viewer error:", error)
        return new NextResponse(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Database Viewer Error</h1>
          <p style="color: red;">Failed to fetch database data: ${error instanceof Error ? error.message : String(error)}</p>
          <a href="javascript:history.back()">← Go Back</a>
        </body>
      </html>
    `, {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        })
    }
}
