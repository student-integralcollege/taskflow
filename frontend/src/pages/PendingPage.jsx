import React, { useState, useMemo } from 'react'
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy'
import { Clock, Filter, ListCheck, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem.jsx';
import TaskModal from '../components/TaskModal.jsx';

const PendingPage = () => {

  // read tasks array the layout provides (name: tasks)
  const { tasks = [], refreshTasks } = useOutletContext() || {};
   const [sortby, setsortby] = useState('newest');
   const [selectedTask, setSelectedTask] = useState(null);
   const [showModal, setShowModal] = useState(false);

  const sortPendingTasks = useMemo(() => {
    const filtered = (tasks || []).filter(
      (t) => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    );
    return filtered.sort((a, b) => {
      if (sortby === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortby === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
    });
  }, [tasks, sortby]);
  
  // minimal handlers used by TaskItem map (prevent undefined reference errors)
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
  }
  const handleDelete = async (id) => {
    const headers = getHeaders(); if (!headers) return;
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE', headers });
    refreshTasks?.();
  }
  const handleToggleComplete = async (id, current) => {
    const headers = getHeaders(); if (!headers) return;
    const isCompleted = [true, 1, 'yes'].includes(typeof current === 'string' ? current.toLowerCase() : current);
    const newStatus = isCompleted ? 'No' : 'Yes';
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'PUT', headers, body: JSON.stringify({ completed: newStatus }) });
    refreshTasks?.();
  }

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <ListCheck className='text-purple-500' /> Pending Task
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7'>
            {sortPendingTasks.length} task{sortPendingTasks.length !== 1 && 's'}
            needing your attention
          </p>
        </div>

        <div className={layoutClasses.sortBox}>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <Filter className='w-4 h-4 text-purple-500' />
            <span className='text-sm'>Sort by:</span>
          </div>

          <select value={sortby} onChange={(e) => setsortby(e.target.value)} className={layoutClasses.select}>
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='priority'>Priority</option>
          </select>

          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setsortby(opt.id)} className={layoutClasses.tabButton(sortby === opt.id)}>
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={layoutClasses.addBox} onClick={() => setShowModal(true)}>
        <div className='flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200'>
            <Plus className='text-purple-500' size={18} />
          </div>
          <span className='font-medium'>Add New Task</span>
        </div>
      </div>

      <div className='space-y-4'>
        {sortPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className='max-w-xs mx-auto py-6'>
              <div className={layoutClasses.emptyIconBg}>
                <Clock className='w-8 h-8 text-purple-500' />
              </div>

              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                All caught up!
              </h3>

              <p className='text-sm text-gray-500 mb-4'>
                No pending tasks - great work!
              </p>
              <button onClick={() => setShowModal(true)} className={layoutClasses.emptyBtn}>
                Create New Task
              </button>
            </div>
          </div>
        ) : (
          sortPendingTasks.map(task => (
            <TaskItem
              key={task.id || task._id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task.id || task._id)}
              onToggleComplete={() => handleToggleComplete(task.id || task._id, task.completed)}
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default PendingPage;
