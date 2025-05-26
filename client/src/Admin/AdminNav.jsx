import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { DropdownMenu ,DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import bur from "../pages/bur.png";
import { MapPinHouse, LogOut, User } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';


function AdminNav() {
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("authToken");
    setLogged(!!auth); // Convert auth to boolean (true if exists, false if null)
  }, []);


function handleLogout(){
  localStorage.removeItem("authToken");
  setLogged(false);
  navigate("/adminLogin");
  toast.success("Logged Out");
}


  return (
  
      
          <div className="flex min-h-screen">
            <nav className='bg-[#081740] w-48 p-4 fixed h-full'>
              <Link to={'/adminDashBoard'} >
              <img src={bur} alt='logo' className='ml-3 h-[50px] mt-6'/>
              </Link>

              
              <ul className='flex flex-col gap-4 mt-[70px]'>
                <li>
                  <Link 
                    to={'/adminDashBoard'} 
                    className="text-white hover:text-gray-300 flex gap-1 py-2 px-4 rounded transition-colors"
                  >
                    <LayoutDashboard className='w-4 text-[#DB9F05]'/>
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link 
                    to={'/analytics'} 
                    className="text-white hover:text-gray-300  py-2 px-4 rounded transition-colors flex gap-1"
                  ><MapPinHouse className='w-4 text-[#DB9F05]'/>
                    PROPERTY
                  </Link>
                </li>
              </ul>
              <div className='mt-[380px] ml-[60px]'>
                {logged ?
                (<DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='focus:outline-none'>
                      <FontAwesomeIcon icon={faUser} color='white' className='text-2xl'/>

                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                     sideOffset={10} 
                    className="w-48 bg-white shadow-lg rounded-lg p-2 z-50" 
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link to='/adminProfile' className="flex gap-4  text-black font-semibold hover:bg-gray-100 p-2 rounded">
                      <User className='w-4'/>

                      Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <button
                                                      onClick={handleLogout} 
                                                      className="w-full font-semibold text-left text-black hover:bg-gray-100 p-2 rounded flex gap-4"
                      >
                        <LogOut className='w-4'/>
                        Logout
                      </button>
                    </DropdownMenuItem>

                  </DropdownMenuContent>


                </DropdownMenu>
                )
                :
                (
                  <p></p>
                )}
              </div>
            </nav>
      
            {/* Content Area */}
            <div className="flex-1 ml-48 p-8">
              <Outlet />
            </div>
          </div>
        )
      
}

export default AdminNav
