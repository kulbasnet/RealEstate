import { useNavigate } from "react-router-dom"
import agent from "./SellPage.jpg"
import office from "./Inside.jpg"
import build from "./build.png"
import press from './press.jpg';
import map from './map.jpg'
import mobile from './mobile.png'
import Footer from "@/components/Footer";
import CardSkeleton from "@/components/CardSkeleton";
function Sell() {
  const navigate = useNavigate()

  function handleClick() {
    navigate("/agent")
  }

  return (
    <div>
      <div className="relative ">
        <img src={build || "/placeholder.svg"} className="w-full h-[540px] mt-[10px] object-cover" />

        {/* Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-shadow text-4xl font-semibold">Sell With Us</h1>
          <h2 className="heading-para text-xl mt-6">Your Properties Deserve Extraordinary Marketing</h2>
        </div>
      </div>

      <div className="w-full h-[700px]">
        
        <div className="flex justify-items-center mt-10">
          <div className="sell-card">
            <img src={agent || "/placeholder.svg"} alt="agent" className="h-[330px] w-[800px] mb-4" />
            <h4 className="text-lg text-black">Meet your Local Agent</h4>
            <p className="text-black text-base font-abyssinica">
              Our local real estate professionals use their market expertise to create a customized plan for your home.
              Find an agent nearby to benefit from their local knowledge.
            </p>
            <button onClick={handleClick} className="text-xl text-[#DB9F05] mt-[30px] ml-[110px]">
              FIND YOUR AGENT
            </button>
          </div>

          <div className="sell-card2">
            <img src={office || "/placeholder.svg"} alt="agent" className="h-[330px] w-[800px] mb-4" />
            <h4 className="text-lg text-black">Access our exceptional Service</h4>
            <p className="text-black text-base font-abyssinica" >
              With a global team of experts, we have a local presence worldwide. Our local brokerage offices combine
              cutting-edge technology and exceptional service to enhance your property.
            </p>
            <button className="text-xl text-[#DB9F05] mt-[30px] ml-[70px]">CONTACT YOUR LOCAL OFFICE</button>
          </div>
        </div>
      </div>

      {/* New Marketing Highlights Section */}
      <div className="bg-[#081740] mb-16">

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h3 className="text-white uppercase tracking-wider mb-4">EXCLUSIVE HIGHLIGHTS</h3>
          <h2 className="text-4xl font-serif text-white max-w-3xl mx-auto">
            The way you market your home should have that wow factor too.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Press Exposure */}
          <div className="space-y-4">
            <img
              src={press}
              alt="Press articles collage"
              className="w-full h-64 object-cover"
            />
            <h3 className="text-lg font-semibold text-[#b98604]">IN THE NEWS</h3>
            <h4 className="text-xl font-serif text-white mb-2">Press Exposure</h4>
            <p className="text-white font-abyssinica">
              As the #1 most profiled luxury real estate brand in the news, Basnet's Realty leads the
              conversation. The brand's award-winning press office and PR efforts position the brand as a powerhouse in
              luxury real estate and drives traffic to the brand website, and ultimately, Sotheby's International Realty
              listings.
            </p>
          </div>

          {/* Global Connections */}
          <div className="space-y-4">
            <img
              src={map}
              alt="World map showing global network"
              className="w-full h-64 object-cover"
            />
            <h3 className="text-lg font-semibold text-[#b98604]">UNPARALLELED NETWORK</h3>
            <h4 className="text-xl font-serif text-white mb-2">Global Connections</h4>
            <p className="text-white font-abyssinica">
              Basnet's Realty is the only truly global real estate company with 25,300 advisors
              working in more than 1,100 local offices across 83 countries and territories. Our unparalleled network
              works together to meet your needs and expectations.
            </p>
          </div>

          {/* Unmatched Marketing */}
          <div className="space-y-4">
            <img
              src={mobile}
              alt="Tablet device showing marketing content"
              className="w-full h-64 object-cover"
            />
            <h3 className="text-lg font-semibold text-[#b98604]">THE HIGHEST STANDARD</h3>
            <h4 className="text-xl font-serif text-white mb-2">Unmatched Marketing</h4>
            <p className="text-white font-abyssinica">
              Basnet's Realty works alongside the highest-profile creative agencies and internal team to
              successfully connect with global consumers always keeping sophisticated design at the foundation.
            </p>
          </div>
        </div>
      </div>

        
      </div>
      <Footer/>
    </div>
  )
}

export default Sell

