import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmiCalculator() {
    const navigate = useNavigate()
    const [amount, setAmount] = useState(500000)
    const [rate, setRate] = useState(10.5)
    const [tenure, setTenure] = useState(12)
    const [emi, setEmi] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)

    useEffect(() => {
        const r = rate / 12 / 100
        const n = tenure
        const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        setEmi(Math.round(emiVal))
        setTotalInterest(Math.round(emiVal * n - amount))
    }, [amount, rate, tenure])

    const format = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <header style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', top: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Renovation EMI Calculator</h1>
                <p style={{ opacity: 0.8, marginTop: '8px' }}>Plan your finances with easy monthly installments</p>
            </header>

            <div style={{ maxWidth: '1000px', margin: '-40px auto 40px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Inputs */}
                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label style={{ fontWeight: 700, color: '#1e293b' }}>Loan Amount</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '18px' }}>{format(amount)}</span>
                        </div>
                        <input type="range" min="50000" max="5000000" step="50000" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}><span>₹50K</span><span>₹50L</span></div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label style={{ fontWeight: 700, color: '#1e293b' }}>Interest Rate (p.a)</label>
                            <span style={{ color: '#e67e22', fontWeight: 800, fontSize: '18px' }}>{rate}%</span>
                        </div>
                        <input type="range" min="8" max="24" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', accentColor: '#e67e22', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}><span>8%</span><span>24%</span></div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '16px' }}>Loan Tenure (Months)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            {[6, 12, 24, 36, 48, 60].map(t => (
                                <button key={t} onClick={() => setTenure(t)} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${tenure === t ? '#e67e22' : '#f1f5f9'}`, background: tenure === t ? '#fff7ed' : 'white', color: tenure === t ? '#e67e22' : '#1e293b', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>{t}M</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ opacity: 0.7, fontSize: '14px', textAlign: 'center' }}>Your Monthly EMI</p>
                    <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#e67e22', textAlign: 'center', margin: '12px 0' }}>{format(emi)}</h2>
                    
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '32px 0' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ opacity: 0.7 }}>Principal Amount</span>
                        <span style={{ fontWeight: 700 }}>{format(amount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ opacity: 0.7 }}>Total Interest</span>
                        <span style={{ fontWeight: 700 }}>{format(totalInterest)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginTop: '16px', borderTop: '2px dashed rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                        <span style={{ fontWeight: 800 }}>Total Payable</span>
                        <span style={{ fontWeight: 800, color: '#e67e22' }}>{format(amount + totalInterest)}</span>
                    </div>

                    <button style={{ marginTop: '40px', width: '100%', padding: '16px', borderRadius: '16px', background: '#e67e22', color: 'white', border: 'none', fontWeight: 800, fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(230,126,34,0.3)' }}>Apply for Instant Loan →</button>
                    <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', opacity: 0.5 }}>*Indicative rates subject to credit approval by partner banks.</p>
                </div>
            </div>
        </div>
    )
}
