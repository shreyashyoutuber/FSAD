import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthSuccess() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        const email = searchParams.get('email')
        const name = searchParams.get('name')

        if (token && email) {
            // --- Matching existing login system keys ---
            
            // 1. JWT for API calls
            localStorage.setItem('token', token)
            
            // 2. Complete user object (Standardized key 'user')
            const user = { 
                name: name || 'Google User', 
                email: email,
                phone: '0000000000',
                savedIdeas: '[]'
            }
            localStorage.setItem('user', JSON.stringify(user))

            // Success redirect
            navigate('/user-dashboard')
        } else {
            console.error('Missing auth parameters')
            navigate('/login?error=Authentication failed')
        }
    }, [searchParams, navigate])

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Authenticating...</div>
                <div style={{ color: '#94a3b8' }}>Completing your secure sign-in</div>
            </div>
        </div>
    )
}
