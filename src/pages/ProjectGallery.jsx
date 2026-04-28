import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROJECTS = [
    { id: 1, type: 'Kitchen', city: 'Mumbai', title: 'Modern Island Kitchen', desc: 'High-gloss acrylic finish with built-in appliances.', budget: '₹4.5L', duration: '18 Days', before: '/Photos/kitchen-before-1.png', after: '/Photos/kitchen-after-1.png' },
    { id: 2, type: 'Wardrobe', city: 'Bangalore', title: 'Master Bedroom Wardrobe', desc: 'Floor-to-ceiling sliding wardrobe with mirror panels.', budget: '₹2.2L', duration: '10 Days', before: '/Photos/wardrobe-before-1.png', after: '/Photos/wardrobe-after-1.png' },
    { id: 3, type: 'Full Home', city: 'Delhi', title: 'Contemporary 3BHK', desc: 'Complete end-to-end renovation with luxury finishes.', budget: '₹18L', duration: '60 Days', before: '/Photos/fullhome-before-1.png', after: '/Photos/fullhome-after-1.png' },
    { id: 4, type: 'Kitchen', city: 'Pune', title: 'Compact U-Shaped Kitchen', desc: 'Optimized storage for smaller spaces with matte finish.', budget: '₹2.8L', duration: '12 Days', before: '/Photos/kitchen-before-2.png', after: '/Photos/kitchen-after-2.png' },
    { id: 5, type: 'Wardrobe', city: 'Hyderabad', title: 'Walk-in Closet', desc: 'Premium walk-in wardrobe with profile lighting.', budget: '₹3.5L', duration: '15 Days', before: '/Photos/wardrobe-before-2.png', after: '/Photos/wardrobe-after-2.png' },
    { id: 6, type: 'Full Home', city: 'Chennai', title: 'Traditional 2BHK', desc: 'Indo-western fusion style for a warm, cozy home.', budget: '₹12L', duration: '45 Days', before: '/Photos/fullhome-before-2.png', after: '/Photos/fullhome-after-2.png' },
]

export default function ProjectGallery() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState('All')
    const [cityFilter, setCityFilter] = useState('All')
    const [hovered, setHovered] = useState(null)

    const filtered = PROJECTS.filter(p => (filter === 'All' || p.type === filter) && (cityFilter === 'All' || p.city === cityFilter))
    const types = ['All', 'Kitchen', 'Wardrobe', 'Full Home']
    const cities = ['All', ...new Set(PROJECTS.map(p => p.city))]

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Plus Jakarta Sans", sans-serif', paddingBottom: '60px' }}>
            <header style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', padding: '60px 20px', color: 'white', textAlign: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', top: '40px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>← Back</button>
                <h1 style={{ fontSize: '40px', fontWeight: 800 }}>Transformation Gallery</h1>
                <p style={{ opacity: 0.9, marginTop: '12px', fontSize: '18px' }}>Real homes. Real results. Instant inspiration.</p>
            </header>

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
                {/* Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '8px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        {types.map(t => (
                            <button key={t} onClick={() => setFilter(t)} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: filter === t ? '#e67e22' : 'transparent', color: filter === t ? 'white' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>{t}</button>
                        ))}
                    </div>
                    <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ padding: '10px 24px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#1e293b', cursor: 'pointer', outline: 'none' }}>
                        {cities.map(c => <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>)}
                    </select>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                    {filtered.map(p => (
                        <div key={p.id} 
                             onMouseEnter={() => setHovered(p.id)} 
                             onMouseLeave={() => setHovered(null)}
                             style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transition: '0.3s', transform: hovered === p.id ? 'translateY(-8px)' : 'none' }}>
                            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                <img src={hovered === p.id ? p.after : p.before} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} />
                                <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
                                    {hovered === p.id ? 'AFTER' : 'BEFORE'}
                                </div>
                                <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#e67e22', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
                                    {p.type}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{p.title}</h3>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>📍 {p.city}</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{p.desc}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                                    <div>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Budget</p>
                                        <p style={{ fontWeight: 800, color: '#1e293b' }}>{p.budget}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Duration</p>
                                        <p style={{ fontWeight: 800, color: '#1e293b' }}>{p.duration}</p>
                                    </div>
                                    <button onClick={() => navigate('/kitchen-estimator')} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Get Similar Quote</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
