import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [captchaInput, setCaptchaInput] = useState('')
    const [captcha, setCaptcha] = useState(generateCaptcha())
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (captchaInput.toUpperCase() !== captcha) {
            setError('Captcha does not match. Please try again.')
            setCaptcha(generateCaptcha()); setCaptchaInput(''); return
        }
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Bharat<span>Home</span> Value</a>
                <div style={{ textAlign: 'center', fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                <h2>Forgot Password?</h2>
                <p className="subtitle">No worries! Enter your email address and we'll send you a reset link.</p>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', margin: '16px 0' }}>{error}</div>}

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your registered email" required />
                        </div>
                        <div className="form-group">
                            <label>Enter the code shown</label>
                            <div className="captcha-row">
                                <span className="captcha-code">{captcha}</span>
                                <button type="button" className="captcha-refresh" onClick={() => setCaptcha(generateCaptcha())}>Refresh</button>
                            </div>
                            <input type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} placeholder="Type the code" autoComplete="off" required />
                        </div>
                        <button type="submit" className="btn-submit">Send Reset Link</button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '24px', background: '#d1fae5', borderRadius: '12px', color: '#065f46', marginTop: '24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <p style={{ fontWeight: 600 }}>Password reset link sent! Please check your email.</p>
                        <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>Redirecting to login...</p>
                    </div>
                )}

                <p className="auth-link" style={{ marginTop: '24px' }}>Remember your password? <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Back to Login</a></p>
                <a className="back-home-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Back to Home</a>
            </div>
        </div>
    )
}
