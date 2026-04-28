import { Navigate } from 'react-router-dom'

/**
 * AdminRoute — Protects admin-only routes.
 * Checks for adminLoggedIn flag AND adminEmail in localStorage.
 * If not an admin, redirects to /admin-login.
 */
export default function AdminRoute({ children }) {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    const adminEmail = localStorage.getItem('adminEmail')

    if (!isAdminLoggedIn || !adminEmail) {
        return <Navigate to="/admin-login" replace />
    }

    return children
}
