import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword, forgotPassword } from '../api'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [stage, setStage] = useState(token ? 'RESET' : 'REQUEST')
    // 'REQUEST' – enter email to get link | 'RESET' – enter new password | 'DONE'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPwd, setConfirm] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log("ResetPassword component mounted. Current token:", token);
        console.log("Current stage:", stage);
        if (token) setStage('RESET')
    }, [token])

    // ── Request reset email ───────────────────────────────────────────────
    const handleRequest = async (e) => {
        e.preventDefault()
        setError('')
        if (!email.trim()) { setError('Please enter your email address.'); return }
        setIsLoading(true)
        try {
            await forgotPassword(email.trim())
            setStage('DONE')
        } catch (err) {
            setError(err.message || 'Request failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Submit new password ───────────────────────────────────────────────
    const handleReset = async (e) => {
        e.preventDefault()
        setError('')
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
        if (password !== confirmPwd) { setError('Passwords do not match.'); return }
        setIsLoading(true)
        try {
            await resetPassword(token, password)
            setStage('DONE')
        } catch (err) {
            setError(err.message || 'Reset failed. The link may have expired.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Done screen ────────────────────────────────────────────────────────
    if (stage === 'DONE') {
        return (
            <div className="auth-container">
                <div className="auth-box" style={{ textAlign: 'center' }}>
                    <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1a1a2e', textDecoration: 'none' }}>
                        Bharat<span style={{ color: '#e67e22' }}>Home</span> <span style={{ color: '#1a1a2e' }}>Value</span>
                    </a>
                    <div style={{ fontSize: '56px', margin: '24px 0 16px' }}>{token ? '✅' : '📧'}</div>
                    <h2 style={{ color: '#1a1a2e' }}>{token ? 'Password Reset!' : 'Check Your Email'}</h2>
                    <p className="subtitle" style={{ marginBottom: '32px' }}>
                        {token
                            ? 'Your password has been updated successfully. You can now login with your new password.'
                            : 'If that email is registered, we\'ve sent a password reset link. Please check your inbox.'}
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

    // ── Reset password (from email link with token) ────────────────────────
    if (stage === 'RESET') {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1a1a2e', textDecoration: 'none' }}>
                        Bharat<span style={{ color: '#e67e22' }}>Home</span> <span style={{ color: '#1a1a2e' }}>Value</span>
                    </a>
                    <div style={{ fontSize: '36px', textAlign: 'center', margin: '12px 0 4px' }}>🔒</div>
                    <h2 style={{ textAlign: 'center', color: '#1a1a2e' }}>Set New Password</h2>
                    <p className="subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Choose a strong password for your account.
                    </p>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleReset}>
                        <div className="form-group">
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                                    placeholder="Enter new password (min 6 chars)"
                                    required
                                    style={{ paddingRight: '48px' }}
                                />
                                <button type="button" onClick={() => setShowPwd(p => !p)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#718096' }}>
                                    {showPwd ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPwd}
                                onChange={(e) => { setConfirm(e.target.value); setError('') }}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // ── Request reset link ─────────────────────────────────────────────────
    return (
        <div className="auth-container">
            <div className="auth-box">
                <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1a1a2e' }}>
                    Bharat<span style={{ color: '#e67e22' }}>Home</span> <span style={{ color: '#1a1a2e' }}>Value</span>
                </a>
                <div style={{ fontSize: '36px', textAlign: 'center', margin: '12px 0 4px' }}>🔑</div>
                <h2 style={{ textAlign: 'center', color: '#1a1a2e' }}>Forgot Password?</h2>
                <p className="subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Enter your registered email and we'll send you a reset link.
                </p>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRequest}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError('') }}
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link →'}
                    </button>
                </form>

                <p className="auth-link">
                    Remember your password? <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a>
                </p>
                <a className="back-home-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Back to Home</a>
            </div>
        </div>
    )
}
