import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Hero = () => {

    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("");

    // Get today's date in YYYY-MM-DD format for min date validation (using local timezone)
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get tomorrow's date for default checkout minimum (using local timezone)
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Handle check-in date change
    const handleCheckInChange = (e) => {
        const selectedCheckIn = e.target.value;
        const today = getTodayDate();

        // Prevent selecting dates before today
        if (selectedCheckIn < today) {
            return; // Don't update if date is in the past
        }

        setCheckIn(selectedCheckIn);

        // If checkout is before or same as new check-in, clear it
        if (checkOut && checkOut <= selectedCheckIn) {
            setCheckOut("");
        }
    };

    // Handle check-out date change
    const handleCheckOutChange = (e) => {
        const selectedCheckOut = e.target.value;

        // Only set if it's after check-in date
        if (!checkIn || selectedCheckOut > checkIn) {
            setCheckOut(selectedCheckOut);
        }
    };

    // Handle guests change to ensure positive values
    const handleGuestsChange = (e) => {
        const value = parseInt(e.target.value);

        // Ensure value is between 1 and 4
        if (value >= 1 && value <= 4) {
            setGuests(value);
        } else if (value > 4) {
            setGuests(4);
        } else if (e.target.value === "") {
            setGuests("");
        } else {
            setGuests(1);
        }
    };

    const onSearch = async (e) => {
        e.preventDefault();

        // Construct URL with all parameters
        const params = new URLSearchParams({
            destination,
            checkIn,
            checkOut,
            guests
        });

        navigate(`/rooms?${params.toString()}`);

        // call api to save recent searched city
        await axios.post('/api/user/store-recent-search', { recentSearchedCity: destination }, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });
        // add destination to searchedCities max 3 recent searched cities
        setSearchedCities((prevSearchedCities) => {
            const updatedSearchedCities = [...prevSearchedCities, destination];
            if (updatedSearchedCities.length > 3) {
                updatedSearchedCities.shift();
            }
            return updatedSearchedCities;
        });
    }

    return (
        <div className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen overflow-hidden'>
            {/* Overlay for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60'></div>

            {/* Animated Content */}
            <motion.div
                className='relative z-10'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.p
                    className='bg-blue-500/80 backdrop-blur-sm px-4 py-2 rounded-full mt-20 inline-block font-semibold shadow-lg'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    ✨ The Ultimate Hotel Experience
                </motion.p>

                <motion.h1
                    className='font-playfair text-3xl md:text-6xl lg:text-7xl font-bold md:font-extrabold max-w-3xl mt-6 leading-tight drop-shadow-2xl'
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Discover Your Perfect Gateway Destination
                </motion.h1>

                <motion.p
                    className='max-w-2xl mt-4 text-base md:text-lg text-gray-100 leading-relaxed drop-shadow-lg'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
                </motion.p>
            </motion.div>

            <motion.form
                onSubmit={onSearch}
                className='relative z-10 bg-white/95 backdrop-blur-md text-gray-700 rounded-2xl shadow-2xl px-6 py-6 mt-10 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto border border-white/20'
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className='flex items-center gap-2 mb-2'>
                        <img src={assets.locationIcon} alt="" className='h-4' />
                        <label htmlFor="destinationInput" className='font-semibold text-sm'>Destination</label>
                    </div>
                    <input
                        list='destinations'
                        onChange={e => setDestination(e.target.value)}
                        value={destination}
                        id="destinationInput"
                        type="text"
                        className="rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full"
                        placeholder="Where to?"
                        required
                    />
                    <datalist id="destinations">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                >
                    <div className='flex items-center gap-2 mb-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn" className='font-semibold text-sm'>Check in</label>
                    </div>
                    <input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={handleCheckInChange}
                        min={getTodayDate()}
                        className="rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full"
                        required
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <div className='flex items-center gap-2 mb-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut" className='font-semibold text-sm'>Check out</label>
                    </div>
                    <input
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        min={checkIn ? (() => {
                            const nextDay = new Date(checkIn);
                            nextDay.setDate(nextDay.getDate() + 1);
                            const year = nextDay.getFullYear();
                            const month = String(nextDay.getMonth() + 1).padStart(2, '0');
                            const day = String(nextDay.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        })() : getTomorrowDate()}
                        className="rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full"
                        required
                    />
                </motion.div>

                <motion.div
                    className='flex md:flex-col max-md:gap-2 max-md:items-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                >
                    <div className='flex items-center gap-2 mb-2'>
                        <img src={assets.guestsIcon} alt="" className='h-4' />
                        <label htmlFor="guests" className='font-semibold text-sm'>Guests</label>
                    </div>
                    <input
                        min={1}
                        max={4}
                        id="guests"
                        type="number"
                        value={guests}
                        onChange={handleGuestsChange}
                        className="rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full md:max-w-24"
                        placeholder="1"
                        required
                    />
                </motion.div>

                <motion.button
                    className='flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-6 text-white my-auto cursor-pointer max-md:w-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-semibold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-6 invert' />
                    <span>Search Hotels</span>
                </motion.button>
            </motion.form>
        </div>
    )
}

export default Hero