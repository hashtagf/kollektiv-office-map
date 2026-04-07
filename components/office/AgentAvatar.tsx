'use client'

import { motion } from 'framer-motion'

interface Agent {
  id: string
  name: string
  role: string
  title: string
  department: 'engineering' | 'business' | 'operations'
  x: number
  y: number
  status: 'working' | 'meeting' | 'break' | 'available'
  currentActivity?: string
}

interface AgentAvatarProps {
  agent: Agent
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

// Role to emoji mapping
const getRoleEmoji = (role: string) => {
  const roleMap: Record<string, string> = {
    'cto': '👑',
    'product-owner': '📋',
    'scrum-master': '🏃',
    'backend': '⚙️',
    'frontend': '🎨',
    'qa': '🔍',
    'devops': '🚀',
    'solution-engineer': '🔧',
    'content-creator': '✍️',
    'marketing': '📢',
    'sales': '💼',
    'support': '🤝',
    'personal-assistant': '📅',
    'hr': '👥',
    'finance': '💰',
    'legal': '⚖️'
  }
  return roleMap[role] || '💻'
}

// Department to color mapping
const getDepartmentColor = (department: string) => {
  const colorMap = {
    'engineering': '#3b82f6', // blue
    'business': '#10b981',     // emerald
    'operations': '#f59e0b'    // amber
  }
  return colorMap[department as keyof typeof colorMap] || '#6b7280'
}

// Status to indicator color mapping
const getStatusColor = (status: string) => {
  const statusMap = {
    'working': '#10b981',   // green
    'meeting': '#3b82f6',   // blue
    'break': '#f59e0b',     // amber
    'available': '#6b7280'  // gray
  }
  return statusMap[status as keyof typeof statusMap] || '#6b7280'
}

export default function AgentAvatar({ agent, isSelected = false, onClick, className = '' }: AgentAvatarProps) {
  const roleEmoji = getRoleEmoji(agent.role)
  const departmentColor = getDepartmentColor(agent.department)
  const statusColor = getStatusColor(agent.status)
  
  // Generate initials from name
  const initials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  return (
    <motion.div
      className={`absolute cursor-pointer select-none ${className}`}
      style={{
        left: `${agent.x - 24}px`,
        top: `${agent.y - 24}px`,
        zIndex: isSelected ? 50 : 10
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -2, 0] // Subtle floating animation
      }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: parseInt(agent.id.slice(-1), 10) * 0.2 // Stagger animations
        }
      }}
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Main Avatar Container */}
      <div className="relative">
        {/* Selection Ring */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1], 
              opacity: [0, 0.8, 0.6] 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          />
        )}
        
        {/* Avatar Circle */}
        <div
          className="relative w-12 h-12 rounded-full border-3 border-white shadow-lg flex items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: departmentColor,
            boxShadow: isSelected 
              ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px ${departmentColor}30`
              : '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
            <defs>
              <pattern id={`pattern-${agent.id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)" />
                <circle cx="6" cy="6" r="1" fill="rgba(255,255,255,0.1)" />
              </pattern>
            </defs>
            <rect width="48" height="48" fill={`url(#pattern-${agent.id})`} />
          </svg>
          
          {/* Agent Initials */}
          <span className="relative z-10 text-white text-sm font-bold tracking-tight">
            {initials}
          </span>
        </div>
        
        {/* Role Icon */}
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-sm border-2 border-gray-100 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
        >
          <span className="text-xs">{roleEmoji}</span>
        </motion.div>
        
        {/* Status Indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: statusColor }}
          >
            {agent.status === 'working' && (
              <motion.div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: statusColor }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {agent.status === 'meeting' && (
              <motion.div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: statusColor }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Name Label */}
      <motion.div
        className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md shadow-lg border border-gray-700">
          <div className="font-medium">{agent.name.split(' ')[0]}</div>
          <div className="text-gray-300 text-[10px] leading-tight">{agent.role}</div>
        </div>
      </motion.div>
      
      {/* Hover Tooltip */}
      <motion.div
        className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none z-30"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white text-gray-800 text-xs px-3 py-2 rounded-lg shadow-xl border border-gray-200 whitespace-nowrap">
          <div className="font-semibold text-gray-900">{agent.name}</div>
          <div className="text-gray-600">{agent.title}</div>
          <div className="text-gray-500 capitalize">{agent.status}</div>
          {agent.currentActivity && (
            <div className="text-blue-600 mt-1 max-w-32 truncate">{agent.currentActivity}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}