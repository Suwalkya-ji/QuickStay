import React, { useEffect, useState } from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import FeedbackForm from './FeedbackForm';

const Testimonial = () => {
    const { axios } = useAppContext();
    const [feedbacks, setFeedbacks] = useState([]);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
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
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className='text-yellow-500'>
                {index < rating ? '⭐' : '☆'}
            </span>
        ));
    };

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-20'>
            <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose Hotel Management for their exclusive and luxurious accommodations around the world." />

            <div className='flex flex-wrap justify-center gap-6 mt-12'>
                {feedbacks.slice(0, 3).map((feedback, index) => (
                    <div key={feedback._id || feedback.id || index} className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow max-w-sm w-full'>
                        <div className='flex items-center gap-3'>
                            <img
                                className='w-12 h-12 rounded-full object-cover'
                                src={feedback.userImage || feedback.image || 'https://via.placeholder.com/150'}
                                alt={feedback.userName || feedback.name}
                            />
                            <div>
                                <p className='font-playfair text-lg font-semibold'>{feedback.userName || feedback.name}</p>
                                <p className='text-gray-500 text-sm'>{feedback.location || feedback.address}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                            {renderStars(feedback.rating || 5)}
                        </div>
                        <p className='text-gray-600 mt-4 leading-relaxed'>"{feedback.review}"</p>
                    </div>
                ))}
            </div>

            {/* Share Feedback Button */}
            <div className='mt-16'>
                {!showFeedbackForm ? (
                    <button
                        onClick={() => setShowFeedbackForm(true)}
                        className='bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg'
                    >
                        Share Your Feedback
                    </button>
                ) : (
                    <div className='w-full max-w-2xl mt-8'>
                        <button
                            onClick={() => setShowFeedbackForm(false)}
                            className='text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2'
                        >
                            ← Back
                        </button>
                        <FeedbackForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Testimonial;