import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Outside component to prevent re-mount on every render (fixes typing focus bug)
function Section({ title, icon, children }) {
    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1.5px solid #f5efe6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #fff3e0' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#e67e22,#d35400)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>{title}</h3>
            </div>
            {children}
        </div>
    )
}

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ minWidth: '130px', color: '#999', fontSize: '13px', fontWeight: 600, paddingTop: '2px' }}>{label}</span>
            <span style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 500 }}>{value}</span>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    background: '#fdf6ee',
    border: '2px solid #f0ece6',
    borderRadius: '10px',
    color: '#1a1a1a',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
    boxSizing: 'border-box',
}

const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '8px',
}

export default function AdminRespond() {
    const navigate = useNavigate()
    const [request, setRequest] = useState(null)
    const [quote, setQuote] = useState('')
    const [description, setDescription] = useState('')
    const [timeline, setTimeline] = useState('')
    const [warranty, setWarranty] = useState('')
    const [notes, setNotes] = useState('')
    const [images, setImages] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileRef = useRef(null)

    useEffect(() => {
        if (!localStorage.getItem('adminLoggedIn')) { navigate('/admin-login'); return }
        const requestId = localStorage.getItem('currentRequestId')
        const stored = localStorage.getItem('allAdminRequests')
        const allReqs = stored ? JSON.parse(stored) : []
        const req = allReqs.find(r => r.id === requestId)
        if (!req) { alert('Request not found'); navigate('/admin-dashboard'); return }
        setRequest(req)

        const responses = JSON.parse(localStorage.getItem('adminResponses') || '{}')
        if (responses[requestId]) {
            const r = responses[requestId]
            setQuote(r.quote || '')
            setDescription(r.description || '')
            setTimeline(r.timeline || '')
            setWarranty(r.warranty || '')
            setNotes(r.notes || '')
            setImages(r.images || [])
            setIsEditing(true)
        }
    }, [])

    const handleFiles = (files) => {
        if (images.length + files.length > 5) { alert('Max 5 images allowed'); return }
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) { alert('Only images allowed'); return }
            const reader = new FileReader()
            reader.onload = (e) => setImages(prev => [...prev, { name: file.name, data: e.target.result }])
            reader.readAsDataURL(file)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSaving(true)
        setTimeout(() => {
            const responses = JSON.parse(localStorage.getItem('adminResponses') || '{}')
            responses[request.id] = { quote, description, timeline, warranty, notes, images, requestId: request.id, responseDate: new Date().toISOString().split('T')[0] }
            localStorage.setItem('adminResponses', JSON.stringify(responses))

            const stored = localStorage.getItem('allAdminRequests')
            const allReqs = stored ? JSON.parse(stored) : []
            const updated = allReqs.map(r => r.id === request.id ? { ...r, responded: true, status: 'responded' } : r)
            localStorage.setItem('allAdminRequests', JSON.stringify(updated))
            setSaving(false)
            navigate('/admin-dashboard')
        }, 800)
    }

    const focusIn = (e) => { e.target.style.borderColor = '#e67e22'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(230,126,34,0.12)' }
    const focusOut = (e) => { e.target.style.borderColor = '#f0ece6'; e.target.style.background = '#fdf6ee'; e.target.style.boxShadow = 'none' }

    if (!request) return (
        <div style={{ minHeight: '100vh', background: '#fdf6ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#e67e22', fontSize: '20px', fontWeight: 700 }}>Loading request...</div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6ee', fontFamily: 'inherit' }}>

            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', boxShadow: '0 4px 20px rgba(230,126,34,0.35)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                    BharatHome <span style={{ color: '#ffe0b2' }}>Value</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
                        {isEditing ? 'EDIT RESPONSE' : 'NEW RESPONSE'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600 }}>{request.id}</span>
                </div>
                <button onClick={() => navigate(-1)} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: '0.3s' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.35)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}>
                    ← Back
                </button>
            </header>

            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Page title */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '6px' }}>
                        {isEditing ? '✏️ Edit Response' : '✉️ Respond to Request'}
                    </h1>
                    <p style={{ color: '#888', fontSize: '15px' }}>Fill in the quote details to send to the customer</p>
                </div>

                {/* Request Info */}
                <Section title="Request Details" icon="📋">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                        <InfoRow label="Customer" value={request.customerName} />
                        <InfoRow label="Email" value={request.customerEmail} />
                        <InfoRow label="Type" value={request.type} />
                        <InfoRow label="Date" value={request.dateSubmitted} />
                        <InfoRow label="Budget" value={request.budget} />
                    </div>
                    <InfoRow label="Description" value={request.description} />
                </Section>

                {/* Response Form */}
                <form onSubmit={handleSubmit}>
                    <Section title="Quote & Details" icon="💰">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Quote Amount (₹) *</label>
                                <input type="number" value={quote} onChange={e => setQuote(e.target.value)}
                                    placeholder="Enter total quote amount" required
                                    style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                            </div>
                            <div>
                                <label style={labelStyle}>Estimated Timeline *</label>
                                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)}
                                    placeholder="e.g. 30–45 working days" required
                                    style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={labelStyle}>Warranty / Guarantee *</label>
                            <input type="text" value={warranty} onChange={e => setWarranty(e.target.value)}
                                placeholder="e.g. 1 year warranty on all labor" required
                                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={labelStyle}>Detailed Description *</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)}
                                placeholder="Provide a full breakdown — materials, work scope, process, etc."
                                rows={6} required
                                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                                onFocus={focusIn} onBlur={focusOut} />
                        </div>
                    </Section>

                    {/* Image Upload */}
                    <Section title="Reference Images" icon="🖼️">
                        <p style={{ color: '#999', fontSize: '14px', marginBottom: '16px' }}>Upload design reference images (max 5)</p>
                        <div onClick={() => fileRef.current?.click()}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                            style={{ border: '2px dashed #ffcc80', borderRadius: '14px', padding: '36px', textAlign: 'center', cursor: 'pointer', color: '#bbb', fontSize: '15px', transition: '0.3s', background: '#fffbf5' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e67e22'; e.currentTarget.style.background = '#fff3e0' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffcc80'; e.currentTarget.style.background = '#fffbf5' }}>
                            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📁</div>
                            <p style={{ fontWeight: 600, color: '#888' }}>Drag & drop or click to browse</p>
                            <p style={{ fontSize: '13px', marginTop: '6px', color: '#bbb' }}>{5 - images.length} slots remaining · PNG, JPG, WEBP</p>
                            <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
                        </div>

                        {images.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
                                {images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', border: '2px solid #ffcc80' }}>
                                        <img src={img.data} alt="" style={{ width: '100px', height: '80px', objectFit: 'cover', display: 'block' }} />
                                        <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                            style={{ position: 'absolute', top: '4px', right: '4px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* Notes */}
                    <Section title="Internal Notes" icon="📝">
                        <label style={labelStyle}>Admin Notes (not shown to customer)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="Add follow-up reminders, internal notes, etc."
                            rows={4}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                            onFocus={focusIn} onBlur={focusOut} />
                    </Section>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="submit" disabled={saving}
                            style={{ flex: 1, padding: '16px', background: saving ? '#f0a57a' : 'linear-gradient(135deg, #e67e22, #d35400)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', transition: '0.3s', boxShadow: saving ? 'none' : '0 8px 24px rgba(230,126,34,0.4)' }}
                            onMouseEnter={e => { if (!saving) e.target.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                            {saving ? '⏳ Saving...' : isEditing ? '✏️ Update Response' : '✉️ Send Response to Customer'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin-dashboard')}
                            style={{ flex: 1, padding: '16px', background: 'white', border: '2px solid #e9ecef', borderRadius: '12px', color: '#555', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}
                            onMouseEnter={e => { e.target.style.borderColor = '#e67e22'; e.target.style.color = '#e67e22' }}
                            onMouseLeave={e => { e.target.style.borderColor = '#e9ecef'; e.target.style.color = '#555' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
