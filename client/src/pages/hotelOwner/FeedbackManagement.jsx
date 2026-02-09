import { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const FeedbackManagement = () => {
    const { axios, getToken, toast } = useAppContext();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/feedback/all', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setFeedbacks(data.feedbacks);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (feedbackId) => {
        try {
            const { data } = await axios.put(
                `/api/feedback/approve/${feedbackId}`,
                {},
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                setFeedbacks(prevFeedbacks =>
                    prevFeedbacks.map(feedback =>
                        feedback._id === feedbackId
                            ? { ...feedback, isApproved: true }
                            : feedback
                    )
                );
                toast.success('Feedback approved successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            const { data } = await axios.delete(`/api/feedback/${feedbackId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setFeedbacks(prevFeedbacks =>
                    prevFeedbacks.filter(feedback => feedback._id !== feedbackId)
                );
                toast.success('Feedback deleted successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className='text-sm text-yellow-400'>
                {index < rating ? '⭐' : '☆'}
            </span>
        ));
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        if (filter === 'pending') return !feedback.isApproved;
        if (filter === 'approved') return feedback.isApproved;
        return true;
    });

    const stats = {
        total: feedbacks.length,
        pending: feedbacks.filter(f => !f.isApproved).length,
        approved: feedbacks.filter(f => f.isApproved).length,
        avgRating: feedbacks.length > 0
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
            : 0
    };

    return (
        <div className='pb-10'>
            <Title
                align='left'
                font='outfit'
                title='Feedback Management'
                subTitle='Review, approve, and manage user feedback efficiently'
            />

            {/* Stats Cards - Compact */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 my-6'>
                <motion.div
                    className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md'
                    whileHover={{ scale: 1.02 }}
                >
                    <div className='text-2xl font-bold'>{stats.total}</div>
                    <div className='text-xs text-blue-100 mt-1'>Total Feedback</div>
                </motion.div>
                <motion.div
                    className='bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-md'
                    whileHover={{ scale: 1.02 }}
                >
                    <div className='text-2xl font-bold'>{stats.pending}</div>
                    <div className='text-xs text-yellow-100 mt-1'>Pending Review</div>
                </motion.div>
                <motion.div
                    className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-md'
                    whileHover={{ scale: 1.02 }}
                >
                    <div className='text-2xl font-bold'>{stats.approved}</div>
                    <div className='text-xs text-green-100 mt-1'>Approved</div>
                </motion.div>
                <motion.div
                    className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-md'
                    whileHover={{ scale: 1.02 }}
                >
                    <div className='text-2xl font-bold'>{stats.avgRating}</div>
                    <div className='text-xs text-purple-100 mt-1'>Avg Rating</div>
                </motion.div>
            </div>

            {/* Filter Buttons - Compact */}
            <div className='flex flex-wrap gap-2 mb-6'>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'all'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'pending'
                            ? 'bg-yellow-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Pending ({stats.pending})
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'approved'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Approved ({stats.approved})
                </button>
            </div>

            {/* Feedback Table - Compact and Professional */}
            {loading ? (
                <div className='flex justify-center items-center py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent'></div>
                </div>
            ) : filteredFeedbacks.length === 0 ? (
                <div className='text-center py-16 bg-gray-50 rounded-xl'>
                    <div className='text-5xl mb-3'>📭</div>
                    <p className='text-lg text-gray-500 font-medium'>No feedback to display</p>
                    <p className='text-sm text-gray-400 mt-1'>Check back later for new submissions</p>
                </div>
            ) : (
                <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Guest</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Rating</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Review</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Date</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Status</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {filteredFeedbacks.map((feedback) => (
                                    <motion.tr
                                        key={feedback._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='hover:bg-gray-50 transition-colors'
                                    >
                                        <td className='px-4 py-3'>
                                            <div className='flex items-center gap-3'>
                                                <img
                                                    className='w-10 h-10 rounded-full object-cover'
                                                    src={feedback.userImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(feedback.userName)}
                                                    alt={feedback.userName}
                                                />
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800'>{feedback.userName}</p>
                                                    <p className='text-xs text-gray-500'>{feedback.location || 'Unknown'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex items-center gap-1'>
                                                {renderStars(feedback.rating)}
                                                <span className='text-xs text-gray-600 ml-1'>({feedback.rating})</span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <p className='text-sm text-gray-700 line-clamp-2 max-w-md'>
                                                "{feedback.review}"
                                            </p>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className='px-4 py-3'>
                                            {feedback.isApproved ? (
                                                <span className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                                                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                                    </svg>
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className='inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full'>
                                                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                                                    </svg>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex items-center justify-center gap-2'>
                                                {!feedback.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(feedback._id)}
                                                        className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
                                                        title='Approve'
                                                    >
                                                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(feedback._id)}
                                                    className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                                                    title='Delete'
                                                >
                                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z' clipRule='evenodd' />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackManagement;
