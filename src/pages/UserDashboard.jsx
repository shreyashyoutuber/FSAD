import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast, useToast } from '../components/Toast'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { fetchUserEstimations, getCurrentUser, saveEstimation, updateProfile, deleteEstimation } from '../api'

const Icons = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>,
    Estimator: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    New: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>,
    Sparkles: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 3.874L18 7.5l-3 2.923L15.708 15 12 13.126 8.292 15 9 10.423 6 7.5l4.088-.626L12 3z" /></svg>,
    Bookmark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    Gift: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
    Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Calculator: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>,
    Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const RECS = [
    { title: 'Kitchen Renovation', desc: 'Modern modular kitchen with granite countertops and chimney', cost: '₹250K', value: '₹400K', roi: '60%', impact: '+8%', priority: 'high', link: '/kitchen-estimator' },
    { title: 'Bathroom Upgrade', desc: 'Premium fittings, new tiles, and modern sanitary ware', cost: '₹180K', value: '₹350K', roi: '94%', impact: '+7%', priority: 'high', link: '/full-home-estimator' },
    { title: 'Fresh Paint & Texture', desc: 'Interior walls with premium Asian Paints and designer textures', cost: '₹80K', value: '₹250K', roi: '100%', impact: '+5%', priority: 'medium', link: '/full-home-estimator' },
    { title: 'Flooring Replacement', desc: 'Vitrified tiles or hardwood flooring for living areas', cost: '₹200K', value: '₹350K', roi: '75%', impact: '+7%', priority: 'medium', link: '/full-home-estimator' },
]

// ---- ANIMATIONS & UTILS ----
const animations = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes pulseGlow { 
    0% { box-shadow: 0 0 0 0 rgba(230,126,34,0.4); } 
    70% { box-shadow: 0 0 0 10px rgba(230,126,34,0); } 
    100% { box-shadow: 0 0 0 0 rgba(230,126,34,0); } 
}
@keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
}
@keyframes spin { to { transform: rotate(360deg); } }

.animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
.animate-slideUp { animation: slideUp 0.5s ease forwards; }
.animate-scaleIn { animation: scaleIn 0.4s ease forwards; }
.animate-pulseGlow { animation: pulseGlow 2s infinite; }

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 8px;
}

