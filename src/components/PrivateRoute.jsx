import { Navigate } from 'react-router-dom'

/**
 * PrivateRoute — Protects user-facing routes.
 * Checks for a valid JWT token in localStorage.
 * If not authenticated, redirects to /login.
 */
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    return children
}
