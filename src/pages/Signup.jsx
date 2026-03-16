import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp, signup } from '../api'

// Registration has 3 stages:
//  1) FORM    – fill in name, email, phone
//  2) OTP     – enter the 6-digit code sent to email
//  3) SUCCESS – account created, password sent via email

export default function Signup() {
    const navigate = useNavigate()

    const [stage, setStage] = useState('FORM') // 'FORM' | 'OTP' | 'SUCCESS'
    const [form, setForm] = useState({ fullname: '', email: '', phone: '', terms: false })
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

    // ── Stage 1: Send OTP ──────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.fullname.trim()) { setError('Please enter your full name.'); return }
        if (!form.email.trim()) { setError('Please enter your email address.'); return }
        if (!form.phone.trim()) { setError('Please enter your phone number.'); return }
        if (!form.terms) { setError('Please accept the Terms & Conditions.'); return }

        setIsLoading(true)
        setInfo('')
        try {
            await sendOtp(form.email, form.fullname)
            setStage('OTP')
            setInfo(`A 6-digit OTP has been sent to ${form.email}. It expires in 5 minutes.`)
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Stage 2: Verify OTP & Register ────────────────────────────────────
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (otp.trim().length !== 6) { setError('Please enter the 6-digit OTP.'); return }

        setIsLoading(true)
        try {
            // Verify OTP first
            await verifyOtp(form.email, otp.trim())

            // OTP valid → register the user
            await signup({ name: form.fullname, email: form.email, phone: form.phone })

            setStage('SUCCESS')
        } catch (err) {
            setError(err.message || 'Verification failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setError('')
        setInfo('')
        setIsLoading(true)
        try {
            await sendOtp(form.email, form.fullname)
            setInfo('A new OTP has been sent to your email.')
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Stage 3: Success screen ────────────────────────────────────────────
    if (stage === 'SUCCESS') {
        return (
            <div className="auth-container">
                <div className="auth-box" style={{ textAlign: 'center' }}>
                    <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        Bharat<span>Home</span> Value
                    </a>
                    <div style={{ fontSize: '56px', margin: '24px 0 16px' }}>🎉</div>
                    <h2 style={{ marginBottom: '8px' }}>Account Created!</h2>
                    <p className="subtitle" style={{ marginBottom: '24px' }}>
                        Your account is ready. We've sent your <strong>login credentials</strong> to:
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg,#1a1a2e,#16213e)',
                        color: '#c9a84c',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '15px',
                        marginBottom: '20px',
                        letterSpacing: '0.5px'
                    }}>
                        📧 {form.email}
                    </div>
                    <p style={{ color: '#4a5568', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
                        Check your inbox for your <strong>default password</strong> and a button to reset it anytime.
                    </p>
                    <button className="btn-submit" onClick={() => navigate('/login')}>
                        Go to Login →
                    </button>
                    <a className="back-home-link" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'block', marginTop: '16px' }}>
                        ← Back to Home
                    </a>
                </div>
            </div>
        )
    }

    // ── Stage 2: OTP Verification ──────────────────────────────────────────
    if (stage === 'OTP') {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        Bharat<span>Home</span> Value
                    </a>
                    <div style={{ fontSize: '40px', textAlign: 'center', margin: '12px 0 4px' }}>📬</div>
                    <h2 style={{ textAlign: 'center' }}>Verify Your Email</h2>
                    <p className="subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Enter the 6-digit code sent to<br />
                        <strong style={{ color: 'var(--primary)' }}>{form.email}</strong>
                    </p>

                    {info && <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{info}</div>}
                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

                    <form onSubmit={handleVerifyAndRegister}>
                        <div className="form-group">
                            <label>OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                style={{ letterSpacing: '8px', fontSize: '22px', textAlign: 'center', fontWeight: '700' }}
                                autoComplete="one-time-code"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={isLoading || otp.length !== 6}>
                            {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>Didn't receive the code?</p>
                        <button
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '14px', textDecoration: 'underline' }}
                        >
                            {isLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>

                    <button
                        onClick={() => { setStage('FORM'); setOtp(''); setError(''); setInfo('') }}
                        style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '13px' }}
                    >
                        ← Change email address
                    </button>
                </div>
            </div>
        )
    }

    // ── Stage 1: Registration Form ─────────────────────────────────────────
    return (
        <div className="auth-container">
            <div className="auth-box">
                <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    Bharat<span>Home</span> Value
                </a>
                <h2>Create Account</h2>
                <p className="subtitle">Join us to enhance your property value</p>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#92400e', marginBottom: '20px' }}>
                    🔐 No password needed! We'll generate a secure one and email it to you after verification.
                </div>

                <form onSubmit={handleSendOtp}>
                    {[
                        { label: 'Full Name', type: 'text', key: 'fullname', ph: 'Enter your full name' },
                        { label: 'Email Address', type: 'email', key: 'email', ph: 'Enter your email' },
                        { label: 'Phone Number', type: 'tel', key: 'phone', ph: 'Enter your phone number' },
                    ].map(({ label, type, key, ph }) => (
                        <div className="form-group" key={key}>
                            <label>{label}</label>
                            <input type={type} value={form[key]} onChange={set(key)} placeholder={ph} required />
                        </div>
                    ))}

                    <div className="form-group">
                        <label className="remember-me" style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: 'normal' }}>
                            <input type="checkbox" checked={form.terms} onChange={set('terms')} />
                            <span>I agree to the <a href="#" style={{ color: 'var(--primary)' }}>Terms & Conditions</a></span>
                        </label>
                    </div>

                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Sending OTP...' : 'Send Verification OTP →'}
                    </button>
                </form>

                <p className="auth-link">Already have an account? <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a></p>
                <a className="back-home-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Back to Home</a>
            </div>
        </div>
    )
}
