import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: session, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error in OAuth process', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`)
    }

    // Get the user id from the OAuth provider
    const userId = session.user.id

    // Check if the user already exists in the user_credits db
    const { data: user, error: userError } = await supabase
      .from('user_credits')
      .select('user_id')
      .eq('user_id', userId)


    if (userError) {
      console.error('Error fetching user', userError)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not fetch user`)
    }

    // If user doesn't exist create new user in the database and add an entry into the user_credits table
    if (!user.length) {
      const { error: insertError } = await supabase
        .from('user_credits')
        .insert([{ user_id: userId, credit_amount: 10 }]) // new user gets 10 seconds of generation

      if (insertError) {
        console.error('Error creating user', insertError)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not create user`)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
