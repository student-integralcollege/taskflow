import React from 'react'

const Sidebar = ({ user, tasks }) => {
    return (
        <aside className='hidden xl:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-purple-100 p-4'>
            <div className='text-sm text-gray-700 font-semibold mb-2'>Welcome</div>
            <div className='text-sm text-gray-500 truncate'>{user?.name || 'User'}</div>
            <hr className='my-4 border-purple-100' />
            <div className='text-xs text-gray-400'>Tasks: {Array.isArray(tasks) ? tasks.length : 0}</div>
        </aside>
    )
}

export default Sidebar

