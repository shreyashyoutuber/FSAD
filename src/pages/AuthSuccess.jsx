import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (token && email) {
            // Save to localStorage
            localStorage.setItem('token', token);
            // Prepare a basic user object for the dashboard
            const user = { 
                email: email,
                name: 'User' 
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to dashboard
            navigate('/user-dashboard');
        } else {
            // Something went wrong
            navigate('/login?error=Authentication failed');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#1a1a1a', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Finalizing Login...</h2>
                <p style={{ color: '#666', marginTop: '8px' }}>Bringing you to your dashboard.</p>
            </div>
        </div>
    );
}
