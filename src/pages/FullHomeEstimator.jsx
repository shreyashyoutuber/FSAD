import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONFIGS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Duplex', 'Villa']
const SCOPES = ['Complete Interior', 'Living + Bedrooms', 'Kitchen + Bathrooms', 'Only Living Room', 'Only Bedrooms']
const STYLES = ['Modern Minimalist', 'Contemporary', 'Traditional Indian', 'Indo-Western', 'Scandinavian', 'Luxury']
const FLOORS = ['Vitrified Tiles', 'Wooden Flooring', 'Marble', 'Granite', 'Carpet', 'Italian Marble']

const PACKAGE_BASE = { Essential: 900000, Premium: 1500000, Luxury: 2500000 }
const CONFIG_MUL = { '1 BHK': 0.6, '2 BHK': 1, '3 BHK': 1.4, '4 BHK': 1.8, 'Duplex': 2.1, 'Villa': 2.8 }

export default function FullHomeEstimator() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [sel, setSel] = useState({ config: '', scope: '', style: '', floor: '', pkg: 'Premium', painting: false, lighting: false, furnishing: false })
    const [submitted, setSubmitted] = useState(false)

    const S = (k, v) => setSel(p => ({ ...p, [k]: v }))
    const isStepOk = (s) => {
        if (s === 1) return sel.config && sel.scope
        if (s === 2) return sel.style && sel.floor
        return true
    }
    const extras = (sel.painting ? 80000 : 0) + (sel.lighting ? 120000 : 0) + (sel.furnishing ? 300000 : 0)
    const base = PACKAGE_BASE[sel.pkg] || 1500000
    const total = Math.round(base * (CONFIG_MUL[sel.config] || 1) + extras)

    const handleSubmit = () => {
        const user = sessionStorage.getItem('bhvUser')
        if (!user) { navigate('/login'); return }
        const est = { type: 'Full Home Estimator', date: new Date().toLocaleDateString(), cost: total, package: sel.pkg, details: sel }
        const prev = JSON.parse(localStorage.getItem('userEstimates') || '[]')
        localStorage.setItem('userEstimates', JSON.stringify([...prev, est]))
        const req = { id: `EST-${Date.now()}`, customerName: JSON.parse(localStorage.getItem('userData') || '{}').name || 'User', customerEmail: user, type: 'Full Home Estimator', status: 'pending', dateSubmitted: new Date().toISOString().split('T')[0], description: `${sel.config}, ${sel.style} style, ${sel.scope}`, budget: `₹${total.toLocaleString('en-IN')}`, responded: false }
        const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
        localStorage.setItem('allAdminRequests', JSON.stringify([...allReqs, req]))
        setSubmitted(true)
        setTimeout(() => navigate('/thankyou'), 1500)
    }

    const steps = ['Property Details', 'Design Preferences', 'Package & Add-ons']

    return (
        <div className="estimator-page">
            <header className="estimator-header" style={{ background: 'linear-gradient(135deg, #0f3460, #16213e)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                    <div><h1 style={{ color: 'white' }}>Full Home Estimator</h1><p style={{ color: 'rgba(255,255,255,0.8)' }}>Complete interior cost estimate for your home</p></div>
                </div>
            </header>

            {submitted ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏠</div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>Quote submitted!</h2>
                    <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Redirecting you to thank you page...</p>
                </div>
            ) : (
                <div className="estimator-body">
                    {/* Progress steps */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: step > i + 1 ? '#10b981' : step === i + 1 ? 'var(--primary)' : '#e9ecef', color: step >= i + 1 ? 'white' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 8px' }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: step === i + 1 ? 'var(--primary)' : 'var(--muted)' }}>{s}</p>
                            </div>
                        ))}
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                        <>
                            <div className="estimator-card">
                                <h2>Property Configuration</h2>
                                <div className="select-grid">
                                    {CONFIGS.map(c => <div key={c} className={`select-option ${sel.config === c ? 'selected' : ''}`} onClick={() => S('config', c)}>{c}</div>)}
                                </div>
                            </div>
                            <div className="estimator-card">
                                <h2>Renovation Scope</h2>
                                <div className="select-grid">
                                    {SCOPES.map(s => <div key={s} className={`select-option ${sel.scope === s ? 'selected' : ''}`} onClick={() => S('scope', s)} style={{ minWidth: '200px' }}>{s}</div>)}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <>
                            <div className="estimator-card">
                                <h2>Interior Style</h2>
                                <div className="select-grid">
                                    {STYLES.map(s => <div key={s} className={`select-option ${sel.style === s ? 'selected' : ''}`} onClick={() => S('style', s)}>{s}</div>)}
                                </div>
                            </div>
                            <div className="estimator-card">
                                <h2>Flooring Type</h2>
                                <div className="select-grid">
                                    {FLOORS.map(f => <div key={f} className={`select-option ${sel.floor === f ? 'selected' : ''}`} onClick={() => S('floor', f)}>{f}</div>)}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <>
                            <div className="estimator-card">
                                <h2>Package</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                                    {[
                                        { name: 'Essential', price: '₹9L+', desc: 'Quality materials, functional design', img: '/Photos/fullhome-pkg.essentials.png' },
                                        { name: 'Premium', price: '₹15L+', desc: 'Upgraded materials, better finishes', img: '/Photos/fullhome-pkg.premium.png' },
                                        { name: 'Luxury', price: '₹25L+', desc: 'Top-of-the-line, custom design', img: '/Photos/fullhome-pkg.luxe.png' },
                                    ].map(({ name, price, desc, img }) => (
                                        <div key={name} className={`select-option ${sel.pkg === name ? 'selected' : ''}`} onClick={() => S('pkg', name)} style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
                                            <img src={img} alt={name} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                                            <div style={{ padding: '14px' }}>
                                                <p style={{ fontWeight: 800, fontSize: '16px' }}>{name}</p>
                                                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)', margin: '6px 0' }}>{price}</p>
                                                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="estimator-card">
                                <h2>Add-ons</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[['painting', 'Wall Painting & Textures', '+₹80,000'], ['lighting', 'Designer Lighting Package', '+₹1,20,000'], ['furnishing', 'Premium Furnishing Package', '+₹3,00,000']].map(([k, label, price]) => (
                                        <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', border: `2px solid ${sel[k] ? 'var(--primary)' : '#e9ecef'}`, borderRadius: '10px', background: sel[k] ? 'rgba(230,126,34,0.05)' : 'white', transition: '0.3s' }}>
                                            <input type="checkbox" checked={sel[k]} onChange={e => S(k, e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                            <span style={{ fontWeight: 600, flex: 1 }}>{label}</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="cost-display" style={{ background: 'linear-gradient(135deg, #0f3460, #16213e)' }}>
                                <p style={{ opacity: 0.9, marginBottom: '8px' }}>Estimated Full Home Interior Cost</p>
                                <div className="amount">₹{total.toLocaleString('en-IN')}</div>
                                <p style={{ opacity: 0.85, marginTop: '8px' }}>{sel.pkg} Package · {sel.config} · {sel.style}</p>
                                <button onClick={handleSubmit} style={{ marginTop: '24px', background: 'white', color: '#0f3460', border: 'none', padding: '14px 40px', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>Submit & Get Expert Quote →</button>
                            </div>
                        </>
                    )}

                    {/* Nav buttons */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                        {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', border: '2px solid #e9ecef', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600 }}>← Previous</button>}
                        {step < 3 && (
                            <button onClick={() => { if (isStepOk(step)) setStep(s => s + 1); else alert('Please complete all selections') }} className="btn-submit" style={{ flex: 1 }}>Next Step →</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
