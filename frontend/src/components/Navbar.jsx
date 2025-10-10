import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <header className='sticky top-0 bg-white/90 backdrop-blur-md shadow-sm p-4'>
            <div className='flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>
                <div className='flex items-center gap-2 group cursor-pointer' onClick={() => navigate('/')}>
                    <div className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300'>
                        <Zap className="text-white w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar