import React from 'react';
import {Route, Routes} from 'react-router-dom'; 
// import axios from 'axios ';
// import {Toaster} from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Buy from "./pages/Buy";
import Sell from './pages/Sell'
import './index.css';
import axios from 'axios';

axios.defaults.baseURL='http://localhost:6001';
axios.defaults.withCredentials=true;


function App() {


  return (
    <>
    <Routes>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/' element={<Buy/>}/>
      <Route path='/Sell ' element={<Sell/>}/>
    </Routes>
      
    </>
  )
}

export default App
