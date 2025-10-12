import React, { useCallback, useEffectEvent, useState } from 'react'
import Navbar from './Navbar'
import { Sidebar } from 'lucide-react'
import { Outlet } from 'react-router-dom';
import axios from 'axios';

const Layout = ({ user, onLogout }) => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No auth token found');
            const { data } = await axios.get('https://loalhost:5000/api/task/gp', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const arr = Array.isArray(data) ? data :
                Array.isArray(data?.data) ? data.data : [];
            setTasks(arr);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not load tasks');
            if (err.response?.status === 401) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [onLogout]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed === true || t.completed === 1 || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')).length;
        const totalcount = tasks.length;
        const pendingcount = totalcount - completedTasks;
        const completedPercentage = totalcount === 0 ? 0 : Math.round((completedTasks / totalcount) * 100);
        return { completedTasks, totalcount, pendingcount, completedPercentage };
    }, [tasks]);

    const statcard = (title, value, icon) => (
        <div className=' p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-100 group'>
            <div className='flex items-center gap-2'>
                <div className='p-3 rounded-lg bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20 '>
                    {icon}
                </div>
                <div className='min-w-0'>
                    <p className='text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'>{title}</p>
                    <p>{value}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar user={user} onLogout={onLogout} />
            <Sidebar user={user} tasks={tasks} />

            <div className='ml-0 xl:ml-64 lg:ml-16 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300'>
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
                    <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
                        <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout