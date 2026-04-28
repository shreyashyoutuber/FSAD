import { useState, useCallback } from 'react'

// ─── Toast Component ─────────────────────────────────────────────────────────
export function Toast({ toasts, removeToast }) {
    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: toast.type === 'success' ? '#f0fdf4'
                            : toast.type === 'error' ? '#fff1f2'
                            : toast.type === 'warning' ? '#fffbeb'
                            : '#f0f9ff',
                        border: `1px solid ${
                            toast.type === 'success' ? '#bbf7d0'
                            : toast.type === 'error' ? '#ffe4e6'
                            : toast.type === 'warning' ? '#fde68a'
                            : '#bae6fd'
                        }`,
                        borderRadius: '12px',
                        padding: '14px 18px',
                        minWidth: '300px',
                        maxWidth: '420px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                        pointerEvents: 'all',
                        animation: 'toastSlideIn 0.3s ease forwards',
                        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
                    }}
                >
                    {/* Icon */}
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>
                        {toast.type === 'success' ? '✅'
                            : toast.type === 'error' ? '❌'
                            : toast.type === 'warning' ? '⚠️'
                            : 'ℹ️'}
                    </span>

                    {/* Message */}
                    <span style={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: toast.type === 'success' ? '#15803d'
                            : toast.type === 'error' ? '#e11d48'
                            : toast.type === 'warning' ? '#b45309'
                            : '#0369a1'
                    }}>
                        {toast.message}
                    </span>

                    {/* Close Button */}
                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: 0,
                            lineHeight: 1,
                            flexShrink: 0
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

// ─── useToast Hook ────────────────────────────────────────────────────────────
export function useToast() {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => removeToast(id), duration)
    }, [removeToast])

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info'),
    }

    return { toasts, toast, removeToast }
}
