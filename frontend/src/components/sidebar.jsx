import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { LINK_CLASSES, menuItems, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, TIP_CARD } from '../assets/dummy.jsx'

const Sidebar = ({ user, tasks = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const totalTasks = tasks?.length || 0
  const completedTasks = (tasks?.filter(t => t.completed) || []).length
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const username = user?.name || 'User'
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileOpen])

  const renderMenuItems = (ismobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) => [
              LINK_CLASSES.base,
              isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
              ismobile ? "justify-start" : "lg:justify-start"
            ].join(' ')}
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span className={` ${ismobile ? 'block' : 'hidden lg:block'} ${LINK_CLASSES.text}`}>{text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className={`${SIDEBAR_CLASSES.desktop} top-16`}>
        <div className='p-5 border-purple-100 border-b lg:block hidden'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
              {initial}
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Hey, {username}</h2>
              <p className='text-sm text-purple-500 font-medium flex items-center gap-1'>
                <Sparkles className='w-3 h-3' /> Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div className={PRODUCTIVITY_CARD.barFg} style={{ width: `${productivity}%` }} />
            </div>
          </div>

          {renderMenuItems()}

          <div className='mt-auto pt-6 lg:block hidden'>
            <div className={TIP_CARD.container}>
              <div className='flex items-center gap-2'>
                 <div className={TIP_CARD.iconWrapper}>
                     <lightbulb className='w-5 h-5 text-purple-600' />
                 </div>
                 <div>
                  <h3 className={TIP_CARD.title}>Pro Tip</h3>
                  <p className={TIP_CARD.text}>Use keyboard shortcuts to boost your productivity!</p>
                  <a href="https://Taskflow.com" target='_blank' className='block mt-2 text-sm text-purple-500 hover:underline'>Visit Taskflow</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar