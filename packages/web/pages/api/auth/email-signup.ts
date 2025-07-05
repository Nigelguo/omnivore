import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Initialise Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { email, password, fullName, username } = req.body

  if (!email || !password || !fullName || !username) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (checkError) throw checkError
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' })
    }

    // Create user with email/password
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        fullName,
        username
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ message: 'User created', user: data.user })
  } catch (err: any) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
