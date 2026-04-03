import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp, signup } from '../api'

export default function Signup() {
    const navigate = useNavigate()

    const [stage, setStage] = useState('FORM') // 'FORM' | 'OTP' | 'SUCCESS'
    const [form, setForm] = useState({ fullname: '', email: '', phone: '', terms: false })
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

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
            setInfo(`A 6-digit OTP has been sent to ${form.email}`)
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault()
        setError('')
        if (otp.trim().length !== 6) { setError('Please enter the 6-digit OTP.'); return }

        setIsLoading(true)
        try {
            await verifyOtp(form.email, otp.trim())
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

    const getGoogleUrl = () => {
        const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8080'
            : 'https://fsad-tpxy.onrender.com';
        return `${base}/oauth2/authorization/google`;
    };

    // --- Styles ---
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        card: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.6s ease-out'
        },
        logo: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '32px',
            display: 'block',
            letterSpacing: '-0.5px'
        },
        logoSpan: { color: '#f59e0b' },
        title: {
            fontSize: '32px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '8px',
            textAlign: 'center'
        },
        subtitle: {
            fontSize: '16px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '32px'
        },
        inputGroup: { marginBottom: '20px' },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#cbd5e1',
            marginBottom: '8px',
            marginLeft: '4px'
        },
        input: {
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        button: {
            width: '100%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            marginTop: '12px',
            boxShadow: '0 10px 15px -3px rgba(217, 119, 6, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        buttonGoogle: {
            width: '100%',
            background: '#ffffff',
            color: '#1f2937',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        dividerContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0'
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)'
        },
        dividerText: {
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        alert: {
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#fbbf24',
            marginBottom: '24px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        },
        error: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
        },
        link: {
            color: '#94a3b8',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '24px'
        },
        activeLink: {
            color: '#f59e0b',
            fontWeight: '600',
            cursor: 'pointer',
            marginLeft: '6px'
        }
    }

    if (stage === 'SUCCESS') {
        return (
            <div style={styles.container}>
                <div style={{...styles.card, textAlign: 'center'}}>
                    <div style={styles.logo}>Bharat<span style={styles.logoSpan}>Home</span> Value</div>
                    <div style={{fontSize: '64px', margin: '20px 0'}}>✨</div>
                    <h2 style={styles.title}>Welcome Aboard!</h2>
                    <p style={styles.subtitle}>Your profile is ready. Your secure password has been sent to:</p>
                    <div style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        padding: '16px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '18px',
                        marginBottom: '32px'
                    }}>
                        {form.email}
                    </div>
                    <button style={styles.button} onClick={() => navigate('/login')}>Sign In Now →</button>
                </div>
            </div>
        )
    }

    if (stage === 'OTP') {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.logo}>Bharat<span style={styles.logoSpan}>Home</span> Value</div>
                    <h2 style={styles.title}>Confirm Email</h2>
                    <p style={styles.subtitle}>Enter the 6-digit code sent to <br/><span style={{color: '#f59e0b'}}>{form.email}</span></p>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleVerifyAndRegister}>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                style={{...styles.input, textAlign: 'center', fontSize: '28px', letterSpacing: '8px', fontWeight: '800'}}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button style={styles.button} disabled={isLoading}>{isLoading ? 'Verifying...' : 'Complete Registry'}</button>
                    </form>
                    <div style={styles.link}>
                        Didn't get it? <span style={styles.activeLink} onClick={handleResendOtp}>Resend Code</span>
                    </div>
                    <div style={{...styles.link, marginTop: '12px', fontSize: '12px', cursor: 'pointer'}} onClick={() => setStage('FORM')}>
                        ← Use a different email
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={{...styles.card, maxWidth: '480px'}}>
                <div style={styles.logo}>Bharat<span style={styles.logoSpan}>Home</span> Value</div>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Start your journey towards a better home</p>

                {error && <div style={styles.error}>{error}</div>}

                <button 
                    style={styles.buttonGoogle} 
                    onClick={() => window.location.href = getGoogleUrl()}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="18" alt="Google" />
                    Continue with Google
                </button>

                <div style={styles.dividerContainer}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>or join via email</span>
                    <div style={styles.dividerLine}></div>
                </div>

                <div style={styles.alert}>
                    <span>🛡️</span>
                    <span>No password needed! We'll generate a secure one.</span>
                </div>

                <form onSubmit={handleSendOtp}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input style={styles.input} type="text" value={form.fullname} onChange={set('fullname')} placeholder="e.g. John Doe" required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input style={styles.input} type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input style={styles.input} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div style={{...styles.inputGroup, display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input type="checkbox" checked={form.terms} onChange={set('terms')} style={{width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f59e0b'}} />
                        <span style={{color: '#94a3b8', fontSize: '13px'}}>I agree to the <span style={{color: '#f59e0b', cursor: 'pointer'}}>Terms of Service</span></span>
                    </div>
                    <button style={styles.button} disabled={isLoading}>{isLoading ? 'Starting...' : 'Send OTP →'}</button>
                </form>

                <div style={styles.link}>
                    Already have an account? <span style={styles.activeLink} onClick={() => navigate('/login')}>Login</span>
                </div>
                <div style={{...styles.link, marginTop: '20px', cursor: 'pointer'}} onClick={() => navigate('/')}>
                    ← Back to Home
                </div>
            </div>
        </div>
    )
}
