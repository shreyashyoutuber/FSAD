import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONTRACTORS = [
    { id: 1, name: 'Apex Interiors', rating: 4.8, reviews: 124, expertise: ['Modular Kitchen', 'Wardrobes'], location: 'Mumbai, MH', image: 'https://images.unsplash.com/photo-1556911223-e250e334621c?w=400&q=80', verified: true },
    { id: 2, name: 'Royal Spaces', rating: 4.9, reviews: 89, expertise: ['Full Home', 'Luxury Design'], location: 'Bangalore, KA', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', verified: true },
    { id: 3, name: 'Modern Living', rating: 4.7, reviews: 210, expertise: ['Flooring', 'Painting'], location: 'Delhi, NCR', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80', verified: false },
    { id: 4, name: 'Elite Woodworks', rating: 4.6, reviews: 56, expertise: ['Wardrobes', 'Furniture'], location: 'Pune, MH', image: 'https://images.unsplash.com/photo-1595428774223-ef0c06b8807a?w=400&q=80', verified: true },
]

export default function ContractorDirectory() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← Back
                    </button>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Contractor <span style={{ color: '#e67e22' }}>Directory</span></h1>
                    <div style={{ width: '80px' }}></div>
                </div>

                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search by expertise or location..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '16px 20px 16px 56px', borderRadius: '16px', border: '2px solid #e9ecef', fontSize: '16px', outline: 'none', transition: '0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#e67e22'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {CONTRACTORS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))).map(c => (
                        <div key={c.id} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {c.verified && <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>VERIFIED</span>}
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{c.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff7ed', padding: '4px 8px', borderRadius: '8px' }}>
                                        <span style={{ color: '#e67e22', fontWeight: 800 }}>★</span>
                                        <span style={{ fontWeight: 800, fontSize: '14px' }}>{c.rating}</span>
                                    </div>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>📍 {c.location}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                    {c.expertise.map(e => <span key={e} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{e}</span>)}
                                </div>
                                <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(230,126,34,0.2)' }}>Get Free Consultation</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