.hover-lift { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
.button-press:active { transform: scale(0.96); transition: transform 0.1s; }

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
`

const Spinner = ({ size = 18, color = 'white' }) => (
    <span style={{ width: size, height: size, border: `2.5px solid ${color}40`, borderTopColor: color, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
)

const Skeleton = ({ w = '100%', h = 20, mb = 0, radius = 8 }) => (
    <div className="skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: radius }} />
)

const DashboardSkeleton = () => (
    <div className="animate-fadeIn" style={{ padding: '0' }}>
        <div style={{ marginBottom: '28px' }}>
            <Skeleton w="260px" h={32} mb={10} />
            <Skeleton w="380px" h={18} />
        </div>
        {/* Property card skeleton */}
        <div className="skeleton" style={{ borderRadius: '24px', height: '200px', marginBottom: '32px' }} />
        {/* Timeline skeleton */}
        <div className="skeleton" style={{ borderRadius: '16px', height: '80px', marginBottom: '32px' }} />
        {/* Metric cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginBottom: '32px' }}>
            {[1, 2, 3].map(i => <div key={i} className="card" style={{ margin: 0, padding: '24px' }}><Skeleton h={20} mb={16} /><Skeleton w="60%" h={32} mb={8} /><Skeleton w="80%" h={14} /></div>)}
        </div>
        {/* Chart + actions skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            <div className="card" style={{ margin: 0, padding: '32px' }}><Skeleton h={24} mb={24} w="200px" /><Skeleton h={260} /></div>
            <div className="card" style={{ margin: 0, padding: '32px' }}><Skeleton h={24} mb={20} w="140px" />{[1, 2, 3, 4].map(i => <Skeleton key={i} h={64} mb={12} radius={16} />)}</div>
        </div>
    </div>
)

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
    <div className={`sidebar-link button-press ${active ? 'active' : ''}`} onClick={onClick} style={{ transition: 'all 0.3s' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span>{label}</span>
        {badge > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px', fontSize: '11px', padding: '2px 8px', marginLeft: 'auto' }}>{badge}</span>}
    </div>
)

// ---- PROFILE MODAL ----
function ProfileModal({ userData, onClose, onSave }) {
    const [form, setForm] = useState({ name: userData?.name || '', email: userData?.email || '', phone: userData?.phone || '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(form)
    }

    return (
        <div onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100, padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 800 }}>Edit Profile</h2>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}>×</button>
                </div>
                <div style={{ padding: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 12px', fontWeight: 800, color: 'white', boxShadow: '0 10px 20px rgba(230,126,34,0.3)' }}>
                            {form.name?.[0]?.toUpperCase()}
                        </div>
                        <h3 style={{ fontWeight: 800, margin: '8px 0 4px', color: '#1a1a1a' }}>{form.name}</h3>
                        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>{form.email}</p>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { label: 'Full Name', key: 'name', type: 'text', icon: <Icons.User /> },
                            { label: 'Email Address', key: 'email', type: 'email', icon: <Icons.Search /> },
                            { label: 'Phone Number', key: 'phone', type: 'tel', icon: <Icons.User /> }
                        ].map(({ label, key, type, icon }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>{icon}</span>
                                    <input
                                        type={type}
                                        value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '2px solid #f0ece6', fontSize: '15px', outline: 'none', transition: '0.3s', boxSizing: 'border-box' }}
                                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={e => e.target.style.borderColor = '#f0ece6'}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="btn-submit" style={{ marginTop: '12px', padding: '14px' }}>Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// ---- EMI CALCULATOR VIEW ----
function EmiView() {
    const [amount, setAmount] = useState(500000)
    const [rate, setRate] = useState(10.5)
    const [tenure, setTenure] = useState(12)
    const [customTenure, setCustomTenure] = useState('')
    const [useCustom, setUseCustom] = useState(false)
    const [emi, setEmi] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)

    const activeTenure = useCustom ? (parseInt(customTenure) || 0) : tenure

    useEffect(() => {
        if (activeTenure <= 0 || rate <= 0) { setEmi(0); setTotalInterest(0); return }
        const r = rate / 12 / 100
        const n = activeTenure
        const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        setEmi(Math.round(emiVal))
        setTotalInterest(Math.round(emiVal * n - amount))
    }, [amount, rate, activeTenure])

    const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
    const PRESETS = [6, 12, 24, 36, 48, 60, 84, 120]
    const principalPct = emi > 0 ? Math.round(amount / (amount + totalInterest) * 100) : 0
    const interestPct = 100 - principalPct

    return (
        <div className="animate-fadeIn" style={{ maxWidth: '980px', margin: '0 auto' }}>
            {/* Header banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '36px 40px', marginBottom: '28px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🧮</div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Renovation EMI Calculator</h2>
                    <p style={{ opacity: 0.7, margin: '6px 0 0', fontSize: '14px' }}>Plan your monthly installments before starting your renovation</p>
                </div>
                {emi > 0 && (
                    <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.08)', padding: '20px 28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '13px', opacity: 0.6, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly EMI</p>
                        <p style={{ fontSize: '38px', fontWeight: 800, color: '#e67e22', margin: 0 }}>{fmt(emi)}</p>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
                {/* ── Input Card ── */}
                <div className="card" style={{ margin: 0, padding: '36px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '32px', color: '#1e293b' }}>Loan Parameters</h3>

                    {/* Loan Amount */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Loan Amount</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '18px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>{fmt(amount)}</span>
                        </div>
                        <input type="range" min="50000" max="5000000" step="50000" value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>₹50K</span><span>₹50L</span>
                        </div>
                        {/* Quick amounts */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                            {[200000, 500000, 1000000, 2000000].map(a => (
                                <button key={a} onClick={() => setAmount(a)}
                                    style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', border: `1.5px solid ${amount === a ? '#e67e22' : '#e2e8f0'}`, background: amount === a ? '#fff7ed' : 'white', color: amount === a ? '#e67e22' : '#64748b' }}>
                                    {a >= 100000 ? `₹${a / 100000}L` : `₹${a / 1000}K`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interest Rate — starts from 0 */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Interest Rate (p.a.)</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '18px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>{rate}%</span>
                        </div>
                        <input type="range" min="0" max="30" step="0.5" value={rate}
                            onChange={e => setRate(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>0%</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>Typical: 8–14%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    {/* Loan Tenure */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Loan Tenure</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '18px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>{activeTenure}M</span>
                        </div>
                        {/* Slider */}
                        <input type="range" min="1" max="360" step="1"
                            value={useCustom ? (parseInt(customTenure) || 1) : tenure}
                            onChange={e => { setTenure(Number(e.target.value)); setUseCustom(false); setCustomTenure('') }}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer', marginBottom: '8px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>1 Month</span><span>360 Months (30 yrs)</span>
                        </div>
                        {/* Preset chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {PRESETS.map(t => (
                                <button key={t} onClick={() => { setTenure(t); setUseCustom(false); setCustomTenure('') }}
                                    style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', border: `1.5px solid ${!useCustom && tenure === t ? '#e67e22' : '#e2e8f0'}`, background: !useCustom && tenure === t ? '#fff7ed' : 'white', color: !useCustom && tenure === t ? '#e67e22' : '#64748b' }}>
                                    {t}M
                                </button>
                            ))}
                        </div>
                        {/* Custom input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: `2px solid ${useCustom ? '#e67e22' : '#e2e8f0'}`, transition: '0.2s' }}>
                            <span style={{ fontSize: '16px' }}>✏️</span>
                            <input type="number" placeholder="Custom months e.g. 18" value={customTenure} min="1" max="600"
                                onChange={e => { setCustomTenure(e.target.value); setUseCustom(true) }}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: 700, color: '#1e293b', width: '100%' }} />
                            <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 600 }}>months</span>
                        </div>
                    </div>
                </div>

                {/* ── Results Card ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* EMI breakdown */}
                    <div style={{ background: 'linear-gradient(160deg, #1e293b, #0f172a)', padding: '36px', borderRadius: '24px', color: 'white', flex: 1 }}>
                        <p style={{ opacity: 0.6, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>Monthly Payment</p>
                        <p style={{ fontSize: '48px', fontWeight: 800, color: '#e67e22', margin: '0 0 28px', textShadow: '0 4px 20px rgba(230,126,34,0.35)' }}>
                            {emi > 0 ? fmt(emi) : <span style={{ opacity: 0.3, fontSize: '32px' }}>Calculating...</span>}
                        </p>

                        {/* Principal vs Interest bar */}
                        {emi > 0 && (
                            <div style={{ marginBottom: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', opacity: 0.6 }}>
                                    <span>Principal ({principalPct}%)</span>
                                    <span>Interest ({interestPct}%)</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                                    <div style={{ width: `${principalPct}%`, background: 'linear-gradient(90deg, #e67e22, #f39c12)', transition: '0.5s' }} />
                                    <div style={{ flex: 1, background: 'rgba(248,113,113,0.5)' }} />
                                </div>
                            </div>
                        )}

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }} />

                        {[
                            { label: 'Principal Amount', value: fmt(amount), color: 'white' },
                            { label: 'Total Interest', value: fmt(totalInterest), color: '#f87171' },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15px' }}>
                                <span style={{ opacity: 0.65 }}>{r.label}</span>
                                <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                            </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', borderTop: '2px dashed rgba(255,255,255,0.1)', paddingTop: '18px', marginTop: '6px' }}>
                            <span style={{ fontWeight: 800 }}>Total Payable</span>
                            <span style={{ fontWeight: 800, color: '#e67e22' }}>{fmt(amount + totalInterest)}</span>
                        </div>
                        {activeTenure > 0 && (
                            <p style={{ opacity: 0.45, fontSize: '12px', marginTop: '10px', textAlign: 'right' }}>Over {activeTenure} months @ {rate}% p.a.</p>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="card" style={{ margin: 0, padding: '24px' }}>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6 }}>
                            🏦 Ready to apply? Get instant pre-approval from our banking partners with zero paperwork.
                        </p>
                        <button style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(230,126,34,0.3)', transition: '0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            Apply for Instant Loan →
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>*Indicative rates. Subject to credit approval by partner banks.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ---- CONFIRM MODAL ----
function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div onClick={e => e.target === e.currentTarget && onCancel()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease' }}>
                <div style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px' }}>⚠️</div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>{title}</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>{message}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onCancel} style={{ flex: 1, padding: '12px', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#555' }}>Cancel</button>
                        <button onClick={onConfirm} style={{ flex: 1, padding: '12px', background: '#dc2626', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: 'white' }}>Yes, Exit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ---- CHAT MODAL (outside component to avoid re-render focus bug) ----
function ChatModal({ requestId, requestType, userName, onClose }) {
    const [msgs, setMsgs] = useState(() => JSON.parse(localStorage.getItem(`chat_${requestId}`) || '[]'))
    const [text, setText] = useState('')
    const bottomRef = useRef(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

    // Mark admin messages as read when chat is opened
    useEffect(() => {
        const markRead = () => {
            const chatMsgs = JSON.parse(localStorage.getItem(`chat_${requestId}`) || '[]')
            const adminCount = chatMsgs.filter(m => m.sender === 'admin').length
            const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
            readCounts[requestId] = adminCount
            localStorage.setItem('chatReadCounts', JSON.stringify(readCounts))
        }
        markRead()
    }, [requestId, msgs])

    const send = () => {
        if (!text.trim()) return
        const newMsg = { sender: 'user', name: userName || 'You', message: text.trim(), time: new Date().toISOString() }
        let updated = [...msgs, newMsg]

        // Auto-reply on first message from user
        const userMsgsBefore = msgs.filter(m => m.sender === 'user').length
        if (userMsgsBefore === 0) {
            const autoReply = {
                sender: 'system',
                name: 'BharatHome Value',
                message: '👋 Thank you for reaching out! Your message has been received. Our expert will review and respond shortly. Please wait for the admin to reply.',
                time: new Date(Date.now() + 1000).toISOString(),
                auto: true
            }
            updated = [...updated, autoReply]
        }

        setMsgs(updated)
        localStorage.setItem(`chat_${requestId}`, JSON.stringify(updated))
        setText('')
    }

    const fmt = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    return (
        <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', height: '580px', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>

                {/* Chat Header */}
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏠</div>
                        <div>
                            <p style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>Negotiate with Expert</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{requestType} · {requestId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}>×</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fdf6ee' }}>
                    {msgs.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '60px', color: '#bbb' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                            <p style={{ fontWeight: 600 }}>Start the negotiation!</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}>Ask for a discount, clarify scope, or request changes</p>
                        </div>
                    )}
                    {msgs.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : m.sender === 'system' ? 'center' : 'flex-start' }}>
                            {m.sender === 'system' ? (
                                <div style={{ maxWidth: '88%', background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '13px', color: '#b45309', lineHeight: 1.6 }}>{m.message}</p>
                                    <p style={{ fontSize: '10px', color: '#d97706', marginTop: '6px' }}>Auto-generated · {fmt(m.time)}</p>
                                </div>
                            ) : (
                                <div style={{ maxWidth: '78%' }}>
                                    <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                                        {m.sender === 'user' ? 'You' : '🔑 Admin'} · {fmt(m.time)}
                                    </p>
                                    <div style={{
                                        padding: '12px 16px', borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'white',
                                        color: m.sender === 'user' ? 'white' : '#1a1a1a',
                                        fontSize: '14px', lineHeight: 1.6,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: m.sender === 'admin' ? '1px solid #f0ece6' : 'none'
                                    }}>
                                        {m.message}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '16px 20px', background: 'white', borderTop: '2px solid #f5efe6', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        placeholder="Type your message… (Enter to send)"
                        style={{ flex: 1, padding: '11px 16px', borderRadius: '12px', border: '2px solid #f0ece6', fontSize: '14px', outline: 'none', fontFamily: 'inherit', transition: '0.3s', background: '#fdf6ee' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white' }}
                        onBlur={e => { e.target.style.borderColor = '#f0ece6'; e.target.style.background = '#fdf6ee' }}
                        autoFocus
                    />
                    <button onClick={send} disabled={!text.trim()}
                        style={{ width: '44px', height: '44px', borderRadius: '12px', background: text.trim() ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : '#e9ecef', border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed', fontSize: '20px', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📤
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Project Timeline Component ─────────────────────────────────────────────
function ProjectTimeline({ status }) {
    const steps = [
        { id: 'submitted', label: 'Submitted', emoji: '📝' },
        { id: 'under-review', label: 'Under Review', emoji: '🔍' },
        { id: 'quote-sent', label: 'Quote Sent', emoji: '💰' },
        { id: 'in-progress', label: 'In Progress', emoji: '🏗️' },
        { id: 'completed', label: 'Completed', emoji: '✅' }
    ]

    const currentIndex = steps.findIndex(s => s.id === status) || 0

    return (
        <div style={{ marginTop: '24px', padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e9ecef' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#64748b', marginBottom: '20px', textTransform: 'uppercase' }}>Project Progress Tracker</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '3px', background: '#e9ecef', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '15px', left: '0', width: `${(currentIndex / (steps.length - 1)) * 100}%`, height: '3px', background: 'var(--primary)', zIndex: 1, transition: '0.5s all' }}></div>

                {steps.map((s, i) => {
                    const isCompleted = i <= currentIndex
                    const isActive = i === currentIndex
                    return (
                        <div key={s.id} style={{ zIndex: 2, textAlign: 'center', flex: 1 }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', background: isCompleted ? 'var(--primary)' : 'white',
                                border: `3px solid ${isCompleted ? 'var(--primary)' : '#e9ecef'}`,
                                margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: '0.3s all', fontSize: '14px',
                                transform: isActive ? 'scale(1.2)' : 'none',
                                boxShadow: isActive ? '0 0 15px rgba(230,126,34,0.4)' : 'none'
                            }}>
                                {isCompleted ? '✓' : ''}
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: isCompleted ? 'var(--primary)' : '#94a3b8' }}>{s.label}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ---- LIGHTBOX VIEWER ----
function LightboxViewer({ lightbox, setLightbox }) {
    const { images, index } = lightbox
    const img = images[index]
    const total = images.length
    const prev = () => setLightbox({ images, index: (index - 1 + total) % total })
    const next = () => setLightbox({ images, index: (index + 1) % total })

    return (
        <div
            onClick={e => { if (e.target === e.currentTarget) setLightbox(null) }}
            onKeyDown={e => { if (e.key === 'Escape') setLightbox(null); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }}
            tabIndex={0}
            ref={el => el?.focus()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, outline: 'none' }}>

            {/* Top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(rgba(0,0,0,0.6), transparent)' }}>
                <div>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '16px' }}>{img.name || `Image ${index + 1}`}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>{index + 1} of {total} · Design Reference</p>
                </div>
                <button onClick={() => setLightbox(null)}
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white', width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer', fontSize: '22px', fontWeight: 700, transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                    ×
                </button>
            </div>

            {/* Image */}
            <img
                src={img.data}
                alt={img.name || 'Reference'}
                style={{ maxWidth: '85vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', animation: 'slideUp 0.25s ease' }}
            />

            {/* Nav arrows */}
            {total > 1 && (
                <>
                    <button onClick={prev}
                        style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', fontSize: '24px', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,126,34,0.8)'; e.currentTarget.style.borderColor = '#e67e22' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
                        ‹
                    </button>
                    <button onClick={next}
                        style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', fontSize: '24px', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,126,34,0.8)'; e.currentTarget.style.borderColor = '#e67e22' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
                        ›
                    </button>
                </>
            )}

            {/* Thumbnail strip */}
            {total > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                    {images.map((thumb, i) => (
                        <div
                            key={i}
                            onClick={() => setLightbox({ images, index: i })}
                            style={{ width: '56px', height: '42px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: i === index ? '2.5px solid #e67e22' : '2px solid rgba(255,255,255,0.2)', opacity: i === index ? 1 : 0.5, transition: '0.3s', boxShadow: i === index ? '0 0 12px rgba(230,126,34,0.5)' : 'none' }}>
                            <img src={thumb.data} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function UserDashboard() {
    const navigate = useNavigate()
    const { toasts, toast, removeToast } = useToast()
    const [view, setView] = useState('dashboard') // dashboard | estimator | new-estimator | recommendations | saved | profile | submit
    const [userData, setUserData] = useState(null)
    const [savedIdeas, setSavedIdeas] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
    const [showAllRecs, setShowAllRecs] = useState(false)
    const [chatReq, setChatReq] = useState(null) // { id, type } of request to chat about
    const [lightbox, setLightbox] = useState(null) // { images: [], index: 0 }
    const [unreadChats, setUnreadChats] = useState(0)
    const [showProfile, setShowProfile] = useState(false)
    const [showExitConfirm, setShowExitConfirm] = useState(false)
    const [propertyPhotos, setPropertyPhotos] = useState([]) // Base64 images for submission
    const fileInputRef = useRef(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const notificationRef = useRef(null)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewText, setReviewText] = useState('')

    // Contractor Directory States
    const [contractorSearch, setContractorSearch] = useState('')
    const [contractorFilter, setContractorFilter] = useState('All')
    const [selectedContractor, setSelectedContractor] = useState(null)

    // NEW Persistent States
    const [estimates, setEstimates] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(null) // est object to delete
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Close notifications on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Handle Property Image Upload
    const handlePropertyPhotoUpload = (e) => {
        const files = Array.from(e.target.files)
        if (propertyPhotos.length + files.length > 5) {
            alert('Maximum 5 photos allowed per property.')
            return
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file.`)
                return
            }
            const reader = new FileReader()
            reader.onload = (event) => {
                setPropertyPhotos(prev => [...prev, { name: file.name, data: event.target.result }])
            }
            reader.readAsDataURL(file)
        })
    }

    const removePropertyPhoto = (index) => {
        setPropertyPhotos(prev => prev.filter((_, i) => i !== index))
    }

    // ---- AI RECOMMENDATION ENGINE ----
    const generateAIRecommendations = (property) => {
        if (!property) return []
        const typeStr = property.type?.replace('Property: ', '') || 'Property'

        // Handle potentially stringified details
        let details = property.details
        if (typeof details === 'string') {
            try { details = JSON.parse(details) } catch (e) { details = {} }
        }

        const valueNum = parseInt(details?.marketValue?.replace(/[^0-9]/g, '') || 5000000)
        const sizeNum = parseInt(details?.area || details?.size || 1200)
        const locationStr = property.customerAddress?.split(',').pop().trim() || 'your location'

        const recommendations = []
        recommendations.push({
            title: 'Designer Modular Kitchen',
            desc: `Premium L-shaped layout with quartz countertops, ideal for ${typeStr}s in ${locationStr}.`,
            cost: `₹${(Math.round(valueNum * 0.05) / 100000).toFixed(1)}L`,
            value: `+₹${(Math.round(valueNum * 0.05 * 1.6) / 100000).toFixed(1)}L`,
            roi: '60%', impact: '+6.5%', priority: 'high', link: '/kitchen-estimator'
        })
        recommendations.push({
            title: 'Italian Marble Flooring',
            desc: `Replace standard tiles with mirrored Italian marble to elevate the ${typeStr}'s appeal.`,
            cost: `₹${(Math.round(sizeNum * 450) / 100000).toFixed(1)}L`,
            value: `+₹${(Math.round(sizeNum * 450 * 1.8) / 100000).toFixed(1)}L`,
            roi: '80%', impact: '+8%', priority: 'medium', link: '/full-home-estimator'
        })
        if (valueNum > 7000000) {
            recommendations.push({
                title: 'Smart Automation Hub',
                desc: `Integrated lighting, security, and climate control for a modern ${locationStr} lifestyle.`,
                cost: '₹2.5L', value: '+₹4.0L', roi: '60%', impact: '+4%', priority: 'medium', link: '/full-home-estimator'
            })
        }
        if (typeStr.toLowerCase().includes('villa') || typeStr.toLowerCase().includes('house')) {
            recommendations.push({
                title: 'Solar Power Plant',
                desc: `5kW Rooftop Solar system with net metering. High value for independent ${typeStr}s.`,
                cost: '₹4.5L', value: '+₹8.0L', roi: '78%', impact: '+9%', priority: 'high', link: '/full-home-estimator'
            })
        } else {
            recommendations.push({
                title: 'Master Bedroom suite',
                desc: `End-to-end paneling and walk-in wardrobe for your ${typeStr} bedroom.`,
                cost: '₹3.2L', value: '+₹5.5L', roi: '72%', impact: '+5%', priority: 'medium', link: '/wardrobe-estimator'
            })
        }
        return recommendations
    }

    // Real Location Rating Engine (City Database)
    const calculateLocationRating = (details) => {
        if (!details) return '3.8/5.0'
        const addr = (details.address || details.locality || '').toLowerCase()
        const city = (details.city || '').toLowerCase()
        const combined = `${addr} ${city}`

        // Real city quality scores based on infrastructure, RE values, livability indices
        const cityScores = {
            // Tier 1 - Top Metro
            'mumbai': 4.6, 'delhi': 4.5, 'bengaluru': 4.6, 'bangalore': 4.6,
            'hyderabad': 4.5, 'chennai': 4.4, 'kolkata': 4.2, 'pune': 4.4,
            'ahmedabad': 4.3, 'gurgaon': 4.6, 'gurugram': 4.6, 'noida': 4.4,
            'navi mumbai': 4.3, 'thane': 4.2,
            // Tier 2 - Major Cities
            'surat': 4.1, 'jaipur': 4.0, 'lucknow': 3.9, 'kochi': 4.2,
            'chandigarh': 4.3, 'indore': 4.1, 'bhopal': 3.8, 'nagpur': 3.9,
            'patna': 3.5, 'vadodara': 4.0, 'coimbatore': 4.0, 'visakhapatnam': 3.9,
            'agra': 3.7, 'nashik': 3.9, 'mysuru': 4.1, 'mysore': 4.1,
            'rajkot': 3.8, 'meerut': 3.6, 'faridabad': 3.8, 'ghaziabad': 3.8,
            'amritsar': 3.9, 'aurangabad': 3.7, 'solapur': 3.6, 'jabalpur': 3.6,
            'warangal': 3.6, 'raipur': 3.7, 'ranchi': 3.6, 'jodhpur': 3.8,
            'madurai': 3.8, 'tiruchirappalli': 3.7, 'guwahati': 3.7, 'bhubaneswar': 3.8,
            'dehradun': 4.0, 'shimla': 4.0, 'mangaluru': 4.1, 'hubli': 3.7,
            'vijayawada': 3.8, 'guntur': 3.6, 'nellore': 3.5, 'belgaum': 3.6,
            'tirunelveli': 3.5, 'salem': 3.6, 'udaipur': 4.0, 'ajmer': 3.6,
            // Tier 3
            'aligarh': 3.3, 'gwalior': 3.5, 'dhanbad': 3.2, 'bareilly': 3.3,
            'moradabad': 3.3, 'mysore': 4.1, 'kolhapur': 3.8, 'bilaspur': 3.4,
        }

        // Find best city match
        let baseScore = 3.5
        for (const [key, val] of Object.entries(cityScores)) {
            if (combined.includes(key)) { baseScore = val; break }
        }

        // Premium locality boost
        const premiumAreas = ['bandra', 'juhu', 'worli', 'powai', 'andheri', 'whitefield', 'koramangala',
            'indiranagar', 'hsr layout', 'banjara hills', 'jubilee hills', 'hitech city',
            'cyber city', 'dlf', 'sector 56', 'sector 44', 'golf course', 'marine drive',
            'connaught', 'hauz khas', 'vasant kunj', 'defence colony', 'anna nagar', 'adyar',
            'velachery', 't nagar', 'viman nagar', 'kalyani nagar', 'aundh', 'wakad']
        const budgetAreas = ['chawl', 'slum', 'jhuggi', 'dhobi ghat', 'industrial', 'nala']

        let modifier = 0
        premiumAreas.forEach(a => { if (combined.includes(a)) modifier += 0.3 })
        budgetAreas.forEach(a => { if (combined.includes(a)) modifier -= 0.5 })

        const finalScore = Math.min(5.0, Math.max(2.5, baseScore + modifier)).toFixed(1)
        return `${finalScore}/5.0`
    }

    useEffect(() => {
        const style = document.createElement('style')
        style.innerText = animations
        document.head.appendChild(style)
        return () => {
            if (document.head.contains(style)) document.head.removeChild(style)
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userData')
        sessionStorage.clear()
        navigate('/login')
    }

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (!userStr) { navigate('/login'); return }
        const user = JSON.parse(userStr)
        const email = user.email

        // Fetch User Profile and Estimations from API
        const loadData = async () => {
            setIsLoadingData(true)
            try {
                // Fetch estimations
                console.log('Loading dashboard data for:', email);
                const apiEstimates = await fetchUserEstimations(email)

                // Parse details JSON string for each estimate
                const parsedEstimates = apiEstimates.map(est => ({
                    ...est,
                    parsedDetails: typeof est.details === 'string' ? JSON.parse(est.details) : est.details
                }));

                console.log('Fetched estimations:', parsedEstimates.length, parsedEstimates);
                setEstimates(parsedEstimates)

                // Fetch profile to get savedIdeas
                const profile = await getCurrentUser()
                setUserData(profile)
                setProfileForm({ name: profile.name || '', email: profile.email || '', phone: profile.phone || '' })
                setSavedIdeas(JSON.parse(profile.savedIdeas || '[]'))
            } catch (err) {
                console.error('Error loading data:', err)
                // Fallback to localStorage if API fails (optional)
                const data = JSON.parse(localStorage.getItem('user') || '{}')
                setUserData(data || { name: 'User' })
                setSavedIdeas(JSON.parse(localStorage.getItem('savedIdeas') || '[]'))
            } finally {
                setIsLoadingData(false)
            }
        }
        loadData()
    }, [])

    // Clear unread counts when recommendations view is opened
    useEffect(() => {
        const count = getUnreadCount()
        if (view === 'recommendations' && count > 0) {
            // Mark all as read locally for now
            const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
            estimates.forEach(req => {
                if (req.responded) {
                    const chatMsgs = JSON.parse(localStorage.getItem(`chat_${req.id}`) || '[]')
                    readCounts[req.id] = chatMsgs.filter(m => m.sender === 'admin').length
                }
            })
            localStorage.setItem('chatReadCounts', JSON.stringify(readCounts))
            setUnreadChats(0)
        } else {
            setUnreadChats(count)
        }
    }, [view, chatReq, estimates])

    const saveIdea = async (rec) => {
        const already = savedIdeas.find(s => s.title === rec.title)
        if (already) { toast.warning('Already saved!'); return }
        const updated = [...savedIdeas, rec]
        setSavedIdeas(updated)
        try {
            await updateSavedIdeas(JSON.stringify(updated))
            toast.success(`"${rec.title}" saved for later!`)
        } catch (err) {
            console.error('Error saving idea:', err)
            localStorage.setItem('savedIdeas', JSON.stringify(updated))
        }
    }

    const removeIdea = async (title) => {
        const updated = savedIdeas.filter(s => s.title !== title)
        setSavedIdeas(updated)
        try {
            await updateSavedIdeas(JSON.stringify(updated))
        } catch (err) {
            console.error('Error removing idea:', err)
            localStorage.setItem('savedIdeas', JSON.stringify(updated))
        }
    }

    const logoutHandler = () => {
        logout()
    }

    const saveProfile = async (newInfo) => {
        try {
            const updated = await updateProfile(newInfo)
            setUserData(updated)
            setShowProfile(false)
            toast.success('Profile updated!')
        } catch (err) {
            console.error('Error updating profile:', err)
            toast.error('Failed to update profile')
        }
    }

    // Data Derivation
    const userFromStore = JSON.parse(localStorage.getItem('user') || '{}')
    const userEmail = userFromStore.email

    // Find the primary property for this user (most recent submission)
    const myProperties = estimates.filter(r => r.type.startsWith('Property:'))
    const activeProperty = myProperties.length > 0 ? myProperties[myProperties.length - 1] : null

    // Calculated metrics
    const dynamicRecs = generateAIRecommendations(activeProperty)
    const activeRecsCount = estimates.filter(r => r.responded).length
    const totalInvestment = estimates
        .filter(res => res.responded)
        .reduce((sum, res) => sum + parseInt(res.adminQuote || 0), 0)

    const potentialValueIncrease = totalInvestment > 0 ? Math.round(totalInvestment * 1.8) : 0

    // Heuristics for display
    const parseMoney = (s) => parseFloat(s?.replace(/[^0-9]/g, '') || '0') * (s?.includes('K') ? 1000 : (s?.includes('L') ? 100000 : 1))
    const fallbackTotalCost = RECS.reduce((sum, r) => sum + parseMoney(r.cost), 0)
    const fallbackTotalValue = RECS.reduce((sum, r) => sum + parseMoney(r.value), 0)

    const displayInvestment = totalInvestment > 0 ? totalInvestment : (activeProperty ? fallbackTotalCost : 0)
    const displayValueIncrease = potentialValueIncrease > 0 ? potentialValueIncrease : (activeProperty ? fallbackTotalValue : 0)
    const displayRecsCount = activeRecsCount > 0 ? activeRecsCount : (activeProperty ? RECS.length : 0)

    const activePropertyDetails = activeProperty?.parsedDetails || {}

    const baseValue = parseInt(activePropertyDetails?.marketValue?.toString().replace(/[^0-9]/g, '') || 0)

    const prop = activeProperty ? {
        type: activeProperty.type?.replace('Property: ', '') || 'Residential',
        location: activePropertyDetails?.address || activePropertyDetails?.city || 'Location',
        currentValue: baseValue,
        size: activePropertyDetails?.propertySize || activePropertyDetails?.size || 'N/A',
        age: (() => {
            if (activePropertyDetails?.propertyAge || activePropertyDetails?.age) return activePropertyDetails.propertyAge || activePropertyDetails.age
            if (activePropertyDetails?.yearBuilt) return new Date().getFullYear() - Number(activePropertyDetails.yearBuilt)
            return 'N/A'
        })(),
        locationRating: calculateLocationRating(activePropertyDetails)
    } : (userData?.property || {})

    // Chart Data Generation
    const chartLabels = ['Current', 'In Progress', 'Responded', 'Final Value']
    const chartGrowthData = [
        baseValue,
        baseValue + (displayInvestment * 0.2),
        baseValue + (displayInvestment * 0.8),
        baseValue + displayValueIncrease
    ]

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Property Value (₹)',
                data: chartGrowthData,
                borderColor: '#e67e22', backgroundColor: 'rgba(230,126,34,0.1)',
                fill: true, tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'white',
                pointBorderColor: '#e67e22',
                pointBorderWidth: 2
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                grid: { color: '#f0f0f0' },
                ticks: {
                    callback: v => `₹${(v / 100000).toFixed(0)}L`,
                    font: { size: 12, weight: '600' }
                }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, weight: '600' } }
            }
        }
    }

    const getUnreadCount = () => {
        const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
        if (!userEmail) return 0

        return estimates.reduce((acc, req) => {
            if (req.responded) {
                const chatMsgs = JSON.parse(localStorage.getItem(`chat_${req.id}`) || '[]')
                const totalAdmin = chatMsgs.filter(m => m.sender === 'admin').length
                const read = readCounts[req.id] || 0
                return acc + Math.max(0, totalAdmin - read)
            }
            return acc
        }, 0)
    }

    if (!userData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>


    const navLinks = [
        { icon: <Icons.Dashboard />, label: 'Dashboard', key: 'dashboard' },
        { icon: <Icons.Estimator />, label: 'My Estimator', key: 'estimator' },
        { icon: <Icons.New />, label: 'New Estimate', key: 'new-estimator' },
        { icon: <Icons.Sparkles />, label: 'Recommendations', key: 'recommendations', badge: unreadChats },
        { icon: <Icons.Bookmark />, label: 'Saved Ideas', key: 'saved', badge: savedIdeas.length },
        { icon: <Icons.Home />, label: 'Submit Property', key: 'submit' },
        { icon: <Icons.Gift />, label: 'Refer & Earn', key: 'referral' },
        { icon: <Icons.Users />, label: 'Contractor Directory', key: 'contractors' },
        { icon: <Icons.Calculator />, label: 'EMI Calculator', key: 'emi' },
    ]


    return (
        <div className="dashboard-layout">
            <Toast toasts={toasts} removeToast={removeToast} />
            {/* Overlay for mobile */}
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="sidebar-header" onClick={() => setView('dashboard')} style={{ cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
                    <h2 className="sidebar-brand" id="BharatHomeValue" style={{ fontSize: '22px', fontWeight: 800 }}>
                        BharatHome<span>Value</span>
                    </h2>
                </div>
                <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(230,126,34,0.3) transparent' }}>
                    {navLinks.map(l => (
                        <SidebarLink key={l.key} icon={l.icon} label={l.label} active={view === l.key} onClick={() => {
                            setView(l.key);
                            setSidebarOpen(false);
                        }} badge={l.badge} />
                    ))}
                </nav>
                <div className="sidebar-footer" style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                    <div className="sidebar-link" onClick={() => setShowExitConfirm(true)}>← Back to Home</div>
                </div>
            </aside>


            {/* Main */}
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }} className="mobile-menu-btn">☰</button>
                        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>
                            {view === 'dashboard' ? 'Dashboard' : view === 'estimator' ? 'My Estimates' : view === 'new-estimator' ? 'New Estimate' : view === 'recommendations' ? 'Recommendations' : view === 'saved' ? 'Saved Ideas' : view === 'profile' ? 'Profile' : view === 'submit' ? 'Submit Property' : view === 'contractors' ? 'Contractor Directory' : view === 'referral' ? 'Refer & Earn' : view === 'emi' ? '🧮 EMI Calculator' : 'Dashboard'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }} ref={notificationRef}>
                            <div
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ width: '40px', height: '40px', background: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e9ecef', position: 'relative' }}
                                className="button-press"
                            >
                                <span style={{ fontSize: '20px' }}>🔔</span>
                                {unreadChats > 0 && (
                                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                                        {unreadChats}
                                    </span>
                                )}
                            </div>

                            {showNotifications && (
                                <div style={{ position: 'absolute', top: '50px', right: '0', width: '320px', background: 'white', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', border: '1px solid #e9ecef', zIndex: 1000, overflow: 'hidden', animation: 'scaleIn 0.2s ease' }}>
                                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Notifications</h4>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}>Mark all as read</span>
                                    </div>
                                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                        {unreadChats > 0 ? (
                                            estimates.filter(r => {
                                                const msgs = JSON.parse(localStorage.getItem(`chat_${r.id}`) || '[]')
                                                const adminMsgs = msgs.filter(m => m.sender === 'admin').length
                                                const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
                                                return adminMsgs > (readCounts[r.id] || 0)
                                            }).map(r => (
                                                <div key={r.id} onClick={() => { setView('recommendations'); setChatReq({ id: r.id, type: r.type }); setShowNotifications(false) }} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>💬</div>
                                                        <div>
                                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>Expert replied to your request</p>
                                                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{r.type} · {r.id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
                                                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '12px', background: '#f8fafc', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                                        <button onClick={() => { setView('recommendations'); setShowNotifications(false) }} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View All Recommendations</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            onClick={() => setShowProfile(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: '0.3s',
                                background: showProfile ? 'var(--primary-dark)' : 'transparent',
                                border: `1.5px solid ${showProfile ? 'var(--primary)' : '#e9ecef'}`,
                            }}
                            onMouseEnter={e => { if (!showProfile) e.currentTarget.style.background = '#f8f9fa' }}
                            onMouseLeave={e => { if (!showProfile) e.currentTarget.style.background = 'transparent' }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 800,
                                color: 'white'
                            }}>
                                {userData.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Profile</span>
                        </div>
                        <button onClick={logoutHandler} className="button-press" style={{ padding: '8px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, transition: '0.3s' }} onMouseEnter={e => e.target.style.background = '#fecaca'} onMouseLeave={e => e.target.style.background = '#fee2e2'}>Logout</button>
                    </div>
                </header>

                <main className="dashboard-main">
                    {/* ---- DASHBOARD VIEW ---- */}
                    {view === 'dashboard' && (
                        isLoadingData ? <DashboardSkeleton /> : (
                            <div className="animate-fadeIn">
                                <div style={{ marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Welcome back, {userData.name}!</h2>
                                    <p style={{ color: 'var(--muted)' }}>Here's an overview of your property improvement journey</p>
                                </div>

                                {/* Property Card */}
                                {activeProperty ? (
                                    <>
                                        {/* Property Card */}
                                        <div className="card animate-slideUp stagger-1" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white', marginBottom: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>YOUR PROPERTY</h3>
                                                    <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{activeProperty.type?.replace('Property: ', '') || 'Residential'}</h2>
                                                    <p style={{ opacity: 0.8, marginTop: '4px' }}>{activeProperty.customerAddress || 'Location details'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ opacity: 0.7, fontSize: '13px' }}>Current Market Value</p>
                                                    <p style={{ fontSize: '28px', fontWeight: 800, color: '#ffd700' }}>
                                                        {activeProperty.parsedDetails?.marketValue
                                                            ? `₹${Number(activeProperty.parsedDetails.marketValue).toLocaleString('en-IN')}`
                                                            : 'Pending Review'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '24px' }}>
                                                {[
                                                    ['Property Size', (activeProperty.parsedDetails?.propertySize || activeProperty.parsedDetails?.size) ? `${activeProperty.parsedDetails.propertySize || activeProperty.parsedDetails.size} sq ft` : 'N/A'],
                                                    ['Property Age', (() => {
                                                        const d = activeProperty.parsedDetails
                                                        if (d?.propertyAge || d?.age) return `${d.propertyAge || d.age} years`
                                                        if (d?.yearBuilt) return `${new Date().getFullYear() - Number(d.yearBuilt)} years`
                                                        return 'N/A'
                                                    })()],
                                                    ['Location Rating', activeProperty.parsedDetails?.locationRating || calculateLocationRating(activeProperty.parsedDetails)]
                                                ].map(([k, v]) => (
                                                    <div key={k} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px' }}>
                                                        <p style={{ opacity: 0.7, fontSize: '12px' }}>{k}</p>
                                                        <p style={{ fontWeight: 700, fontSize: '18px', marginTop: '4px' }}>{v}</p>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>

                                        <div className="animate-slideUp stagger-2" style={{ marginBottom: '32px' }}>
                                            <ProjectTimeline status={activeProperty.responded ? 'quote-sent' : 'under-review'} />
                                        </div>


                                        {/* Metric Cards */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                                            {[
                                                { label: 'Potential Value Increase', value: `+₹${(displayValueIncrease / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'With all recommendations' : 'Initial AI Projection', color: '#3b82f6', icon: <Icons.Dashboard /> },
                                                { label: 'Total Investment', value: `₹${(displayInvestment / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'Estimated renovation cost' : 'Initial AI Estimate', color: '#f59e0b', icon: <Icons.Estimator /> },
                                                { label: 'Active Recommendations', value: displayRecsCount, sub: activeRecsCount > 0 ? 'Personalized for you' : 'Projected for your property', color: '#10b981', icon: <Icons.Sparkles /> },
                                            ].map((m, i) => (
                                                <div key={i} className={`card animate-slideUp stagger-${i + 2}`} style={{ margin: 0, padding: '24px', border: '1px solid #f0f0f0', borderRadius: '20px' }}>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                                                        <div style={{ width: '40px', height: '40px', background: `${m.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: m.color }}>{m.icon}</div>
                                                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#666' }}>{m.label}</span>
                                                    </div>
                                                    <p style={{ fontSize: '28px', fontWeight: 800, color: m.color, letterSpacing: '-0.5px' }}>{m.value}</p>
                                                    <p style={{ fontSize: '13px', color: '#999', marginTop: '6px' }}>{m.sub}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Chart + Quick Actions */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }}>
                                            <div className="card animate-slideUp stagger-5" style={{ margin: 0, padding: '32px' }}>
                                                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    Projected Value Growth
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', background: '#f8f9fa', padding: '4px 12px', borderRadius: '12px' }}>Based on Improvements</span>
                                                </h3>
                                                <div style={{ height: '300px' }}>
                                                    <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                <div className="card" style={{ margin: 0, padding: '32px' }}>
                                                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Quick Actions</h3>
                                                    {[
                                                        { icon: <Icons.New />, title: 'New Estimate', sub: 'Calculate interior costs', action: () => setView('new-estimator'), primary: true },
                                                        { icon: <Icons.Estimator />, title: 'View Estimates', sub: 'See saved estimates', action: () => setView('estimator') },
                                                        { icon: <Icons.Calculator />, title: 'EMI Calculator', sub: 'Plan your renovation loan', action: () => setView('emi') },
                                                        { icon: <Icons.Gift />, title: 'Refer & Earn', sub: 'Invite friends, earn rewards', action: () => setView('referral') },
                                                    ].map((a, i) => (

                                                        <div key={i} onClick={a.action} className={`button-press ${a.primary ? 'animate-pulseGlow' : ''}`} style={{
                                                            display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: '16px', cursor: 'pointer',
                                                            background: a.primary ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : '#ffffff',
                                                            color: a.primary ? 'white' : 'var(--text)', marginBottom: '12px', transition: 'all 0.2s',
                                                            border: a.primary ? 'none' : '1px solid #f0f0f0',
                                                            boxShadow: a.primary ? '0 10px 20px rgba(230,126,34,0.3)' : '0 2px 8px rgba(0,0,0,0.02)'
                                                        }} onMouseEnter={e => { if (!a.primary) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#fff8f4' }; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { if (!a.primary) { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.background = '#ffffff' }; e.currentTarget.style.transform = 'translateY(0)' }}>
                                                            <div style={{ width: '48px', height: '48px', background: a.primary ? 'rgba(255,255,255,0.2)' : '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{a.icon}</div>
                                                            <div><p style={{ fontWeight: 800, fontSize: '15px' }}>{a.title}</p><p style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500 }}>{a.sub}</p></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Recommendations */}
                                        <div className="card" style={{ margin: 0, padding: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                <div>
                                                    <h3 className="card-title" style={{ margin: 0 }}>Top Recommendations</h3>
                                                    <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
                                                        ✨ AI-Optimized for {activeProperty?.customerAddress?.split(',').pop().trim() || 'your property'}
                                                    </p>
                                                </div>
                                                {dynamicRecs.length > 0 && <button onClick={() => setShowAllRecs(!showAllRecs)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>{showAllRecs ? 'Show Less' : 'View All'}</button>}
                                            </div>

                                            {dynamicRecs.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {(showAllRecs ? dynamicRecs : dynamicRecs.slice(0, 2)).map((rec, i) => (
                                                        <div key={i} style={{ border: '2px solid #f0f0f0', borderRadius: '12px', padding: '20px', transition: 'all 0.3s' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                                                <div><h4 style={{ fontSize: '17px', fontWeight: 700 }}>{rec.title}</h4><p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{rec.desc}</p></div>
                                                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: rec.priority === 'high' ? '#fee2e2' : '#fef3c7', color: rec.priority === 'high' ? '#dc2626' : '#b45309' }}>
                                                                    {rec.priority === 'high' ? 'High' : 'Medium'} Priority
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
                                                                {[
                                                                    ['Est. Cost', rec.cost, 'var(--text)'],
                                                                    ['Value Increase', rec.value, '#10b981'],
                                                                    ['ROI', rec.roi, '#3b82f6'],
                                                                    ['Property Impact', rec.impact, '#8b5cf6']
                                                                ].map(([k, v, c]) => (
                                                                    <div key={k} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                                                        <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{k}</p>
                                                                        <p style={{ fontSize: '16px', fontWeight: 800, color: c }}>{v}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                                <button onClick={() => navigate(rec.link)} className="button-press" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(230,126,34,0.2)' }}>Get Detailed Plan</button>
                                                                <button onClick={() => saveIdea(rec)} className="button-press" style={{ flex: 1, padding: '10px', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save for Later</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                                                    <div style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><Icons.Calculator /></div>
                                                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>Expert Analysis in Progress</h4>
                                                    <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '300px', margin: '8px auto 0', lineHeight: 1.5 }}>
                                                        Our experts are reviewing your property details. Personalized recommendations will appear here shortly.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="card animate-fadeIn" style={{ margin: 0, padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #ffffff, #f8fafc)', border: '2px dashed #e2e8f0', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                                        <div style={{ color: 'var(--primary)', marginBottom: '32px', transform: 'scale(3)', display: 'inline-block' }}><Icons.Home /></div>
                                        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>Maximize Your Property Potential</h2>
                                        <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                                            Unlock personalized renovation recommendations, market value projections, and expert insights. Submit your property details to get started.
                                        </p>
                                        <button onClick={() => setView('submit')} className="button-press" style={{ padding: '18px 48px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(230,126,34,0.3)', transition: '0.3s' }}>
                                            Submit Property Details
                                        </button>
                                        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                                            {[
                                                { icon: '📈', text: 'Value Tracking' },
                                                { icon: '🎨', text: 'Expert Design' },
                                                { icon: '💰', text: 'ROI Analysis' }
                                            ].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>
                                                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                                    {item.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {/* ---- ESTIMATOR VIEW ---- */}
                    {view === 'estimator' && (
                        <div className="animate-fadeIn">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div><h2 style={{ fontSize: '24px', fontWeight: 800 }}>My Estimates</h2><p style={{ color: 'var(--muted)' }}>View and manage your interior cost estimates</p></div>
                                <button onClick={() => setView('new-estimator')} className="btn-submit button-press animate-pulseGlow" style={{ width: 'auto', padding: '12px 24px' }}>+ New Estimate</button>
                            </div>
                            {estimates.length === 0 ? (
                                <div className="card hover-lift" style={{ textAlign: 'center', padding: '60px 40px' }}>
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Estimates Yet</h3>
                                    <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Start creating your first interior cost estimate</p>
                                    <button onClick={() => setView('new-estimator')} className="btn-submit button-press" style={{ width: 'auto', padding: '12px 32px' }}>Get Started</button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '20px' }}>
                                    {estimates.map((est, i) => (
                                        <div key={i} className={`card animate-slideUp stagger-${(i % 5) + 1} hover-lift`} style={{ margin: 0, position: 'relative' }}>
                                            <button
                                                onClick={() => setDeleteConfirm(est)}
                                                title="Delete estimate"
                                                style={{ position: 'absolute', top: '16px', right: '16px', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#dc2626', transition: '0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                                            >
                                                <Icons.Trash />
                                            </button>
                                            <h4 style={{ fontWeight: 700, paddingRight: '40px' }}>{est.type}</h4>
                                            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{est.date}</p>
                                            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', margin: '12px 0' }}>₹{est.cost?.toLocaleString('en-IN')}</p>
                                            <span style={{ fontSize: '12px', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>{est.package}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ---- DELETE CONFIRM MODAL ---- */}
                    {deleteConfirm && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                            <div className="card animate-fadeIn" style={{ margin: 0, padding: '40px 36px', maxWidth: '420px', width: '100%', borderRadius: '24px', textAlign: 'center', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
                                <div style={{ width: '72px', height: '72px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#dc2626' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: '#1a1a1a' }}>Delete Estimate?</h3>
                                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '8px', lineHeight: 1.5 }}>You are about to permanently delete:</p>
                                <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary)', background: '#fff7ed', padding: '10px 20px', borderRadius: '10px', marginBottom: '28px' }}>{deleteConfirm.type}</p>
                                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '28px' }}>This action cannot be undone.</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="button-press"
                                        style={{ flex: 1, padding: '14px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: '#475569', transition: '0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >Cancel</button>
                                    <button
                                        onClick={async () => {
                                            setIsDeleting(true)
                                            // Optimistic update — remove immediately
                                            setEstimates(prev => prev.filter(e => e.id !== deleteConfirm.id))
                                            setDeleteConfirm(null)
                                            try {
                                                await deleteEstimation(deleteConfirm.id, userEmail)
                                                toast.success('Estimate deleted successfully')
                                            } catch (err) {
                                                // Rollback not easy here, just show error
                                                toast.error('Failed to delete — please refresh')
                                            } finally {
                                                setIsDeleting(false)
                                            }
                                        }}
                                        className="button-press"
                                        style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: 'white', boxShadow: '0 8px 20px rgba(220,38,38,0.3)', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >{isDeleting ? <Spinner color="white" size={16} /> : null} Yes, Delete</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ---- NEW ESTIMATOR ---- */}
                    {view === 'new-estimator' && (
                        <div className="animate-fadeIn">
                            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Interior Price Estimator</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Get instant, accurate cost estimates for your dream interior.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '24px' }}>
                                {[
                                    { icon: '🏠', title: 'Full Home', badge: 'Most Popular', sub: 'Complete interior for all rooms', features: ['All Rooms', 'Detailed Breakdown', 'Best Value'], link: '/full-home-estimator' },
                                    { icon: '🍳', title: 'Kitchen', badge: 'Kitchen Special', sub: 'Transform your cooking space', features: ['Modular Options', 'Appliance Cost', 'Quick Setup'], link: '/kitchen-estimator' },
                                    { icon: '🚪', title: 'Wardrobe', badge: 'Customizable', sub: 'Custom wardrobe solutions', features: ['Custom Sizes', 'Material Choice', 'Smart Storage'], link: '/wardrobe-estimator' },
                                ].map((c, i) => (
                                    <div key={i} className={`card animate-slideUp stagger-${(i % 5) + 1}`} style={{ margin: 0, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: i === 0 ? 'var(--primary)' : i === 1 ? '#3b82f6' : '#8b5cf6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{c.badge}</span>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{c.icon}</div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{c.title}</h3>
                                        <p style={{ color: 'var(--muted)', marginBottom: '18px' }}>{c.sub}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                                            {c.features.map(f => <span key={f} style={{ fontSize: '13px', color: 'var(--muted)' }}>✓ {f}</span>)}
                                        </div>
                                        <button onClick={() => navigate(c.link)} className="btn-submit button-press">Calculate Now →</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ---- RECOMMENDATIONS (Admin Responses) ---- */}
                    {view === 'recommendations' && (() => {
                        const myRequests = estimates.filter(r => r.responded)
                        return (
                            <div className="animate-fadeIn">
                                <div style={{ marginBottom: '28px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Admin Recommendations</h2>
                                    <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Quotes and advice sent by our experts for your requests</p>
                                </div>

                                {myRequests.length === 0 ? (
                                    <div className="card hover-lift" style={{ textAlign: 'center', padding: '70px 40px' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📬</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Recommendations Yet</h3>
                                        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Our experts will review your submitted estimates and send personalised quotes here.</p>
                                        <button onClick={() => setView('new-estimator')} className="btn-submit button-press" style={{ width: 'auto', padding: '12px 28px' }}>Submit an Estimate →</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {myRequests.map((req, i) => {
                                            const isResponded = req.responded
                                            // The backend Estimation object now contains response fields directly
                                            const res = {
                                                quote: req.adminQuote,
                                                description: req.adminDescription,
                                                timeline: req.adminTimeline,
                                                warranty: req.adminWarranty,
                                                notes: req.adminNotes,
                                                responseDate: req.date // Or use createdAt
                                            }
                                            return (
                                                <div key={req.id} className={`card animate-slideUp stagger-${(i % 5) + 1}`} style={{ margin: 0, borderLeft: '4px solid ' + (isResponded ? '#10b981' : '#f59e0b'), borderRadius: '16px', padding: '28px' }}>
                                                    {/* Header */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                            <div style={{ width: '48px', height: '48px', background: isResponded ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                                                {req.type?.includes('Kitchen') ? '🍳' : req.type?.includes('Wardrobe') ? '👔' : '🏠'}
                                                            </div>
                                                            <div>
                                                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>{req.type}</h3>
                                                                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Request {req.id} · {isResponded ? `Quote received on ${res.responseDate}` : 'Processing by our experts'}</p>
                                                            </div>
                                                        </div>
                                                        <span style={{
                                                            background: isResponded ? '#dcfce7' : '#fef3c7',
                                                            color: isResponded ? '#16a34a' : '#b45309',
                                                            padding: '6px 16px', borderRadius: '20px',
                                                            fontSize: '13px', fontWeight: 700,
                                                            border: '1px solid ' + (isResponded ? '#bbf7d0' : '#fde68a')
                                                        }}>
                                                            {isResponded ? '✓ Quote Received' : '⏳ Processing'}
                                                        </span>
                                                    </div>

                                                    {/* User Submitted Photos - Preview */}
                                                    {req.propertyPhotos && req.propertyPhotos.length > 0 && (
                                                        <div style={{ marginBottom: '24px', background: '#fdf6ee', borderRadius: '12px', padding: '16px', border: '1px solid #fbd38d' }}>
                                                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', marginBottom: '12px' }}>🏗️ Your Property Photos ({req.propertyPhotos.length})</h4>
                                                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                                                                {req.propertyPhotos.map((img, idx) => (
                                                                    <div key={idx} style={{ flexShrink: 0, width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => setLightbox({ images: req.propertyPhotos, index: idx })}>
                                                                        <img src={img.data} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isResponded ? (
                                                        <>
                                                            {/* Quote Metrics */}
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px', marginBottom: '24px' }}>
                                                                {[
                                                                    { label: 'Expert Quote', value: `₹${Number(res.quote || 0).toLocaleString('en-IN')}`, color: 'var(--primary)', bg: '#fff3e0', icon: '💰' },
                                                                    { label: 'Timeline', value: res.timeline, color: '#3b82f6', bg: '#eff6ff', icon: '📅' },
                                                                    { label: 'Warranty', value: res.warranty, color: '#10b981', bg: '#ecfdf5', icon: '🛡️' },
                                                                ].map(({ label, value, color, bg, icon }) => (
                                                                    <div key={label} style={{ background: bg, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                                                                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                                                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</p>
                                                                        <p style={{ fontSize: '18px', fontWeight: 800, color }}>{value}</p>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {res.description && (
                                                                <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Expert Breakdown</h4>
                                                                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap' }}>{res.description}</p>
                                                                </div>
                                                            )}

                                                            {res.images && res.images.length > 0 && (
                                                                <div style={{ marginBottom: '20px' }}>
                                                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>🖼️ Design References ({res.images.length})</h4>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                                                                        {res.images.map((img, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                onClick={() => setLightbox({ images: res.images, index: idx })}
                                                                                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '2px solid #f0ece6', transition: '0.3s' }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,126,34,0.25)'; e.currentTarget.style.borderColor = '#e67e22' }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#f0ece6' }}
                                                                            >
                                                                                <img src={img.data} alt={img.name || 'Reference'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5))', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px' }}>
                                                                                    <span style={{ color: 'white', fontSize: '11px', fontWeight: 600, maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name || `Image ${idx + 1}`}</span>
                                                                                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>🔍</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div style={{ background: '#fffbeb', border: '1px dashed #fcd34d', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
                                                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👷</div>
                                                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>Expert Analysis in Progress</h4>
                                                            <p style={{ color: '#b45309', fontSize: '14px', maxWidth: '400px', margin: '8px auto 0', lineHeight: 1.6 }}>
                                                                Our experts are currently reviewing your request details and creating your personalized quote.
                                                                You can click the button below to directly chat with the expert.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Action */}
                                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                        <button
                                                            onClick={() => setChatReq({ id: req.id, type: req.type })}
                                                            className="button-press"
                                                            style={{
                                                                flex: 1, minWidth: '180px', padding: '13px 20px',
                                                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                                                border: 'none', borderRadius: '10px', color: 'white',
                                                                fontWeight: 800, fontSize: '15px', cursor: 'pointer',
                                                                boxShadow: '0 6px 16px rgba(230,126,34,0.35)',
                                                                transition: '0.3s', display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', gap: '8px'
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                                            💬 Chat &amp; Negotiate
                                                        </button>
                                                        {isResponded && (
                                                            <>
                                                                <button
                                                                    onClick={() => { navigator.clipboard?.writeText(`Quote: ₹${Number(res.quote || 0).toLocaleString('en-IN')} | Timeline: ${res.timeline} | Warranty: ${res.warranty}`); alert('Quote details copied!') }}
                                                                    className="button-press"
                                                                    style={{
                                                                        flex: 1, minWidth: '140px', padding: '13px 20px',
                                                                        background: 'white', border: '2px solid #e9ecef',
                                                                        borderRadius: '10px', cursor: 'pointer', fontWeight: 700,
                                                                        color: '#555', transition: '0.3s', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                                    }}
                                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.color = '#555' }}>
                                                                    📋 Copy Quote
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const printWindow = window.open('', '_blank');
                                                                        const content = `
                                                                        <html>
                                                                            <head>
                                                                                <title>BharatHome Value - Quote ${req.id}</title>
                                                                                <style>
                                                                                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
                                                                                    .header { border-bottom: 3px solid #e67e22; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                                                                                    .logo { font-size: 24px; font-weight: 800; color: #1a1a1a; }
                                                                                    .logo span { color: #e67e22; }
                                                                                    .quote-info { margin-bottom: 30px; }
                                                                                    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                                                                                    .box { background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center; }
                                                                                    .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
                                                                                    .value { font-size: 18px; font-weight: 800; color: #e67e22; }
                                                                                    .description { line-height: 1.8; color: #333; background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 12px; }
                                                                                    .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                                                                                </style>
                                                                            </head>
                                                                            <body>
                                                                                <div class="header">
                                                                                    <div class="logo">BharatHome<span>Value</span></div>
                                                                                    <div style="text-align: right">
                                                                                        <p style="margin:0; font-weight:700">Official Project Quote</p>
                                                                                        <p style="margin:0; font-size:12px; color:#666">Date: ${new Date().toLocaleDateString()}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="quote-info">
                                                                                    <h2>${req.type}</h2>
                                                                                    <p><strong>Quote ID:</strong> ${req.id}</p>
                                                                                    <p><strong>Customer:</strong> ${req.customerName}</p>
                                                                                    <p><strong>Property:</strong> ${req.customerAddress}</p>
                                                                                </div>
                                                                                <div class="grid">
                                                                                    <div class="box"><div class="label">Expert Quote</div><div class="value">₹${Number(res.quote || 0).toLocaleString('en-IN')}</div></div>
                                                                                    <div class="box"><div class="label">Timeline</div><div class="value">${res.timeline}</div></div>
                                                                                    <div class="box"><div class="label">Warranty</div><div class="value">${res.warranty}</div></div>
                                                                                </div>
                                                                                <div class="description">
                                                                                    <h3 style="margin-top:0">Project Description & Scope</h3>
                                                                                    <p>${res.description.replace(/\n/g, '<br>')}</p>
                                                                                </div>
                                                                                <div class="footer">
                                                                                    <p>This is a computer-generated quote based on your requirements and expert analysis.</p>
                                                                                    <p>BharatHome Value - Professional Interior Solutions</p>
                                                                                </div>
                                                                                <script>window.print();</script>
                                                                            </body>
                                                                        </html>
                                                                    `;
                                                                        printWindow.document.write(content);
                                                                        printWindow.document.close();
                                                                    }}
                                                                    className="button-press"
                                                                    style={{
                                                                        flex: 1, minWidth: '140px', padding: '13px 20px',
                                                                        background: 'white', border: '2px solid #e9ecef',
                                                                        borderRadius: '10px', cursor: 'pointer', fontWeight: 700,
                                                                        color: '#555', transition: '0.3s', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                                    }}
                                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.color = '#555' }}>
                                                                    📥 Download PDF
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })()}

                    {/* ---- SAVED IDEAS ---- */}
                    {view === 'saved' && (
                        <div className="animate-fadeIn">
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Your Saved Ideas</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{savedIdeas.length} saved ideas</p>
                            {savedIdeas.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔖</div>
                                    <h3 style={{ fontWeight: 700 }}>No Saved Ideas Yet</h3>
                                    <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Click "Save for Later" on any recommendation</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {savedIdeas.map((idea, i) => (
                                        <div key={i} className={`card animate-slideUp stagger-${(i % 5) + 1} hover-lift`} style={{ margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                            <div>
                                                <h4 style={{ fontWeight: 700, fontSize: '17px' }}>{idea.title}</h4>
                                                <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{idea.desc}</p>
                                                <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '14px' }}>
                                                    <span>Cost: <strong>{idea.cost}</strong></span>
                                                    <span>ROI: <strong style={{ color: '#10b981' }}>{idea.roi}</strong></span>
                                                    <span>Impact: <strong style={{ color: '#3b82f6' }}>{idea.impact}</strong></span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeIdea(idea.title)} className="button-press" style={{ padding: '8px 16px', border: '2px solid #fee2e2', borderRadius: '8px', background: '#fff', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {/* ---- REFERRAL SYSTEM ---- */}
                    {view === 'referral' && (
                        <div className="animate-fadeIn" style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', padding: '48px', textAlign: 'center', marginBottom: '32px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎁</div>
                                <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Refer a Friend, Get ₹2,000</h2>
                                <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '600px', margin: '0 auto 32px' }}>
                                    Help your friends transform their homes. When they complete their first project with us, you both get ₹2,000 in your BharatHome wallet.
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '2px' }}>BHV-{userData.name?.split(' ')[0].toUpperCase()}77</span>
                                    <button onClick={() => { navigator.clipboard.writeText(`BHV-${userData.name?.split(' ')[0].toUpperCase()}77`); alert('Referral code copied!') }} style={{ background: 'white', color: '#1e293b', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Copy Code</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                {[
                                    { label: 'Total Referrals', value: '0', icon: '👥' },
                                    { label: 'Pending Rewards', value: '₹0', icon: '⏳' },
                                    { label: 'Total Earned', value: '₹0', icon: '💰' }
                                ].map((m, i) => (
                                    <div key={i} className="card" style={{ textAlign: 'center', padding: '24px' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{m.icon}</div>
                                        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{m.label}</p>
                                        <p style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>{m.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* ---- SUBMIT PROPERTY ---- */}
                    {view === 'submit' && (

                        <div className="animate-fadeIn" style={{ maxWidth: '850px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Submit New Property</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Tell us about your property to get personalized recommendations</p>
                            <div className="card" style={{ margin: 0 }}>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const fd = new FormData(e.target);
                                    const data = Object.fromEntries(fd.entries());

                                    const estData = {
                                        userEmail: userEmail,
                                        type: `Property: ${data.propertyType}`,
                                        date: new Date().toLocaleDateString(),
                                        cost: parseFloat(data.improvementBudget || 0),
                                        details: JSON.stringify({
                                            firstName: data.firstName,
                                            lastName: data.lastName,
                                            phone: data.phone,
                                            address: data.address,
                                            city: data.city,
                                            propertyType: data.propertyType,
                                            propertySize: data.propertySize,
                                            yearBuilt: data.yearBuilt,
                                            marketValue: data.marketValue,
                                            description: data.description || 'New property submission for review',
                                            propertyPhotos: propertyPhotos
                                        })
                                    };

                                    setIsSubmitting(true);
                                    console.log('Submission started. Preparing data...');
                                    try {
                                        if (!userEmail) throw new Error("User session expired. Please login again.");
                                        
                                        toast.info("Uploading property details & photos...");
                                        console.log('Submitting property data:', estData);

                                        await saveEstimation(estData);
                                        toast.success('Property submitted successfully!');

                                        // Refresh estimations
                                        const updated = await fetchUserEstimations(userEmail);
                                        setEstimates(updated);
                                        setView('dashboard');
                                    } catch (err) {
                                        console.error('Error submitting property:', err);
                                        toast.error(err.message || 'Failed to submit property to server');
                                    } finally {
                                        setIsSubmitting(false)
                                    }
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="form-group"><label>First Name</label><input name="firstName" type="text" defaultValue={userData?.name?.split(' ')[0] || ''} required /></div>
                                        <div className="form-group"><label>Last Name</label><input name="lastName" type="text" defaultValue={userData?.name?.split(' ')[1] || ''} required /></div>
                                        <div className="form-group"><label>Email</label><input name="email" type="email" value={userEmail || ''} readOnly style={{ background: '#f8f9fa', cursor: 'not-allowed' }} required /></div>
                                        <div className="form-group"><label>Contact Number</label><input name="phone" type="tel" defaultValue={userData?.phone || ''} placeholder="+91 XXXXX XXXXX" required /></div>
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Address</label><input name="address" type="text" placeholder="Street address" required /></div>
                                        <div className="form-group"><label>City</label><input name="city" type="text" placeholder="e.g., Mumbai" required /></div>
                                    </div>
                                    <div className="form-group">
                                        <label>Property Type</label>
                                        <select name="propertyType" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '15px', outline: 'none' }} required>
                                            <option value="">Select type</option>
                                            {['Residential', 'Commercial', 'Apartment', 'Villa', 'Bungalow', 'Townhouse'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="form-group"><label>Property Size (Sq Ft)</label><input name="propertySize" type="number" placeholder="e.g., 1250" required /></div>
                                        <div className="form-group"><label>Year Built</label><input name="yearBuilt" type="number" placeholder="e.g., 2015" required /></div>
                                        <div className="form-group"><label>Market Value (₹)</label><input name="marketValue" type="number" placeholder="e.g., 5000000" required /></div>
                                        <div className="form-group"><label>Improvement Budget (₹)</label><input name="improvementBudget" type="number" placeholder="e.g., 500000" required /></div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '24px' }}>
                                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Property & Construction Photos</span>
                                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Max 5 (Optional)</span>
                                        </label>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: '2px dashed #e9ecef', borderRadius: '16px', padding: '32px 20px',
                                                textAlign: 'center', cursor: 'pointer', transition: '0.3s', background: '#fdf6ee',
                                                marginBottom: '16px'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'white' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.background = '#fdf6ee' }}
                                        >
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>Click to upload photos of your property</p>
                                            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Drag and drop or select files (PNG, JPG)</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                multiple
                                                accept="image/*"
                                                onChange={handlePropertyPhotoUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        {propertyPhotos.length > 0 && (
                                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 4px 12px', scrollbarWidth: 'none' }}>
                                                {propertyPhotos.map((img, i) => (
                                                    <div key={i} style={{ position: 'relative', flexShrink: 0, width: '100px', height: '75px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid white' }}>
                                                        <img src={img.data} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removePropertyPhoto(i) }}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Additional Notes</label>
                                        <textarea name="description" rows={3} placeholder="Any special requirements or details..." style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '15px', outline: 'none', resize: 'vertical' }} />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn-submit button-press" 
                                        style={{ marginTop: '24px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Spinner color="white" size={20} /> : null}
                                        {isSubmitting ? 'Submitting Property...' : 'Submit Property for Review →'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ---- CONTRACTOR DIRECTORY ---- */}
                    {view === 'contractors' && (
                        <div className="animate-fadeIn">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Verified Contractor Directory</h2>
                                    <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Hand-picked partners vetted for quality, reliability, and fair pricing.</p>
                                </div>
                                <div style={{ position: 'relative', width: '350px', minWidth: '300px' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--primary)' }}><Icons.Search /></span>
                                    <input
                                        type="text"
                                        placeholder="Search expertise, name or location..."
                                        value={contractorSearch}
                                        onChange={(e) => setContractorSearch(e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '2px solid #e9ecef', fontSize: '14px', outline: 'none', transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                                {['All', 'Interior', 'Renovation', 'Design', 'Garden'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setContractorFilter(t)}
                                        style={{
                                            padding: '10px 24px', borderRadius: '30px', border: 'none',
                                            background: contractorFilter === t ? 'var(--primary)' : 'white',
                                            color: contractorFilter === t ? 'white' : '#64748b',
                                            fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                                            boxShadow: contractorFilter === t ? '0 8px 16px rgba(230,126,34,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                                {[
                                    { id: 1, category: 'Interior', name: 'Apex Interiors', rating: 4.8, reviews: 124, expertise: ['Modular Kitchen', 'Wardrobes'], location: 'Mumbai, MH', image: '/Photos/apex_kitchen.png', verified: true, about: 'Premium interior solutions with a focus on modern modular designs and ergonomic spaces.' },
                                    { id: 2, category: 'Renovation', name: 'Royal Spaces', rating: 4.9, reviews: 89, expertise: ['Full Home', 'Luxury Design'], location: 'Bangalore, KA', image: '/Photos/royal_living.png', verified: true, about: 'Boutique design firm specializing in end-to-end luxury home transformations.' },
                                    { id: 3, category: 'Renovation', name: 'Modern Living', rating: 4.7, reviews: 210, expertise: ['Flooring', 'Painting'], location: 'Delhi, NCR', image: '/Photos/modern_bedroom.png', verified: false, about: 'Budget-friendly renovation experts with over 10 years of experience in the NCR region.' },
                                    { id: 4, category: 'Interior', name: 'Elite Woodworks', rating: 4.6, reviews: 56, expertise: ['Wardrobes', 'Furniture'], location: 'Pune, MH', image: '/Photos/elite_woodwork.png', verified: true, about: 'Custom woodworking and bespoke furniture pieces for high-end residential projects.' },
                                    { id: 5, category: 'Design', name: 'Design Studio', rating: 4.5, reviews: 42, expertise: ['False Ceiling', 'Lighting'], location: 'Hyderabad, TS', image: '/Photos/design_lighting.png', verified: true, about: 'Specialists in modern lighting solutions and designer false ceiling concepts.' },
                                    { id: 6, category: 'Garden', name: 'Green Spaces', rating: 4.4, reviews: 31, expertise: ['Terrace Garden', 'Landscaping'], location: 'Chennai, TN', image: '/Photos/green_garden.png', verified: false, about: 'Creating sustainable and beautiful outdoor spaces for urban homes.' },
                                ].filter(c =>
                                    (contractorFilter === 'All' || c.category === contractorFilter) &&
                                    (c.name.toLowerCase().includes(contractorSearch.toLowerCase()) ||
                                        c.expertise.some(e => e.toLowerCase().includes(contractorSearch.toLowerCase())) ||
                                        c.location.toLowerCase().includes(contractorSearch.toLowerCase()))
                                ).map(c => (
                                    <div key={c.id} className="card hover-lift" style={{ margin: 0, padding: 0, overflow: 'hidden', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '200px', position: 'relative' }}>
                                            <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }}></div>
                                            {c.verified && (
                                                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#10b981', color: 'white', padding: '6px 14px', borderRadius: '30px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(16,185,129,0.4)' }}>
                                                    <span style={{ fontSize: '14px' }}>✓</span> VERIFIED
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>{c.category}</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a202c' }}>{c.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff7ed', padding: '4px 8px', borderRadius: '8px' }}>
                                                    <span style={{ color: '#e67e22', fontWeight: 800 }}>★</span>
                                                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#9a3412' }}>{c.rating}</span>
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '16px' }}>📍</span> {c.location}
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                                {c.expertise.map(e => (
                                                    <span key={e} style={{ background: '#f1f5f9', color: '#475569', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{e}</span>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => setSelectedContractor(c)}
                                                    className="button-press"
                                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#f8fafc', color: '#1e293b', border: '2px solid #e2e8f0', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: '0.3s' }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                                >
                                                    View Profile
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const newReq = {
                                                            userEmail: userEmail,
                                                            type: `Consultation: ${c.name}`,
                                                            date: new Date().toLocaleDateString(),
                                                            cost: 0,
                                                            details: JSON.stringify({ category: c.category, contractorName: c.name, status: 'PENDING' })
                                                        };
                                                        try {
                                                            await saveEstimation(newReq);
                                                            const updated = await fetchUserEstimations(userEmail);
                                                            setEstimates(updated);
                                                            toast.success(`Request sent! ${c.name} will contact you soon.`);
                                                        } catch (err) {
                                                            console.error('Failed to send contractor request:', err);
                                                            toast.error('Failed to send request to server');
                                                        }
                                                    }}
                                                    className="button-press"
                                                    style={{ flex: 1.5, padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 12px rgba(230,126,34,0.3)' }}
                                                >
                                                    Book Free Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contractor Detail Modal */}
                            {selectedContractor && (
                                <div
                                    onClick={e => { if (e.target === e.currentTarget) setSelectedContractor(null) }}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
                                >
                                    <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '32px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', position: 'relative' }}>
                                        <button
                                            onClick={() => setSelectedContractor(null)}
                                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'white', border: 'none', color: '#1e293b', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        >
                                            ×
                                        </button>

                                        <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                                            <img src={selectedContractor.image} alt={selectedContractor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}></div>
                                            <div style={{ position: 'absolute', bottom: '32px', left: '40px', color: 'white' }}>
                                                <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>{selectedContractor.name}</h2>
                                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                    <span style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 700 }}>{selectedContractor.category}</span>
                                                    <span style={{ fontSize: '15px', fontWeight: 600 }}>📍 {selectedContractor.location}</span>
                                                    <span style={{ fontSize: '15px', fontWeight: 600 }}>★ {selectedContractor.rating} ({selectedContractor.reviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ padding: '40px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>About the Expert</h4>
                                                    <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#64748b', marginBottom: '32px' }}>{selectedContractor.about}</p>

                                                    <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>Core Expertise</h4>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                        {selectedContractor.expertise.map(e => (
                                                            <span key={e} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#1e293b', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>{e}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                                    <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#1e293b' }}>Book Consultation</h4>
                                                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Get a detailed site visit and customized estimate from {selectedContractor.name}.</p>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <span style={{ fontSize: '20px' }}>🎁</span>
                                                            <div>
                                                                <p style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>First Call Free</p>
                                                                <p style={{ fontSize: '11px', color: '#64748b' }}>BharatHome User Exclusive</p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={async () => {
                                                                const newReq = {
                                                                    userEmail: userEmail,
                                                                    type: `Consultation: ${selectedContractor.name}`,
                                                                    date: new Date().toLocaleDateString(),
                                                                    cost: 0,
                                                                    details: JSON.stringify({ category: selectedContractor.category, contractorName: selectedContractor.name, priority: true })
                                                                };
                                                                try {
                                                                    await saveEstimation(newReq);
                                                                    const updated = await fetchUserEstimations(userEmail);
                                                                    setEstimates(updated);
                                                                    toast.success(`Priority request sent to ${selectedContractor.name}!`);
                                                                    setSelectedContractor(null);
                                                                } catch (err) {
                                                                    console.error('Failed to send priority request:', err);
                                                                    toast.error('Failed to send request to server');
                                                                }
                                                            }}
                                                            className="button-press"
                                                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 800, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(230,126,34,0.3)' }}
                                                        >
                                                            Confirm Priority Booking
                                                        </button>
                                                        <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>Our experts usually respond within 4 business hours.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ---- EMI CALCULATOR VIEW ---- */}
                    {view === 'emi' && (
                        <EmiView />
                    )}
                </main>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <ConfirmModal
                    title="Exit Dashboard?"
                    message="Are you sure you want to go back to the home page? This will log you out of your current session."
                    onConfirm={() => { logout() }}
                    onCancel={() => setShowExitConfirm(false)}
                />
            )}

            {/* Profile Modal */}
            {showProfile && (
                <ProfileModal
                    userData={userData}
                    onClose={() => setShowProfile(false)}
                    onSave={async (newVal) => {
                        try {
                            const updatedUser = await updateProfile(newVal)
                            // Standardized 'user' key
                            localStorage.setItem('user', JSON.stringify(updatedUser))
                            // Legacy 'userData' key for compatibility if needed elsewhere
                            localStorage.setItem('userData', JSON.stringify(updatedUser))
                            setUserData(updatedUser)
                            setShowProfile(false)
                            toast.success('Profile updated successfully!')
                        } catch (err) {
                            console.error('Profile update failed:', err)
                            toast.error('Failed to update profile on server')
                        }
                    }}
                />
            )}

            {/* Chat Modal */}
            {chatReq && (
                <ChatModal
                    requestId={chatReq.id}
                    requestType={chatReq.type}
                    userName={userData?.name}
                    onClose={() => setChatReq(null)}
                />
            )}

            {/* Image Lightbox */}
            {lightbox && (
                <LightboxViewer
                    lightbox={lightbox}
                    setLightbox={setLightbox}
                />
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div onClick={() => setShowReviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
                    <div onClick={e => e.stopPropagation()} className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⭐</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>Rate Your Experience</h2>
                        <p style={{ color: '#64748b', marginTop: '12px', marginBottom: '32px' }}>How would you rate the service and quality of your recent project?</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setReviewRating(s)} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', transition: '0.2s', transform: reviewRating >= s ? 'scale(1.2)' : 'scale(1)', opacity: reviewRating >= s ? 1 : 0.3 }}>⭐</button>
                            ))}
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            placeholder="Share your thoughts on the quality of work..."
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '15px', minHeight: '120px', marginBottom: '32px', outline: 'none' }}
                        />

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => setShowReviewModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #e9ecef', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Skip</button>
                            <button onClick={() => { alert('Thank you for your feedback!'); setShowReviewModal(false) }} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Submit Review</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

