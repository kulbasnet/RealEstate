import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Agent from './pages/Agent';
import Sign from './pages/Sign';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Login from './pages/Login';
import {Toaster} from "react-hot-toast";
import WithNavBar from './Components/WithNavBar';
import WithoutNav from './Components/WithoutNav';
import Dashboard from './Agent/Dashboard';
import Agentnav from './Agent/Agentnav';
import Message from './Agent/Message';
import './index.css';
import '../src/Agent/Agent.css';

axios.defaults.baseURL = 'http://localhost:6001';
axios.defaults.withCredentials = false;

function App() {
  return (<>

   <Toaster position='top-center' toastOptions={{duration:3000}}/> 
      <Routes>
      {/* Routes with NavBar */}
      <Route element={<WithNavBar />}>
        <Route path="/" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/agent" element={<Agent />} />
      </Route>

      {/* Routes without NavBar */}
      <Route element={<WithoutNav />}>
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />

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

  {/* <NavBar/>
    <Routes>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/sign' element={<Sign/>}/>
      <Route path='/' element={<Buy/>}/>
      <Route path='/sell' element={<Sell/>}/>
    </Routes> */}

  {/* Routes with navBar */}