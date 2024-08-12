import React from 'react';
import {Route, Routes} from 'react-router-dom'; 
// import axios from 'axios ';
// import {Toaster} from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';


function App() {


  return (
    <>
    <Routes>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
    </Routes>
      
    </>
  )
}

export default App
