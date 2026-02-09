import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
    const stats = [
        { number: '500+', label: 'Luxury Hotels' },
        { number: '100+', label: 'Cities Worldwide' },
        { number: '50K+', label: 'Happy Guests' },
        { number: '4.9', label: 'Average Rating' }
    ];

    const values = [
        {
            icon: '🌟',
            title: 'Excellence',
            description: 'We curate only the finest hotels that meet our stringent quality standards.'
        },
        {
            icon: '🤝',
            title: 'Trust',
            description: 'Your satisfaction is our priority. We ensure transparent pricing and secure bookings.'
        },
        {
            icon: '💎',
            title: 'Luxury',
            description: 'Experience world-class accommodations with exclusive amenities and services.'
        },
        {
            icon: '🌍',
            title: 'Global Reach',
            description: 'From bustling cities to serene retreats, we connect you to destinations worldwide.'
        }
    ];

    const team = [
        {
            name: 'Dinesh Suwalkya',
            role: 'CEO & Founder',
            image: 'https://plus.unsplash.com/premium_photo-1664298503962-9e633a8fd13f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            description: 'Full Stack Developer'
        }
    ];

    return (
        <div className='pt-20 md:pt-24'>
            {/* Hero Section */}
            <div className='relative h-[60vh] md:h-[70vh] flex items-center justify-center'>
                <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000)',
                    }}
                >
                    <div className='absolute inset-0 bg-black/50'></div>
                </div>
                <div className='relative z-10 text-center text-white px-4'>
                    <h1 className='text-4xl md:text-6xl font-playfair font-bold mb-6'>
                        About Hotel Management
                    </h1>
                    <p className='text-lg md:text-xl max-w-2xl mx-auto'>
                        Your gateway to extraordinary stays and unforgettable experiences around the world
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24'>
                <div className='max-w-4xl mx-auto'>
                    <h2 className='text-3xl md:text-4xl font-playfair font-bold text-center mb-8'>
                        Our Story
                    </h2>
                    <div className='space-y-6 text-gray-700 leading-relaxed'>
                        <p className='text-lg'>
                            Founded in 2025, Hotel Management was born from a simple yet powerful vision:
                            to make luxury travel accessible and effortless for discerning travelers worldwide.
                            We recognized that finding the perfect accommodation should be an exciting part of
                            the journey, not a stressful task.
                        </p>
                        <p className='text-lg'>
                            Today, we partner with over 500 handpicked hotels across 100+ cities, offering
                            everything from boutique stays in historic neighborhoods to lavish resorts on
                            pristine beaches. Each property in our collection is personally vetted to ensure
                            it meets our high standards for quality, service, and unique character.
                        </p>
                        <p className='text-lg'>
                            Our platform combines cutting-edge technology with personalized service, making
                            it easy to discover, compare, and book your ideal accommodation. Whether you're
                            planning a romantic getaway, a family vacation, or a business trip, Hotel Management
                            is here to make your stay extraordinary.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-16 md:py-20'>
                <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
                        {stats.map((stat, index) => (
                            <div key={index} className='text-center text-white'>
                                <div className='text-4xl md:text-5xl font-bold mb-2'>
                                    {stat.number}
                                </div>
                                <div className='text-sm md:text-base opacity-90'>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24 bg-slate-50'>
                <h2 className='text-3xl md:text-4xl font-playfair font-bold text-center mb-12'>
                    Our Core Values
                </h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {values.map((value, index) => (
                        <div key={index} className='bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'>
                            <div className='text-5xl mb-4'>{value.icon}</div>
                            <h3 className='text-xl font-bold mb-3'>{value.title}</h3>
                            <p className='text-gray-600 leading-relaxed'>
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24'>
                <h2 className='text-3xl md:text-4xl font-playfair font-bold text-center mb-4'>
                    Meet Our Founder
                </h2>
                <p className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
                    Passionate professional dedicated to making your travel dreams a reality
                </p>
                <div className='flex justify-center'>
                    {team.map((member, index) => (
                        <div key={index} className='text-center group max-w-md'>
                            <div className='relative mb-6 overflow-hidden rounded-2xl'>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className='w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                            <h3 className='text-2xl font-bold mb-2'>{member.name}</h3>
                            <p className='text-blue-600 font-semibold mb-2'>{member.role}</p>
                            <p className='text-gray-600'>{member.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission Section */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24 bg-gray-900 text-white'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h2 className='text-3xl md:text-4xl font-playfair font-bold mb-6'>
                        Our Mission
                    </h2>
                    <p className='text-lg md:text-xl leading-relaxed mb-8'>
                        To transform the way people discover and experience luxury accommodations by
                        providing a seamless, trustworthy platform that connects travelers with the
                        world's finest hotels. We're committed to making every stay memorable, every
                        booking effortless, and every journey extraordinary.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className='bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors'
                        >
                            Explore Hotels
                        </button>
                        <button className='border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors'>
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24'>
                <h2 className='text-3xl md:text-4xl font-playfair font-bold text-center mb-12'>
                    Why Choose Hotel Management?
                </h2>
                <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
                    <div className='flex gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold'>
                            ✓
                        </div>
                        <div>
                            <h3 className='text-xl font-bold mb-2'>Handpicked Selection</h3>
                            <p className='text-gray-600'>
                                Every hotel is carefully selected and verified to ensure exceptional quality and service.
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold'>
                            ✓
                        </div>
                        <div>
                            <h3 className='text-xl font-bold mb-2'>Best Price Guarantee</h3>
                            <p className='text-gray-600'>
                                We offer competitive rates and exclusive deals you won't find anywhere else.
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold'>
                            ✓
                        </div>
                        <div>
                            <h3 className='text-xl font-bold mb-2'>24/7 Support</h3>
                            <p className='text-gray-600'>
                                Our dedicated team is always available to assist you before, during, and after your stay.
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold'>
                            ✓
                        </div>
                        <div>
                            <h3 className='text-xl font-bold mb-2'>Secure Booking</h3>
                            <p className='text-gray-600'>
                                Advanced encryption and secure payment processing protect your personal information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
