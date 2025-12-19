import React, { useMemo, useState } from 'react'
import { CT_CLASSES, SORT_OPTIONS } from '../assets/dummy'
import { CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem.jsx';

const CompletePage = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortby, setsortby] = useState('newest');

  const sortedTasks = useMemo(() => {
    return tasks
      .filter(task => [true, 'yes', 1].includes(
        typeof task.completed === "string" ? task.completed.toLowerCase() : task.completed
      ))
      .sort((a, b) => {
        switch (sortby) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'priority':
            const order = { 'high': 3, 'medium': 2, 'low': 1 };
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
          default:
            return 0;
        }
      })
  }, [tasks, sortby]);

  return (
    <div className={CT_CLASSES.page}>
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className='text-purple-500 w-5 h-5 md:w-6 md:h-6' />
            <span className='truncate'>Completed Tasks</span>
          </h1>

          <p className={CT_CLASSES.subtitle}>
            {sortedTasks.length} task{sortedTasks.length !== 1 && 's'} {' '} marked as complete
          </p>
        </div>

        {/* Sort control */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
               <filter className='w-4 h-4 text-purple-500' />
               <span className='text-xs md:text-sm'>Sort by:</span>
            </div>
            {/* Dropdown to select sort option */}
            <select value={sortby} onChange={(e) => setsortby(e.target.value)} className={CT_CLASSES.select}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label} {opt.id === 'newest' ? 'first' : ''}</option>
              ))}
            </select>

            {/* Desktop button */}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setsortby(opt.id)} className={[CT_CLASSES.btnBase, sortby === opt.id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive].join(' ')}>
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className={CT_CLASSES.list}>
        {sortedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 text-purple-500 md-4" />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>No completed tasks yet!</h3>
            <p className={CT_CLASSES.emptyText}>Complete some tasks and they will appear here!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task.id || task._id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className='opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base'
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletePage