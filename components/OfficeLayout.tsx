'use client'

import { motion } from 'framer-motion'

interface Agent {
  id: string
  name: string
  role: string
  color: string
  x: number
  y: number
  status: 'working' | 'meeting' | 'break' | 'available'
  currentActivity?: string
}

interface OfficeLayoutProps {
  agents: Agent[]
  onAgentClick: (agent: Agent) => void
  selectedAgent: Agent | null
}

export default function OfficeLayout({ agents, onAgentClick, selectedAgent }: OfficeLayoutProps) {
  return (
    <div className="relative w-full h-[600px] office-grid bg-gray-50">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1200 600"
        className="absolute inset-0"
      >
        {/* Office Floor Plan */}
        <rect x="20" y="20" width="1160" height="560" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2" rx="8" />
        
        {/* Engineering Area */}
        <rect x="60" y="60" width="520" height="380" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,5" rx="4" />
        <text x="320" y="50" className="room-label fill-blue-600">Engineering</text>
        
        {/* Business Area */}
        <rect x="620" y="60" width="520" height="380" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" rx="4" />
        <text x="880" y="50" className="room-label fill-green-600">Business</text>
        
        {/* Operations Area */}
        <rect x="340" y="460" width="520" height="120" fill="#fefce8" stroke="#eab308" strokeWidth="2" strokeDasharray="5,5" rx="4" />
        <text x="600" y="450" className="room-label fill-yellow-600">Operations</text>
        
        {/* Meeting Rooms */}
        <rect x="60" y="460" width="120" height="80" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="120" y="500" className="room-label fill-red-600">Meeting A</text>
        
        <rect x="200" y="460" width="120" height="80" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="260" y="500" className="room-label fill-red-600">Meeting B</text>
        
        <rect x="880" y="460" width="120" height="80" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="940" y="500" className="room-label fill-red-600">Meeting C</text>
        
        <rect x="1020" y="460" width="120" height="80" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="1080" y="500" className="room-label fill-red-600">Focus</text>
        
        {/* Kitchen/Break Area */}
        <circle cx="1080" cy="150" r="60" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" />
        <text x="1080" y="155" className="room-label fill-purple-600">Kitchen</text>
        
        {/* Desks - Engineering */}
        {/* Row 1 */}
        <rect x="140" y="120" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="310" y="120" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="480" y="120" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 2 */}
        <rect x="140" y="220" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="310" y="220" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="480" y="220" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 3 */}
        <rect x="140" y="320" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="310" y="320" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="480" y="320" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Desks - Business */}
        {/* Row 1 */}
        <rect x="680" y="120" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="850" y="120" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 2 */}
        <rect x="680" y="220" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="850" y="220" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 3 */}
        <rect x="680" y="320" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="850" y="320" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Desks - Operations */}
        <rect x="410" y="480" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="520" y="480" width="80" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Pathways */}
        <path d="M 20 300 L 1180 300" stroke="#d1d5db" strokeWidth="2" strokeDasharray="10,5" />
        <path d="M 600 20 L 600 580" stroke="#d1d5db" strokeWidth="2" strokeDasharray="10,5" />
      </svg>
      
      {/* Agent Avatars */}
      {agents.map((agent) => (
        <motion.div
          key={agent.id}
          className={`absolute agent-avatar cursor-pointer ${
            selectedAgent?.id === agent.id ? 'ring-4 ring-blue-400 ring-opacity-75' : ''
          }`}
          style={{
            left: `${agent.x - 20}px`,
            top: `${agent.y - 20}px`,
          }}
          animate={{
            x: [0, Math.sin(Date.now() * 0.001 + agent.id.length) * 3, 0],
            y: [0, Math.cos(Date.now() * 0.001 + agent.id.length) * 2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={() => onAgentClick(agent)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Agent Avatar Circle */}
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: agent.color }}
          >
            <span className="text-white text-xs font-bold">
              {agent.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1">
            <div className={`w-3 h-3 rounded-full border border-white ${
              agent.status === 'working' ? 'bg-green-400 animate-pulse' :
              agent.status === 'meeting' ? 'bg-blue-400 animate-pulse' :
              agent.status === 'break' ? 'bg-yellow-400' :
              'bg-gray-400'
            }`}></div>
          </div>
          
          {/* Name Label */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {agent.name.split(' ')[0]}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}