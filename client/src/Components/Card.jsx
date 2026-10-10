import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import HouseMap from './HouseMap';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import CardSkeleton from './CardSkeleton';
import { Button } from './ui/button';
import { FilterIcon } from 'lucide-react';
// import { Card } from './ui/card';
import { useRecommendation } from '@/Context/RecommendationContext';



function Card({position}) {
    const [houses, setHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState(null); 
    const [isloading , setLoading] = useState(true);
    // const authToken = localStorage.getItem('authToken'); z
    const[sort, setSort] = useState("asc");
    const [filtered, setFiltered] = useState({
        status:"",
        propertyType:""

    })
    const {setSelectedHouseId} = useRecommendation();
    const overlayRef = useRef(null);
    const panelRef = useRef(null);

    // Details popup: close on Esc, and a soft fade/rise on open (skipped for reduced motion)
    useEffect(() => {
        if (!selectedHouse) return;

        const onKey = (e) => { if (e.key === 'Escape') setSelectedHouse(null); };
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
    }, [selectedHouse]);



    const sortedHouse = [...houses].sort((a,b) =>{
        return sort === "asc" ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
    })

 

    useEffect(() => {
        const houseFilter = async () => {
            // const token = localStorage.getItem('authToken');
            // e.preventDefault();
            try {
                const response = await axios.get("/house/houseFilter",{
                    params:{
                        status: filtered.status,
                        propertyType: filtered.propertyType

                    }
                });
                console.log(response.data.data);
                setHouses(response.data.data);
            } catch (error) {
                console.error("Sorry, something went wrong:", error.message);
            } finally {
                // stop the skeletons even if the request fails
                setLoading(false);
            }
        };

       

        houseFilter();
    }, [filtered.status, filtered.propertyType]);



    const handleCardClick = (house) => {
        setSelectedHouse(house); 
        setSelectedHouseId(house._id); // Send house ID to parent
    
    };

    const handleBackClick = () => {
        setSelectedHouse(null); 
    };


    const handleFilterChange=(type, value)=>{
        setFiltered(prev=>({...prev, [type]: value}));

    }

    return (<>
    {/* Filter bar: wraps onto a second line when the column is narrow instead of overflowing */}
    <div className='flex flex-wrap items-center gap-y-3 ml-4 mr-4 sm:ml-6 xl:ml-[130px] mt-6 md:mt-[122px]'>
    <div className='flex items-center font-abyssinica justify-end mr-[20px]'>
        <Select onValueChange={value=> handleFilterChange("status", value)} >
            <SelectTrigger className="w-[120px] border-gray-300">
                <SelectValue placeholder="STATUS "/>

            </SelectTrigger>
            <SelectContent>
                {/* <SelectItem value="">All</SelectItem> */}
                <SelectItem value="Rent">For Rent</SelectItem>
                <SelectItem value="Sale">For Sale</SelectItem>

            </SelectContent>
        </Select>
    </div>

    <div className='flex items-center gap-4 font-abyssinica justify-end mr-[20px]'>
         <Select onValueChange={value => handleFilterChange("propertyType", value)} >
            <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue placeholder="PROPERTY TYPE"/>

            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="House">House</SelectItem>



            </SelectContent>
        </Select>

    </div>
            <div className="flex items-center gap-4 font-abyssinica justify-end mr-[20px]">
        <Select defaultValue="a-z" onValueChange={(value)=> setSort(value ==="z-a" ? "desc" : "asc" )}>
          <SelectTrigger className="w-[160px] border-gray-300">
            <SelectValue placeholder="SORT: SORT A-Z" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a-z">SORT: SORT A-Z</SelectItem>
            <SelectItem value="z-a">SORT: SORT Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
            <FilterIcon  className='h-4 w-4' />
        </Button>
      </div>


    </div>



        {/*
          Card grid: as many equal-width columns (min 220px) as fit the column: 3 on a wide desktop, 2 on a laptop, 1 on a phone.
          Replaces the fixed w-[700px] flex row that left a blank strip on the right
          and overflowed on narrow screens.
        */}
        <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 w-full px-4 sm:px-6 mt-10 mb-10'>
            {isloading && Array(4).fill(0).map((_, index)=> <CardSkeleton key={index}/>)}
        {sortedHouse.length > 0 ? (
            sortedHouse.map((house, index) => (
                <div
                    key={house._id || index}
                    className='min-h-[300px] h-auto w-full pb-4 shadow-lg cursor-pointer'
                    onClick={() => handleCardClick(house)}
                >
                    <img src={house.img} alt='house' loading='lazy' className='w-full h-48 mb-2 object-cover'/>
                    <div  className='flex justify-end mr-3'>
                    <Favourite houseId={house._id} key={house._id} />

                        </div>
                    <h3 className='card-title'>{house.location}</h3>
                    <p className='card-details'>Price: {house.price} </p>
                    <p className='card-details'>Size: {house.size} Anna</p>
                </div>
            ))
        ) : (
            !isloading && (
                <p className='col-span-full flex min-h-[calc(100vh-180px)] w-full items-center justify-center text-center'>No houses available</p>
            )
        )}

        {selectedHouse && (
            <div
                ref={overlayRef}
                onClick={handleBackClick}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
            >
                <div
                    ref={panelRef}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Details for ${selectedHouse.location}`}
                    className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
                >
                    {/* Photo with back + favourite buttons floating on top */}
                    <div className="relative">
                        <img
                            src={selectedHouse.img}
                            alt="House"
                            className="h-[220px] w-full object-cover sm:h-[340px]"
                        />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
                        <button
                            onClick={handleBackClick}
                            aria-label="Close details"
                            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#081740] shadow transition hover:bg-white"
                        >
                            <FontAwesomeIcon icon={faLongArrowLeft} />
                        </button>
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
                            <Favourite houseId={selectedHouse._id} />
                        </div>
                    </div>

                    <div className="p-5 sm:p-8">
                        {/* Title + price */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="font-abyssinica text-2xl font-bold text-[#081740] sm:text-3xl">
                                        {selectedHouse.location}
                                    </h2>
                                    {selectedHouse.status && (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                String(selectedHouse.status).toLowerCase() === 'sale'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-blue-50 text-blue-700'
                                            }`}
                                        >
                                            {String(selectedHouse.status).toLowerCase() === 'sale' ? 'For Sale' : selectedHouse.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                                <p className="text-2xl font-bold text-[#b98604] sm:text-3xl">
                                    Rs. {Number(selectedHouse.price).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        {/* Key facts */}
                        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <dt className="text-xs uppercase tracking-wide text-gray-500">Size</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedHouse.size} Anna</dd>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <dt className="text-xs uppercase tracking-wide text-gray-500">Property Type</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedHouse.propertyType}</dd>
                            </div>
                            <div className="col-span-2 rounded-lg border border-gray-200 p-4 sm:col-span-1">
                                <dt className="text-xs uppercase tracking-wide text-gray-500">Property ID</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedHouse.propertyNumber}</dd>
                            </div>
                        </dl>

                        {/* Agent */}
                        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                {selectedHouse.listedBy?.img ? (
                                    <img
                                        src={selectedHouse.listedBy.img}
                                        alt={selectedHouse.listedBy?.name || 'Agent'}
                                        className="h-16 w-16 rounded-full bg-gray-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#081740] text-xl font-semibold text-white">
                                        {(selectedHouse.listedBy?.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500">Listed by</p>
                                    <p className="font-semibold text-gray-900">{selectedHouse.listedBy?.name || "Anonymous"}</p>
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
                                <HouseMap position={[selectedHouse.latitude, selectedHouse.longitude]} houses={[selectedHouse]} onHouseClick={handleCardClick} />
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <GetinTouch house={selectedHouse} />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>    

    </>
    );
}

export default Card;