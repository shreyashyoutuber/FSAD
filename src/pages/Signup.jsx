import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function Signup() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '', confirmPassword: '', terms: false, captchaInput: '' })
    const [captcha, setCaptcha] = useState(generateCaptcha())
    const [error, setError] = useState('')

    const refreshCaptcha = () => setCaptcha(generateCaptcha())

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) { setError('Passwords do not match!'); return }
        if (!form.terms) { setError('Please accept the Terms & Conditions'); return }
        if (form.captchaInput.toUpperCase() !== captcha) {
            setError('Captcha does not match. Please try again.')
            refreshCaptcha(); setForm(f => ({ ...f, captchaInput: '' })); return
        }
        sessionStorage.setItem('bhvUser', form.email)
        localStorage.setItem('userData', JSON.stringify({
            name: form.fullname, email: form.email, phone: form.phone,
            property: { type: '2BHK Apartment', location: 'Sector 62, Noida', currentValue: 5000000, size: 1250, age: 8, locationRating: 4.2 }
        }))
        navigate('/user-dashboard')
    }

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

    return (
        <div className="auth-container">
            <div className="auth-box">
                <a className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Bharat<span>Home</span> Value</a>
                <h2>Create Account</h2>
                <p className="subtitle">Join us to enhance your property value</p>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Full Name', type: 'text', key: 'fullname', ph: 'Enter your full name' },
                        { label: 'Email Address', type: 'email', key: 'email', ph: 'Enter your email' },
                        { label: 'Phone Number', type: 'tel', key: 'phone', ph: 'Enter your phone number' },
                        { label: 'Password', type: 'password', key: 'password', ph: 'Create a password' },
                        { label: 'Confirm Password', type: 'password', key: 'confirmPassword', ph: 'Confirm your password' },
                    ].map(({ label, type, key, ph }) => (
                        <div className="form-group" key={key}>
                            <label>{label}</label>
                            <input type={type} value={form[key]} onChange={set(key)} placeholder={ph} required />
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Enter the code shown</label>
                        <div className="captcha-row">
                            <span className="captcha-code">{captcha}</span>
                            <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>Refresh</button>
                        </div>
                        <input type="text" value={form.captchaInput} onChange={set('captchaInput')} placeholder="Type the code" autoComplete="off" required />
                    </div>

                    <div className="form-group">
                        <label className="remember-me" style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: 'normal' }}>
                            <input type="checkbox" checked={form.terms} onChange={set('terms')} />
                            <span>I agree to the <a href="#" style={{ color: 'var(--primary)' }}>Terms & Conditions</a></span>
                        </label>
                    </div>

                    <button type="submit" className="btn-submit">Create Account</button>
                </form>

                <div className="divider"><span>or</span></div>

                <button className="btn-google" onClick={() => {
                    sessionStorage.setItem('bhvUser', 'google-user@gmail.com')
                    localStorage.setItem('userData', JSON.stringify({ name: 'Google User', email: 'google-user@gmail.com', phone: '+91 98765 43210', property: { type: '2BHK Apartment', location: 'Sector 62, Noida', currentValue: 5000000, size: 1250, age: 8, locationRating: 4.2 } }))
                    navigate('/user-dashboard')
                }}>
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
                    </svg>
                    Sign up with Google
                </button>

                <p className="auth-link">Already have an account? <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a></p>
                <a className="back-home-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Back to Home</a>
            </div>
        </div>
    )
}
