import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ---- PROFESSIONAL STYLING & ANIMATIONS ----
const theme = {
    primary: '#e67e22',
    primaryDark: '#d35400',
    slate: '#1e293b',
    slateLight: '#334155',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
}

const animations = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

.animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
.animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-slideRight { animation: slideRight 0.4s ease forwards; }
.animate-scaleIn { animation: scaleIn 0.3s ease forwards; }

.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }

.sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s all;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid transparent;
}
.sidebar-item:hover { background: rgba(255,255,255,0.05); color: white; }
.sidebar-item.active { 
    background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
    color: white;
    box-shadow: 0 4px 12px rgba(230,126,34,0.25);
}

.stats-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid ${theme.border};
    transition: 0.3s all;
}
.stats-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.04); border-color: ${theme.primary}40; }

.hover-row:hover { background-color: #f1f5f9 !important; }
.button-premium {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s all;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
}
.button-premium:active { transform: scale(0.97); }
`

// ---- COMPONENTS ----

function AdminChatModal({ req, onClose }) {
    const [msgs, setMsgs] = useState(() => JSON.parse(localStorage.getItem(`chat_${req.id}`) || '[]'))
    const [text, setText] = useState('')
    const bottomRef = useRef(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

    const send = () => {
        if (!text.trim()) return
        const newMsg = { sender: 'admin', name: 'Admin', message: text.trim(), time: new Date().toISOString() }
        const updated = [...msgs, newMsg]
        setMsgs(updated)
        localStorage.setItem(`chat_${req.id}`, JSON.stringify(updated))
        setText('')
    }

    const fmt = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    return (
        <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', height: '650px', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <div style={{ background: theme.slate, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: theme.primary }}>{req.customerName[0]}</div>
                        <div>
                            <p style={{ color: 'white', fontWeight: 800, fontSize: '16px' }}>{req.customerName}</p>
                            <p style={{ color: '#94a3b8', fontSize: '12px' }}>{req.type} • {req.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
                    {msgs.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '80%' }}>
                                <div style={{
                                    padding: '14px 20px',
                                    borderRadius: m.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: m.sender === 'admin' ? theme.primary : 'white',
                                    color: m.sender === 'admin' ? 'white' : theme.text,
                                    fontSize: '14px', lineHeight: 1.6,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    border: m.sender === 'admin' ? 'none' : `1px solid ${theme.border}`
                                }}>{m.message}</div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', textAlign: m.sender === 'admin' ? 'right' : 'left' }}>{fmt(m.time)}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div style={{ padding: '24px', background: 'white', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '12px' }}>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a professional response..."
                        style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: `2px solid ${theme.border}`, fontSize: '14px', outline: 'none', transition: '0.2s' }}
                        onFocus={e => e.target.style.borderColor = theme.primary}
                        onBlur={e => e.target.style.borderColor = theme.border}
                    />
                    <button onClick={send} style={{ padding: '0 24px', borderRadius: '12px', background: theme.primary, color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Send</button>
                </div>
            </div>
        </div>
    )
}

// ---- MOCK DATA ----
const MOCK_REQUESTS = [
    { id: 'EST-001', customerName: 'Rajesh Kumar', customerEmail: 'rajesh@example.com', customerPhone: '+91 98765 43210', customerAddress: 'Flat 402, Sunshine Apts, Bangalore', type: 'Kitchen Estimator', status: 'pending', dateSubmitted: '2026-02-14', description: 'Kitchen renovation with modern cabinets', budget: '₹1,50,000', responded: false },
    { id: 'EST-002', customerName: 'Priya Singh', customerEmail: 'priya@example.com', customerPhone: '+91 88822 33445', customerAddress: '7th Cross, HSR Layout, Bangalore', type: 'Full Home Estimator', status: 'pending', dateSubmitted: '2026-02-15', description: 'Complete home interior design', budget: '₹15,00,000', responded: false },
    { id: 'EST-003', customerName: 'Amit Patel', customerEmail: 'amit@example.com', customerPhone: '+91 77766 55443', customerAddress: 'Prestige Falcon City, Kanakapura Road', type: 'Wardrobe Estimator', status: 'responded', dateSubmitted: '2026-02-10', description: 'Custom wardrobe design', budget: '₹2,85,000', responded: true },
    { id: 'EST-004', customerName: 'Sneha Reddy', customerEmail: 'sneha@example.com', customerPhone: '+91 99900 11223', customerAddress: 'Electronics City, Phase 1', type: 'Kitchen Estimator', status: 'responded', dateSubmitted: '2026-02-18', description: 'L-shaped kitchen remodel', budget: '₹3,20,000', responded: true },
]

// ---- MAIN COMPONENT ----

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [view, setView] = useState('overview') // overview, requests, customers, settings
    const [requests, setRequests] = useState([])
    const [search, setSearch] = useState('')
    const [selectedReq, setSelectedReq] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [chatReq, setChatReq] = useState(null)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@bharathomevalue.com'

    useEffect(() => {
        const style = document.createElement('style')
        style.innerText = animations
        document.head.appendChild(style)
        return () => { if (document.head.contains(style)) document.head.removeChild(style) }
    }, [])

    useEffect(() => {
        if (!localStorage.getItem('adminLoggedIn')) { navigate('/admin-login'); return }
        const stored = localStorage.getItem('allAdminRequests')
        setRequests(stored ? JSON.parse(stored) : MOCK_REQUESTS)
    }, [])

    const filtered = requests.filter(r =>
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase())
    )

    const revenue = requests.reduce((acc, r) => acc + parseInt(r.budget.replace(/[^0-9]/g, '') || 0), 0)
    const pending = requests.filter(r => !r.responded).length
    const conversion = ((requests.filter(r => r.responded).length / requests.length) * 100).toFixed(1)

    // Derive Customers
    const customerMap = {}
    requests.forEach(r => {
        if (!customerMap[r.customerEmail]) {
            customerMap[r.customerEmail] = {
                name: r.customerName, email: r.customerEmail, phone: r.customerPhone,
                address: r.customerAddress, count: 0, totalValue: 0, requests: []
            }
        }
        customerMap[r.customerEmail].count++
        customerMap[r.customerEmail].totalValue += parseInt(r.budget.replace(/[^0-9]/g, '') || 0)
        customerMap[r.customerEmail].requests.push(r)
    })
    const customers = Object.values(customerMap)

    const logout = () => {
        localStorage.removeItem('adminLoggedIn')
        navigate('/admin-login')
    }

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', color: theme.text, fontFamily: "'Inter', sans-serif" }}>

            {/* ---- SIDEBAR ---- */}
            <aside style={{
                width: '280px', background: theme.slate, borderRight: `1px solid ${theme.border}`,
                display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
            }}>
                <div style={{ padding: '32px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                        BharatHome<span style={{ color: theme.primary }}>Admin</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 700 }}>Management Console</p>
                </div>

                <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={`sidebar-item ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
                        <span style={{ fontSize: '18px' }}>📊</span> Dashboard Overview
                    </div>
                    <div className={`sidebar-item ${view === 'requests' ? 'active' : ''}`} onClick={() => setView('requests')}>
                        <span style={{ fontSize: '18px' }}>📋</span> Incoming Requests
                    </div>
                    <div className={`sidebar-item ${view === 'customers' ? 'active' : ''}`} onClick={() => setView('customers')}>
                        <span style={{ fontSize: '18px' }}>👤</span> Customer Profiles
                    </div>

                    <div style={{ marginTop: '24px', padding: '0 16px' }}>
                        <p style={{ fontSize: '11px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Performance Hub</p>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>System Status</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                                <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Active & Stable</span>
                            </div>
                        </div>
                    </div>
                </div>

            </aside>

            {/* ---- MAIN AREA ---- */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '40px 60px', maxWidth: '1400px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: theme.slate }}>
                            {view === 'overview' ? 'Network Overview' : view === 'requests' ? 'Service Requests' : 'Client Relations'}
                        </h1>
                        <p style={{ color: theme.textMuted, marginTop: '4px' }}>Welcome back. Here is what is happening today.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Universal search..."
                                style={{ padding: '12px 18px 12px 42px', borderRadius: '12px', border: `1px solid ${theme.border}`, width: '240px', outline: 'none', background: 'white', fontSize: '14px', transition: '0.2s' }}
                                onFocus={e => e.target.style.borderColor = theme.primary}
                                onBlur={e => e.target.style.borderColor = theme.border}
                            />
                        </div>

                        <div style={{ height: '40px', width: '1px', background: theme.border }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '6px 6px 6px 16px', borderRadius: '14px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer' }} onClick={() => setShowProfileModal(true)}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: theme.slate, fontSize: '13px', fontWeight: 800, lineHeight: 1 }}>{adminEmail.split('@')[0]}</p>
                                <p style={{ color: theme.primary, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>System Admin</p>
                            </div>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: `linear-gradient(135deg, ${theme.slate}, ${theme.slateLight})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 800, fontSize: '16px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}>
                                {adminEmail[0].toUpperCase()}
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowLogoutConfirm(true) }}
                                className="button-premium"
                                style={{
                                    background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0',
                                    padding: '10px 14px', fontSize: '12px', borderRadius: '10px',
                                    transition: '0.2s all'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <span style={{ marginRight: '6px' }}>🚪</span> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* ---- OVERVIEW VIEW ---- */}
                {view === 'overview' && (
                    <div className="animate-fadeIn">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            {[
                                { label: 'Total Ecosystem Revenue', val: `₹${(revenue / 100000).toFixed(1)}L`, icon: '💰', color: '#6366f1', bg: '#eef2ff' },
                                { label: 'Active Service Requests', val: requests.length, icon: '⚡', color: theme.primary, bg: '#fff7ed' },
                                { label: 'Efficiency Rate', val: `${conversion}%`, icon: '📈', color: '#22c55e', bg: '#f0fdf4' },
                                { label: 'Pending Approvals', val: pending, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
                            ].map((s, i) => (
                                <div key={i} className={`stats-card animate-slideUp stagger-${i + 1}`}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>{s.icon}</div>
                                    <p style={{ color: theme.textMuted, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                                    <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: theme.slate }}>{s.val}</h3>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
                            {/* Recent Activity */}
                            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: `1px solid ${theme.border}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Recent Network Activity</h3>
                                    <button onClick={() => setView('requests')} style={{ background: 'none', border: 'none', color: theme.primary, fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>View All →</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {requests.slice(0, 5).reverse().map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: `1px solid ${theme.border}` }}>
                                                {r.type.includes('Kitchen') ? '🍳' : r.type.includes('Home') ? '🏠' : '👔'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p style={{ fontWeight: 800, fontSize: '15px' }}>{r.customerName} requested {r.type}</p>
                                                    <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>{r.dateSubmitted}</span>
                                                </div>
                                                <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>Budget Estimate: <span style={{ color: theme.text, fontWeight: 700 }}>{r.budget}</span></p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: r.responded ? '#dcfce7' : '#fee2e2', color: r.responded ? '#15803d' : '#ef4444' }}>
                                                    {r.responded ? 'COMPLETED' : 'URGENT'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Services */}
                            <div style={{ background: theme.slate, borderRadius: '24px', padding: '32px', color: 'white' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Service Distribution</h3>
                                {['Kitchen Estimator', 'Full Home Estimator', 'Wardrobe Estimator'].map(t => {
                                    const count = requests.filter(r => r.type === t).length
                                    const pct = ((count / requests.length) * 100).toFixed(0)
                                    return (
                                        <div key={t} style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>
                                                <span>{t}</span>
                                                <span>{pct}% ({count})</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: theme.primary, borderRadius: '4px', transition: '1s all' }}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>Our data reveals that <strong>Kitchen Renovations</strong> currently drive 40% of the platform engagement.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---- REQUESTS TABLE VIEW ---- */}
                {view === 'requests' && (
                    <div className="animate-fadeIn">
                        <div style={{ background: 'white', borderRadius: '24px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                                        {['Reference ID', 'Customer Info', 'Project Type', 'Submission', 'Project Budget', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '24px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r, i) => (
                                        <tr key={r.id} className="hover-row" style={{ borderBottom: `1px solid ${theme.border}`, transition: '0.2s' }}>
                                            <td style={{ padding: '24px 20px', fontWeight: 800, color: theme.primary }}>{r.id}</td>
                                            <td style={{ padding: '24px 20px' }}>
                                                <p style={{ fontWeight: 800, fontSize: '14px' }}>{r.customerName}</p>
                                                <p style={{ fontSize: '12px', color: theme.textMuted }}>{r.customerEmail}</p>
                                            </td>
                                            <td style={{ padding: '24px 20px', fontSize: '14px', fontWeight: 600 }}>{r.type}</td>
                                            <td style={{ padding: '24px 20px', fontSize: '13px', color: theme.textMuted }}>{r.dateSubmitted}</td>
                                            <td style={{ padding: '24px 20px', fontWeight: 800 }}>{r.budget}</td>
                                            <td style={{ padding: '24px 20px' }}>
                                                <span style={{
                                                    padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                                                    background: r.responded ? '#f0fdf4' : '#fff7ed',
                                                    color: r.responded ? '#15803d' : '#c2410c',
                                                    border: `1px solid ${r.responded ? '#bbf7d0' : '#ffedd5'}`
                                                }}>
                                                    {r.responded ? '● Responded' : '● Processing'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '24px 20px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => setChatReq(r)} className="button-premium" style={{ background: theme.bg, color: theme.slate, border: `1px solid ${theme.border}` }}>💬 Negotiate</button>
                                                    <button onClick={() => { localStorage.setItem('currentRequestId', r.id); navigate('/admin-respond') }} className="button-premium" style={{ background: theme.slate, color: 'white' }}>{r.responded ? 'Edit' : 'Respond'}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ---- CUSTOMERS VIEW ---- */}
                {view === 'customers' && (
                    <div className="animate-fadeIn">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                            {customers.map((c, i) => (
                                <div key={i} className="stats-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: theme.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 800 }}>
                                        {c.name[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ fontWeight: 800, fontSize: '17px' }}>{c.name}</h4>
                                            <span style={{ fontSize: '11px', fontWeight: 800, color: theme.primary, background: '#fff7ed', padding: '4px 10px', borderRadius: '12px' }}>PRO USER</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '2px' }}>{c.email}</p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                                            <div><p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Inquiries</p><p style={{ fontWeight: 800 }}>{c.count} Records</p></div>
                                            <div><p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Invested</p><p style={{ fontWeight: 800, color: '#16a34a' }}>₹{(c.totalValue / 100000).toFixed(1)}L</p></div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedCustomer(c)}
                                            style={{ marginTop: '16px', width: '100%', padding: '10px', borderRadius: '10px', background: theme.slate, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                                            View Enterprise Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div onClick={e => { if (e.target === e.currentTarget) setSelectedCustomer(null) }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '32px', maxWidth: '750px', width: '100%', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                        <div style={{ background: theme.slate, padding: '40px', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>{selectedCustomer.name[0]}</div>
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{selectedCustomer.name}</h2>
                                        <p style={{ color: '#94a3b8', fontWeight: 500 }}>Global Account • UID-99238</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCustomer(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '24px' }}>×</button>
                            </div>
                        </div>
                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                                {[
                                    { k: 'Email Platform', v: selectedCustomer.email },
                                    { k: 'Encrypted Phone', v: selectedCustomer.phone },
                                    { k: 'Registered Address', v: selectedCustomer.address }
                                ].map(i => (
                                    <div key={i.k}>
                                        <p style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{i.k}</p>
                                        <p style={{ fontWeight: 700, fontSize: '14px' }}>{i.v}</p>
                                    </div>
                                ))}
                            </div>
                            <h4 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: theme.slate, marginBottom: '20px', borderBottom: `2px solid ${theme.border}`, paddingBottom: '10px' }}>Engagement History</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                                {selectedCustomer.requests.map(req => (
                                    <div key={req.id} style={{ padding: '20px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontWeight: 800 }}>{req.type}</p>
                                            <p style={{ fontSize: '12px', color: theme.textMuted }}>{req.id} • Submitted on {req.dateSubmitted}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 800, color: theme.primary }}>{req.budget}</p>
                                            <p style={{ fontSize: '11px', color: req.responded ? '#15803d' : '#f97316', fontWeight: 800 }}>{req.responded ? 'PROCESSED' : 'PENDING ACTION'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {chatReq && <AdminChatModal req={chatReq} onClose={() => setChatReq(null)} />}

            {/* Account Profile Modal */}
            {showProfileModal && (
                <div onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false) }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', maxWidth: '480px', width: '100%', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                        <div style={{ background: `linear-gradient(135deg, ${theme.slate}, ${theme.slateLight})`, padding: '40px', textAlign: 'center', color: 'white' }}>
                            <div style={{ width: '80px', height: '80px', background: theme.primary, borderRadius: '24px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, boxShadow: '0 12px 24px rgba(230,126,34,0.3)' }}>{adminEmail[0].toUpperCase()}</div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{adminEmail}</h2>
                            <p style={{ color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>Master Administrator Control</p>
                        </div>
                        <div style={{ padding: '32px' }}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                    <p style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Security Level</p>
                                    <p style={{ fontWeight: 800, color: theme.slate }}>Root / Level 4 (Highest)</p>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                    <p style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Last Authentication</p>
                                    <p style={{ fontWeight: 800, color: theme.slate }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <button onClick={() => setShowProfileModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: theme.slate, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>Close Account Overview</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div onClick={e => { if (e.target === e.currentTarget) setShowLogoutConfirm(false) }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                    <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#fee2e2', color: '#dc2626', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🚪</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: theme.slate }}>Confirm Sign Out</h3>
                            <p style={{ color: theme.textMuted, marginTop: '12px', lineHeight: 1.6, fontSize: '14px' }}>Are you sure you want to end your administrative session and return to the login screen?</p>
                        </div>
                        <div style={{ padding: '0 32px 32px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'white', border: `1px solid ${theme.border}`, color: theme.slate, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={logout} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#dc2626', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
