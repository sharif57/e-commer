import Register from '@/components/auth/register'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

export default function page() {
  return (
    <main className=" p-4">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>
        <Register />
      </GoogleOAuthProvider>
    </main>
  )
}
