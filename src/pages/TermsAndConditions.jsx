import { useNavigate } from 'react-router-dom'

export default function TermsAndConditions() {
    const navigate = useNavigate()

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing and using BharatHome Value ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Platform.'
        },
        {
            title: '2. Description of Service',
            content: 'BharatHome Value provides property valuation estimates, interior renovation cost estimates, and connections to design professionals. All estimates are indicative and should not be considered as final valuations or binding quotes.'
        },
        {
            title: '3. User Accounts',
            content: 'You must register with a valid email address to use the Platform. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.'
        },
        {
            title: '4. Use of Platform',
            content: 'You agree to use the Platform only for lawful purposes. You must not submit false property information, misrepresent your identity, or use the Platform to harm other users or third parties.'
        },
        {
            title: '5. Estimates & Accuracy',
            content: 'The cost estimates provided by BharatHome Value are generated algorithmically and based on market averages. Actual costs may vary. We do not guarantee the accuracy of any estimate and recommend consulting a professional before making financial decisions.'
        },
        {
            title: '6. Privacy & Data',
            content: 'Your use of the Platform is also governed by our Privacy Policy. We collect and process your personal data only as described therein. By using the Platform, you consent to such processing.'
        },
        {
            title: '7. Intellectual Property',
            content: 'All content on the Platform, including text, graphics, logos, and software, is the property of BharatHome Value and protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.'
        },
        {
            title: '8. Limitation of Liability',
            content: 'BharatHome Value shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the Platform. Our total liability shall not exceed ₹5,000 or the amount paid by you in the preceding 6 months, whichever is less.'
        },
        {
            title: '9. Changes to Terms',
            content: 'We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes your acceptance of the new Terms.'
        },
        {
            title: '10. Contact Us',
            content: 'For any questions regarding these Terms, please contact us at support@bharathomevalue.com'
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
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
                    <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1a1a1a', marginBottom: '16px' }}>
                        Terms & Conditions
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>
                        Last updated: April 28, 2026 · Effective immediately
                    </p>
                </div>

                <div style={{
                    background: '#fff7ed',
                    border: '1px solid #ffedd5',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    marginBottom: '40px'
                }}>
                    <p style={{ color: '#9a3412', fontWeight: 600, fontSize: '15px', margin: 0 }}>
                        ⚠️ Please read these terms carefully before using BharatHome Value. By creating an account, you agree to be bound by these terms.
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

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '14px 40px',
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
                        I Accept — Create My Account
                    </button>
                </div>
            </div>
        </div>
    )
}
