import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function Home() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [heroStarted, setHeroStarted] = useState(false)
    const [showcaseStarted, setShowcaseStarted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [form, setForm] = useState({ name: '', phone: '', city: '', whatsapp: true, countryCode: '+91' })
    const [policyContent, setPolicyContent] = useState(null)
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
        alert('Thank you! Our designer will contact you shortly.')
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
                    <button className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>☰</button>
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
                        { icon: '💬', title: 'Meet Designer', desc: 'Discuss your needs and budget' },
                        { icon: '🎨', title: 'Book Design', desc: 'Pay 5% to book your interior slot' },
                        { icon: '📋', title: 'Finalize', desc: 'Choose materials and finishes' },
                        { icon: '🔧', title: 'Installation', desc: 'Our team installs everything' },
                        { icon: '🏠', title: 'Move In', desc: 'Enjoy your beautiful new home!' },
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
                        { icon: '🏗️', title: 'Smart Design Solutions', desc: 'AI-powered recommendations to enhance your property\'s appeal and market value instantly.' },
                        { icon: '🎨', title: '3D Visualization', desc: 'See your enhanced property before implementation with our advanced 3D design sessions.' },
                        { icon: '💡', title: 'Expert Guidance', desc: 'Connect with experienced designers who understand Indian property markets inside out.' },
                        { icon: '⚡', title: 'Quick Implementation', desc: 'Fast-track enhancements with trusted contractors and vendors across 50+ cities.' },
                        { icon: '📊', title: 'Value Guarantee', desc: 'Average 15-25% property value increase with our proven enhancement framework.' },
                        { icon: '🤝', title: 'End-to-End Support', desc: 'From consultation to completion, we handle every step of your property enhancement journey.' },
                    ].map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-card-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
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
                                    <div className="about-feature-item-icon">✓</div>
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
                    <div className="stat-item"><div className="stat-number">{c7}</div><span className="stat-suffix">★</span><div className="stat-label">Customer Rating</div></div>
                </div>
            </section>

            {/* Policy Modal */}
            {policyContent && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPolicyContent(null) }}>
                    <div className="modal-box" style={{ maxWidth: '600px' }}>
                        <button className="modal-close-btn" onClick={() => setPolicyContent(null)}>×</button>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: '32px', color: 'white', textAlign: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{policyContent.title}</h2>
                        </div>
                        <div style={{ padding: '40px', maxHeight: '60vh', overflowY: 'auto', textAlign: 'left' }}>
                            {policyContent.content.map((p, i) => (
                                <div key={i} style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>{p.subtitle}</h4>
                                    <p style={{ fontSize: '15px', color: '#636e72', lineHeight: 1.7 }}>{p.text}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '24px 40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                            <button className="btn-nav" onClick={() => setPolicyContent(null)} style={{ border: 'none', width: '100%', padding: '14px' }}>Close</button>
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
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a onClick={() => setPolicyContent({
                                title: 'Privacy Policy',
                                content: [
                                    { subtitle: 'Data Collection', text: 'We collect information you provide directly to us when you submit your property details or sign up for our services.' },
                                    { subtitle: 'Use of Information', text: 'Your data is used to provide personalized property enhancement recommendations and market value projections.' },
                                    { subtitle: 'Data Sharing', text: 'We do not sell your personal information. We only share data with trusted partners necessary to fulfill your requests.' }
                                ]
                            })} style={{ cursor: 'pointer' }}>Privacy Policy</a></li>
                            <li><a onClick={() => setPolicyContent({
                                title: 'Terms of Use',
                                content: [
                                    { subtitle: 'Acceptance of Terms', text: 'By accessing BharatHome Value, you agree to comply with our service terms and standard property analysis protocols.' },
                                    { subtitle: 'User Conduct', text: 'Users are expected to provide accurate property data for the best results in valuations and design recommendations.' },
                                    { subtitle: 'Liability', text: 'Market projections are estimates based on available data and expert insight, and are for informational purposes.' }
                                ]
                            })} style={{ cursor: 'pointer' }}>Terms of Use</a></li>
                            <li><a onClick={() => alert('Blog coming soon!')} style={{ cursor: 'pointer' }}>Blog</a></li>
                            <li><a onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-col" id="contact-info">
                        <h4>Get in Touch</h4>
                        <ul className="footer-contact-list">
                            <li><a href="mailto:hello@bharathomevalue.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>📧</span> hello@bharathomevalue.com</a></li>
                            <li><a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>📞</span> +91 9876 543 210</a></li>
                            <li><a href="https://wa.me/919876543210?text=Hello!%20I'm%20interested%20in%20enhancing%20my%20property%20value." target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 700 }}><span>💬</span> WhatsApp Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 BharatHome Value. All rights reserved. | <a onClick={() => setPolicyContent({
                        title: 'Privacy Policy',
                        content: [
                            { subtitle: 'Data Policy', text: 'Our commitment to protecting your privacy and home data is paramount.' }
                        ]
                    })} style={{ cursor: 'pointer', color: 'var(--primary)' }}>Privacy Policy</a> | <a onClick={() => setPolicyContent({
                        title: 'Terms of Use',
                        content: [
                            { subtitle: 'Service Terms', text: 'Standard terms of service for property enhancement and value estimation.' }
                        ]
                    })} style={{ cursor: 'pointer', color: 'var(--primary)' }}>Terms of Use</a></p>
                </div>
            </footer>
        </div>
    )
}
