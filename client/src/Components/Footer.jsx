import React from "react"
import { ArrowRight } from "lucide-react"

function Footer() {
  return (
    <div>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Contact Section */}
          <div className="space-y-6 col-span-2 sm:col-span-2 md:col-span-1">
            <h2 className="text-xl font-serif text-[#8C6F1D]">Basnet's Realty</h2>
            <a href="/contact" className="inline-flex items-center font-semibold text-sm hover:underline">
              CONTACT US <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#8C6F1D] uppercase">Company</h3>
            <nav className="flex flex-col space-y-3">
              {["Luxury Outlook", "About Us", "Giving Back", "Press", "Join Us", "Luxury Real Estate"].map(
                (item, index) => (
                  <a key={`company-${index}`} href="/" className="text-sm hover:underline">
                    {item}
                  </a>
                ),
              )}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#8C6F1D] uppercase">Apps</h3>
            <nav className="flex flex-col space-y-3">
              {["SIR Mobile App", "SIR Apple TV App", "Virtual Reality"].map((item, index) => (
                <a key={`app-${index}`} href="/" className="text-sm hover:underline">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#8C6F1D] uppercase">Basnet's</h3>
            <nav className="flex flex-col space-y-3">
              {["Auctions", "Diamonds", "Wine", "Institute of Art"].map((item, index) => (
                <a key={`basnet-${index}`} href="/" className="text-sm hover:underline">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 text-center">
          <nav className="flex flex-wrap justify-center items-center gap-2 text-sm">
            {["Facebook", "X", "Instagram", "LinkedIn", "YouTube", "Pinterest", "TikTok"].map((social, index) => (
              <React.Fragment key={`social-${index}`}>
                <a href="/" className="hover:underline italic">
                  {social}
                </a>
                {index < 6 && <span className="text-gray-400 hidden sm:inline">•</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="mt-8 text-center">
          <button className="text-sm text-gray-600 hover:underline uppercase">
            Do not sell or share my personal information
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Basnet Realty's commitment to{" "}
            <a href="/" className="underline">
              fair housing laws
            </a>
            {", "}
            <a href="/" className="underline">
              standard operating procedures
            </a>
            {", and "}
            <a href="/" className="underline">
              reasonable accommodations
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
