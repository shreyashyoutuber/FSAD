






const Icons = {
    Dashboard: () => nullnullnullnullnullnull,
    Estimator: () => nullnullnullnull,
    New: () => nullnullnullnullnullnull,
    Sparkles: () => nullnullnull,
    Bookmark: () => nullnullnull,
    Home: () => nullnullnullnull,
    Gift: () => nullnullnullnullnullnullnull,
    Users: () => nullnullnullnullnullnull,
    Calculator: () => nullnullnullnullnullnullnullnullnullnullnullnull,
    Search: () => nullnullnullnull,
    User: () => nullnullnullnull,
    Logout: () => nullnullnullnullnull,
    Trash: () => nullnullnullnullnullnullnull,
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const RECS = [
    { title: 'Kitchen Renovation', desc: 'Modern modular kitchen with granite countertops and chimney', cost: 'â‚¹250K', value: 'â‚¹400K', roi: '60%', impact: '+8%', priority: 'high', link: '/kitchen-estimator' },
    { title: 'Bathroom Upgrade', desc: 'Premium fittings, new tiles, and modern sanitary ware', cost: 'â‚¹180K', value: 'â‚¹350K', roi: '94%', impact: '+7%', priority: 'high', link: '/full-home-estimator' },
    { title: 'Fresh Paint & Texture', desc: 'Interior walls with premium Asian Paints and designer textures', cost: 'â‚¹80K', value: 'â‚¹250K', roi: '100%', impact: '+5%', priority: 'medium', link: '/full-home-estimator' },
    { title: 'Flooring Replacement', desc: 'Vitrified tiles or hardwood flooring for living areas', cost: 'â‚¹200K', value: 'â‚¹350K', roi: '75%', impact: '+7%', priority: 'medium', link: '/full-home-estimator' },
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
    null
)

const Skeleton = ({ w = '100%', h = 20, mb = 0, radius = 8 }) => (
    null
)

const DashboardSkeleton = () => (
    null
        null
            null
            null
        null
        {/* Property card skeleton */}
        null
        {/* Timeline skeleton */}
        null
        {/* Metric cards skeleton */}
        null
            {[1, 2, 3].map(i => nullnullnullnullnull)}
        null
        {/* Chart + actions skeleton */}
        null
            nullnullnullnull
            nullnull{[1, 2, 3, 4].map(i => null)}null
        null
    null
)

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
    null
        null{icon}null
        null{label}null
        {badge > 0 && null{badge}null}
    null
)

// ---- PROFILE MODAL ----
function ProfileModal({ userData, onClose, onSave }) {
    const [form, setForm] = useState({ name: userData?.name || '', email: userData?.email || '', phone: userData?.phone || '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(form)
    }

    return (
        null e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100, padding: '20px' }}>
            null
                null
                    nullEdit Profilenull
                    nullÃ—null
                null
                null
                    null
                        null
                            {form.name?.[0]?.toUpperCase()}
                        null
                        null{form.name}null
                        null{form.email}null
                    null
                    null
                        {[
                            { label: 'Full Name', key: 'name', type: 'text', icon: null },
                            { label: 'Email Address', key: 'email', type: 'email', icon: null },
                            { label: 'Phone Number', key: 'phone', type: 'tel', icon: null }
                        ].map(({ label, key, type, icon }) => (
                            null
                                null{label}null
                                null
                                    null{icon}null
                                    null setForm({ ...form, [key]: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '2px solid #f0ece6', fontSize: '15px', outline: 'none', transition: '0.3s', boxSizing: 'border-box' }}
                                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={e => e.target.style.borderColor = '#f0ece6'}
                                        required
                                    />
                                null
                            null
                        ))}
                        nullSave Changesnull
                    null
                null
            null
        null
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
        if (activeTenure null new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
    const PRESETS = [6, 12, 24, 36, 48, 60, 84, 120]
    const principalPct = emi > 0 ? Math.round(amount / (amount + totalInterest) * 100) : 0
    const interestPct = 100 - principalPct

    return (
        null
            {/* Header banner */}
            null
                null
                    nullðŸ§®null
                    nullRenovation EMI Calculatornull
                    nullPlan your monthly installments before starting your renovationnull
                null
                {emi > 0 && (
                    null
                        nullMonthly EMInull
                        null{fmt(emi)}null
                    null
                )}
            null

            null
                {/* â”€â”€ Input Card â”€â”€ */}
                null
                    nullLoan Parametersnull

                    {/* Loan Amount */}
                    null
                        null
                            nullLoan Amountnull
                            null{fmt(amount)}null
                        null
                        null setAmount(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        null
                            nullâ‚¹50Knullnullâ‚¹50Lnull
                        null
                        {/* Quick amounts */}
                        null
                            {[200000, 500000, 1000000, 2000000].map(a => (
                                null setAmount(a)}
                                    style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', border: `1.5px solid ${amount === a ? '#e67e22' : '#e2e8f0'}`, background: amount === a ? '#fff7ed' : 'white', color: amount === a ? '#e67e22' : '#64748b' }}>
                                    {a >= 100000 ? `â‚¹${a / 100000}L` : `â‚¹${a / 1000}K`}
                                null
                            ))}
                        null
                    null

                    {/* Interest Rate â€” starts from 0 */}
                    null
                        null
                            nullInterest Rate (p.a.)null
                            null{rate}%null
                        null
                        null setRate(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        null
                            null0%null
                            nullTypical: 8â€“14%null
                            null30%null
                        null
                    null

                    {/* Loan Tenure */}
                    null
                        null
                            nullLoan Tenurenull
                            null{activeTenure}Mnull
                        null
                        {/* Slider */}
                        null { setTenure(Number(e.target.value)); setUseCustom(false); setCustomTenure('') }}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer', marginBottom: '8px' }} />
                        null
                            null1 Monthnullnull360 Months (30 yrs)null
                        null
                        {/* Preset chips */}
                        null
                            {PRESETS.map(t => (
                                null { setTenure(t); setUseCustom(false); setCustomTenure('') }}
                                    style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', border: `1.5px solid ${!useCustom && tenure === t ? '#e67e22' : '#e2e8f0'}`, background: !useCustom && tenure === t ? '#fff7ed' : 'white', color: !useCustom && tenure === t ? '#e67e22' : '#64748b' }}>
                                    {t}M
                                null
                            ))}
                        null
                        {/* Custom input */}
                        null
                            nullâœï¸null
                            null { setCustomTenure(e.target.value); setUseCustom(true) }}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: 700, color: '#1e293b', width: '100%' }} />
                            nullmonthsnull
                        null
                    null
                null

                {/* â”€â”€ Results Card â”€â”€ */}
                null
                    {/* EMI breakdown */}
                    null
                        nullMonthly Paymentnull
                        null
                            {emi > 0 ? fmt(emi) : nullCalculating...null}
                        null

                        {/* Principal vs Interest bar */}
                        {emi > 0 && (
                            null
                                null
                                    nullPrincipal ({principalPct}%)null
                                    nullInterest ({interestPct}%)null
                                null
                                null
                                    null
                                    null
                                null
                            null
                        )}

                        null

                        {[
                            { label: 'Principal Amount', value: fmt(amount), color: 'white' },
                            { label: 'Total Interest', value: fmt(totalInterest), color: '#f87171' },
                        ].map(r => (
                            null
                                null{r.label}null
                                null{r.value}null
                            null
                        ))}

                        null
                            nullTotal Payablenull
                            null{fmt(amount + totalInterest)}null
                        null
                        {activeTenure > 0 && (
                            nullOver {activeTenure} months @ {rate}% p.a.null
                        )}
                    null

                    {/* CTA */}
                    null
                        null
                            ðŸ¦ Ready to apply? Get instant pre-approval from our banking partners with zero paperwork.
                        null
                        null e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            Apply for Instant Loan â†’
                        null
                        null*Indicative rates. Subject to credit approval by partner banks.null
                    null
                null
            null
        null
    )
}

