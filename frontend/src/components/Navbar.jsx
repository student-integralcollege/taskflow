import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Zap, ChevronDown, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuref = useRef(null);

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    }

    const handleLogout = () => {
        setIsMenuOpen(false);
        onLogout && onLogout();
    }

    return (
        <header className='sticky top-0 bg-white/90 backdrop-blur-md shadow-sm'>
            <div className='flex items-center justify-between px-3 py-2 md:px-4 max-w-5xl mx-auto'>
                {/* Left: Logo & Title */}
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
                    <div className='relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-sm transition-transform duration-200'>
                        <Zap className="text-white w-5 h-5" />
                        <div className='absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-full shadow animate-ping' />
                    </div>
                    <span className='text-xl font-extrabold bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide'>
                        TaskFlow
                    </span>
                </div>

                {/* Right: Settings Button */}
                <div className='flex items-center gap-3'>
                    <button
                        className='p-1 text-gray-600 rounded-full hover:text-purple-500 hover:bg-purple-50 transition-colors duration-200'
                        onClick={() => navigate('/profile')}
                        aria-label='Open profile settings'
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* user dropdown*/}
                    <div ref={menuref} className='relative'>
                        <button onClick={handleMenuToggle} className='flex items-center gap-2 px-2 py-1 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-200 border border-transparent' aria-haspopup='menu' aria-expanded={isMenuOpen}>
                            <div className='relative w-8 h-8'>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className='w-8 h-8 rounded-full shadow-sm' />
                                ) : (
                                    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-sm' >
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}

                                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-pulse' />
                            </div>

                            <div className='text-left hidden md:block'>
                                <p className='text-sm font-medium text-gray-800'>{user?.name || 'User'}</p>
                                <p className='text-xs text-gray-500 font-normal'>{user?.email || ''}</p>
                            </div>

                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen && (
                            <ul className='absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-purple-100 z-50 overflow-hidden' role='menu'>
                                <li className='p-2' role='none'>
                                    <button onClick={() => { setIsMenuOpen(false); navigate('/profile') }} className='w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200' role='menuitem'>
                                        Profile
                                    </button>
                                </li>
                                <li className='p-2 border-t border-purple-100' role='none'>
                                    <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className='w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2' role='menuitem'>
                                        <LogOut className='w-4 h-4' />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar;