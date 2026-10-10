import SearchBar from '@/Components/SearchBar'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Link } from 'react-router-dom';
import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sell from './sell.jpg';
import buy from './buy.jpg';
import agent from './agent.png';
import burberry from './burberry.png';
import house from './house.jpg';
import  {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '@/Components/Footer';
import LatestHouse from '@/Components/LatestHouse';
import Recommend from '@/Components/Recommend';
import { useRecommendation } from '@/Context/RecommendationContext';

gsap.registerPlugin(ScrollTrigger);

function Hero({handleSearch, onSearch}) {
  const [searchinput, setSearchInput] = useState('');
  const { selectedHouseId } = useRecommendation();
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Skip every animation for visitors who prefer reduced motion
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wide = window.matchMedia('(min-width: 768px)').matches;

        // 1. Hero banner: image settles in, title + search rise one after another
        gsap.fromTo('.hero-img', { scale: 1.2 }, { scale: 1.15, duration: 2, ease: 'power2.out' });
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-title', { y: 30, autoAlpha: 0, duration: 1 }, 0.2)
          .from('.hero-search', { y: 30, autoAlpha: 0, duration: 1 }, 0.5);

        // Gentle parallax: the banner image drifts slower than the page
        gsap.to('.hero-img', {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-wrap', start: 'top 100px', end: 'bottom top', scrub: true },
        });

        // 2. Generic scroll reveal (plays once). clearProps removes the leftover
        //    transform afterwards so position:fixed popups inside (e.g. the
        //    LatestHouse detail modal) are not trapped by a transformed parent.
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        // 3. Buy / Sell / Agent cards: staggered rise, plus a soft lift on hover
        gsap.from('.home-card', {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: '.home-cards', start: 'top 85%', once: true },
        });

        const cleanups = [];
        gsap.utils.toArray('.home-card').forEach((card) => {
          const enter = () => gsap.to(card, { y: -6, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
          const leave = () => gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
          card.addEventListener('mouseenter', enter);
          card.addEventListener('mouseleave', leave);
          cleanups.push(() => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
          });
        });

        // 4. Our Story: image slides in, then the text lines follow
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: '.story', start: 'top 75%', once: true },
          })
          .from('.story-img', { ...(wide ? { x: -60 } : { y: 40 }), autoAlpha: 0, duration: 1.2 })
          .from('.story-text > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.15 }, '-=0.7');

        return () => cleanups.forEach((fn) => fn());
      });
    }, root);

    // Content above (recommendations, latest homes) loads asynchronously and changes
    // the page height, so re-measure the scroll triggers when that happens.
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const ro = new ResizeObserver(refresh);
    if (root.current) ro.observe(root.current);
    window.addEventListener('load', refresh);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
  <div ref={root}>
<div className="hero-wrap relative mt-[100px] overflow-hidden">
  <img src={house} alt="pic" className="hero-img w-full h-[520px] object-cover max-sm:h-[420px]" />

  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
    <h1 className="hero-title text-white font-semibold font-abyssinica text-5xl mb-2 max-sm:text-4xl">Agent. Homes.</h1>
    
    <div className="hero-search mx-auto w-full max-w-2xl">
      <SearchBar onSearch={handleSearch} searchInput={searchinput} setSearchInput={setSearchInput}/>
    </div>
  </div>
</div>

      <div>
        
      <div className='mx-4 mt-[40px] sm:ml-[160px] sm:mr-4' data-reveal>
          <h1 className=' font-semibold text-2xl'>Recommended Homes For You</h1>
          <p className='text-gray-600 '>Based on homes you recently viewed </p>
          </div>
      
            {selectedHouseId ? (
          <div >
            <Recommend houseId={selectedHouseId} />
          </div>
        ) : (
          <div className="h-48 w-full flex items-center justify-center text-gray-500 mt-4">
            Click on a house to view recommendations.
          </div>
        )}
             
      </div>

      <div data-reveal>
        <LatestHouse/>
      </div>
        
        

        <div className='home-cards flex flex-wrap justify-center gap-8 mb-16 px-4'>
        <Card className="home-card h-[480px] w-96 max-w-full mt-[110px] flex flex-col items-center text-center p-4 shadow-lg max-sm:mt-10">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={sell} alt="pic" className="w-full h-50 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Buy a Home</CardTitle>
    <CardDescription className="text-black px-10">
      Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.
    </CardDescription>
    <CardContent>
      <Link to={'/'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          Browse Homes
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>


<Card className="home-card h-[480px] w-96 max-w-full mt-[110px] flex flex-col items-center text-center p-4 shadow-lg max-sm:mt-0">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={buy} alt="pic" className="w-full h-45 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Sell a Home</CardTitle>
    <CardDescription className="text-black  ">
    Regardless of the approach you choose to undertake in selling your home, we are equipped to assist you in achieving a successful transaction.   </CardDescription>
    <CardContent>
      <Link to={'/sell'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          See your options
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>

<Card className="home-card h-[480px] w-96 max-w-full mt-[110px] flex flex-col items-center text-center p-4 shadow-lg max-sm:mt-0">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={agent} alt="pic" className="w-ful h-48 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Find an Agent</CardTitle>
    <CardDescription className="text-black px-10">
    Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else. </CardDescription>
 <CardContent>
      <Link to={'/agent'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          Find Agents
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>
    </div>

    <div className='story bg-[#081740] flex justify-center items-center mb-10 h-[550px] px-8 max-md:h-auto max-md:flex-col max-md:py-8 max-sm:px-4'>
  <img src={burberry} alt='picture' className='story-img h-[450px] mt-10 mr-20 max-md:mt-0 max-md:mr-0 max-md:mb-6 max-md:h-auto max-md:max-h-[360px] max-md:max-w-full' />

  <div className="story-text flex flex-col text-white max-w-lg">
    <h1 className='text-4xl font-abyssinica mb-4'>Our Story</h1>
    <p className="mb-4 text-base ">
      Only one network of agents represents the longest standing tastemaker in the world. In the spirit of innovation, an exceptional luxury real estate company bearing the Basnet's Realties name was launched in 1976. Beyond the beautiful properties and the personal touch of our agents, only one brand can deliver a lifestyle that caters to you. With a network of homes for sale worldwide, our website lets you search property listings globally, and includes a large inventory of luxury homes for sale, including houses, condos, townhomes, villas, and more.
    </p>
    <Link to={'/about'} className="text-white font-semibold flex items-center gap-2 hover:underline">
      Read More <FontAwesomeIcon icon={faArrowRight} />
    </Link>
  </div>
</div>

<Footer/>

  </div>
  )
}

export default Hero