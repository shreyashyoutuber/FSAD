import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmiCalculator() {
    const navigate = useNavigate()
    const [amount, setAmount] = useState(500000)
    const [rate, setRate] = useState(10.5)
    const [tenure, setTenure] = useState(12)
    const [customTenure, setCustomTenure] = useState('')
    const [useCustomTenure, setUseCustomTenure] = useState(false)
    const [emi, setEmi] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)

    const activeTenure = useCustomTenure ? (parseInt(customTenure) || 0) : tenure

    useEffect(() => {
        const r = rate / 12 / 100
        const n = activeTenure
        if (n <= 0 || r <= 0) {
            setEmi(0)
            setTotalInterest(0)
            return
        }
        const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        setEmi(Math.round(emiVal))
        setTotalInterest(Math.round(emiVal * n - amount))
    }, [amount, rate, activeTenure])

    const format = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

    const PRESET_TENURES = [6, 12, 24, 36, 48, 60, 84, 120]

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf6ec 100%)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '48px 20px 60px', color: 'white', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', left: '24px', top: '24px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', backdropFilter: 'blur(8px)', transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >← Back</button>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧮</div>
                <h1 style={{ fontSize: '34px', fontWeight: 800, marginBottom: '8px' }}>Renovation EMI Calculator</h1>
                <p style={{ opacity: 0.75, fontSize: '16px' }}>Plan your finances with easy monthly installments</p>
            </header>

            {/* Cards */}
            <div style={{ maxWidth: '1080px', margin: '-40px auto 60px', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>

                {/* ── Input Card ── */}
                <div style={{ background: 'white', padding: '40px', borderRadius: '28px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)' }}>

                    {/* Loan Amount */}
                    <div style={{ marginBottom: '36px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Loan Amount</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '20px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>{format(amount)}</span>
                        </div>
                        <input type="range" min="50000" max="5000000" step="50000" value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer', height: '6px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>₹50K</span><span>₹50L</span>
                        </div>
                    </div>

                    {/* Interest Rate — starts from 0% */}
                    <div style={{ marginBottom: '36px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Interest Rate (p.a)</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '20px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>{rate}%</span>
                        </div>
                        <input type="range" min="0" max="30" step="0.5" value={rate}
                            onChange={e => setRate(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer', height: '6px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>0%</span>
                            <span style={{ color: '#10b981' }}>Typical: 8–14%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    {/* Loan Tenure — slider + preset chips + custom input */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Loan Tenure (Months)</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '20px', background: '#fff7ed', padding: '4px 14px', borderRadius: '10px' }}>
                                {activeTenure}M
                            </span>
                        </div>

                        {/* Slider */}
                        <input type="range" min="1" max="360" step="1" value={useCustomTenure ? (parseInt(customTenure) || 1) : tenure}
                            onChange={e => {
                                setUseCustomTenure(false)
                                setCustomTenure('')
                                setTenure(Number(e.target.value))
                            }}
                            style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer', height: '6px', marginBottom: '12px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            <span>1M</span><span>360M (30 yrs)</span>
                        </div>

                        {/* Quick presets */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                            {PRESET_TENURES.map(t => (
                                <button key={t}
                                    onClick={() => { setTenure(t); setUseCustomTenure(false); setCustomTenure('') }}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.2s',
                                        border: `2px solid ${!useCustomTenure && tenure === t ? '#e67e22' : '#f1f5f9'}`,
                                        background: !useCustomTenure && tenure === t ? '#fff7ed' : 'white',
                                        color: !useCustomTenure && tenure === t ? '#e67e22' : '#64748b',
                                    }}
                                >{t}M</button>
                            ))}
                        </div>

                        {/* Custom input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', borderRadius: '14px', padding: '14px 18px', border: useCustomTenure ? '2px solid #e67e22' : '2px solid #f1f5f9', transition: '0.2s' }}>
                            <span style={{ fontSize: '18px' }}>✏️</span>
                            <input
                                type="number"
                                placeholder="Enter custom months (e.g. 18)"
                                value={customTenure}
                                min="1"
                                max="600"
                                onChange={e => {
                                    setCustomTenure(e.target.value)
                                    setUseCustomTenure(true)
                                }}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', fontWeight: 700, color: '#1e293b', width: '100%' }}
                            />
                            <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap', fontWeight: 600 }}>months</span>
                        </div>
                    </div>
                </div>

                {/* ── Result Card ── */}
                <div style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)', padding: '44px', borderRadius: '28px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 24px 60px rgba(15,23,42,0.3)' }}>
                    <p style={{ opacity: 0.65, fontSize: '14px', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>Your Monthly EMI</p>
                    <h2 style={{ fontSize: '52px', fontWeight: 800, color: '#e67e22', textAlign: 'center', margin: '14px 0 28px', textShadow: '0 4px 20px rgba(230,126,34,0.4)' }}>
                        {emi > 0 ? format(emi) : '—'}
                    </h2>

                    {/* Progress bar */}
                    {emi > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', opacity: 0.6 }}>
                                <span>Principal</span><span>Interest</span>
                            </div>
                            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${Math.round(amount / (amount + totalInterest) * 100)}%`, background: 'linear-gradient(90deg, #e67e22, #f39c12)', borderRadius: '10px 0 0 10px', transition: '0.5s' }} />
                                <div style={{ flex: 1, background: 'rgba(255,100,100,0.4)', borderRadius: '0 10px 10px 0' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', opacity: 0.6 }}>
                                <span>{Math.round(amount / (amount + totalInterest) * 100)}%</span>
                                <span>{Math.round(totalInterest / (amount + totalInterest) * 100)}%</span>
                            </div>
                        </div>
                    )}

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0 28px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                        <span style={{ opacity: 0.65 }}>Principal Amount</span>
                        <span style={{ fontWeight: 700 }}>{format(amount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                        <span style={{ opacity: 0.65 }}>Total Interest</span>
                        <span style={{ fontWeight: 700, color: '#f87171' }}>{format(totalInterest)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', borderTop: '2px dashed rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '4px' }}>
                        <span style={{ fontWeight: 800 }}>Total Payable</span>
                        <span style={{ fontWeight: 800, color: '#e67e22' }}>{format(amount + totalInterest)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '10px', opacity: 0.55 }}>
                        <span>Over {activeTenure} months</span>
                        <span>{rate}% p.a.</span>
                    </div>

                    <button
                        style={{ marginTop: '36px', width: '100%', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 800, fontSize: '16px', cursor: 'pointer', boxShadow: '0 12px 30px rgba(230,126,34,0.4)', transition: '0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Apply for Instant Loan →
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', opacity: 0.4 }}>*Indicative rates subject to credit approval by partner banks.</p>
                </div>
            </div>
        </div>
    )
}
