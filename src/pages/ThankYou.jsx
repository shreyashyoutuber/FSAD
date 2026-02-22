import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ThankYou() {
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => navigate('/user-dashboard'), 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ textAlign: 'center', color: 'white', maxWidth: '600px' }}>
                <div style={{ fontSize: '96px', marginBottom: '24px', animation: 'float 2s ease-in-out infinite' }}>🎉</div>
                <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Thank You!</h1>
                <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '12px' }}>Your estimate has been submitted successfully.</p>
                <p style={{ opacity: 0.7, fontSize: '16px', marginBottom: '40px', lineHeight: 1.8 }}>
                    Our expert team will review your requirements and get back to you within 24-48 hours with a detailed quote and recommendations.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px' }}>
                    {[['📋', '24-48 hrs', 'Response Time'], ['👨‍💼', 'Dedicated', 'Expert Assigned'], ['💬', 'Free', 'Consultation']].map(([icon, val, label]) => (
                        <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                            <p style={{ fontWeight: 800, fontSize: '18px', color: '#ffd700' }}>{val}</p>
                            <p style={{ fontSize: '13px', opacity: 0.8 }}>{label}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/user-dashboard')} style={{ padding: '14px 32px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Go to Dashboard →</button>
                    <button onClick={() => navigate('/')} style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Back to Home</button>
                </div>
                <p style={{ marginTop: '32px', opacity: 0.5, fontSize: '14px' }}>Redirecting to dashboard in 5 seconds...</p>
            </div>
        </div>
    )
}
