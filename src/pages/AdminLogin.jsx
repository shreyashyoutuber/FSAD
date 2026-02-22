import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function AdminLogin() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '', captchaInput: '' })
    const [captcha, setCaptcha] = useState(generateCaptcha())
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.captchaInput.toUpperCase() !== captcha) {
            setError('Verification failed. Please try again.')
            setCaptcha(generateCaptcha()); setForm(f => ({ ...f, captchaInput: '' })); return
        }
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminEmail', form.email)
        localStorage.setItem('adminLoginTime', Date.now())
        navigate('/admin-dashboard')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: 'white',
                borderRadius: '20px',
                padding: '48px 40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                animation: 'slideUp 0.5s ease'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        onClick={() => navigate('/')}
                        style={{
                            fontSize: '26px',
                            fontWeight: 800,
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'inline-block',
                            marginBottom: '32px'
                        }}
                    >
                        Bharat<span style={{ color: '#e67e22' }}>Home</span> Value
                    </div>

                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#fff7ed',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: '1px solid #ffedd5',
                        fontSize: '24px'
                    }}>
                        🔐
                    </div>
                    <h2 style={{ color: '#1e293b', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Admin Access</h2>
                    <p style={{ color: '#64748b', fontSize: '15px' }}>Management Portal Secure Login</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        marginBottom: '24px',
                        border: '1px solid #ffe4e6',
                        textAlign: 'center',
                        fontWeight: 600
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#475569', fontSize: '13px', fontWeight: 700 }}>Admin Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="admin@example.com"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                color: '#1e293b',
                                fontSize: '15px',
                                outline: 'none',
                                transition: '0.3s'
                            }}
                            onFocus={e => (e.target.style.borderColor = '#e67e22')}
                            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#475569', fontSize: '13px', fontWeight: 700 }}>Access Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••••••"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                color: '#1e293b',
                                fontSize: '15px',
                                outline: 'none',
                                transition: '0.3s'
                            }}
                            onFocus={e => (e.target.style.borderColor = '#e67e22')}
                            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>

                    <div style={{ background: '#fffaf5', padding: '20px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Security Check</span>
                            <button type="button" onClick={() => setCaptcha(generateCaptcha())} style={{ background: 'none', border: 'none', color: '#e67e22', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Refresh</button>
                        </div>
                        <div style={{
                            background: 'white', border: '2px solid #ffedd5',
                            padding: '12px', textAlign: 'center', fontSize: '24px', fontWeight: 800,
                            color: '#e67e22', letterSpacing: '8px', marginBottom: '16px', borderRadius: '8px',
                            boxShadow: 'inset 0 2px 4px rgba(230, 126, 34, 0.05)'
                        }}>
                            {captcha}
                        </div>
                        <input
                            type="text"
                            value={form.captchaInput}
                            onChange={e => setForm({ ...form, captchaInput: e.target.value.toUpperCase() })}
                            placeholder="Enter the 5 characters"
                            required
                            style={{
                                width: '100%', background: 'white', border: '2px solid #ffedd5',
                                padding: '10px 14px', borderRadius: '8px', color: '#1e293b',
                                fontSize: '14px', outline: 'none', textTransform: 'uppercase'
                            }}
                            onFocus={e => (e.target.style.borderColor = '#e67e22')}
                            onBlur={e => (e.target.style.borderColor = '#ffedd5')}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '14px', borderRadius: '10px', border: 'none',
                            background: 'linear-gradient(135deg, #e67e22, #d35400)',
                            color: 'white', fontSize: '15px',
                            fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                            marginTop: '8px', boxShadow: '0 4px 15px rgba(230, 126, 34, 0.3)'
                        }}
                        onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(230, 126, 34, 0.4)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(230, 126, 34, 0.3)'; }}
                    >
                        Login as Admin
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <a
                        onClick={() => navigate('/login')}
                        style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 600 }}
                        onMouseEnter={e => (e.target.style.color = '#e67e22')}
                        onMouseLeave={e => (e.target.style.color = '#64748b')}
                    >
                        Return to Personal Login
                    </a>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    )
}
