import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Agent from './pages/Agent';
import Sign from './pages/Sign';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Login from './pages/Login';
import {Toaster} from "react-hot-toast";
import WithNavBar from './components/WithNavBar';
import WithoutNav from './components/WithoutNav';
import Dashboard from './Agent/Dashboard';
import Agentnav from './Agent/Agentnav';
import Message from './Agent/Message';
import Hero from './pages/Hero';
import VerificationEmailPage  from './pages/VerificationEmailPage';
import ForgotPassword from './pages/ForgotPassword';
import './index.css'
import '../src/Agent/Agent.css';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchBar from './components/SearchBar';

axios.defaults.baseURL = 'http://localhost:6001';
axios.defaults.withCredentials = false;

function App() {
  return (<>

   <Toaster position='top-center' toastOptions={{duration:3000}} /> 
      <Routes>
      {/* Routes with NavBar */}
      <Route element={<WithNavBar />}>
        <Route path="/" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/agent" element={<Agent />} />
        <Route path='/hero' element={<Hero/>}/>
      </Route>

      {/* Routes without NavBar */}
      <Route element={<WithoutNav />}>
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path='/verifyEmail' element={<VerificationEmailPage/>}/>
        <Route path='/forgetPassword' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:token' element={<ResetPasswordPage/>}/>
      </Route>

      {/* Route for Agent */}
      <Route element={<Agentnav/>}>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/message' element={<Message/>}/>
      </Route>



    </Routes>
  
  </>
  );
}

export default App;

  