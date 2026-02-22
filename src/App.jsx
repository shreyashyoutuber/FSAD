import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminRespond from './pages/AdminRespond'
import UserDashboard from './pages/UserDashboard'
import KitchenEstimator from './pages/KitchenEstimator'
import WardrobeEstimator from './pages/WardrobeEstimator'
import FullHomeEstimator from './pages/FullHomeEstimator'
import ThankYou from './pages/ThankYou'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-respond" element={<AdminRespond />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/kitchen-estimator" element={<KitchenEstimator />} />
                <Route path="/wardrobe-estimator" element={<WardrobeEstimator />} />
                <Route path="/full-home-estimator" element={<FullHomeEstimator />} />
                <Route path="/thankyou" element={<ThankYou />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
