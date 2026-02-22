import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '', remember: false, captchaInput: '' })
    const [captcha, setCaptcha] = useState(generateCaptcha())
    const [error, setError] = useState('')
    const [isHovered, setIsHovered] = useState(null)

    const refreshCaptcha = () => setCaptcha(generateCaptcha())

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.captchaInput.toUpperCase() !== captcha) {
            setError('Captcha does not match. Please try again.')
            refreshCaptcha()
            setForm(f => ({ ...f, captchaInput: '' }))
            return
        }
        sessionStorage.setItem('bhvUser', form.email)
        const name = form.email.split('@')[0]
        localStorage.setItem('userData', JSON.stringify({
            name, email: form.email, phone: '+91 98765 43210',
            property: { type: '2BHK Apartment', location: 'Sector 62, Noida', currentValue: 5000000, size: 1250, age: 8, locationRating: 4.2 }
        }))
        navigate('/user-dashboard')
    }

    const handleGoogle = () => {
        sessionStorage.setItem('bhvUser', 'google-user@gmail.com')
        localStorage.setItem('userData', JSON.stringify({
            name: 'Google User', email: 'google-user@gmail.com', phone: '+91 98765 43210',
            property: { type: '2BHK Apartment', location: 'Sector 62, Noida', currentValue: 5000000, size: 1250, age: 8, locationRating: 4.2 }
        }))
        navigate('/user-dashboard')
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: '#fdf6ee',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}>
            {/* Left Side: Visual/Branding (Hidden on mobile) */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1470") center/cover no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }} className="login-sidebar">
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div
                        onClick={() => navigate('/')}
                        style={{
                            fontSize: '32px',
                            fontWeight: 800,
                            marginBottom: '40px',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        Bharat<span style={{ color: '#e67e22' }}>Home</span> Value
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                        Transform Your Space <br /> with Confidence.
                    </h1>
                    <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6, marginBottom: '40px' }}>
                        Access personalized estimates, expert recommendations, and professional interior design solutions tailored just for you.
                    </p>

                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#e67e22' }}>10k+</h4>
                            <p style={{ fontSize: '14px', opacity: 0.8 }}>Homes Estimated</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#e67e22' }}>500+</h4>
                            <p style={{ fontSize: '14px', opacity: 0.8 }}>Expert Designers</p>
                        </div>
                    </div>
                </div>
                {/* Subtle Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    bottom: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(230, 126, 34, 0.2)',
                    borderRadius: '50%',
                    filter: 'blur(80px)'
                }} />
            </div>

            {/* Right Side: Login Form */}
            <div style={{
                width: '100%',
                maxWidth: '560px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: 'white'
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Welcome Back</h2>
                        <p style={{ color: '#636e72', fontSize: '16px' }}>Login to access your personalized dashboard</p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            marginBottom: '24px',
                            border: '1px solid #fecaca',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="name@example.com"
                                required
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '2px solid #f0ece6',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: '0.3s',
                                    background: '#fdf6ee'
                                }}
                                onFocus={e => (e.target.style.borderColor = '#e67e22')}
                                onBlur={e => (e.target.style.borderColor = '#f0ece6')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '2px solid #f0ece6',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: '0.3s',
                                    background: '#fdf6ee'
                                }}
                                onFocus={e => (e.target.style.borderColor = '#e67e22')}
                                onBlur={e => (e.target.style.borderColor = '#f0ece6')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fdf6ee', padding: '16px', borderRadius: '12px', border: '1px solid #f0ece6' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#636e72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verification Code</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #e67e22, #d35400)',
                                    color: 'white',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    fontSize: '20px',
                                    fontWeight: 800,
                                    letterSpacing: '4px',
                                    userSelect: 'none',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {captcha}
                                </div>
                                <button
                                    type="button"
                                    onClick={refreshCaptcha}
                                    style={{
                                        background: 'white',
                                        border: '2px solid #f0ece6',
                                        borderRadius: '8px',
                                        width: '44px',
                                        height: '44px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        transition: '0.3s'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#e67e22')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#f0ece6')}
                                    title="Refresh Captcha"
                                >
                                    🔄
                                </button>
                            </div>
                            <input
                                type="text"
                                value={form.captchaInput}
                                onChange={e => setForm({ ...form, captchaInput: e.target.value.toUpperCase() })}
                                placeholder="Enter characters above"
                                autoComplete="off"
                                required
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '2px solid #f0ece6',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: '0.3s',
                                    textTransform: 'uppercase'
                                }}
                                onFocus={e => (e.target.style.borderColor = '#e67e22')}
                                onBlur={e => (e.target.style.borderColor = '#f0ece6')}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#636e72' }}>
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={e => setForm({ ...form, remember: e.target.checked })}
                                    style={{ accentColor: '#e67e22' }}
                                />
                                Remember me
                            </label>
                            <a
                                onClick={() => navigate('/forgot-password')}
                                style={{ color: '#e67e22', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: '0.3s',
                                boxShadow: '0 6px 20px rgba(230, 126, 34, 0.3)',
                                marginTop: '8px'
                            }}
                            onMouseEnter={e => (e.target.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => (e.target.style.transform = 'translateY(0)')}
                        >
                            Sign In
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#f0ece6' }} />
                        <span style={{ color: '#b2bec3', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: '#f0ece6' }} />
                    </div>

                    <button
                        onClick={handleGoogle}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '2px solid #f0ece6',
                            background: 'white',
                            color: '#1a1a1a',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: '0.3s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#e67e22')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#f0ece6')}
                    >
                        <svg width="20" height="20" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '32px', color: '#636e72', fontSize: '15px' }}>
                        Don&apos;t have an account?{' '}
                        <a
                            onClick={() => navigate('/signup')}
                            style={{ color: '#e67e22', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Create Account
                        </a>
                    </p>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <a
                            onClick={() => navigate('/')}
                            style={{ color: '#b2bec3', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .login-sidebar { display: none !important; }
                }
            `}</style>
        </div>
    )
}

