import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
    const navigate = useNavigate()

    const sections = [
        {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly, such as your name, email address, and phone number when you register. We also collect property details you submit, such as property type, location, size, and age. We automatically collect usage data such as pages visited, features used, and browser type.'
        },
        {
            title: '2. How We Use Your Information',
            content: 'We use your information to provide our property valuation and interior estimation services, send you OTP verification codes and account-related emails, connect you with design experts upon your request, improve our Platform through usage analytics, and comply with legal obligations.'
        },
        {
            title: '3. Data Storage & Security',
            content: 'Your data is stored securely on cloud servers (Aiven MySQL Cloud). We use industry-standard encryption (BCrypt for passwords, HTTPS for data in transit). We never store plaintext passwords. Your JWT authentication tokens expire automatically.'
        },
        {
            title: '4. Email Communications',
            content: 'By registering, you agree to receive your account credentials, OTP codes, and service-related emails. We use Brevo (formerly Sendinblue) to send emails. We do not send marketing emails without your explicit consent.'
        },
        {
            title: '5. Data Sharing',
            content: 'We do not sell your personal data. We may share your data with design professionals only when you explicitly request a consultation. We use Google OAuth for optional social login — Google\'s privacy policy applies to that authentication. We use Brevo for email delivery.'
        },
        {
            title: '6. Cookies & Local Storage',
            content: 'We use browser localStorage to store your authentication token and session data for a seamless experience. We do not use advertising or tracking cookies. You can clear your browser storage at any time, which will log you out.'
        },
        {
            title: '7. Your Rights',
            content: 'You have the right to access, correct, or delete your personal data at any time. You can update your profile from your User Dashboard. To request complete data deletion, contact us at privacy@bharathomevalue.com.'
        },
        {
            title: '8. Data Retention',
            content: 'We retain your account data as long as your account is active. Estimation data is retained for 2 years to provide you with historical comparisons. You can request deletion at any time.'
        },
        {
            title: '9. Changes to This Policy',
            content: 'We may update this Privacy Policy periodically. We will notify you of significant changes via email. Continued use of the Platform constitutes acceptance of the updated policy.'
        },
        {
            title: '10. Contact & Grievance',
            content: 'For privacy concerns or to exercise your data rights, contact our Grievance Officer at: privacy@bharathomevalue.com. We aim to respond within 7 business days.'
        }
    ]

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fdf6ee',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid #f0ece6',
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div
                    onClick={() => navigate('/')}
                    style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', cursor: 'pointer' }}
                >
                    Bharat<span style={{ color: '#e67e22' }}>Home</span> Value
                </div>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 24px',
                        background: '#e67e22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    ← Go Back
                </button>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                    <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1a1a1a', marginBottom: '16px' }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>
                        Last updated: April 28, 2026 · We value your privacy
                    </p>
                </div>

                <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    marginBottom: '40px'
                }}>
                    <p style={{ color: '#166534', fontWeight: 600, fontSize: '15px', margin: 0 }}>
                        🛡️ Your privacy matters to us. We collect only what we need to provide our services and never sell your personal data to third parties.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {sections.map((section, i) => (
                        <div key={i} style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid #f0ece6',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #fdf6ee' }}>
                                {section.title}
                            </h2>
                            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/terms')}
                        style={{
                            padding: '14px 32px',
                            background: 'white',
                            color: '#e67e22',
                            border: '2px solid #e67e22',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        View Terms & Conditions
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '14px 32px',
                            background: 'linear-gradient(135deg, #e67e22, #d35400)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(230,126,34,0.3)'
                        }}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    )
}
