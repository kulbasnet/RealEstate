import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
// import UserFont from '../Components/UserFont';
import AgentFont from '../Components/AgentFont';
import bur from "../pages/bur.png";
import { Menu, Pyramid, X } from 'lucide-react';

function Agentnav() {
  const [open, setOpen] = useState(false); // mobile menu

  const closeMenu = () => setOpen(false);

  // Esc closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-[#081740] shadow-md z-50 flex items-center justify-between px-8 py-4 h-[100px] max-lg:px-5 max-sm:h-[76px] max-sm:px-2 max-sm:py-2">
      <Link to="/dashboard" onClick={closeMenu}>
            <img src={bur} className='h-15 w-auto max-sm:w-[56px]' alt="logo" />
            </Link>

        {/* Desktop/tablet links (md and up). The 510px offset and 100px gaps are kept from xl (1280px) up. */}
        <ul className="hidden md:flex md:gap-8 lg:gap-12 xl:ml-[510px] xl:gap-[100px] text-white text-base lg:text-lg font-semibold">
    
          <li>
            <Link to={'/dashboard'} className="hover:text-gray-300">DASHBOARD</Link>
          </li>
          <li>
            <Link to={'/agentMessage'} className="hover:text-gray-300 flex gap-2 "> CLIENTS <Pyramid className='w-4 text-[#DB9F05]'/></Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Hamburger: phones only (below md) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="agent-mobile-menu"
            className="md:hidden rounded-md p-2 text-white transition-colors hover:bg-white/10"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <AgentFont />
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div
            id="agent-mobile-menu"
            className="md:hidden absolute left-0 top-full w-full border-t border-white/10 bg-[#081740] px-5 pb-3 pt-1 font-semibold text-white shadow-lg"
          >
            <ul className="flex flex-col">
              <li>
                <Link
                  to={'/dashboard'}
                  onClick={closeMenu}
                  className="block border-b border-white/10 py-3 hover:text-[#DB9F05]"
                >
                  DASHBOARD
                </Link>
              </li>
              <li>
                <Link
                  to={'/agentMessage'}
                  onClick={closeMenu}
                  className="flex items-center gap-2 py-3 hover:text-[#DB9F05]"
                >
                  CLIENTS <Pyramid className='w-4 text-[#DB9F05]'/>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  );
}

export default Agentnav;