import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import PlannerPage from './pages/PlannerPage'
import KitchenEstimator from './pages/KitchenEstimator'
import WardrobeEstimator from './pages/WardrobeEstimator'
import FullHomeEstimator from './pages/FullHomeEstimator'
import ThankYou from './pages/ThankYou'
import ProfilePage from './pages/ProfilePage'
import AuthSuccess from './pages/AuthSuccess'
import NotFound from './pages/NotFound'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import EmiCalculator from './pages/EmiCalculator'
import ProjectGallery from './pages/ProjectGallery'
import ContractorDirectory from './pages/ContractorDirectory'


import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import { useEffect } from 'react'
import { warmUpBackend } from './api'

function App() {
    useEffect(() => {
        warmUpBackend();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* ── Public Routes ──────────────────────────── */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth-success" element={<AuthSuccess />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ResetPassword />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/emi-calculator" element={<EmiCalculator />} />
                <Route path="/gallery" element={<ProjectGallery />} />
                <Route path="/contractors" element={<ContractorDirectory />} />


                {/* ── Protected User Routes ──────────────────── */}
                <Route path="/user-dashboard" element={
                    <PrivateRoute><UserDashboard /></PrivateRoute>
                } />
                <Route path="/planner" element={
                    <PrivateRoute><PlannerPage /></PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute><ProfilePage /></PrivateRoute>
                } />
                <Route path="/kitchen-estimator" element={
                    <PrivateRoute><KitchenEstimator /></PrivateRoute>
                } />
                <Route path="/wardrobe-estimator" element={
                    <PrivateRoute><WardrobeEstimator /></PrivateRoute>
                } />
                <Route path="/full-home-estimator" element={
                    <PrivateRoute><FullHomeEstimator /></PrivateRoute>
                } />
                <Route path="/thankyou" element={
                    <PrivateRoute><ThankYou /></PrivateRoute>
                } />

                {/* ── Protected Admin Routes ─────────────────── */}
                <Route path="/admin-dashboard" element={
                    <AdminRoute><AdminDashboard /></AdminRoute>
                } />

                {/* ── 404 Not Found ──────────────────────────── */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
