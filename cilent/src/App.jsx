import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sign from './pages/Sign';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Login from './pages/Login';
import WithNavBar from './Components/WithNavBar';
import WithoutNav from './Components/WithoutNav';
import './index.css';

axios.defaults.baseURL = 'http://localhost:6001';
axios.defaults.withCredentials = false;

function App() {
  return (
    <Routes>
      {/* Routes with NavBar */}
      <Route element={<WithNavBar />}>
        <Route path="/" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
      </Route>

      {/* Routes without NavBar */}
      <Route element={<WithoutNav />}>
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
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