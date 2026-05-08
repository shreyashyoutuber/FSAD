import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveEstimation } from '../api'
import { CITIES, MATERIAL_GRADES } from '../config/estimatorConfig'
import { Toast, useToast } from '../components/Toast'

const SIZES = ['7x6 ft', '8x7 ft', '10x8 ft', '12x9 ft', '14x10 ft', 'Custom']
const LAYOUTS = ['L-Shaped', 'U-Shaped', 'Parallel', 'Straight', 'Island']
const SHUTTER_MATERIALS = ['Acrylic', 'PU (Polyurethane)', 'Membrane', 'Lacquered Glass', 'Veneer']
const COUNTERTOP = ['Granite', 'Marble', 'Quartz', 'Ceramic Tile', 'Stainless Steel']

const BASE_COST = 120000
const sizeMul = { '7x6 ft': 1, '8x7 ft': 1.15, '10x8 ft': 1.3, '12x9 ft': 1.5, '14x10 ft': 1.7, 'Custom': 1.4 }
const pkgMul = { Essential: 1, Premium: 1.5, Luxury: 2.2 }

export default function KitchenEstimator() {
    const navigate = useNavigate()
    const { toasts, toast, removeToast } = useToast()
    const [sel, setSel] = useState({
        size: '', layout: '', shutter: '', countertop: '',
        package: 'Essential', appliances: false, sink: false, chimney: false
    })
    const [city, setCity] = useState('')
    const [grade, setGrade] = useState('standard')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isComplete = sel.size && sel.layout && sel.shutter && sel.countertop && city
    const cityMul = CITIES.find(c => c.name === city)?.multiplier || 1.0
    const gradeMul = MATERIAL_GRADES.find(g => g.id === grade)?.multiplier || 1.0
    const extras = (sel.appliances ? 45000 : 0) + (sel.sink ? 15000 : 0) + (sel.chimney ? 20000 : 0)
    const baseEstimate = Math.round(BASE_COST * (sizeMul[sel.size] || 1) * (pkgMul[sel.package] || 1))
    const total = isComplete ? Math.round(baseEstimate * cityMul * gradeMul + extras) : 0

    const S = (k, v) => setSel(p => ({ ...p, [k]: v }))

    const handleSubmit = async () => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) { navigate('/signup'); return }
        const userEmail = JSON.parse(storedUser).email
        if (!userEmail) { navigate('/signup'); return }

        const selectedGrade = MATERIAL_GRADES.find(g => g.id === grade)
        const estData = {
            userEmail,
            type: 'Kitchen Estimator',
            date: new Date().toLocaleDateString(),
            cost: total,
            details: JSON.stringify({ ...sel, city, grade: selectedGrade?.label })
        }

        setIsLoading(true)
        try {
            await saveEstimation(estData)
            setSubmitted(true)
            setTimeout(() => navigate('/user-dashboard'), 2500)
        } catch (err) {
            console.error('Error saving estimation:', err)
            // Fallback for user experience if needed, but the objective is backend persistence
            toast.error('Failed to save estimation to server')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="estimator-page">
            <header className="estimator-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                    <div>
                        <h1 style={{ color: 'white' }}>Kitchen Estimator</h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Get accurate cost estimates for your kitchen renovation</p>
                    </div>
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

                    {/* ── City Selector ── */}
                    <div className="estimator-card">
                        <h2>📍 Your City</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
                            Labour and material costs vary by city. Select yours for an accurate estimate.
                        </p>
                        <select
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '10px',
                                border: `2px solid ${city ? 'var(--primary)' : '#e2e8f0'}`,
                                fontSize: '15px', fontWeight: 600, outline: 'none',
                                background: '#f8fafc', cursor: 'pointer',
                                color: city ? 'var(--primary)' : '#64748b',
                                fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
                            }}
                        >
                            <option value="">— Select your city —</option>
                            {CITIES.map(c => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        {city && (
                            <p style={{ marginTop: '10px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                                📊 {city} cost index: <span style={{ color: 'var(--primary)' }}>{(CITIES.find(c => c.name === city)?.multiplier * 100).toFixed(0)}% of base rate</span>
                            </p>
                        )}
                    </div>

                    {/* ── Material Grade ── */}
                    <div className="estimator-card">
                        <h2>🏷️ Material Quality Grade</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
                            Choose your preferred material quality. This affects the overall cost significantly.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {MATERIAL_GRADES.map(g => (
                                <div
                                    key={g.id}
                                    onClick={() => setGrade(g.id)}
                                    style={{
                                        padding: '20px 16px', borderRadius: '12px', cursor: 'pointer',
                                        border: `2px solid ${grade === g.id ? g.color : '#e2e8f0'}`,
                                        background: grade === g.id ? g.bg : 'white',
                                        textAlign: 'center', transition: 'all 0.2s',
                                        transform: grade === g.id ? 'translateY(-2px)' : 'none',
                                        boxShadow: grade === g.id ? `0 8px 20px ${g.color}30` : 'none'
                                    }}
                                >
                                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{g.emoji}</div>
                                    <p style={{ fontWeight: 800, fontSize: '15px', color: grade === g.id ? g.color : '#1e293b', marginBottom: '6px' }}>{g.label}</p>
                                    <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{g.description}</p>
                                    <p style={{ marginTop: '10px', fontWeight: 800, fontSize: '14px', color: grade === g.id ? g.color : '#94a3b8' }}>
                                        {g.multiplier < 1 ? `${((1 - g.multiplier) * 100).toFixed(0)}% less` : g.multiplier === 1 ? 'Base rate' : `+${((g.multiplier - 1) * 100).toFixed(0)}% more`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

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

                    {/* Cost Display */}
                    <div className="cost-display">
                        <p style={{ opacity: 0.9, marginBottom: '8px' }}>Estimated Kitchen Renovation Cost</p>
                        <div className="amount">₹{total.toLocaleString('en-IN')}</div>
                        {isComplete && (
                            <div style={{ marginTop: '12px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>📍 {city}</span>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>🏷️ {MATERIAL_GRADES.find(g => g.id === grade)?.label} Grade</span>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>📦 {sel.package}</span>
                            </div>
                        )}
                        <p style={{ opacity: 0.85, marginTop: '8px' }}>
                            {isComplete ? `${sel.size} · ${sel.layout} layout` : 'Please select all options including city to see final estimate'}
                        </p>
                        <button
                            onClick={() => { if (isComplete) handleSubmit() }}
                            disabled={isLoading || !isComplete}
                            style={{
                                marginTop: '24px',
                                background: isLoading ? '#ccc' : (isComplete ? 'white' : 'rgba(255,255,255,0.3)'),
                                color: isComplete ? 'var(--primary)' : 'white',
                                border: isComplete ? 'none' : '1px solid white',
                                padding: '14px 40px', borderRadius: '10px',
                                fontWeight: 800, fontSize: '16px',
                                cursor: (isLoading || !isComplete) ? 'not-allowed' : 'pointer',
                                transition: '0.3s', opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? 'Submitting...' : 'Submit & Get Expert Quote →'}
                        </button>
                    </div>
                </div>
            )}
            <Toast toasts={toasts} removeToast={removeToast} />
        </div>
    )
}
