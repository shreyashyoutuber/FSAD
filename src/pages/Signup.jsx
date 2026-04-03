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
        // ... previous styles unchanged ...
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
        }
    }
    // ... logic for stages unchanged ...

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
                    {/* ... form fields stay the same ... */}
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