// ---- CONFIRM MODAL ----
function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        null e.target === e.currentTarget && onCancel()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
            null
                null
                    nullâš ï¸null
                    null{title}null
                    null{message}null
                    null
                        nullCancelnull
                        nullYes, Exitnull
                    null
                null
            null
        null
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
                message: 'ðŸ‘‹ Thank you for reaching out! Your message has been received. Our expert will review and respond shortly. Please wait for the admin to reply.',
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
        null { if (e.target === e.currentTarget) onClose() }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            null

                {/* Chat Header */}
                null
                    null
                        nullðŸ null
                        null
                            nullNegotiate with Expertnull
                            null{requestType} Â· {requestId}null
                        null
                    null
                    nullÃ—null
                null

                {/* Messages */}
                null
                    {msgs.length === 0 && (
                        null
                            nullðŸ’¬null
                            nullStart the negotiation!null
                            nullAsk for a discount, clarify scope, or request changesnull
                        null
                    )}
                    {msgs.map((m, i) => (
                        null
                            {m.sender === 'system' ? (
                                null
                                    null{m.message}null
                                    nullAuto-generated Â· {fmt(m.time)}null
                                null
                            ) : (
                                null
                                    null
                                        {m.sender === 'user' ? 'You' : 'ðŸ”‘ Admin'} Â· {fmt(m.time)}
                                    null
                                    null
                                        {m.message}
                                    null
                                null
                            )}
                        null
                    ))}
                    null
                null

                {/* Input */}
                null
                    null setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        placeholder="Type your messageâ€¦ (Enter to send)"
                        style={{ flex: 1, padding: '11px 16px', borderRadius: '12px', border: '2px solid #f0ece6', fontSize: '14px', outline: 'none', fontFamily: 'inherit', transition: '0.3s', background: '#fdf6ee' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white' }}
                        onBlur={e => { e.target.style.borderColor = '#f0ece6'; e.target.style.background = '#fdf6ee' }}
                        autoFocus
                    />
                    null
                        ðŸ“¤
                    null
                null
            null
        null
    )
}

