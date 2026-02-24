import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

.animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
.animate-slideUp { animation: slideUp 0.5s ease forwards; }
.animate-scaleIn { animation: scaleIn 0.4s ease forwards; }
.animate-pulseGlow { animation: pulseGlow 2s infinite; }

.hover-lift { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
.button-press:active { transform: scale(0.96); transition: transform 0.1s; }

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
    color: #555;
    font-weight: 600;
    margin-bottom: 8px;
}
.sidebar-link:hover { background: #fff3e0; color: #e67e22; }
.sidebar-link.active { background: #e67e22; color: white; box-shadow: 0 4px 12px rgba(230,126,34,0.3); }
`

// Admin Chat Modal — outside component to prevent re-render focus issues
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
    const unread = msgs.filter(m => m.sender === 'user').length

    return (
        <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', height: '600px', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white' }}>
                            {req.customerName[0]}
                        </div>
                        <div>
                            <p style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>{req.customerName}</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{req.type} · {req.id} · {unread} message{unread !== 1 ? 's' : ''} from user</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}>×</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fdf6ee' }}>
                    {msgs.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '80px', color: '#bbb' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📬</div>
                            <p style={{ fontWeight: 600, color: '#999' }}>No messages yet</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}>The customer hasn't sent any negotiation messages yet.</p>
                        </div>
                    )}
                    {msgs.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '78%' }}>
                                <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px', textAlign: m.sender === 'admin' ? 'right' : 'left' }}>
                                    {m.sender === 'admin' ? '🔑 You (Admin)' : `👤 ${req.customerName}`} · {fmt(m.time)}
                                </p>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: m.sender === 'admin' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: m.sender === 'admin' ? 'linear-gradient(135deg, #e67e22, #d35400)' : 'white',
                                    color: m.sender === 'admin' ? 'white' : '#1a1a1a',
                                    fontSize: '14px', lineHeight: 1.6,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: m.sender === 'user' ? '1px solid #f0ece6' : 'none'
                                }}>
                                    {m.message}
                                </div>
                            </div>
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
                        placeholder="Reply to customer… (Enter to send)"
                        style={{ flex: 1, padding: '11px 16px', borderRadius: '12px', border: '2px solid #f0ece6', fontSize: '14px', outline: 'none', fontFamily: 'inherit', transition: '0.3s', background: '#fdf6ee' }}
                        onFocus={e => { e.target.style.borderColor = '#e67e22'; e.target.style.background = 'white' }}
                        onBlur={e => { e.target.style.borderColor = '#f0ece6'; e.target.style.background = '#fdf6ee' }}
                        autoFocus
                    />
                    <button onClick={send} disabled={!text.trim()}
                        style={{ width: '44px', height: '44px', borderRadius: '12px', background: text.trim() ? 'linear-gradient(135deg, #e67e22, #d35400)' : '#e9ecef', border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed', fontSize: '20px', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📤
                    </button>
                </div>
            </div>
        </div>
    )
}

const MOCK_REQUESTS = [
    { id: 'EST-001', customerName: 'Rajesh Kumar', customerEmail: 'rajesh@example.com', customerPhone: '+91 98765 43210', customerAddress: 'Flat 402, Sunshine Apts, Bangalore', type: 'Kitchen Estimator', status: 'pending', dateSubmitted: '2026-02-14', description: 'Kitchen renovation with modern cabinets', budget: '₹1,50,000', responded: false },
    { id: 'EST-002', customerName: 'Priya Singh', customerEmail: 'priya@example.com', customerPhone: '+91 88822 33445', customerAddress: '7th Cross, HSR Layout, Bangalore', type: 'Full Home Estimator', status: 'pending', dateSubmitted: '2026-02-15', description: 'Complete home interior design', budget: '₹15,00,000', responded: false },
    { id: 'EST-003', customerName: 'Amit Patel', customerEmail: 'amit@example.com', customerPhone: '+91 77766 55443', customerAddress: 'Prestige Falcon City, Kanakapura Road', type: 'Wardrobe Estimator', status: 'responded', dateSubmitted: '2026-02-10', description: 'Custom wardrobe design', budget: '₹2,85,000', responded: true },
]

const TYPE_ICON = { 'Kitchen Estimator': '🍳', 'Full Home Estimator': '🏠', 'Wardrobe Estimator': '👔' }

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [filter, setFilter] = useState('all')
    const [selectedReq, setSelectedReq] = useState(null)
    const [search, setSearch] = useState('')
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@bharathomevalue.com'
    const [chatReq, setChatReq] = useState(null)
    const [view, setView] = useState('requests')
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    useEffect(() => {
        const style = document.createElement('style')
        style.innerText = animations
        document.head.appendChild(style)
        return () => {
            if (document.head.contains(style)) document.head.removeChild(style)
        }
    }, [])

    useEffect(() => {
        if (!localStorage.getItem('adminLoggedIn')) { navigate('/admin-login'); return }
        const stored = localStorage.getItem('allAdminRequests')
        setRequests(stored ? JSON.parse(stored) : MOCK_REQUESTS)
    }, [])

    const logout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminLoggedIn')
            localStorage.removeItem('adminEmail')
            navigate('/admin-login')
        }
    }

    const filtered = requests.filter(r => {
        const matchFilter = filter === 'all' ? true : filter === 'pending' ? !r.responded : r.responded
        const matchSearch = !search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    const total = requests.length
    const pending = requests.filter(r => !r.responded).length
    const responded = requests.filter(r => r.responded).length

    const openResponse = (id) => { localStorage.setItem('currentRequestId', id); navigate('/admin-respond') }

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6ee', fontFamily: 'inherit' }}>

            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                padding: '0 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '68px',
                boxShadow: '0 4px 20px rgba(230,126,34,0.35)',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                        BharatHome <span style={{ color: '#ffe0b2' }}>Value</span>
                    </div>
                    <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
                        ADMIN PANEL
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '14px' }}>{adminEmail}</p>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Administrator</p>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800, color: 'white' }}>
                        {adminEmail[0]?.toUpperCase()}
                    </div>
                    <button onClick={logout} className="button-press"
                        style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: '0.3s' }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.35)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}>
                        Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '280px',
                    background: 'white',
                    borderRight: '2px solid #f5efe6',
                    padding: '30px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    position: 'sticky',
                    top: '68px',
                    height: 'calc(100vh - 68px)'
                }}>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#aaa', letterSpacing: '1px', marginBottom: '16px', marginLeft: '20px' }}>NAVIGATION</p>
                    <div className={`sidebar-link button-press ${view === 'requests' ? 'active' : ''}`} onClick={() => setView('requests')}>
                        <span style={{ fontSize: '20px' }}>📋</span>
                        <span>Estimator Requests</span>
                    </div>
                    <div className={`sidebar-link button-press ${view === 'customers' ? 'active' : ''}`} onClick={() => setView('customers')}>
                        <span style={{ fontSize: '20px' }}>👥</span>
                        <span>Customer Management</span>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '20px', background: '#fdf6ee', borderRadius: '16px', border: '1px solid #ffcc80' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#e67e22', textTransform: 'uppercase', marginBottom: '8px' }}>Security Tip</p>
                        <p style={{ fontSize: '11px', color: '#8d6e63', lineHeight: 1.5 }}>Always verify customer identity before sharing sensitive pricing details.</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1400px' }}>

                    {/* ---- REQUESTS VIEW ---- */}
                    {view === 'requests' && (
                        <div className="animate-fadeIn">
                            <div style={{ marginBottom: '28px' }}>
                                <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#1a1a1a', marginBottom: '6px' }}>Estimator Requests</h1>
                                <p style={{ color: '#888', fontSize: '15px' }}>Manage and respond to customer estimation requests</p>
                            </div>

                            {/* Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
                                {[
                                    { label: 'Total Requests', value: total, icon: '📋', color: '#e67e22', light: '#fff3e0' },
                                    { label: 'Pending', value: pending, icon: '⏳', color: '#f59e0b', light: '#fffbeb' },
                                    { label: 'Responded', value: responded, icon: '✅', color: '#10b981', light: '#ecfdf5' },
                                ].map(({ label, value, icon, color, light }, i) => (
                                    <div key={label} className={`animate-slideUp stagger-${i + 1}`}
                                        style={{ background: 'white', borderRadius: '16px', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: `1.5px solid ${light}`, transition: '0.3s', cursor: 'default' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}30` }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}>
                                        <div style={{ width: '58px', height: '58px', borderRadius: '14px', background: light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{icon}</div>
                                        <div>
                                            <div style={{ fontSize: '38px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                                            <div style={{ fontSize: '14px', color: '#888', marginTop: '4px', fontWeight: 500 }}>{label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Filter + Search Bar */}
                            <div style={{ background: 'white', borderRadius: '14px', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[['all', 'All Requests'], ['pending', '⏳ Pending'], ['responded', '✅ Responded']].map(([val, label]) => (
                                        <button key={val} onClick={() => setFilter(val)} className="button-press"
                                            style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: '0.25s', background: filter === val ? '#e67e22' : '#f5f5f5', color: filter === val ? 'white' : '#555', boxShadow: filter === val ? '0 4px 12px rgba(230,126,34,0.3)' : 'none' }}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="🔍  Search name, ID or type..."
                                    style={{ padding: '10px 18px', borderRadius: '10px', border: '2px solid #f0ece6', background: '#fdf6ee', fontSize: '14px', outline: 'none', width: '260px', color: '#333', transition: '0.3s' }}
                                    onFocus={e => e.target.style.borderColor = '#e67e22'}
                                    onBlur={e => e.target.style.borderColor = '#f0ece6'}
                                />
                            </div>

                            {/* Requests Table */}
                            <div className="animate-slideUp stagger-4" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)' }}>
                                            {['Request ID', 'Customer', 'Type', 'Date', 'Budget', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#bbb', fontSize: '16px' }}>
                                                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                                                No requests found
                                            </td></tr>
                                        ) : filtered.map((req, i) => (
                                            <tr key={req.id}
                                                style={{ borderTop: `1px solid #f5f5f5`, transition: '0.2s', cursor: 'default', background: i % 2 === 0 ? 'white' : '#fffcf9' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fff8f0'}
                                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fffcf9'}>
                                                <td style={{ padding: '18px 20px', fontWeight: 800, color: '#e67e22', fontSize: '14px' }}>{req.id}</td>
                                                <td style={{ padding: '18px 20px' }}>
                                                    <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>{req.customerName}</div>
                                                    <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>{req.customerEmail}</div>
                                                </td>
                                                <td style={{ padding: '18px 20px' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#555', fontSize: '13px', fontWeight: 500 }}>
                                                        {TYPE_ICON[req.type] || '📄'} {req.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '18px 20px', color: '#999', fontSize: '13px' }}>{req.dateSubmitted}</td>
                                                <td style={{ padding: '18px 20px', color: '#333', fontWeight: 700, fontSize: '14px' }}>{req.budget}</td>
                                                <td style={{ padding: '18px 20px' }}>
                                                    <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: req.responded ? '#dcfce7' : '#fef3c7', color: req.responded ? '#16a34a' : '#92400e', border: `1px solid ${req.responded ? '#bbf7d0' : '#fde68a'}` }}>
                                                        {req.responded ? '✓ Responded' : '⏳ Pending'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '18px 20px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setSelectedReq(req)} className="button-press"
                                                            style={{ padding: '7px 16px', background: '#fff3e0', border: '1.5px solid #ffcc80', color: '#e67e22', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: '0.2s' }}>
                                                            View
                                                        </button>
                                                        <button onClick={() => openResponse(req.id)} className="button-press"
                                                            style={{ padding: '7px 16px', background: req.responded ? '#eff6ff' : '#f0fdf4', border: `1.5px solid ${req.responded ? '#93c5fd' : '#86efac'}`, color: req.responded ? '#2563eb' : '#16a34a', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: '0.2s' }}>
                                                            {req.responded ? '✏️ Edit' : '✉️ Respond'}
                                                        </button>
                                                        <button onClick={() => setChatReq(req)} className="button-press"
                                                            style={{ padding: '7px 14px', background: '#fff8f0', border: '1.5px solid #ffcc80', color: '#e67e22', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            💬 Chat
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p style={{ textAlign: 'center', color: '#bbb', marginTop: '20px', fontSize: '13px' }}>
                                Showing {filtered.length} of {total} requests
                            </p>
                        </div>
                    )}

                    {/* ---- CUSTOMERS VIEW ---- */}
                    {view === 'customers' && (() => {
                        const customerMap = {}
                        requests.forEach(r => {
                            if (!customerMap[r.customerEmail]) {
                                customerMap[r.customerEmail] = {
                                    name: r.customerName,
                                    email: r.customerEmail,
                                    phone: r.customerPhone || '+91 90000 00000',
                                    address: r.customerAddress || 'Address not listed',
                                    propertyCount: 0,
                                    requests: []
                                }
                            }
                            customerMap[r.customerEmail].propertyCount++
                            customerMap[r.customerEmail].requests.push(r)
                        })
                        const customers = Object.values(customerMap)
                        const filteredCustomers = customers.filter(c =>
                            c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.email.toLowerCase().includes(search.toLowerCase())
                        )

                        return (
                            <div className="animate-fadeIn">
                                <div style={{ marginBottom: '28px' }}>
                                    <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#1a1a1a', marginBottom: '6px' }}>Customer Management</h1>
                                    <p style={{ color: '#888', fontSize: '15px' }}>View and manage detailed profiles for all your clients</p>
                                </div>

                                <div style={{ background: 'white', borderRadius: '14px', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                    <div style={{ fontWeight: 700, color: '#e67e22' }}>Total Clients: {customers.length}</div>
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="🔍  Search customers..."
                                        style={{ padding: '10px 18px', borderRadius: '10px', border: '2px solid #f0ece6', background: '#fdf6ee', fontSize: '14px', outline: 'none', width: '260px' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                                    {filteredCustomers.map((c, i) => (
                                        <div key={c.email} className={`animate-slideUp stagger-${(i % 5) + 1} hover-lift`} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1.5px solid #fdf6ee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                                                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #e67e22, #d35400)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 800 }}>
                                                    {c.name[0]}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '2px' }}>{c.name}</h3>
                                                    <div style={{ display: 'inline-block', padding: '3px 10px', background: '#fff3e0', color: '#e67e22', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                                                        {c.propertyCount} Property Record{c.propertyCount !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', background: '#fdfaf6', padding: '16px', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                                                    <span style={{ color: '#aaa', minWidth: '70px' }}>Email</span>
                                                    <span style={{ color: '#555', fontWeight: 700 }}>{c.email}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                                                    <span style={{ color: '#aaa', minWidth: '70px' }}>Phone</span>
                                                    <span style={{ color: '#555', fontWeight: 700 }}>{c.phone}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                                                    <span style={{ color: '#aaa', minWidth: '70px' }}>Address</span>
                                                    <span style={{ color: '#555', fontWeight: 700 }}>{c.address}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedCustomer(c)}
                                                className="button-press"
                                                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #e67e22, #d35400)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 800, cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 12px rgba(230,126,34,0.3)' }}>
                                                View Detailed Activity
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })()}
                </main>
            </div>

            {/* Request Detail Modal */}
            {selectedReq && (
                <div onClick={e => { if (e.target === e.currentTarget) setSelectedReq(null) }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '0', maxWidth: '520px', width: '100%', position: 'relative', animation: 'slideUp 0.3s ease', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
                        <div style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', padding: '28px 32px', borderRadius: '20px 20px 0 0', position: 'relative' }}>
                            <button onClick={() => setSelectedReq(null)}
                                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}>×</button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '40px' }}>{TYPE_ICON[selectedReq.type] || '📄'}</span>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>Request Details</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '14px' }}>{selectedReq.id}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '28px 32px' }}>
                            {[['Customer Name', selectedReq.customerName], ['Email', selectedReq.customerEmail], ['Estimator Type', selectedReq.type], ['Date Submitted', selectedReq.dateSubmitted], ['Estimated Budget', selectedReq.budget], ['Description', selectedReq.description]].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', gap: '16px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #f5f5f5' }}>
                                    <span style={{ minWidth: '130px', color: '#999', fontSize: '13px', fontWeight: 600 }}>{k}</span>
                                    <span style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button onClick={() => { setSelectedReq(null); openResponse(selectedReq.id) }} className="button-press"
                                    style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #e67e22, #d35400)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '15px', boxShadow: '0 6px 16px rgba(230,126,34,0.35)', transition: '0.3s' }}>
                                    {selectedReq.responded ? '✏️ Edit Response' : '✉️ Respond with Quote'}
                                </button>
                                <button onClick={() => { setSelectedReq(null); setChatReq(selectedReq) }} className="button-press"
                                    style={{ flex: 1, padding: '14px', background: '#fff3e0', border: '2px solid #ffcc80', borderRadius: '10px', color: '#e67e22', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>
                                    💬 Chat & Negotiate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div onClick={e => { if (e.target === e.currentTarget) setSelectedCustomer(null) }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', animation: 'scaleIn 0.3s ease', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', padding: '32px', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, border: '2px solid rgba(255,255,255,0.3)' }}>{selectedCustomer.name[0]}</div>
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{selectedCustomer.name}</h2>
                                        <p style={{ opacity: 0.8, fontWeight: 500 }}>Customer Profile</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCustomer(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', fontSize: '22px' }}>×</button>
                            </div>
                        </div>

                        <div style={{ padding: '32px' }}>
                            <div style={{ marginBottom: '28px' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Contact Information</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div><p style={{ fontSize: '11px', color: '#bbb', marginBottom: '4px' }}>EMAIL ADDRESS</p><p style={{ fontWeight: 700, color: '#333' }}>{selectedCustomer.email}</p></div>
                                    <div><p style={{ fontSize: '11px', color: '#bbb', marginBottom: '4px' }}>PHONE NUMBER</p><p style={{ fontWeight: 700, color: '#333' }}>{selectedCustomer.phone}</p></div>
                                    <div style={{ gridColumn: '1/-1' }}><p style={{ fontSize: '11px', color: '#bbb', marginBottom: '4px' }}>RESIDENTIAL ADDRESS</p><p style={{ fontWeight: 700, color: '#333' }}>{selectedCustomer.address}</p></div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Property Activity ({selectedCustomer.propertyCount})</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                                    {selectedCustomer.requests.map(req => (
                                        <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#fdf6ee', borderRadius: '12px', border: '1.5px solid #ffcc80' }}>
                                            <div>
                                                <p style={{ fontWeight: 800, fontSize: '14px', color: '#1a1a1a' }}>{req.type}</p>
                                                <p style={{ fontSize: '12px', color: '#e67e22' }}>{req.id} • {req.dateSubmitted}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: 800, color: '#333' }}>{req.budget}</p>
                                                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: req.responded ? '#dcfce7' : '#fef3c7', color: req.responded ? '#16a34a' : '#92400e', fontWeight: 700 }}>
                                                    {req.responded ? 'DONE' : 'PENDING'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Chat Modal */}
            {chatReq && <AdminChatModal req={chatReq} onClose={() => setChatReq(null)} />}
        </div>
    )
}
