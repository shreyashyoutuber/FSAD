import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Professional Icon Set
const Icons = {
    Policy: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    Terms: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    Rocket: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    Diamond: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l3 12"/><path d="M13 3l3 6-3 12"/><path d="M2 9h20"/></svg>,
    Card: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>,
    Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    Handshake: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 6-6"/><path d="M18 9c0 1.1-.9 2-2 2h-1a4 4 0 0 0-4 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.28a2 2 0 0 1 1.42.59l1.41 1.41a2 2 0 0 0 1.42.59H16a2 2 0 0 1 2 2v1Z"/></svg>,
    Cookie: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>,
    Government: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Gift: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg>,
    Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    Chat: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
    Message: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Palette: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.7-.4-1 0-.9.7-1.5 1.5-1.5h1.9c3 0 5.5-2.5 5.5-5.5 0-5.3-4.6-9.5-10-9.5z"/></svg>,
    Layout: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    Wrench: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    Home: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Building: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="18" x2="20" y2="18"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="6" x2="20" y2="6"/></svg>,
    Lightbulb: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
    Zap: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    BarChart: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
}

function useCounter(target, started) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!started) return
        const isDecimal = target % 1 !== 0
        const duration = 2000
        const increment = target / (duration / 16)
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) { setCount(target); clearInterval(timer) }
            else setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
        }, 16)
        return () => clearInterval(timer)
    }, [started, target])
    return count
}

const ALL_POLICIES = {
    'Policies Hub': { icon: <Icons.Policy />, subtitle: 'Everything you need to know about our standards' },
    'Terms of Use': {
        icon: <Icons.Terms />,
        sections: [
            { title: 'General', content: 'Our standard terms for service delivery and property valuation across all Indian regions.' },
            { title: 'Definitions', content: 'Interpretation of legal and technical terms used in our design agreements.' },
            { title: 'Eligibility', content: 'Requirements for users to register and access our premium design tools.' },
            { title: 'Account Security', content: 'Ensuring your property data and personal information remains private and secure.' },
            { title: 'Our Service', content: 'Detailed scope of BharatHome Value\'s property enhancement and market analysis services.' }
        ]
    },
    'Getting Started': {
        icon: <Icons.Rocket />,
        sections: [
            { title: 'Meet a Designer', content: 'Initial consultation to discuss your vision, budget, and property potential.' },
            { title: 'Book Design', content: 'Formalizing your project with a 5% booking fee to secure your design slot.' },
            { title: 'Finalization', content: 'Selecting materials, finishes, and approving the final 3D visualization.' }
        ]
    },
    'Quality & Service': {
        icon: <Icons.Diamond />,
        sections: [
            { title: 'BharatHome Quality Promise', content: 'Our commitment to delivering international design standards with verified craftsmanship.' },
            { title: 'Expert Execution', content: 'Standard operating procedures for on-site execution and project management.' },
            { title: 'Design Accuracy', content: 'Ensuring the final implementation matches the approved 3D designs within standard tolerances.' },
            { title: 'Vendor Standards', content: 'Strict quality benchmarks for all third-party materials and components used.' }
        ]
    },
    'Payments & EMI': {
        icon: <Icons.Card />,
        sections: [
            { title: 'Payment methods', content: 'Safe and secure digital payment gateways including all major Indian banks and UPI.' },
            { title: 'Transaction Guarantee', content: 'Multi-layer security protocols to protect your financial transactions.' },
            { title: 'Payment Terms', content: 'Clear milestone-based schedules (5%, 45%, 50%) to ensure project transparency.' },
            { title: 'EMI Options', content: 'Flexible financing solutions available through our banking partners.' }
        ]
    },
    'Cancellations & Refunds': {
        icon: <Icons.Refresh />,
        sections: [
            { title: 'Cancellations', content: 'Refund policies based on the project stage (Pre-execution vs. Post-production).' },
            { title: 'Return & Exchange', content: 'How we handle material discrepancies and product replacements.' },
            { title: 'Delay Penalty', content: 'Our "On-Time or Pay" guarantee protecting you against project delays.' }
        ]
    },
    'Warranty & Care': {
        icon: <Icons.Shield />,
        sections: [
            { title: 'Comprehensive Warranty', content: 'Industry-leading coverage for modular systems, furniture, and services.' },
            { title: 'Modular Warranty', content: 'Up to 10 years warranty on kitchens and wardrobes against manufacturing defects.' },
            { title: 'Maintenance Guide', content: 'Essential care instructions to maximize the life and value of your home interiors.' },
            { title: 'Assured Partner Warranty', content: 'Standardized warranties for services provided by our certified service partners.' }
        ]
    },
    'Becoming a Partner': {
        icon: <Icons.Handshake />,
        sections: [
            { title: 'For Designers', content: 'How professional designers can leverage our platform to reach more homeowners.' },
            { title: 'For Suppliers', content: 'Quality benchmarks and application process for material and service providers.' },
            { title: 'Reseller Terms', content: 'Structuring professional reseller arrangements within our ecosystem.' }
        ]
    },
    'Privacy & Cookies': {
        icon: <Icons.Cookie />,
        sections: [
            { title: 'Privacy Policy', content: 'How we protect the property images and personal data you share with us.' },
            { title: 'Cookie Policy', content: 'Understanding the technologies we use to personalize your design experience.' },
            { title: 'Data Redressal', content: 'Your rights to access, modify, or delete your data from our platform.' }
        ]
    },
    'Customer Governance': {
        icon: <Icons.Government />,
        sections: [
            { title: 'Grievance Redressal', content: 'Escalation matrix and timeline for resolving customer concerns.' },
            { title: 'Whistle Blower Policy', text: 'Encouraging transparency and reporting of any unethical business practices.' },
            { title: 'Terms & Conditions', content: 'Master service agreement covering project delivery and legal obligations.' }
        ]
    },
    'Referral Program': {
        icon: <Icons.Gift />,
        sections: [
            { title: 'Refer and Earn', content: 'Structure of our referral rewards for successful property handovers.' },
            { title: 'Program Terms', content: 'Eligibility and validity criteria for the referral program.' }
        ]
    }
}

