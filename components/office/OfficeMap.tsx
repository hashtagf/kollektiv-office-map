'use client'

import { motion } from 'framer-motion'
import AgentAvatar from './AgentAvatar'
import SpeechBubble from './SpeechBubble'

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

interface OfficeMapProps {
  agents: Agent[]
  onAgentClick?: (agent: Agent) => void
  selectedAgent?: Agent | null
  className?: string
}

export default function OfficeMap({ agents, onAgentClick, selectedAgent, className = '' }: OfficeMapProps) {
  return (
    <div className={`relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1200 600"
        className="absolute inset-0"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for patterns and gradients */}
        <defs>
          <pattern id="floorPattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#f9fafb" />
            <rect x="0" y="0" width="20" height="20" fill="#f3f4f6" opacity="0.5" />
            <rect x="20" y="20" width="20" height="20" fill="#f3f4f6" opacity="0.5" />
          </pattern>
          <linearGradient id="deskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="roomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(248,250,252,0.8)" />
          </linearGradient>
        </defs>
        
        {/* Office Floor */}
        <rect x="0" y="0" width="1200" height="600" fill="url(#floorPattern)" />
        
        {/* Main Office Boundary */}
        <rect x="20" y="20" width="1160" height="560" 
              fill="none" 
              stroke="#374151" 
              strokeWidth="3" 
              rx="12" 
              strokeDasharray="none" />
        
        {/* Department Areas */}
        
        {/* Engineering Area */}
        <rect x="50" y="50" width="500" height="360" 
              fill="url(#roomGradient)" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeDasharray="8,4" 
              rx="8" 
              opacity="0.7" />
        <text x="300" y="40" 
              className="text-sm font-semibold fill-blue-600" 
              textAnchor="middle">
          🖥️ Engineering
        </text>
        
        {/* Business Area */}
        <rect x="580" y="50" width="570" height="360" 
              fill="url(#roomGradient)" 
              stroke="#10b981" 
              strokeWidth="2" 
              strokeDasharray="8,4" 
              rx="8" 
              opacity="0.7" />
        <text x="865" y="40" 
              className="text-sm font-semibold fill-emerald-600" 
              textAnchor="middle">
          📈 Business
        </text>
        
        {/* Operations Area */}
        <rect x="300" y="450" width="600" height="120" 
              fill="url(#roomGradient)" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              strokeDasharray="8,4" 
              rx="8" 
              opacity="0.7" />
        <text x="600" y="440" 
              className="text-sm font-semibold fill-amber-600" 
              textAnchor="middle">
          ⚙️ Operations
        </text>
        
        {/* Meeting Rooms */}
        <rect x="50" y="450" width="120" height="100" 
              fill="#fef2f2" 
              stroke="#dc2626" 
              strokeWidth="2" 
              rx="6" />
        <text x="110" y="470" 
              className="text-xs font-medium fill-red-600" 
              textAnchor="middle">
          🏢 Meeting A
        </text>
        
        <rect x="190" y="450" width="90" height="100" 
              fill="#fef2f2" 
              stroke="#dc2626" 
              strokeWidth="2" 
              rx="6" />
        <text x="235" y="470" 
              className="text-xs font-medium fill-red-600" 
              textAnchor="middle">
          📞 Phone
        </text>
        
        <rect x="920" y="450" width="110" height="100" 
              fill="#fef2f2" 
              stroke="#dc2626" 
              strokeWidth="2" 
              rx="6" />
        <text x="975" y="470" 
              className="text-xs font-medium fill-red-600" 
              textAnchor="middle">
          🎯 Focus
        </text>
        
        <rect x="1050" y="450" width="100" height="100" 
              fill="#fef2f2" 
              stroke="#dc2626" 
              strokeWidth="2" 
              rx="6" />
        <text x="1100" y="470" 
              className="text-xs font-medium fill-red-600" 
              textAnchor="middle">
          🤝 Meeting B
        </text>
        
        {/* Common Areas */}
        
        {/* Kitchen/Break Area */}
        <circle cx="1050" cy="150" r="70" 
                fill="#f0f9ff" 
                stroke="#0ea5e9" 
                strokeWidth="2" 
                strokeDasharray="5,5" />
        <text x="1050" y="155" 
              className="text-xs font-medium fill-sky-600" 
              textAnchor="middle">
          ☕ Kitchen
        </text>
        
        {/* Lounge Area */}
        <ellipse cx="150" cy="320" rx="80" ry="60" 
                 fill="#f5f3ff" 
                 stroke="#8b5cf6" 
                 strokeWidth="2" 
                 strokeDasharray="5,5" />
        <text x="150" y="325" 
              className="text-xs font-medium fill-purple-600" 
              textAnchor="middle">
          🛋️ Lounge
        </text>
        
        {/* Workstation Desks */}
        
        {/* Engineering Desks */}
        {/* Row 1 */}
        <rect x="200" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="300" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="400" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="500" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 2 */}
        <rect x="200" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="300" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="400" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="500" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 3 */}
        <rect x="300" y="260" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="400" y="260" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="500" y="260" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Business Desks */}
        {/* Row 1 */}
        <rect x="620" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="720" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="820" y="100" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 2 */}
        <rect x="620" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="720" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="820" y="180" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Row 3 */}
        <rect x="620" y="260" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="720" y="260" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Operations Desks */}
        <rect x="380" y="480" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="480" y="480" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="580" y="480" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="680" y="480" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        <rect x="780" y="480" width="70" height="50" fill="url(#deskGradient)" stroke="#6b7280" strokeWidth="1" rx="4" />
        
        {/* Pathways */}
        <path d="M 20 420 Q 600 380 1180 420" 
              stroke="#9ca3af" 
              strokeWidth="3" 
              strokeDasharray="12,8" 
              fill="none" 
              opacity="0.6" />
        <path d="M 570 20 Q 600 300 570 580" 
              stroke="#9ca3af" 
              strokeWidth="3" 
              strokeDasharray="12,8" 
              fill="none" 
              opacity="0.6" />
        
        {/* Additional decorative elements */}
        <circle cx="60" cy="60" r="8" fill="#10b981" opacity="0.7" />
        <circle cx="1140" cy="60" r="8" fill="#3b82f6" opacity="0.7" />
        <circle cx="60" cy="540" r="8" fill="#f59e0b" opacity="0.7" />
        <circle cx="1140" cy="540" r="8" fill="#ef4444" opacity="0.7" />
      </svg>
      
      {/* Agent Avatars */}
      {agents.map((agent) => (
        <div key={agent.id} className="absolute">
          <AgentAvatar
            agent={agent}
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => onAgentClick?.(agent)}
          />
          
          {/* Speech Bubble for current activity */}
          {agent.currentActivity && (
            <SpeechBubble
              message={agent.currentActivity}
              agentX={agent.x}
              agentY={agent.y}
            />
          )}
        </div>
      ))}
      
      {/* Grid overlay for debugging (can be removed) */}
      {/* <div className="absolute inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-gray-400" style={{ top: `${(i + 1) * 50}px` }} />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-gray-400" style={{ left: `${(i + 1) * 50}px` }} />
        ))}
      </div> */}
    </div>
  )
}