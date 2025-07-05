import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email, password, fullName, username } = req.body

  if (!email || !password || !fullName || !username) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Check if username already exists
  const { data: existingUser, error: findError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return res.status(409).json({ error: 'Username already taken' })
  }

  // Sign up user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username
      }
    }
  })

  if (signUpError) {
    return res.status(500).json({ error: signUpError.message })
  }

  return res.status(200).json({ message: 'Signup successful', user: signUpData.user })
}
