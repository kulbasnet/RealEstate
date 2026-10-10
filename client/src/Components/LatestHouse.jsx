import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6">
                    <div className="relative h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:h-[calc(100dvh-3rem)] sm:p-6">
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 left-4 text-gray-600 hover:text-black text-xl"
                        >
                            <FontAwesomeIcon icon={faLongArrowLeft} />
                        </button>

                        <img src={selected.img} alt="House" className="w-full h-[200px] sm:h-[285px] mt-9 mb-5 object-cover rounded-lg" />
                        <Favourite houseId={selected._id} />

                        <h2 className="text-2xl font-bold mt-11">{selected.location}</h2>

                        <div className="flex justify-end items-center mt-2">
                            <img src={selected.listedBy?.img || "NO"} className='w-16 h-16 rounded-full object-cover' />
                            <button className='' onClick={
                                () => {
                                    document.getElementById("getInTouchSection")?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    })
                                }
                            }>Book an Agent</button>
                        </div>
                        <p className="mt-2">PRICE: <span className="font-semibold">Rs. {selected.price}</span></p>
                        <p className="mt-2">SIZE: <span className="font-semibold">{selected.size} Anna</span></p>
                        <p className="mt-2">PROPERTY ID: {selected.propertyNumber}</p>
                        <p className="mt-2">PROPERTY TYPE: {selected.propertyType}</p>
                        <p className="mt-2">Status: {selected.status}</p>

                        <HouseMap position={[selected.latitude, selected.longitude]} houses={[selected]} />

                        <div className="mt-4">
                            <GetinTouch house={selected} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    </>
    );
}

export default LatestHouse;