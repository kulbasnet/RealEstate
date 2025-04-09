import React from 'react'
import {Link} from 'react-router-dom';
import { ArrowRight } from "lucide-react"


function Footer() {
  return (
    <div>
       <footer className="max-w-7xl ml-[160px] px-4 pt-2 pb-8">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Contact Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif">Basnet's Realty</h2>
          <Link to="/contact" className="inline-flex items-center font-semibold text-sm hover:underline">
            CONTACT US <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

 <div className="space-y-4">
          <h3 className="font-medium text-[#8C6F1D] uppercase">Company</h3>
          <nav className="flex flex-col space-y-3">
            {["Luxury Outlook", "About Us", "Giving Back", "Press", "Join Us", "Luxury Real Estate"].map((item) => (
              <Link   className="text-sm hover:underline">
                {item}
              </Link> ))}
          </nav>
        </div>

 <div className="space-y-4">
          <h3 className="font-medium text-[#8C6F1D] uppercase">Apps</h3>
          <nav className="flex flex-col space-y-3">
            {["SIR Mobile App", "SIR Apple TV App", "Virtual Reality"].map((item) => (
              <Link className="text-sm hover:underline">
                {item}
              </Link>
            ))}
          </nav>
        </div>

<div className="space-y-4">
          <h3 className="font-medium text-[#8C6F1D] uppercase">Basnet's</h3>
          <nav className="flex flex-col space-y-3">
            {["Auctions", "Diamonds", "Wine", "Institute of Art"].map((item) => (
              <Link  className="text-sm hover:underline">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
 <div className="mt-12 text-center">
        <nav className="flex justify-center items-center space-x-4 text-sm">
          {["Facebook", "X", "Instagram", "LinkedIn", "YouTube", "Pinterest", "TikTok"].map((social, index) => (
            <>
              <Link  className="hover:underline italic">
                {social}
              </Link>
              {index < 6 && <span className="text-gray-400">•</span>}
            </>
          ))}
        </nav>
      </div>

 <div className="mt-8 text-center">
        <button className="text-sm text-gray-600 hover:underline uppercase">
          Do not sell or share my personal information
        </button> <p className="mt-4 text-sm text-gray-600">
          Basnet Realty's commitment to{" "}
          <Link className="underline">
            fair housing laws
          </Link> ,{" "}
          <Link  className="underline">
            standard operating procedures
          </Link>
          , and{" "}
          <Link  className="underline">
            reasonable accommodations
          </Link> .
        </p>
      </div>
    </footer>
    </div>
  )
}

export default Footer
