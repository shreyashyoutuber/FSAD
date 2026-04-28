import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast, useToast } from '../components/Toast'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

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
`

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
                            { label: 'Full Name', key: 'name', type: 'text', icon: '👤' },
                            { label: 'Email Address', key: 'email', type: 'email', icon: '✉️' },
                            { label: 'Phone Number', key: 'phone', type: 'tel', icon: '📞' }
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
        const valueNum = parseInt(property.details?.marketValue?.replace(/[^0-9]/g, '') || 5000000)
        const sizeNum = parseInt(property.details?.area || property.details?.size || 1200)
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

    useEffect(() => {
        const style = document.createElement('style')
        style.innerText = animations
        document.head.appendChild(style)
        return () => {
            if (document.head.contains(style)) document.head.removeChild(style)
        }
    }, [])

    useEffect(() => {
        const user = sessionStorage.getItem('bhvUser')
        if (!user) { navigate('/login'); return }
        const data = JSON.parse(localStorage.getItem('userData') || '{}')
        setUserData(data)
        setProfileForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' })
        setSavedIdeas(JSON.parse(localStorage.getItem('savedIdeas') || '[]'))
    }, [])

    // Clear unread counts when recommendations view is opened
    useEffect(() => {
        const count = getUnreadCount()
        if (view === 'recommendations' && count > 0) {
            const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
            const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
            allReqs.forEach(req => {
                if (req.customerEmail === userEmail) {
                    const chatMsgs = JSON.parse(localStorage.getItem(`chat_${req.id}`) || '[]')
                    readCounts[req.id] = chatMsgs.filter(m => m.sender === 'admin').length
                }
            })
            localStorage.setItem('chatReadCounts', JSON.stringify(readCounts))
            setUnreadChats(0)
        } else {
            setUnreadChats(count)
        }
    }, [view, chatReq])

    const saveIdea = (rec) => {
        const already = savedIdeas.find(s => s.title === rec.title)
        if (already) { toast.warning('Already saved!'); return }
        const updated = [...savedIdeas, rec]
        setSavedIdeas(updated)
        localStorage.setItem('savedIdeas', JSON.stringify(updated))
        toast.success(`"${rec.title}" saved for later!`)
    }

    const removeIdea = (title) => {
        const updated = savedIdeas.filter(s => s.title !== title)
        setSavedIdeas(updated)
        localStorage.setItem('savedIdeas', JSON.stringify(updated))
    }

    const logout = () => {
        sessionStorage.removeItem('bhvUser')
        navigate('/')
    }

    const saveProfile = (newInfo) => {
        const updated = { ...userData, ...newInfo }
        setUserData(updated)
        localStorage.setItem('userData', JSON.stringify(updated))
        setShowProfile(false)
    }

    // Data Derivation
    const allEstimates = JSON.parse(localStorage.getItem('userEstimates') || '[]')
    const userEmail = sessionStorage.getItem('bhvUser')
    const estimates = allEstimates.filter(est => est.userEmail === userEmail || est.customerEmail === userEmail)
    const allAdminRequests = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
    const adminResponses = JSON.parse(localStorage.getItem('adminResponses') || '{}')

    // Find the primary property for this user (most recent submission)
    const myProperties = allAdminRequests.filter(r => r.customerEmail === userEmail && r.type.startsWith('Property:'))
    const myRequests = allAdminRequests.filter(r => r.customerEmail === userEmail)
    const activeProperty = myProperties.length > 0 ? myProperties[myProperties.length - 1] : null

    // Calculated metrics
    const dynamicRecs = generateAIRecommendations(activeProperty)
    const activeRecsCount = allAdminRequests.filter(r => r.customerEmail === userEmail && r.responded).length
    const totalInvestment = Object.values(adminResponses)
        .filter(res => allAdminRequests.find(req => req.id === res.requestId && req.customerEmail === userEmail))
        .reduce((sum, res) => sum + parseInt(res.quote || 0), 0)

    const potentialValueIncrease = totalInvestment > 0 ? Math.round(totalInvestment * 1.8) : 0 
    
    // Heuristics for display
    const parseMoney = (s) => parseFloat(s?.replace(/[^0-9]/g, '') || '0') * (s?.includes('K') ? 1000 : (s?.includes('L') ? 100000 : 1))
    const fallbackTotalCost = RECS.reduce((sum, r) => sum + parseMoney(r.cost), 0)
    const fallbackTotalValue = RECS.reduce((sum, r) => sum + parseMoney(r.value), 0)

    const displayInvestment = totalInvestment > 0 ? totalInvestment : (activeProperty ? fallbackTotalCost : 0)
    const displayValueIncrease = potentialValueIncrease > 0 ? potentialValueIncrease : (activeProperty ? fallbackTotalValue : 0)
    const displayRecsCount = activeRecsCount > 0 ? activeRecsCount : (activeProperty ? RECS.length : 0)

    const baseValue = parseInt(activeProperty?.details?.marketValue?.replace(/[^0-9]/g, '') || 5000000)

    const prop = activeProperty ? {
        type: activeProperty.type?.replace('Property: ', '') || 'Residential',
        location: activeProperty.customerAddress || 'Location',
        currentValue: baseValue,
        size: activeProperty.details?.size || '1,250',
        age: activeProperty.details?.year ? (new Date().getFullYear() - activeProperty.details.year) : 10,
        locationRating: 4.5
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
        const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
        const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
        const userEmail = sessionStorage.getItem('bhvUser')
        let total = 0
        allReqs.forEach(req => {
            if (req.customerEmail === userEmail) {
                const chatMsgs = JSON.parse(localStorage.getItem(`chat_${req.id}`) || '[]')
                const adminMsgs = chatMsgs.filter(m => m.sender === 'admin').length
                const lastRead = readCounts[req.id] || 0
                total += Math.max(0, adminMsgs - lastRead)
            }
        })
        return total
    }

    if (!userData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>


    const navLinks = [
        { icon: '📊', label: 'Dashboard', key: 'dashboard' },
        { icon: '💰', label: 'My Estimator', key: 'estimator' },
        { icon: '📄', label: 'New Estimate', key: 'new-estimator' },
        { icon: '💡', label: 'Recommendations', key: 'recommendations', badge: unreadChats },
        { icon: '🔖', label: 'Saved Ideas', key: 'saved', badge: savedIdeas.length },
        { icon: '🏠', label: 'Submit Property', key: 'submit' },
        { icon: '🎁', label: 'Refer & Earn', key: 'referral' },
        { icon: '👷', label: 'Contractors', key: 'contractors' },
    ]


    return (
        <div className="dashboard-layout">
            <Toast toasts={toasts} removeToast={removeToast} />
            {showProfile && <ProfileModal userData={userData} onClose={() => setShowProfile(false)} onSave={saveProfile} />}
            {/* Overlay for mobile */}
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header" onClick={() => setView('dashboard')} style={{ cursor: 'pointer', transition: 'all 0.3s' }}>
                    <h2 className="sidebar-brand" id="BharatHomeValue" style={{ fontSize: '22px', fontWeight: 800 }}>
                        BharatHome<span>Value</span>
                    </h2>
                </div>
                <nav className="sidebar-nav">
                    {navLinks.map(l => (
                        <SidebarLink key={l.key} icon={l.icon} label={l.label} active={view === l.key} onClick={() => { 
                            if (l.key === 'contractors') {
                                navigate('/contractors');
                            } else {
                                setView(l.key); 
                            }
                            setSidebarOpen(false);
                        }} badge={l.badge} />
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-link" onClick={() => setShowExitConfirm(true)}>← Back to Home</div>
                </div>
            </aside>

            {/* Main */}
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }} className="mobile-menu-btn">☰</button>
                        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>
                            {view === 'dashboard' ? 'Dashboard' : view === 'estimator' ? 'My Estimates' : view === 'new-estimator' ? 'New Estimate' : view === 'recommendations' ? 'Recommendations' : view === 'saved' ? 'Saved Ideas' : view === 'profile' ? 'Profile' : view === 'submit' ? 'Submit Property' : 'Dashboard'}
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
                                            myRequests.filter(r => {
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
                        <button onClick={logout} className="button-press" style={{ padding: '8px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, transition: '0.3s' }} onMouseEnter={e => e.target.style.background = '#fecaca'} onMouseLeave={e => e.target.style.background = '#fee2e2'}>Logout</button>
                    </div>
                </header>

                <main className="dashboard-main">
                    {/* ---- DASHBOARD VIEW ---- */}
                    {view === 'dashboard' && (
                        <div className="animate-fadeIn">
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Welcome back, {userData.name}! 👋</h2>
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
                                                <p style={{ fontSize: '28px', fontWeight: 800, color: '#ffd700' }}>₹{activeProperty.details?.marketValue || '₹50,00,000'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '24px' }}>
                                            {[
                                                ['Property Size', `${activeProperty.details?.size || '1,250'} sq ft`],
                                                ['Property Age', `${activeProperty.details?.age || '10'} years`],
                                                ['Location Rating', `4.5/5.0`]
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
                                            { label: 'Potential Value Increase', value: `+₹${(displayValueIncrease / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'With all recommendations' : 'Initial AI Projection', color: '#3b82f6', icon: '📊' },
                                            { label: 'Total Investment', value: `₹${(displayInvestment / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'Estimated renovation cost' : 'Initial AI Estimate', color: '#f59e0b', icon: '₹' },
                                            { label: 'Active Recommendations', value: displayRecsCount, sub: activeRecsCount > 0 ? 'Personalized for you' : 'Projected for your property', color: '#10b981', icon: '💡' },
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
                                                    { icon: '📐', title: 'New Estimate', sub: 'Calculate interior costs', action: () => setView('new-estimator'), primary: true },
                                                    { icon: '📋', title: 'View Estimates', sub: 'See saved estimates', action: () => setView('estimator') },
                                                    { icon: '🎁', title: 'Refer & Earn', sub: 'Invite friends, earn rewards', action: () => setView('referral') },
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
                                                <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
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
                                    <div style={{ fontSize: '72px', marginBottom: '32px' }}>🏡</div>
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
                                        <div key={i} className={`card animate-slideUp stagger-${(i % 5) + 1} hover-lift`} style={{ margin: 0 }}>
                                            <h4 style={{ fontWeight: 700 }}>{est.type}</h4>
                                            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{est.date}</p>
                                            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', margin: '12px 0' }}>₹{est.cost?.toLocaleString('en-IN')}</p>
                                            <span style={{ fontSize: '12px', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>{est.package}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                        const userEmail = sessionStorage.getItem('bhvUser')
                        const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]')
                        const allResponses = JSON.parse(localStorage.getItem('adminResponses') || '{}')
                        // Get all of this user's requests
                        const myRequests = allReqs.filter(r => r.customerEmail === userEmail)
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
                                            const res = allResponses[req.id]
                                            const isResponded = req.responded && res
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
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const fd = new FormData(e.target);
                                    const data = Object.fromEntries(fd.entries());

                                    const newReq = {
                                        id: `PROP-${Date.now().toString().slice(-6)}`,
                                        customerName: `${data.firstName} ${data.lastName}`,
                                        customerEmail: data.email,
                                        customerPhone: data.phone,
                                        customerAddress: `${data.address}, ${data.city}`,
                                        type: `Property: ${data.propertyType}`,
                                        status: 'pending',
                                        dateSubmitted: new Date().toISOString().split('T')[0],
                                        description: data.description || 'New property submission for review',
                                        budget: `₹${data.improvementBudget}`,
                                        responded: false,
                                        propertyPhotos: propertyPhotos, // New property photos
                                        details: {
                                            size: data.propertySize,
                                            year: data.yearBuilt,
                                            marketValue: `₹${data.marketValue}`
                                        }
                                    };

                                    const allReqs = JSON.parse(localStorage.getItem('allAdminRequests') || '[]');
                                    localStorage.setItem('allAdminRequests', JSON.stringify([...allReqs, newReq]));

                                    alert('Property submitted! Our team will review and provide recommendations within 48 hours.');
                                    setView('dashboard');
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

                                    <button type="submit" className="btn-submit button-press">Submit Property</button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <ConfirmModal
                    title="Exit Dashboard?"
                    message="Are you sure you want to go back to the home page? This will log you out of your current session."
                    onConfirm={() => { logout(); navigate('/') }}
                    onCancel={() => setShowExitConfirm(false)}
                />
            )}

            {/* Profile Modal */}
            {showProfile && (
                <ProfileModal
                    userData={userData}
                    onClose={() => setShowProfile(false)}
                    onSave={(newVal) => {
                        const updated = { ...userData, ...newVal }
                        localStorage.setItem('userData', JSON.stringify(updated))
                        setUserData(updated)
                        setProfileForm(newVal)
                        setShowProfile(false)
                        alert('Profile updated successfully!')
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
            {lightbox && (() => {
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
            })()}
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

