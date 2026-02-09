import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const MyHotels = () => {
    const { axios, getToken, setShowHotelReg } = useAppContext();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const fetchMyHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/my-hotels', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setHotels(data.hotels);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHotel = async (hotelId, hotelName) => {
        // Confirm before deleting
        if (!window.confirm(`Are you sure you want to delete "${hotelName}"? This will also delete all rooms associated with this hotel. This action cannot be undone.`)) {
            return;
        }

        try {
            setDeleting(hotelId);
            const { data } = await axios.delete(`/api/hotels/${hotelId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                // Remove hotel from the list
                setHotels(prevHotels => prevHotels.filter(hotel => hotel._id !== hotelId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleting(null);
        }
    };

    useEffect(() => {
        fetchMyHotels();
    }, []);

    return (
        <div>
            <div className='flex justify-between items-start'>
                <Title
                    align='left'
                    font='outfit'
                    title='My Hotels'
                    subTitle='View and manage all your registered hotels. Add new properties to expand your business.'
                />
                <button
                    onClick={() => setShowHotelReg(true)}
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                    + Add New Hotel
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center items-center py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
            ) : hotels.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20'>
                    <div className='bg-gray-50 border-2 border-gray-200 rounded-lg p-8 max-w-md text-center'>
                        <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                        </svg>
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>No Hotels Registered</h3>
                        <p className='text-gray-600 mb-6'>
                            Start by registering your first hotel to begin accepting bookings.
                        </p>
                        <button
                            onClick={() => setShowHotelReg(true)}
                            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
                        >
                            Register Your First Hotel
                        </button>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
                    {hotels.map((hotel) => (
                        <div key={hotel._id} className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow'>
                            <div className='flex items-start justify-between mb-4'>
                                <div>
                                    <h3 className='text-xl font-semibold text-gray-800'>{hotel.name}</h3>
                                    <p className='text-sm text-gray-500 mt-1'>{hotel.city}</p>
                                </div>
                                <div className='bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium'>
                                    Active
                                </div>
                            </div>

                            <div className='space-y-2 text-sm text-gray-600'>
                                <div className='flex items-start'>
                                    <svg className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                    <span>{hotel.address}</span>
                                </div>

                                <div className='flex items-center'>
                                    <svg className='w-4 h-4 mr-2 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                    </svg>
                                    <span>{hotel.contact}</span>
                                </div>
                            </div>

                            <div className='mt-4 pt-4 border-t border-gray-200 flex items-center justify-between'>
                                <div className='text-xs text-gray-500'>
                                    Registered on {new Date(hotel.createdAt).toLocaleDateString()}
                                </div>
                                <button
                                    onClick={() => handleDeleteHotel(hotel._id, hotel.name)}
                                    disabled={deleting === hotel._id}
                                    className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                    title='Delete Hotel'
                                >
                                    {deleting === hotel._id ? (
                                        <>
                                            <svg className='animate-spin h-3 w-3' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                            </svg>
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyHotels;
