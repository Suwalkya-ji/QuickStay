import { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ListRoom = () => {
    const { axios, getToken, user, currency } = useAppContext();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (roomId) => {
        try {
            const { data } = await axios.post(
                "/api/rooms/toggle-availability",
                { roomId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );
            if (data.success) {
                toast.success(data.message);
                // Update local state immediately
                setRooms(prevRooms =>
                    prevRooms.map(room =>
                        room._id === roomId
                            ? { ...room, isAvailable: !room.isAvailable }
                            : room
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user]);

    return (
        <div className='pb-10'>
            <Title
                align='left'
                font='outfit'
                title='Room Listings'
                subTitle='Manage all your room listings and availability in one place'
            />

            {/* Stats */}
            <div className='flex items-center gap-4 my-6'>
                <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg px-6 py-3 shadow-md'>
                    <div className='text-2xl font-bold'>{rooms.length}</div>
                    <div className='text-xs text-blue-100'>Total Rooms</div>
                </div>
                <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg px-6 py-3 shadow-md'>
                    <div className='text-2xl font-bold'>{rooms.filter(r => r.isAvailable).length}</div>
                    <div className='text-xs text-green-100'>Available</div>
                </div>
                <div className='bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-lg px-6 py-3 shadow-md'>
                    <div className='text-2xl font-bold'>{rooms.filter(r => !r.isAvailable).length}</div>
                    <div className='text-xs text-gray-100'>Unavailable</div>
                </div>
            </div>

            {/* Room List */}
            {loading ? (
                <div className='flex justify-center py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent'></div>
                </div>
            ) : rooms.length === 0 ? (
                <div className='text-center py-16 bg-gray-50 rounded-xl'>
                    <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                    </svg>
                    <p className='text-lg text-gray-500 font-medium'>No rooms added yet</p>
                    <p className='text-sm text-gray-400 mt-1'>Add your first room to start receiving bookings</p>
                </div>
            ) : (
                <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Room</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Amenities</th>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Price</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Status</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {rooms.map((room, index) => (
                                    <motion.tr
                                        key={room._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className='hover:bg-gray-50 transition-colors'
                                    >
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center gap-3'>
                                                {room.images && room.images.length > 0 && (
                                                    <img
                                                        className='w-16 h-16 rounded-lg object-cover'
                                                        src={room.images[0]}
                                                        alt={room.roomType}
                                                    />
                                                )}
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800'>{room.roomType}</p>
                                                    <p className='text-xs text-gray-500'>
                                                        {room.hotel?.name || 'Hotel'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex flex-wrap gap-1'>
                                                {room.amenities.slice(0, 3).map((amenity, i) => (
                                                    <span
                                                        key={i}
                                                        className='inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full'
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {room.amenities.length > 3 && (
                                                    <span className='inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                                        +{room.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div>
                                                <p className='text-sm font-bold text-gray-800'>
                                                    {currency} {room.pricePerNight.toLocaleString()}
                                                </p>
                                                <p className='text-xs text-gray-500'>per night</p>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 text-center'>
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                                                    room.isAvailable
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${
                                                    room.isAvailable ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></span>
                                                {room.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 text-center'>
                                            <label
                                                className='relative inline-flex items-center cursor-pointer'
                                                title={room.isAvailable ? 'Disable Room' : 'Enable Room'}
                                            >
                                                <input
                                                    type='checkbox'
                                                    className='sr-only peer'
                                                    onChange={() => toggleAvailability(room._id)}
                                                    checked={room.isAvailable}
                                                />
                                                <div className='w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                                                <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-md'></span>
                                            </label>
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

export default ListRoom;
