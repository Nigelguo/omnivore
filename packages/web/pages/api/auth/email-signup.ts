import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (username.length < 4) {
      setError('Username must be at least 4 characters')
      return
    }

    const res = await fetch('/api/auth/email-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, fullName, username })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSuccess('')
    } else {
      setSuccess('Signup successful! Please check your email.')
      setError('')
      setEmail('')
      setPassword('')
      setFullName('')
      setUsername('')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        {username && username.length < 4 && (
          <p style={{ color: 'red' }}>Username should contain at least four characters</p>
        )}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 20, width: '100%' }}
        />

        <button type="submit" style={{ width: '100%' }}>Sign Up</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: 20 }}>{success}</p>}
    </div>
  )
}
