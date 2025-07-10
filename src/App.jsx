// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Guest / Auth
import HomePage           from "./pages/B_home_page";
import SignupPage         from "./pages/signup_page";
import LoginPage          from "./pages/login_page";

// Logged‑in user
import HomePageUser       from "./pages/home_page";
import HomeUserDashboard  from "./pages/home_pasge_user";
import Feed               from "./pages/Feed";
import Events             from "./pages/Events";
import Jobs               from "./pages/jobs";
import Messages           from "./pages/messages";
import Membership         from "./pages/membership";
import CreatePost         from "./pages/create-post";
import CreateEvent        from "./pages/createevent";
import EventEnrollPage    from "./pages/events_enroll";
import JobApplicationPage from "./pages/JobApplicationPage";
import GalleryPageUser    from "./pages/GalleryPage_user";
import UserAlertsPage     from "./pages/AlertPage_user";

// Admin
import AdminLoginPage     from "./pages/admin_login";
import AdminDashboard     from "./pages/admin_dashboard";
import AdminRegistrations from "./pages/admin_new_registrations";
import AdminUsers         from "./pages/admin_users";
import AdminFeed          from "./pages/admin_feed";
import AdminEvents        from "./pages/admin_events";
import AdminJobs          from "./pages/admin_jobs";
import CreateJob          from "./pages/create_job";
import AlertPageAdmin     from "./pages/AlertPage_admin";
import GalleryPageAdmin   from "./pages/GalleryPage_admin";
import PurchasePremium    from "./pages/PurchasePremium";

// Super‑admin
import SuperAdminLogin    from "./pages/super_admin_login";
import SuperAdminDashboard from "./pages/super_admin_dashboard";
import SuperAdminSignup   from "./pages/super_admin_signup";
import PremiumPlansAdmin from "./pages/PremiumPlansAdmin";
import AdminPremium from "./pages/adminpremium";
const GOOGLE_CLIENT_ID =
  "121835700906-thqi0h9t9anvgodk7ptp7ah26lt90oks.apps.googleusercontent.com";

/* ─────────  Conditional landing  ───────── */
function ConditionalHome() {
  const { user } = useAuth();
  return user ? <HomePageUser /> : <HomePage />;
}

/* ─────────  App component  ───────── */
function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public / Guest */}
            <Route path="/"                element={<ConditionalHome />} />
            <Route path="/signup"          element={<SignupPage />} />
            <Route path="/login"           element={<LoginPage />} />

            {/* Super‑admin */}
            <Route path="/super-admin-login"     element={<SuperAdminLogin />} />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
<Route path="/super-admin-signup"       element={<SuperAdminSignup />} />
<Route path="/premium-plans-super-admin" element={<PremiumPlansAdmin />} />
            {/* Admin */}
            <Route path="/admin-login"        element={<AdminLoginPage />} />
            <Route path="/admin-dashboard"    element={<AdminDashboard />} />
            <Route path="/admin-registrations"element={<AdminRegistrations />} />
            <Route path="/admin-users"        element={<AdminUsers />} />
            <Route path="/admin-feed"         element={<AdminFeed />} />
            <Route path="/admin-events"       element={<AdminEvents />} />
            <Route path="/admin-jobs"         element={<AdminJobs />} />
            <Route path="/createjob"          element={<CreateJob />} />
            <Route path="/alert-page"         element={<AlertPageAdmin />} />
            <Route path="/gallery-page"       element={<GalleryPageAdmin />} />
<Route path="/premium-plans-admin"  element={<AdminPremium />} />
            {/* Authenticated user */}
            <Route path="/home-register"  element={<HomePageUser />} />
            <Route path="/home-user"      element={<HomeUserDashboard />} />
            <Route path="/feed"           element={<Feed />} />
            <Route path="/events"         element={<Events />} />
            <Route path="/jobs"           element={<Jobs />} />
            <Route path="/messages"       element={<Messages />} />
            <Route path="/membership"     element={<Membership />} />
            <Route path="/create-post"    element={<CreatePost />} />
            <Route path="/createevent"    element={<CreateEvent />} />
            <Route path="/events/enroll/:id" element={<EventEnrollPage />} />
            <Route path="/job-apply/:jobId"  element={<JobApplicationPage />} />
            <Route path="/gallery-page-user"  element={<GalleryPageUser />} />
            <Route path="/alert-page-user"    element={<UserAlertsPage />} />
            <Route path="/purchase-premium" element={<PurchasePremium />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
