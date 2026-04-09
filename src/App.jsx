import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import KitchenEstimator from './pages/KitchenEstimator'
import WardrobeEstimator from './pages/WardrobeEstimator'
import FullHomeEstimator from './pages/FullHomeEstimator'
import ThankYou from './pages/ThankYou'
import DatabaseTest from './pages/DatabaseTest'
import ProfilePage from './pages/ProfilePage'
import AuthSuccess from './pages/AuthSuccess'
import { useEffect } from 'react'
import { warmUpBackend } from './api'

function App() {
    useEffect(() => {
        warmUpBackend();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth-success" element={<AuthSuccess />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ResetPassword />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/kitchen-estimator" element={<KitchenEstimator />} />
                <Route path="/wardrobe-estimator" element={<WardrobeEstimator />} />
                <Route path="/full-home-estimator" element={<FullHomeEstimator />} />
                <Route path="/thankyou" element={<ThankYou />} />
                <Route path="/db-test" element={<DatabaseTest />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
