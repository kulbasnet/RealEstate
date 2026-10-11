import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Favourite from './Favourite';
import { CardTitle, Card, CardDescription } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GetinTouch from './GetinTouch';
import { useNavigate } from 'react-router-dom';
import HouseMap from './HouseMap';
import CardSkeleton from './CardSkeleton';

function LatestHouse() {
    const [latest, setLatest] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isloading, setLoading] = useState(true);
    const navigate = useNavigate();
    const overlayRef = useRef(null);
    const panelRef = useRef(null);

    const closeDetails = () => setSelected(null);

    // Details popup: close on Esc, and a soft fade/rise on open (skipped for reduced motion)
    useEffect(() => {
        if (!selected) return;

        const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
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
    }, [selected]);

    useEffect(() => {
        const getLatestHouse = async () => {
            try {
                const response = await axios.get("/house/getLatestHouse");
                setLatest(response.data.Houses);
            } catch (error) {
                console.log("Sorry", error);
            } finally {
                // stop the skeleton even if the request fails
                setLoading(false);
            }
        };

        getLatestHouse();
    }, []);

    return (
    <>
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                <div>
                    <h2 className="font-semibold text-2xl sm:text-3xl">Latest Homes</h2>
                    <p className="mt-1 text-sm text-gray-600 sm:text-base">Recently added listings</p>
                </div>
                {latest.length > 4 && (
                    <div className="flex shrink-0 gap-2">
                        <button
                            aria-label="Show previous homes"
                            onClick={() => setCurrentIndex((prev) => Math.max(prev - 4, 0))}
                            disabled={currentIndex === 0}
                            className="rounded-full bg-white p-2 shadow transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ←
                        </button>
                        <button
                            aria-label="Show more homes"
                            onClick={() => setCurrentIndex((prev) => prev + 4)}
                            disabled={currentIndex + 4 >= latest.length}
                            className="rounded-full bg-white p-2 shadow transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/*
              Phones: one horizontally swipeable row.
              md+: a grid (2 columns, then 4 from lg) with no inner scrollbars.
            */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 pt-1 pb-4 sm:gap-6 md:grid md:grid-cols-2 md:overflow-visible md:snap-none lg:grid-cols-4">
                {isloading && Array(4).fill(0).map((_, index) => <CardSkeleton key={index} latest={10} />)}
                {latest.length > 0 ? (
                    latest
                        .slice(currentIndex, currentIndex + 4)
                        .map((house) => (
                            <Card
                                key={house._id}
                                className="flex h-auto w-[min(85vw,280px)] shrink-0 snap-start flex-col overflow-hidden cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-xl md:w-full md:shrink"
                                onClick={() => {
                                    setSelected(house)
                                    console.log("clicked House", house);
                                }}
                            >
                                <img
                                    src={house.img}
                                    alt="house"
                                    className="w-full h-48 mb-2 object-cover"
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
                        ))
                ) : (
                    <p></p>
                )}
            </div>

            {selected && (
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
                        aria-label={`Details for ${selected.location}`}
                        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
                    >
                        {/* Photo with back + favourite buttons floating on top */}
                        <div className="relative">
                            <img
                                src={selected.img}
                                alt="House"
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
                                <Favourite houseId={selected._id} />
                            </div>
                        </div>

                        <div className="p-5 sm:p-8">
                            {/* Title + price */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="font-abyssinica text-2xl font-bold text-[#081740] sm:text-3xl">
                                            {selected.location}
                                        </h2>
                                        {selected.status && (
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    String(selected.status).toLowerCase() === 'sale'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-blue-50 text-blue-700'
                                                }`}
                                            >
                                                {String(selected.status).toLowerCase() === 'sale' ? 'For Sale' : selected.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                                    <p className="text-2xl font-bold text-[#b98604] sm:text-3xl">
                                        Rs. {Number(selected.price).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            {/* Key facts */}
                            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <dt className="text-xs uppercase tracking-wide text-gray-500">Size</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selected.size} Anna</dd>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <dt className="text-xs uppercase tracking-wide text-gray-500">Property Type</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selected.propertyType}</dd>
                                </div>
                                <div className="col-span-2 rounded-lg border border-gray-200 p-4 sm:col-span-1">
                                    <dt className="text-xs uppercase tracking-wide text-gray-500">Property ID</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selected.propertyNumber}</dd>
                                </div>
                            </dl>

                            {/* Agent */}
                            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    {selected.listedBy?.img ? (
                                        <img
                                            src={selected.listedBy.img}
                                            alt={selected.listedBy?.name || 'Agent'}
                                            className="h-16 w-16 rounded-full bg-gray-200 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#081740] text-xl font-semibold text-white">
                                            {(selected.listedBy?.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">Listed by</p>
                                        <p className="font-semibold text-gray-900">{selected.listedBy?.name || "Anonymous"}</p>
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
                                    <HouseMap position={[selected.latitude, selected.longitude]} houses={[selected]} />
                                </div>
                            </div>

                            {/* Contact form */}
                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <GetinTouch house={selected} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    </>
    );
}

export default LatestHouse;