'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentAvatar } from './AgentAvatar'
import type { Agent, Position } from '@/types/agent'

interface AnimatedAgentProps {
  agent: Agent
  onPositionUpdate?: (agentId: string, position: Position) => void
  onMovementComplete?: (agentId: string) => void
  onConversationStart?: (agentId: string) => void
  onClick?: (agentId: string) => void
}

const MOVEMENT_SPEED = 150 // pixels per second
const CONVERSATION_TOPICS = [
  'Discussing project requirements 💼',
  'Code review session 🔍',
  'Planning next sprint 📅',
  'Brainstorming ideas 💡',
  'Technical architecture 🏗️',
  'Coffee break chat ☕',
  'Bug analysis 🐛',
  'Feature planning ✨'
]

const STATUS_MESSAGES = {
  working: ['Coding...', 'Debugging...', 'Testing...', 'Reviewing...', 'Implementing...'],
  meeting: ['In meeting', 'Discussing...', 'Presenting...'],
  break: ['Taking a break', 'Getting coffee', 'Stretching...'],
  idle: ['Available', 'Waiting...', 'Ready to help']
}

export const AnimatedAgent: React.FC<AnimatedAgentProps> = ({
  agent,
  onPositionUpdate,
  onMovementComplete,
  onConversationStart,
  onClick
}) => {
  const [currentPosition, setCurrentPosition] = useState<Position>(agent.position)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const [speechMessage, setSpeechMessage] = useState('')
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null)

  // Calculate movement duration based on distance
  const calculateDuration = useCallback((start: Position, end: Position): number => {
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )
    
    const duration = distance / MOVEMENT_SPEED
    return Math.min(Math.max(duration, 1), 4) // Between 1-4 seconds
  }, [])

  // Update position when agent target changes
  useEffect(() => {
    if (agent.targetPosition && 
        (agent.targetPosition.x !== currentPosition.x || agent.targetPosition.y !== currentPosition.y)) {
      
      setIsAnimating(true)
      const duration = calculateDuration(currentPosition, agent.targetPosition)
      
      // Notify parent of movement start
      if (onPositionUpdate) {
        onPositionUpdate(agent.id, agent.targetPosition)
      }

      // Update position after animation duration
      setTimeout(() => {
        setCurrentPosition(agent.targetPosition!)
        setIsAnimating(false)
        
        if (onMovementComplete) {
          onMovementComplete(agent.id)
        }
      }, duration * 1000)
    }
  }, [agent.targetPosition, currentPosition, calculateDuration, agent.id, onPositionUpdate, onMovementComplete])

  // Handle speech bubbles for different states
  useEffect(() => {
    let message = ''
    let shouldShow = false

    if (agent.isInConversation) {
      message = CONVERSATION_TOPICS[Math.floor(Math.random() * CONVERSATION_TOPICS.length)]
      shouldShow = true
    } else if (agent.currentTask && agent.status === 'working') {
      message = agent.currentTask
      shouldShow = Math.random() < 0.3 // 30% chance to show work status
    } else if (agent.status !== 'idle') {
      const statusMessages = STATUS_MESSAGES[agent.status]
      message = statusMessages[Math.floor(Math.random() * statusMessages.length)]
      shouldShow = Math.random() < 0.2 // 20% chance for other statuses
    }

    if (shouldShow && !showSpeechBubble) {
      setSpeechMessage(message)
      setShowSpeechBubble(true)
      
      // Clear existing timer
      if (speechTimer) {
        clearTimeout(speechTimer)
      }
      
      // Auto-hide after 3-6 seconds
      const timer = setTimeout(() => {
        setShowSpeechBubble(false)
        setSpeechMessage('')
      }, 3000 + Math.random() * 3000)
      
      setSpeechTimer(timer)
    } else if (!agent.isInConversation && showSpeechBubble) {
      // Hide speech bubble if not in conversation
      if (speechTimer) {
        clearTimeout(speechTimer)
      }
      setShowSpeechBubble(false)
      setSpeechMessage('')
    }

    return () => {
      if (speechTimer) {
        clearTimeout(speechTimer)
      }
    }
  }, [agent.isInConversation, agent.currentTask, agent.status, showSpeechBubble, speechTimer])

  // Movement animation variants
  const movementVariants = {
    idle: {
      x: currentPosition.x,
      y: currentPosition.y,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.3
      }
    },
    moving: agent.targetPosition ? {
      x: agent.targetPosition.x,
      y: agent.targetPosition.y,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: calculateDuration(currentPosition, agent.targetPosition)
      }
    } : {}
  }

  // Conversation animation (gentle floating)
  const conversationVariants = {
    idle: {
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    talking: {
      y: [-1, 1, -1],
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  // Status indicator animation
  const statusIndicatorVariants = {
    working: {
      backgroundColor: '#10B981',
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    meeting: {
      backgroundColor: '#3B82F6',
      scale: 1
    },
    break: {
      backgroundColor: '#F59E0B',
      scale: 1
    },
    idle: {
      backgroundColor: '#6B7280',
      scale: 1
    }
  }

  const handleAgentClick = () => {
    if (onClick) {
      onClick(agent.id)
    }
    
    if (onConversationStart && !agent.isInConversation) {
      onConversationStart(agent.id)
    }
  }

  return (
    <motion.div
      className="absolute z-20 cursor-pointer"
      style={{
        left: -20,
        top: -60
      }}
      initial="idle"
      animate={isAnimating ? 'moving' : 'idle'}
      variants={movementVariants}
      layout
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechMessage && (
          <motion.div
            className="absolute bottom-full left-1/2 mb-2 z-30"
            style={{ transform: 'translateX(-50%)' }}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
          >
            <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg max-w-48 text-center">
              <div className="text-xs text-gray-700 font-medium leading-tight">
                {speechMessage}
              </div>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Avatar with conversation animation */}
      <motion.div
        variants={conversationVariants}
        animate={agent.isInConversation ? 'talking' : 'idle'}
      >
        <AgentAvatar
          agent={{
            ...agent,
            position: currentPosition,
            isMoving: isAnimating
          }}
          size={40}
          showLabel={true}
          showStatus={true}
          onClick={handleAgentClick}
        />
      </motion.div>

      {/* Movement trail effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.4, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: 'easeOut'
            }}
          >
            <div
              className="w-12 h-12 rounded-full border-2 border-dashed"
              style={{ borderColor: agent.avatarColor || '#6B7280' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
        variants={statusIndicatorVariants}
        animate={agent.status}
      />

      {/* Activity indicator for working status */}
      {agent.status === 'working' && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div className="w-4 h-4 text-green-500">
            ⚡
          </div>
        </motion.div>
      )}

      {/* Meeting indicator */}
      {agent.status === 'meeting' && (
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <div className="text-xs">📅</div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AnimatedAgent