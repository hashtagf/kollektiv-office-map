'use client'

import React from 'react'
import type { Agent } from '../types/agent'

interface AgentAvatarProps {
  agent: Agent
  size?: number
  showLabel?: boolean
  showStatus?: boolean
  onClick?: () => void
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 40,
  showLabel = true,
  showStatus = true,
  onClick
}) => {
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working': return '#22C55E' // Green
      case 'meeting': return '#3B82F6' // Blue
      case 'break': return '#F59E0B' // Orange
      case 'idle': return '#6B7280' // Gray
      default: return '#6B7280'
    }
  }

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'working': return 'Working'
      case 'meeting': return 'In Meeting'
      case 'break': return 'On Break'
      case 'idle': return 'Idle'
      default: return 'Unknown'
    }
  }

  return (
    <div 
      className={`relative group ${
        onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''
      }`}
      onClick={onClick}
    >
      {/* Main Avatar Circle */}
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          className="drop-shadow-md"
        >
          {/* Outer status ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 4) / 2}
            fill="none"
            stroke={getStatusColor(agent.status)}
            strokeWidth="2"
            className="transition-colors duration-300"
          />
          
          {/* Main avatar circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 8) / 2}
            fill={agent.avatarColor}
            className="transition-all duration-300"
          />
          
          {/* Emoji icon */}
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.35}
            className="pointer-events-none select-none"
          >
            {agent.emoji}
          </text>
        </svg>
        
        {/* Conversation indicator */}
        {agent.isInConversation && (
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
            title="In conversation"
          />
        )}
        
        {/* Moving indicator */}
        {agent.isMoving && (
          <div 
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            title="Moving"
          />
        )}
      </div>
      
      {/* Name label */}
      {showLabel && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-800 shadow-sm whitespace-nowrap">
            {agent.name}
          </div>
          <div className="text-xs text-gray-600 text-center mt-0.5">
            {agent.title}
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      {showStatus && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getStatusColor(agent.status) }}
            title={getStatusText(agent.status)}
          />
        </div>
      )}
      
      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm whitespace-nowrap">
          <div className="font-medium">{agent.name}</div>
          <div className="text-gray-300 text-xs">{agent.title}</div>
          <div className="text-gray-400 text-xs mt-1">
            Status: {getStatusText(agent.status)}
          </div>
          {agent.lastActivity && (
            <div className="text-gray-400 text-xs">
              Last: {agent.lastActivity}
            </div>
          )}
          {agent.currentTask && (
            <div className="text-gray-400 text-xs">
              Task: {agent.currentTask}
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentAvatar