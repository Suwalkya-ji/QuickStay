import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Title from '../components/Title';

const AdminRegister = () => {
    const { axios, getToken, user, getUserData } = useAppContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already admin, redirect to dashboard
        if (user && user.role === 'admin') {
            navigate('/owner');
        }
    }, [user, navigate]);

    const handleRegisterAsAdmin = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                '/api/user/register-as-admin',
                {},
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success('Successfully registered as admin!');
                // Refresh user data to get updated role
                await getUserData();
                // Redirect to dashboard
                navigate('/owner');
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
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title
                title='Become a Hotel Admin'
                subTitle='Register as an admin to list and manage your hotels on Hotel Management'
                align='center'
            />

            <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-playfair mb-4">Why become an admin?</h2>
                        <ul className="text-left space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">✓</span>
                                <span>List multiple hotels on our platform</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">✓</span>
                                <span>Manage room availability and pricing</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">✓</span>
                                <span>Track bookings and revenue in real-time</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">✓</span>
                                <span>Reach thousands of potential customers</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t pt-6">
                        <p className="text-gray-600 mb-6 text-center">
                            By registering as an admin, you'll gain access to our hotel management dashboard
                            where you can list your properties and start accepting bookings.
                        </p>

                        <button
                            onClick={handleRegisterAsAdmin}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register as Admin'}
                        </button>

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Already an admin? <a href="/owner" className="text-blue-600 hover:underline">Go to Dashboard</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
