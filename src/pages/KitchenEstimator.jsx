import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SIZES = ['7x6 ft', '8x7 ft', '10x8 ft', '12x9 ft', '14x10 ft', 'Custom']
const LAYOUTS = ['L-Shaped', 'U-Shaped', 'Parallel', 'Straight', 'Island']
const SHUTTER_MATERIALS = ['Acrylic', 'PU (Polyurethane)', 'Membrane', 'Lacquered Glass', 'Veneer']
const COUNTERTOP = ['Granite', 'Marble', 'Quartz', 'Ceramic Tile', 'Stainless Steel']

const BASE_COST = 120000

export default function KitchenEstimator() {
    const navigate = useNavigate()
    const [sel, setSel] = useState({ size: '', layout: '', shutter: '', countertop: '', package: 'Essential', appliances: false, sink: false, chimney: false })
    const [submitted, setSubmitted] = useState(false)

    const isComplete = sel.size && sel.layout && sel.shutter && sel.countertop
    const sizeMul = { '7x6 ft': 1, '8x7 ft': 1.15, '10x8 ft': 1.3, '12x9 ft': 1.5, '14x10 ft': 1.7, 'Custom': 1.4 }
    const pkgMul = { Essential: 1, Premium: 1.5, Luxury: 2.2 }
    const extras = (sel.appliances ? 45000 : 0) + (sel.sink ? 15000 : 0) + (sel.chimney ? 20000 : 0)
    const total = isComplete ? Math.round(BASE_COST * (sizeMul[sel.size] || 1) * (pkgMul[sel.package] || 1) + extras) : 0

    const S = (k, v) => setSel(p => ({ ...p, [k]: v }))

    const handleSubmit = () => {
        const user = sessionStorage.getItem('bhvUser')
        if (!user) { navigate('/login'); return }
        const est = { type: 'Kitchen Estimator', date: new Date().toLocaleDateString(), cost: total, package: sel.package, details: sel }
        const prev = JSON.parse(localStorage.getItem('userEstimates') || '[]')
        localStorage.setItem('userEstimates', JSON.stringify([...prev, est]))
        const req = { id: `EST-${Date.now()}`, customerName: JSON.parse(localStorage.getItem('userData') || '{}').name || 'User', customerEmail: user, type: 'Kitchen Estimator', status: 'pending', dateSubmitted: new Date().toISOString().split('T')[0], description: `Kitchen ${sel.layout} layout, ${sel.size}, ${sel.shutter} shutters`, budget: `₹${total.toLocaleString('en-IN')}`, responded: false }
        const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
        localStorage.setItem('allAdminRequests', JSON.stringify([...allReqs, req]))
        setSubmitted(true)
        setTimeout(() => navigate('/user-dashboard'), 2500)
    }

    return (
        <div className="estimator-page">
            <header className="estimator-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                    <div><h1 style={{ color: 'white' }}>Kitchen Estimator</h1><p style={{ color: 'rgba(255,255,255,0.8)' }}>Get accurate cost estimates for your kitchen renovation</p></div>
                </div>
            </header>

            {submitted ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>Estimate submitted successfully!</h2>
                    <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Redirecting to your dashboard...</p>
                </div>
            ) : (
                <div className="estimator-body">
                    {/* Kitchen Size */}
                    <div className="estimator-card">
                        <h2>Kitchen Size</h2>
                        <div className="select-grid">
                            {SIZES.map(s => <div key={s} className={`select-option ${sel.size === s ? 'selected' : ''}`} onClick={() => S('size', s)}>{s}</div>)}
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="estimator-card">
                        <h2>Kitchen Layout</h2>
                        <div className="select-grid">
                            {LAYOUTS.map(l => <div key={l} className={`select-option ${sel.layout === l ? 'selected' : ''}`} onClick={() => S('layout', l)}>{l}</div>)}
                        </div>
                    </div>

                    {/* Shutter Material */}
                    <div className="estimator-card">
                        <h2>Shutter Material</h2>
                        <div className="select-grid">
                            {SHUTTER_MATERIALS.map(m => <div key={m} className={`select-option ${sel.shutter === m ? 'selected' : ''}`} onClick={() => S('shutter', m)}>{m}</div>)}
                        </div>
                    </div>

                    {/* Countertop */}
                    <div className="estimator-card">
                        <h2>Countertop Material</h2>
                        <div className="select-grid">
                            {COUNTERTOP.map(c => <div key={c} className={`select-option ${sel.countertop === c ? 'selected' : ''}`} onClick={() => S('countertop', c)}>{c}</div>)}
                        </div>
                    </div>

                    {/* Package */}
                    <div className="estimator-card">
                        <h2>Package</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                            {[
                                { name: 'Essential', desc: 'Budget-friendly option with quality materials', img: '/Photos/kitchen-pkg.essentials.png' },
                                { name: 'Premium', desc: 'Upgraded materials with better finishes', img: '/Photos/kitchen-pkg.premium.png' },
                                { name: 'Luxury', desc: 'Top-of-the-line materials and custom designs', img: '/Photos/kitchen-pkg.luxe.png' },
                            ].map(({ name, desc, img }) => (
                                <div key={name} className={`select-option ${sel.package === name ? 'selected' : ''}`} onClick={() => S('package', name)} style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
                                    <img src={img} alt={name} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                                    <div style={{ padding: '14px' }}>
                                        <p style={{ fontWeight: 800, fontSize: '16px' }}>{name}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="estimator-card">
                        <h2>Add-ons</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[['appliances', 'Built-in Appliances', '+₹45,000'], ['sink', 'Premium Sink & Fittings', '+₹15,000'], ['chimney', 'Auto-clean Chimney', '+₹20,000']].map(([k, label, price]) => (
                                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', border: `2px solid ${sel[k] ? 'var(--primary)' : '#e9ecef'}`, borderRadius: '10px', background: sel[k] ? 'rgba(230,126,34,0.05)' : 'white', transition: '0.3s' }}>
                                    <input type="checkbox" checked={sel[k]} onChange={e => S(k, e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontWeight: 600, flex: 1 }}>{label}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{price}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cost */}
                    {isComplete && (
                        <div className="cost-display">
                            <p style={{ opacity: 0.9, marginBottom: '8px' }}>Estimated Kitchen Renovation Cost</p>
                            <div className="amount">₹{total.toLocaleString('en-IN')}</div>
                            <p style={{ opacity: 0.85, marginTop: '8px' }}>{sel.package} Package · {sel.size} · {sel.layout}</p>
                            <button onClick={handleSubmit} style={{ marginTop: '24px', background: 'white', color: 'var(--primary)', border: 'none', padding: '14px 40px', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}>
                                Submit & Get Expert Quote →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
