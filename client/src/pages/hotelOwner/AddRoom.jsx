import { useState, useEffect } from 'react';
import Title from '../../components/Title';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const AddRoom = () => {
    const { axios, getToken } = useAppContext();

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: '',
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    });

    // Handle price change to ensure positive values only
    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value);

        // Allow empty string for user to clear input
        if (e.target.value === '') {
            setInputs({ ...inputs, pricePerNight: '' });
            return;
        }

        // Ensure value is positive
        if (value > 0) {
            setInputs({ ...inputs, pricePerNight: value });
        } else {
            setInputs({ ...inputs, pricePerNight: 1 });
        }
    };

    // Handle image deletion
    const handleDeleteImage = (key) => {
        setImages({ ...images, [key]: null });
    };

    const fetchMyHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/my-hotels', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setHotels(data.hotels);
                if (data.hotels.length > 0) {
                    setSelectedHotel(data.hotels[0]._id);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchMyHotels();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!selectedHotel) {
            toast.error("Please select a hotel first");
            return;
        }

        if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
            toast.error("Please fill in all the details");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('hotelId', selectedHotel);
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);
            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
            formData.append('amenities', JSON.stringify(amenities));

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key]);
            });

            const { data } = await axios.post('/api/rooms/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } });

            if (data.success) {
                toast.success(data.message);
                setInputs({
                    roomType: '',
                    pricePerNight: '',
                    amenities: {
                        'Free WiFi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false
                    }
                });
                setImages({ 1: null, 2: null, 3: null, 4: null });
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
        <motion.form
            onSubmit={onSubmitHandler}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='pb-10'
        >
            <Title
                align='left'
                font='outfit'
                title='Add Room'
                subTitle='Create new room listings with detailed information and attractive photos'
            />

            {/* Main Content Card */}
            <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6'>
                {/* Hotel Selection */}
                <div className='mb-8'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Select Hotel <span className='text-red-500'>*</span>
                    </label>
                    <select
                        className='w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        value={selectedHotel}
                        onChange={(e) => setSelectedHotel(e.target.value)}
                        required
                    >
                        <option value=''>Choose a hotel</option>
                        {hotels.map((hotel) => (
                            <option key={hotel._id} value={hotel._id}>
                                {hotel.name} - {hotel.city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload Section */}
                <div className='mb-8'>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Room Images <span className='text-red-500'>*</span>
                        <span className='text-xs text-gray-500 font-normal ml-2'>(Upload up to 4 images)</span>
                    </label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {Object.keys(images).map((key) => (
                            <div key={key} className='relative'>
                                <motion.label
                                    htmlFor={images[key] ? '' : `roomImage${key}`}
                                    className='relative group cursor-pointer block'
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className='aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors overflow-hidden bg-gray-50'>
                                        {images[key] ? (
                                            <img
                                                className='w-full h-full object-cover'
                                                src={URL.createObjectURL(images[key])}
                                                alt={`Room ${key}`}
                                            />
                                        ) : (
                                            <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                                <svg className='w-10 h-10 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                                </svg>
                                                <span className='text-xs'>Upload Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        id={`roomImage${key}`}
                                        hidden
                                        onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
                                    />
                                </motion.label>

                                {/* Delete Button - Only show when image exists */}
                                {images[key] && (
                                    <motion.button
                                        type='button'
                                        onClick={() => handleDeleteImage(key)}
                                        className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all z-10'
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title='Delete image'
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </motion.button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Details */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Room Type <span className='text-red-500'>*</span>
                        </label>
                        <select
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                            value={inputs.roomType}
                            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
                            required
                        >
                            <option value=''>Select Room Type</option>
                            <option value='Single Bed'>Single Bed</option>
                            <option value='Double Bed'>Double Bed</option>
                            <option value='Luxury Room'>Luxury Room</option>
                            <option value='Family Suite'>Family Suite</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Price per Night <span className='text-red-500'>*</span>
                        </label>
                        <div className='relative'>
                            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>₹</span>
                            <input
                                type='number'
                                placeholder='1000'
                                min='1'
                                step='1'
                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                                value={inputs.pricePerNight}
                                onChange={handlePriceChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Amenities
                    </label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                        {Object.keys(inputs.amenities).map((amenity, index) => (
                            <motion.label
                                key={index}
                                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    inputs.amenities[amenity]
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <input
                                    type='checkbox'
                                    className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                                    checked={inputs.amenities[amenity]}
                                    onChange={() => setInputs({
                                        ...inputs,
                                        amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] }
                                    })}
                                />
                                <span className={`text-sm font-medium ${
                                    inputs.amenities[amenity] ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                    {amenity}
                                </span>
                            </motion.label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                type='submit'
                className='mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {loading ? (
                    <span className='flex items-center gap-2'>
                        <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Adding Room...
                    </span>
                ) : (
                    <span className='flex items-center gap-2'>
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
                        </svg>
                        Add Room
                    </span>
                )}
            </motion.button>
        </motion.form>
    );
};

export default AddRoom;
