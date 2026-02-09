import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { testimonials } from '../assets/assets';

const Experiences = () => {
    const { axios } = useAppContext();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/feedback/approved');
            if (data.success && data.feedbacks.length > 0) {
                setFeedbacks(data.feedbacks);
            } else {
                // If no real feedback, show dummy testimonials
                setFeedbacks(testimonials);
            }
        } catch (error) {
            // On error, show dummy testimonials
            setFeedbacks(testimonials);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className='text-2xl'>
                {index < rating ? '⭐' : '☆'}
            </span>
        ));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-white via-slate-50 to-white'>
            {/* Hero Section */}
            <motion.div
                className='relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-28 px-6 md:px-16 lg:px-24 overflow-hidden'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Decorative circles */}
                <div className='absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl'></div>
                <div className='absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl'></div>

                <motion.div
                    className='relative max-w-4xl mx-auto text-center'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className='font-playfair text-4xl md:text-6xl font-bold mb-6'>
                        Guest Experiences
                    </h1>
                    <p className='text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto'>
                        Discover authentic stories from travelers who have experienced the luxury and comfort of Hotel Management. Their journeys inspire our commitment to excellence.
                    </p>
                </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                className='max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-20'
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='text-center'>
                        <div className='text-4xl md:text-5xl font-bold text-blue-600 mb-2'>
                            {feedbacks.length}+
                        </div>
                        <p className='text-gray-600 font-medium'>Happy Guests</p>
                    </div>
                    <div className='text-center'>
                        <div className='text-4xl md:text-5xl font-bold text-blue-600 mb-2'>
                            4.8
                        </div>
                        <p className='text-gray-600 font-medium'>Average Rating</p>
                    </div>
                    <div className='text-center'>
                        <div className='text-4xl md:text-5xl font-bold text-blue-600 mb-2'>
                            98%
                        </div>
                        <p className='text-gray-600 font-medium'>Satisfaction Rate</p>
                    </div>
                </div>
            </motion.div>

            {/* Feedback Grid */}
            <div className='max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pb-32'>
                {loading ? (
                    <div className='flex justify-center py-20'>
                        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600'></div>
                    </div>
                ) : (
                    <motion.div
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                        variants={containerVariants}
                        initial='hidden'
                        animate='visible'
                    >
                        {feedbacks.map((feedback, index) => (
                            <motion.div
                                key={feedback._id || feedback.id || index}
                                variants={cardVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden'
                            >
                                {/* Card Header with gradient */}
                                <div className='h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'></div>

                                <div className='p-8'>
                                    {/* Stars */}
                                    <div className='flex items-center justify-center gap-1 mb-6'>
                                        {renderStars(feedback.rating || 5)}
                                    </div>

                                    {/* Review Text */}
                                    <p className='text-gray-700 text-center leading-relaxed mb-8 min-h-[120px] font-medium'>
                                        "{feedback.review}"
                                    </p>

                                    {/* Divider */}
                                    <div className='w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full'></div>

                                    {/* User Info */}
                                    <div className='flex flex-col items-center'>
                                        <motion.img
                                            className='w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg mb-4'
                                            src={feedback.userImage || feedback.image || 'https://via.placeholder.com/150'}
                                            alt={feedback.userName || feedback.name}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <h3 className='font-playfair text-xl font-bold text-gray-800 mb-1'>
                                            {feedback.userName || feedback.name}
                                        </h3>
                                        <p className='text-gray-500 text-sm flex items-center gap-1'>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                            </svg>
                                            {feedback.location || feedback.address}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Call to Action */}
            <motion.div
                className='bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className='max-w-4xl mx-auto text-center text-white'>
                    <h2 className='font-playfair text-3xl md:text-5xl font-bold mb-6'>
                        Ready to Create Your Own Story?
                    </h2>
                    <p className='text-lg md:text-xl text-blue-100 mb-8 leading-relaxed'>
                        Join thousands of satisfied guests who have discovered luxury and comfort at Hotel Management properties worldwide.
                    </p>
                    <motion.button
                        onClick={() => window.location.href = '/rooms'}
                        className='bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Our Hotels
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Experiences;