// â”€â”€â”€ Project Timeline Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProjectTimeline({ status }) {
    const steps = [
        { id: 'submitted', label: 'Submitted', emoji: 'ðŸ“' },
        { id: 'under-review', label: 'Under Review', emoji: 'ðŸ”' },
        { id: 'quote-sent', label: 'Quote Sent', emoji: 'ðŸ’°' },
        { id: 'in-progress', label: 'In Progress', emoji: 'ðŸ—ï¸' },
        { id: 'completed', label: 'Completed', emoji: 'âœ…' }
    ]

    const currentIndex = steps.findIndex(s => s.id === status) || 0

    return (
        null
            nullProject Progress Trackernull
            null
                {/* Connecting Line */}
                nullnull
                nullnull

                {steps.map((s, i) => {
                    const isCompleted = i null
                            null
                                {isCompleted ? 'âœ“' : ''}
                            null
                            null{s.label}null
                        null
                    )
                })}
            null
        null
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
        null { if (e.target === e.currentTarget) setLightbox(null) }}
            onKeyDown={e => { if (e.key === 'Escape') setLightbox(null); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }}
            tabIndex={0}
            ref={el => el?.focus()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, outline: 'none' }}>

            {/* Top bar */}
            null
                null
                    null{img.name || `Image ${index + 1}`}null
                    null{index + 1} of {total} Â· Design Referencenull
                null
                null setLightbox(null)}
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white', width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer', fontSize: '22px', fontWeight: 700, transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                    Ã—
                null
            null

            {/* Image */}
            null

            {/* Nav arrows */}
            {total > 1 && (
                null
                    null { e.currentTarget.style.background = 'rgba(230,126,34,0.8)'; e.currentTarget.style.borderColor = '#e67e22' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
                        â€¹
                    null
                    null { e.currentTarget.style.background = 'rgba(230,126,34,0.8)'; e.currentTarget.style.borderColor = '#e67e22' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
                        â€º
                    null
                null
            )}

            {/* Thumbnail strip */}
            {total > 1 && (
                null
                    {images.map((thumb, i) => (
                        null setLightbox({ images, index: i })}
                            style={{ width: '56px', height: '42px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: i === index ? '2.5px solid #e67e22' : '2px solid rgba(255,255,255,0.2)', opacity: i === index ? 1 : 0.5, transition: '0.3s', boxShadow: i === index ? '0 0 12px rgba(230,126,34,0.5)' : 'none' }}>
                            null
                        null
                    ))}
                null
            )}
        null
    )
}

 function UserDashboard() {
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
            cost: `â‚¹${(Math.round(valueNum * 0.05) / 100000).toFixed(1)}L`,
            value: `+â‚¹${(Math.round(valueNum * 0.05 * 1.6) / 100000).toFixed(1)}L`,
            roi: '60%', impact: '+6.5%', priority: 'high', link: '/kitchen-estimator'
        })
        recommendations.push({
            title: 'Italian Marble Flooring',
            desc: `Replace standard tiles with mirrored Italian marble to elevate the ${typeStr}'s appeal.`,
            cost: `â‚¹${(Math.round(sizeNum * 450) / 100000).toFixed(1)}L`,
            value: `+â‚¹${(Math.round(sizeNum * 450 * 1.8) / 100000).toFixed(1)}L`,
            roi: '80%', impact: '+8%', priority: 'medium', link: '/full-home-estimator'
        })
        if (valueNum > 7000000) {
            recommendations.push({
                title: 'Smart Automation Hub',
                desc: `Integrated lighting, security, and climate control for a modern ${locationStr} lifestyle.`,
                cost: 'â‚¹2.5L', value: '+â‚¹4.0L', roi: '60%', impact: '+4%', priority: 'medium', link: '/full-home-estimator'
            })
        }
        if (typeStr.toLowerCase().includes('villa') || typeStr.toLowerCase().includes('house')) {
            recommendations.push({
                title: 'Solar Power Plant',
                desc: `5kW Rooftop Solar system with net metering. High value for independent ${typeStr}s.`,
                cost: 'â‚¹4.5L', value: '+â‚¹8.0L', roi: '78%', impact: '+9%', priority: 'high', link: '/full-home-estimator'
            })
        } else {
            recommendations.push({
                title: 'Master Bedroom suite',
                desc: `End-to-end paneling and walk-in wardrobe for your ${typeStr} bedroom.`,
                cost: 'â‚¹3.2L', value: '+â‚¹5.5L', roi: '72%', impact: '+5%', priority: 'medium', link: '/wardrobe-estimator'
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

        warmUpBackend();
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
                label: 'Property Value (â‚¹)',
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
                    callback: v => `â‚¹${(v / 100000).toFixed(0)}L`,
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

    if (!userData) return nullLoading...null


    const navLinks = [
        { icon: null, label: 'Dashboard', key: 'dashboard' },
        { icon: null, label: 'My Estimator', key: 'estimator' },
        { icon: null, label: 'New Estimate', key: 'new-estimator' },
        { icon: null, label: 'Recommendations', key: 'recommendations', badge: unreadChats },
        { icon: null, label: 'Saved Ideas', key: 'saved', badge: savedIdeas.length },
        { icon: null, label: 'Submit Property', key: 'submit' },
        { icon: null, label: 'Refer & Earn', key: 'referral' },
        { icon: null, label: 'Contractor Directory', key: 'contractors' },
        { icon: null, label: 'EMI Calculator', key: 'emi' },
    ]


    return (
        null
            null
            {/* Overlay for mobile */}
            {sidebarOpen && null setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />}

            {/* Sidebar */}
            null
                null setView('dashboard')} style={{ cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
                    null
                        BharatHomenullValuenull
                    null
                null
                null
                    {navLinks.map(l => (
                        null {
                            setView(l.key);
                            setSidebarOpen(false);
                        }} badge={l.badge} />
                    ))}
                null
                null
                    null setShowExitConfirm(true)}>â† Back to Homenull
                null
            null


            {/* Main */}
            null
                null
                    null
                        null setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }} className="mobile-menu-btn">â˜°null
                        null
                            {view === 'dashboard' ? 'Dashboard' : view === 'estimator' ? 'My Estimates' : view === 'new-estimator' ? 'New Estimate' : view === 'recommendations' ? 'Recommendations' : view === 'saved' ? 'Saved Ideas' : view === 'profile' ? 'Profile' : view === 'submit' ? 'Submit Property' : view === 'contractors' ? 'Contractor Directory' : view === 'referral' ? 'Refer & Earn' : view === 'emi' ? 'ðŸ§® EMI Calculator' : 'Dashboard'}
                        null
                    null
                    null
                        {/* Notification Bell */}
                        null
                            null setShowNotifications(!showNotifications)}
                                style={{ width: '40px', height: '40px', background: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e9ecef', position: 'relative' }}
                                className="button-press"
                            >
                                nullðŸ””null
                                {unreadChats > 0 && (
                                    null
                                        {unreadChats}
                                    null
                                )}
                            null

                            {showNotifications && (
                                null
                                    null
                                        nullNotificationsnull
                                        nullMark all as readnull
                                    null
                                    null
                                        {unreadChats > 0 ? (
                                            estimates.filter(r => {
                                                const msgs = JSON.parse(localStorage.getItem(`chat_${r.id}`) || '[]')
                                                const adminMsgs = msgs.filter(m => m.sender === 'admin').length
                                                const readCounts = JSON.parse(localStorage.getItem('chatReadCounts') || '{}')
                                                return adminMsgs > (readCounts[r.id] || 0)
                                            }).map(r => (
                                                null { setView('recommendations'); setChatReq({ id: r.id, type: r.type }); setShowNotifications(false) }} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    null
                                                        nullðŸ’¬null
                                                        null
                                                            nullExpert replied to your requestnull
                                                            null{r.type} Â· {r.id}null
                                                        null
                                                    null
                                                null
                                            ))
                                        ) : (
                                            null
                                                nullðŸ“­null
                                                nullNo new notificationsnull
                                            null
                                        )}
                                    null
                                    null
                                        null { setView('recommendations'); setShowNotifications(false) }} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View All Recommendationsnull
                                    null
                                null
                            )}
                        null

                        null setShowProfile(true)}
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
                            null
                                {userData.name?.[0]?.toUpperCase()}
                            null
                            nullProfilenull
                        null
                        null e.target.style.background = '#fecaca'} onMouseLeave={e => e.target.style.background = '#fee2e2'}>Logoutnull
                    null
                null

                null
                    {/* ---- DASHBOARD VIEW ---- */}
                    {view === 'dashboard' && (
                        isLoadingData ? null : (
                            null
                                null
                                    nullWelcome back, {userData.name}!null
                                    nullHere's an overview of your property improvement journeynull
                                null

                                {/* Property Card */}
                                {activeProperty ? (
                                    null
                                        {/* Property Card */}
                                        null
                                            null
                                                null
                                                    nullYOUR PROPERTYnull
                                                    null{activeProperty.type?.replace('Property: ', '') || 'Residential'}null
                                                    null{activeProperty.customerAddress || 'Location details'}null
                                                null
                                                null
                                                    nullCurrent Market Valuenull
                                                    null
                                                        {activeProperty.parsedDetails?.marketValue
                                                            ? `â‚¹${Number(activeProperty.parsedDetails.marketValue).toLocaleString('en-IN')}`
                                                            : 'Pending Review'}
                                                    null
                                                null
                                            null
                                            null
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
                                                    null
                                                        null{k}null
                                                        null{v}null
                                                    null
                                                ))}
                                            null

                                        null

                                        null
                                            null
                                        null


                                        {/* Metric Cards */}
                                        null
                                            {[
                                                { label: 'Potential Value Increase', value: `+â‚¹${(displayValueIncrease / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'With all recommendations' : 'Initial AI Projection', color: '#3b82f6', icon: null },
                                                { label: 'Total Investment', value: `â‚¹${(displayInvestment / 100000).toFixed(2)}L`, sub: activeRecsCount > 0 ? 'Estimated renovation cost' : 'Initial AI Estimate', color: '#f59e0b', icon: null },
                                                { label: 'Active Recommendations', value: displayRecsCount, sub: activeRecsCount > 0 ? 'Personalized for you' : 'Projected for your property', color: '#10b981', icon: null },
                                            ].map((m, i) => (
                                                null
                                                    null
                                                        null{m.icon}null
                                                        null{m.label}null
                                                    null
                                                    null{m.value}null
                                                    null{m.sub}null
                                                null
                                            ))}
                                        null

                                        {/* Chart + Quick Actions */}
                                        null
                                            null
                                                null
                                                    Projected Value Growth
                                                    nullBased on Improvementsnull
                                                null
                                                null
                                                    null
                                                null
                                            null
                                            null
                                                null
                                                    nullQuick Actionsnull
                                                    {[
                                                        { icon: null, title: 'New Estimate', sub: 'Calculate interior costs', action: () => setView('new-estimator'), primary: true },
                                                        { icon: null, title: 'View Estimates', sub: 'See saved estimates', action: () => setView('estimator') },
                                                        { icon: null, title: 'EMI Calculator', sub: 'Plan your renovation loan', action: () => setView('emi') },
                                                        { icon: null, title: 'Refer & Earn', sub: 'Invite friends, earn rewards', action: () => setView('referral') },
                                                    ].map((a, i) => (

                                                        null { if (!a.primary) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#fff8f4' }; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { if (!a.primary) { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.background = '#ffffff' }; e.currentTarget.style.transform = 'translateY(0)' }}>
                                                            null{a.icon}null
                                                            nullnull{a.title}nullnull{a.sub}nullnull
                                                        null
                                                    ))}
                                                null
                                            null
                                        null

                                        {/* AI Recommendations */}
                                        null
                                            null
                                                null
                                                    nullTop Recommendationsnull
                                                    null
                                                        âœ¨ AI-Optimized for {activeProperty?.customerAddress?.split(',').pop().trim() || 'your property'}
                                                    null
                                                null
                                                {dynamicRecs.length > 0 && null setShowAllRecs(!showAllRecs)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>{showAllRecs ? 'Show Less' : 'View All'}null}
                                            null

                                            {dynamicRecs.length > 0 ? (
                                                null
                                                    {(showAllRecs ? dynamicRecs : dynamicRecs.slice(0, 2)).map((rec, i) => (
                                                        null
                                                            null
                                                                nullnull{rec.title}nullnull{rec.desc}nullnull
                                                                null
                                                                    {rec.priority === 'high' ? 'High' : 'Medium'} Priority
                                                                null
                                                            null
                                                            null
                                                                {[
                                                                    ['Est. Cost', rec.cost, 'var(--text)'],
                                                                    ['Value Increase', rec.value, '#10b981'],
                                                                    ['ROI', rec.roi, '#3b82f6'],
                                                                    ['Property Impact', rec.impact, '#8b5cf6']
                                                                ].map(([k, v, c]) => (
                                                                    null
                                                                        null{k}null
                                                                        null{v}null
                                                                    null
                                                                ))}
                                                            null
                                                            null
                                                                null navigate(rec.link)} className="button-press" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(230,126,34,0.2)' }}>Get Detailed Plannull
                                                                null saveIdea(rec)} className="button-press" style={{ flex: 1, padding: '10px', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save for Laternull
                                                            null
                                                        null
                                                    ))}
                                                null
                                            ) : (
                                                null
                                                    nullnullnull
                                                    nullExpert Analysis in Progressnull
                                                    null
                                                        Our experts are reviewing your property details. Personalized recommendations will appear here shortly.
                                                    null
                                                null
                                            )}
                                        null
                                    null
                                ) : (
                                    null
                                        nullnullnull
                                        nullMaximize Your Property Potentialnull
                                        null
                                            Unlock personalized renovation recommendations, market value projections, and expert insights. Submit your property details to get started.
                                        null
                                        null setView('submit')} className="button-press" style={{ padding: '18px 48px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(230,126,34,0.3)', transition: '0.3s' }}>
                                            Submit Property Details
                                        null
                                        null
                                            {[
                                                { icon: 'ðŸ“ˆ', text: 'Value Tracking' },
                                                { icon: 'ðŸŽ¨', text: 'Expert Design' },
                                                { icon: 'ðŸ’°', text: 'ROI Analysis' }
                                            ].map((item, i) => (
                                                null
                                                    null{item.icon}null
                                                    {item.text}
                                                null
                                            ))}
                                        null
                                    null
                                )}
                            null
                        )
                    )}

                    {/* ---- ESTIMATOR VIEW ---- */}
                    {view === 'estimator' && (
                        null
                            null
                                nullnullMy EstimatesnullnullView and manage your interior cost estimatesnullnull
                                null setView('new-estimator')} className="btn-submit button-press animate-pulseGlow" style={{ width: 'auto', padding: '12px 24px' }}>+ New Estimatenull
                            null
                            {estimates.length === 0 ? (
                                null
                                    nullðŸ“‹null
                                    nullNo Estimates Yetnull
                                    nullStart creating your first interior cost estimatenull
                                    null setView('new-estimator')} className="btn-submit button-press" style={{ width: 'auto', padding: '12px 32px' }}>Get Startednull
                                null
                            ) : (
                                null
                                    {estimates.map((est, i) => (
                                        null
                                            null setDeleteConfirm(est)}
                                                title="Delete estimate"
                                                style={{ position: 'absolute', top: '16px', right: '16px', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#dc2626', transition: '0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                                            >
                                                null
                                            null
                                            null{est.type}null
                                            null{est.date}null
                                            nullâ‚¹{est.cost?.toLocaleString('en-IN')}null
                                            null{est.package}null
                                        null
                                    ))}
                                null
                            )}
                        null
                    )}

                    {/* ---- DELETE CONFIRM MODAL ---- */}
                    {deleteConfirm && (
                        null
                            null
                                null
                                    nullnullnullnullnullnullnull
                                null
                                nullDelete Estimate?null
                                nullYou are about to permanently delete:null
                                null{deleteConfirm.type}null
                                nullThis action cannot be undone.null
                                null
                                    null setDeleteConfirm(null)}
                                        className="button-press"
                                        style={{ flex: 1, padding: '14px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: '#475569', transition: '0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >Cancelnull
                                    null {
                                            setIsDeleting(true)
                                            // Optimistic update â€” remove immediately
                                            setEstimates(prev => prev.filter(e => e.id !== deleteConfirm.id))
                                            setDeleteConfirm(null)
                                            try {
                                                await deleteEstimation(deleteConfirm.id, userEmail)
                                                toast.success('Estimate deleted successfully')
                                            } catch (err) {
                                                // Rollback not easy here, just show error
                                                toast.error('Failed to delete â€” please refresh')
                                            } finally {
                                                setIsDeleting(false)
                                            }
                                        }}
                                        className="button-press"
                                        style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: 'white', boxShadow: '0 8px 20px rgba(220,38,38,0.3)', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >{isDeleting ? null : null} Yes, Deletenull
                                null
                            null
                        null
                    )}

                    {/* ---- NEW ESTIMATOR ---- */}
                    {view === 'new-estimator' && (
                        null
                            nullInterior Price Estimatornull
                            nullGet instant, accurate cost estimates for your dream interior.null
                            null
                                {[
                                    { icon: 'ðŸ ', title: 'Full Home', badge: 'Most Popular', sub: 'Complete interior for all rooms', features: ['All Rooms', 'Detailed Breakdown', 'Best Value'], link: '/full-home-estimator' },
                                    { icon: 'ðŸ³', title: 'Kitchen', badge: 'Kitchen Special', sub: 'Transform your cooking space', features: ['Modular Options', 'Appliance Cost', 'Quick Setup'], link: '/kitchen-estimator' },
                                    { icon: 'ðŸšª', title: 'Wardrobe', badge: 'Customizable', sub: 'Custom wardrobe solutions', features: ['Custom Sizes', 'Material Choice', 'Smart Storage'], link: '/wardrobe-estimator' },
                                ].map((c, i) => (
                                    null
                                        null{c.badge}null
                                        null{c.icon}null
                                        null{c.title}null
                                        null{c.sub}null
                                        null
                                            {c.features.map(f => nullâœ“ {f}null)}
                                        null
                                        null navigate(c.link)} className="btn-submit button-press">Calculate Now â†’null
                                    null
                                ))}
                            null
                        null
                    )}

                    {/* ---- RECOMMENDATIONS (Admin Responses) ---- */}
                    {view === 'recommendations' && (() => {
                        const myRequests = estimates.filter(r => r.responded)
                        return (
                            null
                                null
                                    nullAdmin Recommendationsnull
                                    nullQuotes and advice sent by our experts for your requestsnull
                                null

                                {myRequests.length === 0 ? (
                                    null
                                        nullðŸ“¬null
                                        nullNo Recommendations Yetnull
                                        nullOur experts will review your submitted estimates and send personalised quotes here.null
                                        null setView('new-estimator')} className="btn-submit button-press" style={{ width: 'auto', padding: '12px 28px' }}>Submit an Estimate â†’null
                                    null
                                ) : (
                                    null
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
                                                null
                                                    {/* Header */}
                                                    null
                                                        null
                                                            null
                                                                {req.type?.includes('Kitchen') ? 'ðŸ³' : req.type?.includes('Wardrobe') ? 'ðŸ‘”' : 'ðŸ '}
                                                            null
                                                            null
                                                                null{req.type}null
                                                                nullRequest {req.id} Â· {isResponded ? `Quote received on ${res.responseDate}` : 'Processing by our experts'}null
                                                            null
                                                        null
                                                        null
                                                            {isResponded ? 'âœ“ Quote Received' : 'â³ Processing'}
                                                        null
                                                    null

                                                    {/* User Submitted Photos - Preview */}
                                                    {req.propertyPhotos && req.propertyPhotos.length > 0 && (
                                                        null
                                                            nullðŸ—ï¸ Your Property Photos ({req.propertyPhotos.length})null
                                                            null
                                                                {req.propertyPhotos.map((img, idx) => (
                                                                    null setLightbox({ images: req.propertyPhotos, index: idx })}>
                                                                        null
                                                                    null
                                                                ))}
                                                            null
                                                        null
                                                    )}

                                                    {isResponded ? (
                                                        null
                                                            {/* Quote Metrics */}
                                                            null
                                                                {[
                                                                    { label: 'Expert Quote', value: `â‚¹${Number(res.quote || 0).toLocaleString('en-IN')}`, color: 'var(--primary)', bg: '#fff3e0', icon: 'ðŸ’°' },
                                                                    { label: 'Timeline', value: res.timeline, color: '#3b82f6', bg: '#eff6ff', icon: 'ðŸ“…' },
                                                                    { label: 'Warranty', value: res.warranty, color: '#10b981', bg: '#ecfdf5', icon: 'ðŸ›¡ï¸' },
                                                                ].map(({ label, value, color, bg, icon }) => (
                                                                    null
                                                                        null{icon}null
                                                                        null{label}null
                                                                        null{value}null
                                                                    null
                                                                ))}
                                                            null

                                                            {res.description && (
                                                                null
                                                                    nullExpert Breakdownnull
                                                                    null{res.description}null
                                                                null
                                                            )}

                                                            {res.images && res.images.length > 0 && (
                                                                null
                                                                    nullðŸ–¼ï¸ Design References ({res.images.length})null
                                                                    null
                                                                        {res.images.map((img, idx) => (
                                                                            null setLightbox({ images: res.images, index: idx })}
                                                                                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '2px solid #f0ece6', transition: '0.3s' }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,126,34,0.25)'; e.currentTarget.style.borderColor = '#e67e22' }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#f0ece6' }}
                                                                            >
                                                                                null
                                                                                null
                                                                                    null{img.name || `Image ${idx + 1}`}null
                                                                                    nullðŸ”null
                                                                                null
                                                                            null
                                                                        ))}
                                                                    null
                                                                null
                                                            )}
                                                        null
                                                    ) : (
                                                        null
                                                            nullðŸ‘·null
                                                            nullExpert Analysis in Progressnull
                                                            null
                                                                Our experts are currently reviewing your request details and creating your personalized quote.
                                                                You can click the button below to directly chat with the expert.
                                                            null
                                                        null
                                                    )}

                                                    {/* Action */}
                                                    null
                                                        null setChatReq({ id: req.id, type: req.type })}
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
                                                            ðŸ’¬ Chat &amp; Negotiate
                                                        null
                                                        {isResponded && (
                                                            null
                                                                null { navigator.clipboard?.writeText(`Quote: â‚¹${Number(res.quote || 0).toLocaleString('en-IN')} | Timeline: ${res.timeline} | Warranty: ${res.warranty}`); alert('Quote details copied!') }}
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
                                                                    ðŸ“‹ Copy Quote
                                                                null
                                                                null {
                                                                        const printWindow = window.open('', '_blank');
                                                                        const content = `
                                                                        null
                                                                            null
                                                                                nullBharatHome Value - Quote ${req.id}null
                                                                                null
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
                                                                                null
                                                                            null
                                                                            null
                                                                                null
                                                                                    nullBharatHomenullValuenullnull
                                                                                    null
                                                                                        nullOfficial Project Quotenull
                                                                                        nullDate: ${new Date().toLocaleDateString()}null
                                                                                    null
                                                                                null
                                                                                null
                                                                                    null${req.type}null
                                                                                    nullnullQuote ID:null ${req.id}null
                                                                                    nullnullCustomer:null ${req.customerName}null
                                                                                    nullnullProperty:null ${req.customerAddress}null
                                                                                null
                                                                                null
                                                                                    nullnullExpert Quotenullnullâ‚¹${Number(res.quote || 0).toLocaleString('en-IN')}nullnull
                                                                                    nullnullTimelinenullnull${res.timeline}nullnull
                                                                                    nullnullWarrantynullnull${res.warranty}nullnull
                                                                                null
                                                                                null
                                                                                    nullProject Description & Scopenull
                                                                                    null${res.description.replace(/\n/g, 'null')}null
                                                                                null
                                                                                null
                                                                                    nullThis is a computer-generated quote based on your requirements and expert analysis.null
                                                                                    nullBharatHome Value - Professional Interior Solutionsnull
                                                                                null
                                                                                nullwindow.print();null
                                                                            null
                                                                        null
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
                                                                    ðŸ“¥ Download PDF
                                                                null
                                                            null
                                                        )}
                                                    null
                                                null
                                            )
                                        })}
                                    null
                                )}
                            null
                        )
                    })()}

                    {/* ---- SAVED IDEAS ---- */}
                    {view === 'saved' && (
                        null
                            nullYour Saved Ideasnull
                            null{savedIdeas.length} saved ideasnull
                            {savedIdeas.length === 0 ? (
                                null
                                    nullðŸ”–null
                                    nullNo Saved Ideas Yetnull
                                    nullClick "Save for Later" on any recommendationnull
                                null
                            ) : (
                                null
                                    {savedIdeas.map((idea, i) => (
                                        null
                                            null
                                                null{idea.title}null
                                                null{idea.desc}null
                                                null
                                                    nullCost: null{idea.cost}nullnull
                                                    nullROI: null{idea.roi}nullnull
                                                    nullImpact: null{idea.impact}nullnull
                                                null
                                            null
                                            null removeIdea(idea.title)} className="button-press" style={{ padding: '8px 16px', border: '2px solid #fee2e2', borderRadius: '8px', background: '#fff', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Removenull
                                        null
                                    ))}
                                null
                            )}
                        null
                    )}


                    {/* ---- REFERRAL SYSTEM ---- */}
                    {view === 'referral' && (
                        null
                            null
                                nullðŸŽnull
                                nullRefer a Friend, Get â‚¹2,000null
                                null
                                    Help your friends transform their homes. When they complete their first project with us, you both get â‚¹2,000 in your BharatHome wallet.
                                null
                                null
                                    nullBHV-{userData.name?.split(' ')[0].toUpperCase()}77null
                                    null { navigator.clipboard.writeText(`BHV-${userData.name?.split(' ')[0].toUpperCase()}77`); alert('Referral code copied!') }} style={{ background: 'white', color: '#1e293b', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Copy Codenull
                                null
                            null

                            null
                                {[
                                    { label: 'Total Referrals', value: '0', icon: 'ðŸ‘¥' },
                                    { label: 'Pending Rewards', value: 'â‚¹0', icon: 'â³' },
                                    { label: 'Total Earned', value: 'â‚¹0', icon: 'ðŸ’°' }
                                ].map((m, i) => (
                                    null
                                        null{m.icon}null
                                        null{m.label}null
                                        null{m.value}null
                                    null
                                ))}
                            null
                        null
                    )}


                    {/* ---- SUBMIT PROPERTY ---- */}
                    {view === 'submit' && (

                        null
                            nullSubmit New Propertynull
                            nullTell us about your property to get personalized recommendationsnull
                            null
                                null {
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
                                    null
                                        nullnullFirst Namenullnullnull
                                        nullnullLast Namenullnullnull
                                        nullnullEmailnullnullnull
                                        nullnullContact Numbernullnullnull
                                        nullnullAddressnullnullnull
                                        nullnullCitynullnullnull
                                    null
                                    null
                                        nullProperty Typenull
                                        null
                                            nullSelect typenull
                                            {['Residential', 'Commercial', 'Apartment', 'Villa', 'Bungalow', 'Townhouse'].map(t => null{t}null)}
                                        null
                                    null
                                    null
                                        nullnullProperty Size (Sq Ft)nullnullnull
                                        nullnullYear Builtnullnullnull
                                        nullnullMarket Value (â‚¹)nullnullnull
                                        nullnullImprovement Budget (â‚¹)nullnullnull
                                    null
                                    null
                                        null
                                            nullProperty & Construction Photosnull
                                            nullMax 5 (Optional)null
                                        null

                                        null fileInputRef.current?.click()}
                                            style={{
                                                border: '2px dashed #e9ecef', borderRadius: '16px', padding: '32px 20px',
                                                textAlign: 'center', cursor: 'pointer', transition: '0.3s', background: '#fdf6ee',
                                                marginBottom: '16px'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'white' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.background = '#fdf6ee' }}
                                        >
                                            nullðŸ“¸null
                                            nullClick to upload photos of your propertynull
                                            nullDrag and drop or select files (PNG, JPG)null
                                            null
                                        null
                                        {propertyPhotos.length > 0 && (
                                            null
                                                {propertyPhotos.map((img, i) => (
                                                    null
                                                        null
                                                        null { e.stopPropagation(); removePropertyPhoto(i) }}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >Ã—null
                                                    null
                                                ))}
                                            null
                                        )}
                                    null
                                    null
                                        nullAdditional Notesnull
                                        null
                                    null
                                    null
                                        {isSubmitting ? null : null}
                                        {isSubmitting ? 'Submitting Property...' : 'Submit Property for Review â†’'}
                                    null
                                null
                            null
                        null
                    )}

                    {/* ---- CONTRACTOR DIRECTORY ---- */}
                    {view === 'contractors' && (
                        null
                            null
                                null
                                    nullVerified Contractor Directorynull
                                    nullHand-picked partners vetted for quality, reliability, and fair pricing.null
                                null
                                null
                                    nullnullnull
                                    null setContractorSearch(e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '2px solid #e9ecef', fontSize: '14px', outline: 'none', transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                null
                            null

                            {/* Filter Tabs */}
                            null
                                {['All', 'Interior', 'Renovation', 'Design', 'Garden'].map(t => (
                                    null setContractorFilter(t)}
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
                                    null
                                ))}
                            null

                            null
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
                                    null
                                        null
                                            null
                                            nullnull
                                            {c.verified && (
                                                null
                                                    nullâœ“null VERIFIED
                                                null
                                            )}
                                            null
                                                null{c.category}null
                                            null
                                        null
                                        null
                                            null
                                                null{c.name}null
                                                null
                                                    nullâ˜…null
                                                    null{c.rating}null
                                                null
                                            null
                                            null
                                                nullðŸ“null {c.location}
                                            null
                                            null
                                                {c.expertise.map(e => (
                                                    null{e}null
                                                ))}
                                            null

                                            null
                                                null setSelectedContractor(c)}
                                                    className="button-press"
                                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#f8fafc', color: '#1e293b', border: '2px solid #e2e8f0', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: '0.3s' }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                                >
                                                    View Profile
                                                null
                                                null {
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
                                                null
                                            null
                                        null
                                    null
                                ))}
                            null

                            {/* Contractor Detail Modal */}
                            {selectedContractor && (
                                null { if (e.target === e.currentTarget) setSelectedContractor(null) }}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
                                >
                                    null
                                        null setSelectedContractor(null)}
                                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'white', border: 'none', color: '#1e293b', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        >
                                            Ã—
                                        null

                                        null
                                            null
                                            nullnull
                                            null
                                                null{selectedContractor.name}null
                                                null
                                                    null{selectedContractor.category}null
                                                    nullðŸ“ {selectedContractor.location}null
                                                    nullâ˜… {selectedContractor.rating} ({selectedContractor.reviews} reviews)null
                                                null
                                            null
                                        null

                                        null
                                            null
                                                null
                                                    nullAbout the Expertnull
                                                    null{selectedContractor.about}null

                                                    nullCore Expertisenull
                                                    null
                                                        {selectedContractor.expertise.map(e => (
                                                            null{e}null
                                                        ))}
                                                    null
                                                null
                                                null
                                                    nullBook Consultationnull
                                                    nullGet a detailed site visit and customized estimate from {selectedContractor.name}.null

                                                    null
                                                        null
                                                            nullðŸŽnull
                                                            null
                                                                nullFirst Call Freenull
                                                                nullBharatHome User Exclusivenull
                                                            null
                                                        null

                                                        null {
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
                                                        null
                                                        nullOur experts usually respond within 4 business hours.null
                                                    null
                                                null
                                            null
                                        null
                                    null
                                null
                            )}
                        null
                    )}

                    {/* ---- EMI CALCULATOR VIEW ---- */}
                    {view === 'emi' && (
                        null
                    )}
                null
            null

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                null { logout() }}
                    onCancel={() => setShowExitConfirm(false)}
                />
            )}

            {/* Profile Modal */}
            {showProfile && (
                null setShowProfile(false)}
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
                null setChatReq(null)}
                />
            )}

            {/* Image Lightbox */}
            {lightbox && (
                null
            )}

            {/* Review Modal */}
            {showReviewModal && (
                null setShowReviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
                    null e.stopPropagation()} className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                        nullâ­null
                        nullRate Your Experiencenull
                        nullHow would you rate the service and quality of your recent project?null

                        null
                            {[1, 2, 3, 4, 5].map(s => (
                                null setReviewRating(s)} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', transition: '0.2s', transform: reviewRating >= s ? 'scale(1.2)' : 'scale(1)', opacity: reviewRating >= s ? 1 : 0.3 }}>â­null
                            ))}
                        null

                        null setReviewText(e.target.value)}
                            placeholder="Share your thoughts on the quality of work..."
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '15px', minHeight: '120px', marginBottom: '32px', outline: 'none' }}
                        />

                        null
                            null setShowReviewModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #e9ecef', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Skipnull
                            null { alert('Thank you for your feedback!'); setShowReviewModal(false) }} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Submit Reviewnull
                        null
                    null
                null
            )}
        null
    )
}


