import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const HotelCard = ({room,index}) => {

    const { currency } = useAppContext();

    return (
        <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)} key={room._id}>
            <motion.div
                className='relative max-w-70 w-full rounded-2xl overflow-hidden bg-white text-gray-500/90 shadow-lg hover:shadow-2xl transition-all duration-300'
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className='relative overflow-hidden h-56'>
                    <motion.img
                        src={room.images[0]}
                        alt="hotel-img"
                        draggable="false"
                        className='w-full h-full object-cover'
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
                    {index % 2 === 0 && (
                        <motion.p
                            className='px-4 py-1.5 absolute top-4 left-4 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-lg'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            ⭐ Best Seller
                        </motion.p>
                    )}
                </div>
                <div className='p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <p className='font-playfair text-xl font-semibold text-gray-800'>{room.hotel.name}</p>
                        <div className='flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg'>
                            <img src={assets.starIconFilled} alt="star-icon" className='w-4' />
                            <span className='text-sm font-semibold text-amber-600'>4.5</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
                        <img src={assets.locationIcon} alt="location-icon" className='w-4' />
                        <span className='line-clamp-1'>{room.hotel.address}</span>
                    </div>
                    <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                        <div>
                            <p className='text-xs text-gray-500'>Starting from</p>
                            <p className='text-2xl font-bold text-blue-600'>{currency}{room.pricePerNight}<span className='text-sm font-normal text-gray-500'>/night</span></p>
                        </div>
                        <motion.button
                            className='px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default HotelCard