import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveEstimation } from '../api'
import { CITIES, MATERIAL_GRADES } from '../config/estimatorConfig'
import { Toast, useToast } from '../components/Toast'

const TYPES = ['Single Door', 'Double Door', 'Walk-in', 'Corner', 'Sliding', 'Custom']
const MATERIALS = ['MDF with Laminate', 'HDHMR Board', 'Plywood', 'PVC', 'Solid Wood']
const WIDTHS = ['3 ft', '4 ft', '5 ft', '6 ft', '7 ft', '8 ft+']
const FINISHES = ['Matte Finish', 'Glossy Finish', 'Wood Texture', 'Fabric Texture', 'Glass Panels']
const BASE = 85000

export default function WardrobeEstimator() {
    const navigate = useNavigate()
    const { toasts, toast, removeToast } = useToast()
    const [sel, setSel] = useState({ type: '', material: '', width: '', finish: '', pkg: 'Standard', lights: false, mirror: false, pullout: false })
    const [city, setCity] = useState('')
    const [grade, setGrade] = useState('standard')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const S = (k, v) => setSel(p => ({ ...p, [k]: v }))
    const isComplete = sel.type && sel.material && sel.width && sel.finish && city
    
    const cityMul = CITIES.find(c => c.name === city)?.multiplier || 1.0
    const gradeMul = MATERIAL_GRADES.find(g => g.id === grade)?.multiplier || 1.0
    const sizeMul = { '3 ft': 0.8, '4 ft': 1, '5 ft': 1.2, '6 ft': 1.4, '7 ft': 1.65, '8 ft+': 1.9 }
    const pkgMul = { Standard: 1, Premium: 1.45, Luxury: 2 }
    const extras = (sel.lights ? 8000 : 0) + (sel.mirror ? 12000 : 0) + (sel.pullout ? 15000 : 0)
    
    const baseEstimate = Math.round(BASE * (sizeMul[sel.width] || 1) * (pkgMul[sel.pkg] || 1))
    const total = isComplete ? Math.round(baseEstimate * cityMul * gradeMul + extras) : 0

    const handleSubmit = async () => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) { navigate('/signup'); return }
        const userEmail = JSON.parse(storedUser).email
        if (!userEmail) { navigate('/signup'); return }

        const selectedGrade = MATERIAL_GRADES.find(g => g.id === grade)
        const estData = {
            userEmail,
            type: 'Wardrobe Estimator',
            date: new Date().toLocaleDateString(),
            cost: total,
            details: JSON.stringify({ ...sel, city, grade: selectedGrade?.label })
        }

        setIsLoading(true)
        try {
            toast.success('Wardrobe estimation saved successfully!');
            setSubmitted(true)
            setTimeout(() => navigate('/user-dashboard'), 2500)
        } catch (err) {
            console.error("Error saving estimation:", err)
            toast.error('Failed to save estimation to server');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="estimator-page">
            <header className="estimator-header" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2c3e50)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                    <div><h1 style={{ color: 'white' }}>Wardrobe Estimator</h1><p style={{ color: 'rgba(255,255,255,0.8)' }}>Design your perfect wardrobe and get instant estimate</p></div>
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
                        <select
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '10px',
                                border: `2px solid ${city ? 'var(--primary)' : '#e2e8f0'}`,
                                fontSize: '15px', fontWeight: 600, outline: 'none',
                                background: '#f8fafc', cursor: 'pointer',
                                color: city ? 'var(--primary)' : '#64748b'
                            }}
                        >
                            <option value="">— Select your city —</option>
                            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* ── Material Grade ── */}
                    <div className="estimator-card">
                        <h2>🏷️ Material Quality Grade</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {MATERIAL_GRADES.map(g => (
                                <div
                                    key={g.id}
                                    onClick={() => setGrade(g.id)}
                                    style={{
                                        padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                        border: `2px solid ${grade === g.id ? g.color : '#e2e8f0'}`,
                                        background: grade === g.id ? g.bg : 'white',
                                        textAlign: 'center', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{g.emoji}</div>
                                    <p style={{ fontWeight: 800, fontSize: '14px', color: grade === g.id ? g.color : '#1e293b' }}>{g.label}</p>
                                    <p style={{ fontSize: '11px', color: '#64748b' }}>{g.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: 'Wardrobe Type', opts: TYPES, key: 'type' },
                        { title: 'Material', opts: MATERIALS, key: 'material' },
                        { title: 'Width', opts: WIDTHS, key: 'width' },
                        { title: 'Door Finish', opts: FINISHES, key: 'finish' },
                    ].map(({ title, opts, key }) => (
                        <div className="estimator-card" key={key}>
                            <h2>{title}</h2>
                            <div className="select-grid">
                                {opts.map(o => <div key={o} className={`select-option ${sel[key] === o ? 'selected' : ''}`} onClick={() => S(key, o)}>{o}</div>)}
                            </div>
                        </div>
                    ))}

                    <div className="estimator-card">
                        <h2>Package</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                            {[
                                { name: 'Standard', desc: 'Reliable quality at great value', img: '/Photos/wardrobe-package-img.essentials.png' },
                                { name: 'Premium', desc: 'Enhanced finishes & accessories', img: '/Photos/wardrobe-package-img.premium.png' },
                                { name: 'Luxury', desc: 'Premium materials & smart storage', img: '/Photos/wardrobe-package-img.luxe.png' },
                            ].map(({ name, desc, img }) => (
                                <div key={name} className={`select-option ${sel.pkg === name ? 'selected' : ''}`} onClick={() => S('pkg', name)} style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
                                    <img src={img} alt={name} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                                    <div style={{ padding: '14px' }}>
                                        <p style={{ fontWeight: 800 }}>{name}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="estimator-card">
                        <h2>Add-ons</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[['lights', 'LED Interior Lighting', '+₹8,000'], ['mirror', 'Full-length Mirror Door', '+₹12,000'], ['pullout', 'Pull-out Accessories', '+₹15,000']].map(([k, label, price]) => (
                                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', border: `2px solid ${sel[k] ? 'var(--primary)' : '#e9ecef'}`, borderRadius: '10px', background: sel[k] ? 'rgba(230,126,34,0.05)' : 'white', transition: '0.3s' }}>
                                    <input type="checkbox" checked={sel[k]} onChange={e => S(k, e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontWeight: 600, flex: 1 }}>{label}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{price}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="cost-display" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2c3e50)' }}>
                        <p style={{ opacity: 0.9, marginBottom: '8px' }}>Estimated Wardrobe Cost</p>
                        <div className="amount">₹{total.toLocaleString('en-IN')}</div>
                        {isComplete && (
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>📍 {city}</span>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>🏷️ {MATERIAL_GRADES.find(g => g.id === grade)?.label}</span>
                            </div>
                        )}
                        <p style={{ opacity: 0.85, marginTop: '8px' }}>
                            {isComplete ? `${sel.pkg} Package · ${sel.type} · ${sel.width}` : 'Please select all options including city to see final estimate'}
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
