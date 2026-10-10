import { useLayoutEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import agent from "./SellPage.webp"
import office from "./Inside.jpg"
import build from "./build.webp"
import press from './press.webp';
import map from './map.webp'
import mobile from './mobile.webp'
import Footer from "@/Components/Footer";

gsap.registerPlugin(ScrollTrigger)

function Sell() {
  const navigate = useNavigate()
  const root = useRef(null)

  function handleClick() {
    navigate("/agent")
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Only animate when the visitor hasn't asked for reduced motion
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Hero: image settles in, then title and subtitle rise
        gsap.fromTo(".hero-img", { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out" })
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-title", { y: 30, autoAlpha: 0, duration: 1 })
          .from(".hero-sub", { y: 30, autoAlpha: 0, duration: 1 }, "-=0.6")

        // 2. Scroll reveal for any element tagged data-reveal (plays once)
        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          })
        })

        // 3. Image frames: slow zoom-out on reveal + gentle zoom on hover
        const cleanups = []
        gsap.utils.toArray("[data-img]").forEach((frame) => {
          const img = frame.querySelector("img")
          if (!img) return

          gsap.fromTo(
            img,
            { scale: 1.15 },
            {
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
              scrollTrigger: { trigger: frame, start: "top 88%", once: true },
            }
          )

          const enter = () => gsap.to(img, { scale: 1.06, duration: 0.8, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" })
          frame.addEventListener("mouseenter", enter)
          frame.addEventListener("mouseleave", leave)
          cleanups.push(() => {
            frame.removeEventListener("mouseenter", enter)
            frame.removeEventListener("mouseleave", leave)
          })
        })

        return () => cleanups.forEach((fn) => fn())
      })
    }, root)

    // Lazy images change page height as they load, so re-measure trigger positions
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)

    return () => {
      window.removeEventListener("load", refresh)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={root} className="overflow-x-hidden">
      <div className="relative overflow-hidden">
        <img
          src={build}
          alt="Luxury home"
          fetchPriority="high"
          decoding="async"
          className="hero-img w-full h-[320px] sm:h-[440px] md:h-[540px] mt-[10px] object-cover"
        />

        {/* Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="hero-title text-shadow text-4xl font-semibold">Sell With Us</h1>
          <h2 className="hero-sub heading-para text-xl mt-6">Your Properties Deserve Extraordinary Marketing</h2>
        </div>
      </div>

      <div className="w-full h-auto md:h-[700px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12 mt-10 px-4 pb-10 md:pb-0">
          <div className="sell-card !ml-0 !mr-0 !w-full max-w-[450px]" data-reveal>
            <div data-img className="overflow-hidden mb-4">
              <img
                src={agent}
                alt="Local real estate agent"
                loading="lazy"
                decoding="async"
                className="h-[220px] sm:h-[280px] md:h-[330px] w-full object-cover"
              />
            </div>
            <h4 className="text-lg text-black">Meet your Local Agent</h4>
            <p className="text-black text-base font-abyssinica">
              Our local real estate professionals use their market expertise to create a customized plan for your home.
              Find an agent nearby to benefit from their local knowledge.
            </p>
            <button onClick={handleClick} className="text-xl text-[#DB9F05] mt-[30px] ml-0 md:ml-[110px]">
              FIND YOUR AGENT
            </button>
          </div>

          <div className="sell-card2 !ml-0 !mr-0 !w-full max-w-[450px]" data-reveal data-delay="0.15">
            <div data-img className="overflow-hidden mb-4">
              <img
                src={office}
                alt="Real estate office"
                loading="lazy"
                decoding="async"
                className="h-[220px] sm:h-[280px] md:h-[330px] w-full object-cover"
              />
            </div>
            <h4 className="text-lg text-black">Access our exceptional Service</h4>
            <p className="text-black text-base font-abyssinica">
              With a global team of experts, we have a local presence worldwide. Our local brokerage offices combine
              cutting-edge technology and exceptional service to enhance your property.
            </p>
            <button className="text-xl text-[#DB9F05] mt-[30px] ml-0 md:ml-[70px]">CONTACT YOUR LOCAL OFFICE</button>
          </div>
        </div>
      </div>

      {/* New Marketing Highlights Section */}
      <div className="bg-[#081740] mb-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16" data-reveal>
            <h3 className="text-white uppercase tracking-wider mb-4">EXCLUSIVE HIGHLIGHTS</h3>
            <h2 className="text-4xl font-serif text-white max-w-3xl mx-auto">
              The way you market your home should have that wow factor too.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Press Exposure */}
            <div className="space-y-4" data-reveal>
              <div data-img className="overflow-hidden">
                <img
                  src={press}
                  alt="Press articles collage"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover"
                />
              </div>
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
            <div className="space-y-4" data-reveal data-delay="0.15">
              <div data-img className="overflow-hidden">
                <img
                  src={map}
                  alt="World map showing global network"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#b98604]">UNPARALLELED NETWORK</h3>
              <h4 className="text-xl font-serif text-white mb-2">Global Connections</h4>
              <p className="text-white font-abyssinica">
                Basnet's Realty is the only truly global real estate company with 25,300 advisors
                working in more than 1,100 local offices across 83 countries and territories. Our unparalleled network
                works together to meet your needs and expectations.
              </p>
            </div>

            {/* Unmatched Marketing */}
            <div className="space-y-4" data-reveal data-delay="0.3">
              <div data-img className="overflow-hidden">
                <img
                  src={mobile}
                  alt="Tablet device showing marketing content"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover"
                />
              </div>
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
