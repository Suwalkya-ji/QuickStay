import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import HotelReg from '../../components/HotelReg'
import toast from 'react-hot-toast'

const Layout = () => {

    const { isOwner, navigate, user, showHotelReg } = useAppContext()

    useEffect(() => {
        if (user && !isOwner) {
            toast.error('Access denied. Admin privileges required.')
            navigate('/')
        }
    }, [isOwner, user])

    return (
        <div className='flex flex-col min-h-screen'>
            {showHotelReg && <HotelReg />}
            <Navbar />
            <div className='flex flex-1'>
                <Sidebar />
                <div className='flex-1 p-4 pt-10 md:px-10 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout