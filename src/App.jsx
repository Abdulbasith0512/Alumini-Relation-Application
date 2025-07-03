import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider, useAuth } from './context/AuthContext';
import HomePageuser from "./pages/home_page"; // Logged-in
import HomePage from "./pages/B_home_page";  // Guest
import LoginPage from "./pages/login_page";
import SignupPage from "./pages/signup_page";
import AdminloginPage from "./pages/admin_login";
 // Make sure filename is correct
import AdminRegistrations from "./pages/admin_new_registrations";


import AdminDashboard from "./pages/admin_dashboard"; // renamed from admin_home
import Feed from "./pages/Feed";
import Events from "./pages/Events";
import Jobs from "./pages/jobs";
import Messages from './pages/messages';
import Membership from './pages/membership';
import CreatePost from './pages/create-post';
import CreateEvent from './pages/createevent';
import EventEnrollPage from './pages/events_enroll';
import AlertPage from './pages/AlertPage_admin';
import UserAlertsPage from './pages/AlertPage_user';
import GalleryPage from './pages/GalleryPage_admin';
import GalleryPageUser from './pages/GalleryPage_user';
import HomeUserDashboard from './pages/home_pasge_user';
import AdminUsers from './pages/admin_users';
import Adminfeed from './pages/admin_feed';
import SuperAdminlogin from './pages/super_admin_login';
import SuperAdminDashboard from './pages/super_admin_dashboard';
import AdminEvents from './pages/admin_events';



const ClientId = "121835700906-thqi0h9t9anvgodk7ptp7ah26lt90oks.apps.googleusercontent.com";

function ConditionalRoute() {
  const { user } = useAuth();
  return user ? <HomePageuser /> : <HomePage />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={ClientId}>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/home-register" element={<HomePageuser />} />
<Route path="/home-user" element={<HomeUserDashboard />} />
<Route path="/alert-page" element={<AlertPage />} />
<Route path="/gallery-page" element={<GalleryPage />} />
<Route path="/gallery-page-user" element={<GalleryPageUser />} />
<Route path="/alert-page-user" element={<UserAlertsPage />} />
<Route path="/feed" element={<Feed />} />
<Route path="/events" element={<Events/>}/>
<Route path="/jobs" element={<Jobs/>}/>
<Route path="/messages" element={<Messages/>}/>
<Route path="/membership" element={<Membership/>}/>
<Route path="/create-post" element={<CreatePost/>}/>
<Route path="/createevent" element={<CreateEvent/>}/>
<Route path="/events/enroll/:id" element={<EventEnrollPage />} />
<Route path="/admin-users" element={<AdminUsers />} />
<Route path="/admin-feed" element={<Adminfeed />} />
  <Route path="/" element={<ConditionalRoute />} />
 <Route path="/super-admin-login" element={<SuperAdminlogin />} /> 
 <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
<Route path="/admin-events" element={<AdminEvents />} /> 
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/admin-login" element={<AdminloginPage />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/admin-registrations" element={<AdminRegistrations />} />
</Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
