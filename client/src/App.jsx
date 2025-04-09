import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Agent from './pages/Agent';
import Sign from './pages/Sign';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Login from './pages/Login';
import { Toaster } from "react-hot-toast";
import WithNavBar from './components/WithNavBar';
import WithoutNav from './components/WithoutNav';
import Dashboard from './Agent/Dashboard';
import Agentnav from './Agent/Agentnav';
import Message from './Agent/Message';
import Hero from './pages/Hero';
import VerificationEmailPage from './pages/VerificationEmailPage';
import ForgotPassword from './pages/ForgotPassword';
import './index.css';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutUs from './pages/AboutUs';
import AgentProfile from './Agent/AgentProfile';
import ProtectedRoute from '../src/components/ProtectedRoutes';  // ✅ Import ProtectedRoute
import UserProfile from './pages/UserProfile';
import GetFavourite from './pages/GetFavourite';
import AdminLogin from './Admin/AdminLogin';
import AdminSignUp from './Admin/AdminSignUp';
import AdminDashBoard from './Admin/AdminDashBoard';
import AdminAnalystics from './Admin/AdminAnalystics';
import AdminNav from './Admin/AdminNav';
import AdminProfile from './Admin/AdminProfile';
import AdminVerification from './Admin/AdminVerification';
import AdminForgetPassword from './Admin/AdminForgetPassword';
import AdminResetPassword from './Admin/AdminResetPassword';
import { SkeletonTheme } from 'react-loading-skeleton';
import Messages from './pages/Messages';
import AgentMessage from './Agent/AgentMessage';

axios.defaults.baseURL = 'http://localhost:6001';
axios.defaults.withCredentials = false;

function App() {
  return (
    <>
    <Toaster position='top-center' toastOptions={{ duration: 3000 }} />
    <SkeletonTheme highlightColor='#90A4AE' baseColor='#F4F5F6'>
    <Routes>
  {/* Routes with NavBar (Public Pages) */}
  <Route element={<WithNavBar />}>
  <Route path="/sell" element={<Sell />} />
  <Route path="/" element={<Buy />} />

    <Route path="/agent" element={<Agent />} />
    <Route path='/hero' element={<Hero />} />
    <Route path='/about' element={<AboutUs />} />
    <Route path='/userProfile' element={<UserProfile/>}/>
    <Route path='/favouriteHouse' element={<GetFavourite/>}/>
    <Route path='/message' element={<Messages/>} />
  </Route>

  {/* Routes without NavBar (Login, Signup, etc.) */}
  <Route element={<WithoutNav />}>
    <Route path="/sign" element={<Sign />} />
    <Route path="/login" element={<Login />} />
    <Route path='/verifyEmail' element={<VerificationEmailPage />} />
    <Route path='/forgetPassword' element={<ForgotPassword />} />
    <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
    <Route path='/adminLogin' element={<AdminLogin/>}/>
  <Route path='/adminSignUp' element={<AdminSignUp/>}/>
  <Route path='/adminVerify' element={<AdminVerification/>}/>
  <Route path='/adminForget' element={<AdminForgetPassword/>}/>
  <Route path='/adminResetPassword/:token' element={<AdminResetPassword/>}/>

  </Route>

  {/* ✅ Protect Agent Routes - Only Agents Can Access */}
  <Route element={<ProtectedRoute requiredAgent={true} />}>
    <Route element={<Agentnav />}>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/message' element={<Message />} />
      <Route path='/agentProfile' element={<AgentProfile />} />
      <Route path='/agentMessage' element={<AgentMessage/>} />

    </Route>
  </Route>

  <Route element={<AdminNav/>}>
  <Route path='/adminDashBoard' element={<AdminDashBoard/>}/>
  <Route path='/analytics' element={<AdminAnalystics/>}/>
  <Route path='/adminProfile' element={<AdminProfile/>}/>

  </Route>
  

  
</Routes> 

  </SkeletonTheme>

    </>
  );
}

export default App;
