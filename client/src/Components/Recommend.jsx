import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import CardSkeleton from './CardSkeleton';
import { Card, CardTitle, CardDescription } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';
import HouseMap from './HouseMap';

// Recommendation photos come from the API as { contentType, data } (base64)
const houseImg = (house) =>
  house?.img?.data ? `data:${house.img.contentType};base64,${house.img.data}` : house?.img;

// The agent photo may be a plain URL or the same { contentType, data } object
const agentImg = (agent) =>
  agent?.img?.data ? `data:${agent.img.contentType};base64,${agent.img.data}` : agent?.img;


const Recommend = ({ houseId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardSelect, setCardSelect] = useState(null);
    const [error, setError] = useState(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const closeDetails = () => setCardSelect(null);


  useEffect(() => {
    const authentication = localStorage.getItem('authToken');
    const getRecommendation = async () => {
      try {
        const response = await axios.get(
          `/A/getRecommend/${houseId}`,{
            headers:{
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${authentication}`
            }
          }
        );
        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (error) {
      setError( 'Failed to load recommendations');
        setLoading(false);
        console.log('Error', error.message);
      }
    };

    if (houseId) 
      getRecommendation();
  }, [houseId]);

  // Details popup: close on Esc, and a soft fade/rise on open (skipped for reduced motion)
  useEffect(() => {
    if (!cardSelect) return;

    const onKey = (e) => { if (e.key === 'Escape') setCardSelect(null); };
    window.addEventListener('keydown', onKey);

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, clearProps: 'all' });
      gsap.fromTo(
        panelRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', clearProps: 'all' }
      );
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      mm.revert();
    };
  }, [cardSelect]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>

        {/* px-1 / pt-1 match the Latest Homes row so the two sections line up and shadows aren't clipped */}
        <div className="flex gap-4 overflow-x-auto px-1 pt-1 pb-4 sm:gap-6">
    {loading &&  <CardSkeleton/> }     

      {recommendations.map((house) => (
        <Card 
        key={house._id} 
        className="h-auto min-h-[320px] w-[min(85vw,280px)] shrink-0 cursor-pointer rounded-lg border shadow-sm transition-shadow hover:shadow-md"
        onClick={
          ()=>{
            setCardSelect(house)
          }
        }
        >
      <img 
        src={houseImg(house)}
        alt={house.location}
        className="w-full h-48 object-cover mb-2 rounded"
      />
         <div className='flex justify-end mr-3'>
                  <Favourite houseId={house._id} />

                      </div>
            <div className="p-4">
              <CardTitle className="font-abyssinica">{house.location}</CardTitle>
                   <CardDescription>
                        Property: {house.propertyNumber}
                  </CardDescription>
                      <CardDescription>
                        Size: {house.size} sqft
                    </CardDescription>
                        <CardDescription>
               Price: Rs{house.price}
                </CardDescription>
                        </div>
        </Card>
      ))}

{cardSelect && (
    <div
        ref={overlayRef}
        onClick={closeDetails}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
    >
        <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${cardSelect.location}`}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
        >
            {/* Photo with back + favourite buttons floating on top */}
            <div className="relative">
                <img
                    src={houseImg(cardSelect)}
                    alt={cardSelect.location}
                    className="h-[220px] w-full object-cover sm:h-[340px]"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
                <button
                    onClick={closeDetails}
                    aria-label="Close details"
                    className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#081740] shadow transition hover:bg-white"
                >
                    <FontAwesomeIcon icon={faLongArrowLeft} />
                </button>
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
                    <Favourite houseId={cardSelect._id} />
                </div>
            </div>

            <div className="p-5 sm:p-8">
                {/* Title + price */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-abyssinica text-2xl font-bold text-[#081740] sm:text-3xl">
                                {cardSelect.location}
                            </h2>
                            {cardSelect.status && (
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        String(cardSelect.status).toLowerCase() === 'sale'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-blue-50 text-blue-700'
                                    }`}
                                >
                                    {String(cardSelect.status).toLowerCase() === 'sale' ? 'For Sale' : cardSelect.status}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-[#b98604] sm:text-3xl">
                            Rs. {Number(cardSelect.price).toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Key facts */}
                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-4">
                        <dt className="text-xs uppercase tracking-wide text-gray-500">Size</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cardSelect.size} Anna</dd>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <dt className="text-xs uppercase tracking-wide text-gray-500">Property Type</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cardSelect.propertyType}</dd>
                    </div>
                    <div className="col-span-2 rounded-lg border border-gray-200 p-4 sm:col-span-1">
                        <dt className="text-xs uppercase tracking-wide text-gray-500">Property ID</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cardSelect.propertyNumber}</dd>
                    </div>
                </dl>

                {/* Agent */}
                <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {agentImg(cardSelect.listedBy) ? (
                            <img
                                src={agentImg(cardSelect.listedBy)}
                                alt={cardSelect.listedBy?.name || 'Agent'}
                                className="h-16 w-16 rounded-full bg-gray-200 object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#081740] text-xl font-semibold text-white">
                                {(cardSelect.listedBy?.name || 'A').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Listed by</p>
                            <p className="font-semibold text-gray-900">{cardSelect.listedBy?.name || "Anonymous"}</p>
                        </div>
                    </div>
                    <button
                        className="h-11 rounded-md bg-[#081740] px-6 text-white transition hover:bg-[#b98604]"
                        onClick={() => {
                            document.getElementById("getInTouchSection")?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }}
                    >
                        Book an agent
                    </button>
                </div>

                {/* Map */}
                <div className="mt-8">
                    <h3 className="mb-3 text-lg font-semibold text-[#081740]">Location</h3>
                    <div className="relative isolate z-0 overflow-hidden rounded-xl border border-gray-200">
                        <HouseMap position={[cardSelect.latitude, cardSelect.longitude]} houses={[cardSelect]} />
                    </div>
                </div>

                {/* Contact form */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <GetinTouch house={cardSelect} />
                </div>
            </div>
        </div>
    </div>
)}


    </div>

    </>

  );
};

export default Recommend;