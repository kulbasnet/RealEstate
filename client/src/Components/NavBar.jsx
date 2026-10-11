import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import UserFont from './UserFont';
import bur from '../pages/bur.png'
import { ChevronDown, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from './ui/dropdown-menu';




function NavBar() { 
  const [open, setOpen] = useState(false);          // mobile menu
  const [toolsOpen, setToolsOpen] = useState(false); // TOOLS section inside the mobile menu
  const root = useRef(null);

  const closeMenu = () => {
    setOpen(false);
    setToolsOpen(false);
  };

  // Esc closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Logo entrance and a gentle logo hover. All skipped for reduced motion.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav-logo', { y: -12, scale: 0.85, autoAlpha: 0, duration: 0.9 });
      });

      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const logo = root.current?.querySelector('.nav-logo');
        const anchor = logo?.closest('a');
        if (!logo || !anchor) return;
        const enter = () => gsap.to(logo, { scale: 1.08, rotate: -2, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        const leave = () => gsap.to(logo, { scale: 1, rotate: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        anchor.addEventListener('mouseenter', enter);
        anchor.addEventListener('mouseleave', leave);
        return () => {
          anchor.removeEventListener('mouseenter', enter);
          anchor.removeEventListener('mouseleave', leave);
        };
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Mobile menu items drop in one after another when it opens
  useLayoutEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.nav-m-item', { y: -10, autoAlpha: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', clearProps: 'all' });
      });
    }, root);
    return () => ctx.revert();
  }, [open]);

  return (
    <nav ref={root} className="fixed top-0 left-0 z-50 flex h-[100px] w-full items-center justify-between bg-[#081740] px-8 py-4 shadow-md max-lg:px-5 max-sm:h-[76px] max-sm:px-2 max-sm:py-2">
      <Link to={'/hero'} onClick={closeMenu}>
        <img className="nav-logo h-15 w-auto max-sm:w-[56px]" src={bur} alt="logo" />
      </Link> 

      {/* Desktop/tablet links (md and up). The 510px offset and 100px gaps are kept from xl (1280px) up. */}
      <ul className="hidden md:flex md:gap-8 lg:gap-12 xl:ml-[510px] xl:gap-[100px] text-base lg:text-lg font-semibold text-white">
        <li className="nav-link"><Link to={'/'} className="hover:underline">BUY</Link></li>
        <li className="nav-link"><Link to={'/sell'} className="hover:underline">SELL</Link></li>
        <li className="nav-link"><Link to={'/agent'} className="hover:underline">AGENT</Link></li>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
          <li className='nav-link flex cursor-pointer'> TOOLS <ChevronDown className='ml-3 mt-1'/> </li>
          </DropdownMenuTrigger>
          <DropdownMenuContent
          sideOffset = {10}
          className= "w-48 bg-white shadow-lg rounded-lg p-2 z-50"
          >
          <DropdownMenuItem>
            <Link to='/Emi' className='block text-black font-bold  hover:bg-gray-100 p-2 rounded'>EMI Calculator</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to='/landUnit' className='block text-black font-bold  hover:bg-gray-100 p-2 rounded'>Unit/ Naptol</Link>
          </DropdownMenuItem>

          </DropdownMenuContent>
         
        </DropdownMenu>
      </ul>

      <div className="flex items-center gap-3">
        {/* Hamburger: phones only (below md) */}
        <button
          type="button"
          onClick={() => (open ? closeMenu() : setOpen(true))}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden rounded-md p-2 text-white transition-colors hover:bg-white/10"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <UserFont className="bg-[gold]" />
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute left-0 top-full w-full border-t border-white/10 bg-[#081740] px-5 pb-3 pt-1 font-semibold text-white shadow-lg"
        >
          <ul className="flex flex-col">
            <li className="nav-m-item">
              <Link to={'/'} onClick={closeMenu} className="block border-b border-white/10 py-3 hover:text-[#DB9F05]">BUY</Link>
            </li>
            <li className="nav-m-item">
              <Link to={'/sell'} onClick={closeMenu} className="block border-b border-white/10 py-3 hover:text-[#DB9F05]">SELL</Link>
            </li>
            <li className="nav-m-item">
              <Link to={'/agent'} onClick={closeMenu} className="block border-b border-white/10 py-3 hover:text-[#DB9F05]">AGENT</Link>
            </li>
            <li className="nav-m-item">
              <button
                type="button"
                onClick={() => setToolsOpen((v) => !v)}
                aria-expanded={toolsOpen}
                className="flex w-full items-center justify-between py-3 hover:text-[#DB9F05]"
              >
                TOOLS
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div className="flex flex-col pb-2 pl-4 text-sm">
                  <Link to='/Emi' onClick={closeMenu} className="py-2 hover:text-[#DB9F05]">EMI Calculator</Link>
                  <Link to='/landUnit' onClick={closeMenu} className="py-2 hover:text-[#DB9F05]">Unit/ Naptol</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;