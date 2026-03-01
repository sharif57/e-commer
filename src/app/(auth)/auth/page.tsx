
import SignInForm from "@/components/auth/login"
import { GoogleOAuthProvider } from "@react-oauth/google";


export default function SignInPage() {
  return (
    <main className="flex items-center justify-center p-4">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>
         <SignInForm />
      </GoogleOAuthProvider>
    </main>
  )
}