export default function Home() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [heroStarted, setHeroStarted] = useState(false)
    const [showcaseStarted, setShowcaseStarted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [form, setForm] = useState({ name: '', phone: '', city: '', whatsapp: true, countryCode: '+91' })
    const [policyState, setPolicyState] = useState({ open: false, activeCat: 'Terms of Use' })
    const statsRef = useRef(null)

    // Hero stats: start counting immediately on mount
    const c1 = useCounter(25, heroStarted)
    const c2 = useCounter(10000, heroStarted)
    const c3 = useCounter(50, heroStarted)
    // Showcase stats: start counting when scrolled into view
    const c4 = useCounter(10000, showcaseStarted)
    const c5 = useCounter(50, showcaseStarted)
    const c6 = useCounter(25, showcaseStarted)
    const c7 = useCounter(4.9, showcaseStarted)

    useEffect(() => {
        // Start hero counters immediately
        setHeroStarted(true)
        // Open modal after delay
        const timer = setTimeout(() => setModalOpen(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShowcaseStarted(true) }, { threshold: 0.3 })
        if (statsRef.current) obs.observe(statsRef.current)
        return () => obs.disconnect()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const user = localStorage.getItem('user')
        if (user) {
            navigate('/user-dashboard')
        } else {
            navigate('/signup', { state: { from: 'hero', ...form } })
        }
        setModalOpen(false)
    }

    const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false) }

    return (
        <div>
            {/* Navbar */}
            <header className="navbar">
                <nav className="nav-inner">
                    <div className="nav-logo" onClick={() => scrollTo('home')}>Bharat<span>Home</span> Value</div>
                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li><a href="#home" onClick={() => scrollTo('home')}>Home</a></li>
                        <li><a href="#ideas" onClick={() => scrollTo('ideas')}>Enhancement Ideas</a></li>
                        <li><a href="#about" onClick={() => scrollTo('about')}>About Us</a></li>
                        <li><a onClick={() => navigate('/login')} className="btn-nav" style={{ cursor: 'pointer' }}>Login</a></li>
                        <li><a onClick={() => navigate('/admin-login')} className="btn-nav admin" style={{ cursor: 'pointer' }}>Admin</a></li>
                    </ul>
                    <button className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
                </nav>
            </header>

            {/* Hero */}
            <section id="home" className="hero">
                <div className="hero-content">
                    <h1>Enhance the Value of Your Indian Home</h1>
                    <p>Discover innovative design solutions and smart tools to enhance the appeal and value of your residential property in today's competitive market.</p>
                    <div className="hero-stats">
                        <div className="stat"><h3>{c1}</h3><span className="suffix">%</span><p>Average Value Increase</p></div>
                        <div className="stat"><h3>{c2.toLocaleString()}</h3><span className="suffix">+</span><p>Properties Enhanced</p></div>
                        <div className="stat"><h3>{c3}</h3><span className="suffix">+</span><p>Indian Cities Covered</p></div>
                    </div>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>Start My Evaluation</button>
                </div>
            </section>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
                    <div className="modal-box">
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
                        <div className="modal-img-header">
                            <div><h3>Confused by Too Many Options?</h3><p>Trust <strong>BharatHome Value</strong> – the finisher your home deserves.</p></div>
                        </div>
                        <div className="modal-body">
                            <h2>Meet a designer</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-field">
                                    <label>Full Name</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" required />
                                </div>
                                <div className="form-field">
                                    <label>Mobile Number</label>
                                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter your mobile number" type="tel" required />
                                </div>
                                <div className="form-field">
                                    <label>Property City</label>
                                    <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required>
                                        <option value="">Select city</option>
                                        {['Mumbai', 'Delhi/NCR', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '14px', color: '#636e72' }}>
                                    <span>Send updates on WhatsApp</span>
                                    <input type="checkbox" checked={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.checked })} />
                                </div>
                                <button type="submit" className="btn-final">Book 3D Design Session →</button>
                                <p style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '12px' }}>By submitting, you agree to our <a href="#" style={{ color: '#e67e22' }}>privacy policy</a> and <a href="#" style={{ color: '#e67e22' }}>terms of use</a>.</p>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Process Steps */}
            <section className="process-steps">
                <h2 className="section-title">Your dream home in 5 easy steps</h2>
                <div className="steps-container">
                    {[
                        { icon: <Icons.Message />, title: 'Meet Designer', desc: 'Discuss your needs and budget' },
                        { icon: <Icons.Palette />, title: 'Book Design', desc: 'Pay 5% to book your interior slot' },
                        { icon: <Icons.Layout />, title: 'Finalize', desc: 'Choose materials and finishes' },
                        { icon: <Icons.Wrench />, title: 'Installation', desc: 'Our team installs everything' },
                        { icon: <Icons.Home />, title: 'Move In', desc: 'Enjoy your beautiful new home!' },
                    ].map((s, i) => (
                        <div key={i} className="step-item">
                            <div className="step-icon-wrapper"><div className="step-icon">{s.icon}</div></div>
                            {i < 4 && <div className="step-arrow">→</div>}
                            <h3 className="step-title">{s.title}</h3>
                            <p className="step-description">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="ideas" className="features">
                <h2 className="section-title">Why Choose BharatHome Value?</h2>
                <p className="section-subtitle">Elevate your property with our expert enhancement solutions tailored for Indian homes</p>
                <div className="features-grid">
                    {[
                        { icon: <Icons.Building />, title: 'Smart Design Solutions', desc: 'AI-powered recommendations to enhance your property\'s appeal and market value instantly.' },
                        { icon: <Icons.Palette />, title: '3D Visualization', desc: 'See your enhanced property before implementation with our advanced 3D design sessions.' },
                        { icon: <Icons.Lightbulb />, title: 'Expert Guidance', desc: 'Connect with experienced designers who understand Indian property markets inside out.' },
                        { icon: <Icons.Zap />, title: 'Quick Implementation', desc: 'Fast-track enhancements with trusted contractors and vendors across 50+ cities.' },
                        { icon: <Icons.BarChart />, title: 'Value Guarantee', desc: 'Average 15-25% property value increase with our proven enhancement framework.' },
                        { icon: <Icons.Handshake />, title: 'End-to-End Support', desc: 'From consultation to completion, we handle every step of your property enhancement journey.' },
                    ].map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-card-icon" style={{ color: 'var(--primary)' }}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Inspiration Gallery */}
            <section className="inspiration-section">
                <div className="insp-header">
                    <div className="insp-title-box">
                        <h2>Inspiration for home interior designs</h2>
                        <p>Give your home a new look with these interior design ideas curated for you</p>
                    </div>
                    <a href="#ideas" className="view-all-link">View All <span>›</span></a>
                </div>

                <div className="insp-gallery-wrapper">
                    {/* Row 1: Living Room, Bedroom, Ceiling */}
                    <div className="insp-grid-row">
                        <div className="insp-item">
                            <img src="/Photos/insp-living.png" alt="Living Room" />
                            <div className="insp-label">Living Room</div>
                        </div>
                        <div className="insp-item">
                            <img src="/Photos/insp-bedroom.png" alt="Master Bedroom" />
                            <div className="insp-label">Master Bedroom</div>
                        </div>
                        <div className="insp-item">
                            <img src="/Photos/insp-ceiling.png" alt="False Ceiling" />
                            <div className="insp-label">False Ceiling</div>
                        </div>
                    </div>

                    {/* Row 2: Homes, Kitchen, Wardrobe */}
                    <div className="insp-grid-row">
                        <div className="insp-item">
                            <img src="/Photos/insp-general.png" alt="Homes by BharatHome" />
                            <div className="insp-label">Homes by BharatHome</div>
                        </div>
                        <div className="insp-item">
                            <img src="/Photos/insp-kitchen.png" alt="Kitchen" />
                            <div className="insp-label">Kitchen</div>
                        </div>
                        <div className="insp-item">
                            <img src="/Photos/insp-wardrobe.png" alt="Wardrobe" />
                            <div className="insp-label">Wardrobe</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="about">
                <div className="about-content">
                    <div className="about-text">
                        <h2>Why Your Home Deserves Better</h2>
                        <p>Your home is one of your most valuable assets. In India's competitive real estate market, the difference between an average property and an exceptional one can be millions of rupees.</p>
                        <p>We understand the nuances of Indian properties – from compact Mumbai apartments to sprawling Delhi farmhouses. Our team combines design expertise with market insight to create enhancements that add real value.</p>
                        <div className="about-features">
                            {[
                                { title: 'Market-Driven Strategies', desc: 'Recommendations based on actual market data from your region' },
                                { title: 'Budget-Flexible Solutions', desc: 'Options ranging from budget to premium enhancements' },
                                { title: 'Rapid Delivery', desc: 'Complete enhancement plans within 48 hours' },
                            ].map((f, i) => (
                                <div key={i} className="about-feature-item">
                                    <div className="about-feature-item-icon" style={{ color: 'var(--primary)' }}><Icons.Check /></div>
                                    <div className="about-feature-item-text"><h4>{f.title}</h4><p>{f.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
                        <img
                            src="/Photos/HomeSub.png"
                            alt="Beautiful modern interior"
                            style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                                e.target.src = '/Photos/Hero.png'
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(230,126,34,0.95)', borderRadius: '10px', padding: '14px 20px', backdropFilter: 'blur(8px)' }}>
                            <p style={{ color: 'white', fontWeight: 800, fontSize: '20px', margin: 0 }}>25%</p>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', margin: 0 }}>Avg. Value Increase</p>
                        </div>
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '14px 20px', backdropFilter: 'blur(8px)' }}>
                            <p style={{ color: '#1a1a1a', fontWeight: 800, fontSize: '20px', margin: 0 }}>10,000+</p>
                            <p style={{ color: '#636e72', fontSize: '12px', margin: 0 }}>Homes Enhanced</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-showcase" ref={statsRef}>
                <div className="stats-grid">
                    <div className="stat-item"><div className="stat-number">{c4.toLocaleString()}</div><span className="stat-suffix">+</span><div className="stat-label">Properties Enhanced</div></div>
                    <div className="stat-item"><div className="stat-number">{c5}</div><span className="stat-suffix">+</span><div className="stat-label">Indian Cities Covered</div></div>
                    <div className="stat-item"><div className="stat-number">{c6}</div><span className="stat-suffix">%</span><div className="stat-label">Average Value Increase</div></div>
                    <div className="stat-item"><div className="stat-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c7} <span style={{ fontSize: '24px', marginLeft: '4px', color: '#f1c40f' }}><Icons.Star /></span></div><div className="stat-label">Customer Rating</div></div>
                </div>
            </section>

            {/* Policy Hub Modal */}
            {policyState.open && (
                <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)' }} onClick={(e) => { if (e.target === e.currentTarget) setPolicyState({ ...policyState, open: false }) }}>
                    <div className="modal-box animate-fadeIn" style={{ maxWidth: '1000px', width: '95%', height: '85vh', display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {/* Header */}
                        <div style={{ background: 'white', padding: '24px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Policy Center</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Last updated: February 2026</p>
                            </div>
                            <button className="button-press" onClick={() => setPolicyState({ ...policyState, open: false })} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>

                        {/* Body - 2 Columns */}
                        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                            {/* Left Sidebar */}
                            <div style={{ width: '280px', background: '#f8fafc', borderRight: '1px solid #f1f5f9', overflowY: 'auto', padding: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {Object.entries(ALL_POLICIES).map(([cat, val]) => (
                                        <div
                                            key={cat}
                                            onClick={() => setPolicyState({ ...policyState, activeCat: cat })}
                                            className="button-press"
                                            style={{
                                                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '12px',
                                                background: policyState.activeCat === cat ? 'white' : 'transparent',
                                                boxShadow: policyState.activeCat === cat ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                                border: policyState.activeCat === cat ? '1px solid #e2e8f0' : '1px solid transparent'
                                            }}
                                        >
                                            <span style={{ color: policyState.activeCat === cat ? 'var(--primary)' : '#64748b' }}>{val.icon}</span>
                                            <span style={{ fontSize: '14px', fontWeight: policyState.activeCat === cat ? 700 : 500, color: policyState.activeCat === cat ? 'var(--primary)' : '#475569' }}>
                                                {cat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Content */}
                            <div style={{ flex: 1, background: 'white', overflowY: 'auto', padding: '40px' }}>
                                <div style={{ marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{policyState.activeCat}</h3>
                                    <p style={{ color: '#64748b', fontSize: '15px' }}>{ALL_POLICIES[policyState.activeCat]?.subtitle || `Essential information regarding ${policyState.activeCat}`}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {ALL_POLICIES[policyState.activeCat]?.sections?.map((section, idx) => (
                                        <div key={idx} style={{ paddingLeft: '24px', borderLeft: '3px solid #e2e8f0' }}>
                                            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>{section.title}</h4>
                                            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>{section.content || section.text}</p>
                                        </div>
                                    ))}
                                    {!ALL_POLICIES[policyState.activeCat].sections && (
                                        <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed #f1f5f9', borderRadius: '20px' }}>
                                            <p style={{ color: '#94a3b8' }}>Detailed selection coming soon for this category.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '24px 40px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Need more help? Contact <a href="mailto:support@bharathome.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>Support Team</a></p>
                            <button className="btn-nav" onClick={() => setPolicyState({ ...policyState, open: false })} style={{ border: 'none', padding: '10px 32px' }}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <section className="cta-final">
                <h2>Ready to Enhance Your Property's Value?</h2>
                <p>Join thousands of homeowners who've already transformed their properties. Get your free personalized enhancement report today.</p>
                <button className="btn-white" onClick={() => setModalOpen(true)}>Get Started Now →</button>
            </section>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10 }}>
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>BharatHome Value</h4>
                        <p>Elevating property value across India with expert design solutions and market-driven enhancements.</p>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                            {['FB', 'IG', 'LI', 'TW'].map(s => (
                                <div key={s} className="button-press" style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="footer-col" id="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>Home</a></li>
                            <li><a href="#ideas" onClick={(e) => { e.preventDefault(); scrollTo('ideas') }}>Services</a></li>
                            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
                            <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a></li>
                            <li><a onClick={() => setPolicyState({ open: true, activeCat: 'Terms of Use' })} style={{ cursor: 'pointer', fontWeight: 700 }}>Privacy & Company</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a onClick={() => setPolicyState({ open: true, activeCat: 'Privacy & Cookies' })} style={{ cursor: 'pointer' }}>Privacy Policy</a></li>
                            <li><a onClick={() => setPolicyState({ open: true, activeCat: 'Terms of Use' })} style={{ cursor: 'pointer' }}>Terms of Use</a></li>
                            <li><a onClick={() => alert('Blog coming soon!')} style={{ cursor: 'pointer' }}>Blog</a></li>
                            <li><a onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-col" id="contact-info">
                        <h4>Get in Touch</h4>
                        <ul className="footer-contact-list">
                            <li><a href="mailto:hello@bharathomevalue.com" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'var(--primary)' }}><Icons.Mail /></span> hello@bharathomevalue.com</a></li>
                            <li><a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'var(--primary)' }}><Icons.Phone /></span> +91 9876 543 210</a></li>
                            <li><a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#25D366', fontWeight: 700 }}><span><Icons.Chat /></span> WhatsApp Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 BharatHome Value. All rights reserved. | <a onClick={() => setPolicyState({ open: true, activeCat: 'Privacy & Cookies' })} style={{ cursor: 'pointer', color: 'var(--primary)' }}>Privacy Policy</a> | <a onClick={() => setPolicyState({ open: true, activeCat: 'Terms of Use' })} style={{ cursor: 'pointer', color: 'var(--primary)' }}>Terms of Use</a></p>
                </div>
            </footer>
        </div>
    )
}
