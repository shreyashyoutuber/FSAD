import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fdf6ee 0%, #fff7ed 100%)',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            padding: '24px',
            textAlign: 'center'
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', cursor: 'pointer', marginBottom: '48px' }}
            >
                Bharat<span style={{ color: '#e67e22' }}>Home</span> Value
            </div>

            {/* 404 Number */}
            <div style={{
                fontSize: '120px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                marginBottom: '24px'
            }}>
                404
            </div>

            {/* House Icon */}
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏠</div>

            <h1 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: '16px'
            }}>
                Page Not Found
            </h1>

            <p style={{
                fontSize: '17px',
                color: '#64748b',
                maxWidth: '480px',
                lineHeight: 1.7,
                marginBottom: '40px'
            }}>
                Looks like this page took a renovation break! The page you're looking for doesn't exist or has been moved.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #e67e22, #d35400)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)',
                        transition: '0.3s'
                    }}
                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                    ← Back to Home
                </button>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '14px 32px',
                        background: 'white',
                        color: '#e67e22',
                        border: '2px solid #e67e22',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                    onMouseEnter={e => { e.target.style.background = '#fff7ed' }}
                    onMouseLeave={e => { e.target.style.background = 'white' }}
                >
                    Go to Login
                </button>
            </div>
        </div>
    )
}
