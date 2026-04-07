'use client'

import React from 'react'
import { Agent } from '@/types/agent'

interface SpeechBubbleProps {
  agent: Agent
  className?: string
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ agent, className = '' }) => {
  if (!agent.currentTask && !agent.isInConversation) {
    return null
  }

  const bubbleText = agent.isInConversation 
    ? `Talking with ${agent.conversationPartner}`
    : agent.currentTask || ''

  if (!bubbleText) return null

  return (
    <div className={`absolute pointer-events-none z-20 ${className}`}
         style={{
           left: agent.position.x + 30,
           top: agent.position.y - 40,
           transform: 'translateX(-50%)'
         }}>
      <div className="relative">
        {/* Speech bubble using SVG */}
        <svg 
          width="auto" 
          height="40" 
          viewBox="0 0 200 40" 
          className="overflow-visible"
        >
          <defs>
            <filter id={`shadow-${agent.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>
          
          {/* Main bubble */}
          <path
            d="M10,5 Q5,5 5,10 L5,25 Q5,30 10,30 L85,30 Q90,30 90,25 L90,10 Q90,5 85,5 Z"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
            filter={`url(#shadow-${agent.id})`}
          />
          
          {/* Tail pointing down */}
          <path
            d="M25,30 L20,35 L30,30 Z"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        </svg>
        
        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-center px-3 py-1">
          <span className="text-xs text-gray-700 font-medium leading-tight text-center max-w-[120px] truncate">
            {bubbleText}
          </span>
        </div>
        
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1">
          <div className={`w-2 h-2 rounded-full ${
            agent.status === 'working' ? 'bg-green-500' :
            agent.status === 'meeting' ? 'bg-blue-500' :
            agent.status === 'break' ? 'bg-yellow-500' :
            'bg-gray-400'
          }`} />
        </div>
      </div>
    </div>
  )
}

export default SpeechBubble