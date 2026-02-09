import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useClerk } from '@clerk/clerk-react';

const FeedbackForm = () => {
    const { user, axios, getToken } = useAppContext();
    const { openSignIn } = useClerk();
    const [formData, setFormData] = useState({
        rating: 5,
        review: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to submit feedback');
            openSignIn();
            return;
        }

        if (!formData.review.trim()) {
            toast.error('Please write your review');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(
                '/api/feedback/submit',
                formData,
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                setFormData({ rating: 5, review: '', location: '' });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto'>
            <h3 className='text-2xl font-playfair font-bold text-center mb-6'>
                Share Your Experience
            </h3>
            <p className='text-gray-600 text-center mb-8'>
                Your feedback helps us improve and helps other travelers make informed decisions
            </p>

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Rating */}
                <div>
                    <label className='block text-sm font-semibold mb-3'>
                        Rating *
                    </label>
                    <div className='flex gap-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type='button'
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className='text-3xl transition-all hover:scale-110'
                            >
                                {star <= formData.rating ? '⭐' : '☆'}
                            </button>
                        ))}
                        <span className='ml-3 text-gray-600 self-center'>
                            {formData.rating} / 5
                        </span>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className='block text-sm font-semibold mb-2'>
                        Your Location (Optional)
                    </label>
                    <input
                        type='text'
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder='e.g., Mumbai, India'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {/* Review */}
                <div>
                    <label className='block text-sm font-semibold mb-2'>
                        Your Review *
                    </label>
                    <textarea
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        placeholder='Share your experience with Hotel Management...'
                        rows='5'
                        maxLength='500'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    <div className='text-sm text-gray-500 text-right mt-1'>
                        {formData.review.length} / 500
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>

                <p className='text-xs text-gray-500 text-center'>
                    Your feedback will be reviewed before being published
                </p>
            </form>
        </div>
    );
};

export default FeedbackForm;
