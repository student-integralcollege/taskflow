import React, { useEffect, useState } from 'react'
import { DEFAULT_TASK } from '../assets/dummy';
import { PlusCircle, Save, X } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/tasks';

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
    const [taskData, setTaskData] = useState(DEFAULT_TASK);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!isOpen) return;
        if (taskToEdit) {
            const normalized = taskToEdit.completed === 'yes' || taskToEdit.completed === true ? 'Yes' : 'No';
            setTaskData({
                ...DEFAULT_TASK,
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                priority: taskToEdit.priority || 'Low',
                dueDate: taskToEdit.dueDate?.split('T')[0] || '',
                completed: normalized,
                id: taskToEdit._id,
            });
        }
        else{
            setTaskData(DEFAULT_TASK);
        }
        setError(null);
    }, [isOpen, taskToEdit]);

    return (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center'>
            <div className='bg-white border border-purple-100 rounded-xl w-full max-w-md shadow-lg p-6 relative animate-fadeIn'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        {taskData.id ? <Save className='text-purple-500 w-5 h-5' /> :
                         <PlusCircle className='text-purple-500 w-5 h-5' />}
                        {taskData.id ? 'Edit Task' : 'Create New Task'}
                    </h2>

                    <button onClick={onClose} className='p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                
            </div>
        </div>
    )
}

export default TaskModal