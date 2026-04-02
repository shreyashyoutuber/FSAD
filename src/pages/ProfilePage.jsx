import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateProfile } from '../api';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data);
            setForm({ name: data.name, phone: data.phone || '' });
        } catch (err) {
            setError('Failed to load profile. Please login again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        try {
            const updated = await updateProfile(form);
            setUser(updated);
            setSuccess('Profile updated successfully!');
            // Update local storage too handled by api.js
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button 
                   onClick={() => navigate(-1)} 
                   style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                >
                    ← Back
                </button>
                <h1>User Profile</h1>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
            {success && <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>Account Email</p>
                    <p style={{ fontWeight: 600, fontSize: '18px' }}>{user?.email}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px' }}>Phone Number</label>
                        <input 
                            type="text" 
                            value={form.phone} 
                            onChange={e => setForm({...form, phone: e.target.value})}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={updating}
                        style={{ 
                            padding: '14px', 
                            borderRadius: '8px', 
                            border: 'none', 
                            background: updating ? '#ccc' : '#e67e22', 
                            color: 'white', 
                            fontWeight: 700, 
                            cursor: updating ? 'not-allowed' : 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {updating ? 'Updating...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
