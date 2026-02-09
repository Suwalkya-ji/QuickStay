import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';
import { motion } from 'framer-motion';

const RecommendedHotels = () => {

    const { rooms, searchedCities } = useAppContext();

    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        const filteredHotels = rooms.slice().filter(room => searchedCities.includes(room.hotel.city));
        setRecommended(filteredHotels);
    }

    useEffect(() => {
        filterHotels()
    }, [rooms, searchedCities])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return recommended.length > 0 && (
        <motion.div
            className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-slate-50 to-white py-20'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <Title title="Recommended Hotels" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />
            <motion.div
                className='flex flex-wrap items-center justify-center gap-6 mt-20'
                variants={containerVariants}
            >
                {recommended.slice(0, 4).map((room, index) => (
                    <motion.div key={room._id} variants={itemVariants}>
                        <HotelCard room={room} index={index} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default RecommendedHotels