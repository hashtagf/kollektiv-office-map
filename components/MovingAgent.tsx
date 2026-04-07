'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AgentAvatar } from './AgentAvatar'
import type { Agent, Position, MovementPath } from '../types/agent'

interface MovingAgentProps {
  agent: Agent
  onPositionUpdate?: (agentId: string, position: Position) => void
  onMovementComplete?: (agentId: string) => void
  onConversationStart?: (agentId: string, partnerId?: string) => void
  officeWidth?: number
  officeHeight?: number
}

const OFFICE_ZONES = {
  engineering: { x: 100, y: 100, width: 400, height: 250 },
  business: { x: 600, y: 100, width: 400, height: 250 },
  operations: { x: 350, y: 400, width: 300, height: 200 },
  meeting: { x: 750, y: 400, width: 200, height: 150 },
  common: { x: 100, y: 650, width: 500, height: 100 },
  kitchen: { x: 700, y: 650, width: 200, height: 100 }
}

export const MovingAgent: React.FC<MovingAgentProps> = ({
  agent,
  onPositionUpdate,
  onMovementComplete,
  onConversationStart,
  officeWidth = 1200,
  officeHeight = 800
}) => {
  const [currentPosition, setCurrentPosition] = useState<Position>(agent.position)
  const [isAnimating, setIsAnimating] = useState(false)
  const [movementPath, setMovementPath] = useState<MovementPath | null>(null)

  // Generate random target position within appropriate zone
  const generateRandomTarget = useCallback((): Position => {
    const zones = Object.values(OFFICE_ZONES)
    const randomZone = zones[Math.floor(Math.random() * zones.length)]
    
    return {
      x: randomZone.x + Math.random() * randomZone.width,
      y: randomZone.y + Math.random() * randomZone.height
    }
  }, [])

  // Generate movement to team area
  const generateTeamTarget = useCallback((): Position => {
    const teamZone = OFFICE_ZONES[agent.team as keyof typeof OFFICE_ZONES] || OFFICE_ZONES.common
    
    return {
      x: teamZone.x + Math.random() * teamZone.width,
      y: teamZone.y + Math.random() * teamZone.height
    }
  }, [agent.team])

  // Calculate movement duration based on distance
  const calculateDuration = useCallback((start: Position, end: Position): number => {
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )
    
    // Base duration of 2-5 seconds depending on distance
    const baseDuration = 2 + (distance / 300) * 3
    return Math.min(Math.max(baseDuration, 2), 5)
  }, [])

  // Start movement to target position
  const startMovement = useCallback((targetPosition: Position) => {
    if (isAnimating) return
    
    const duration = calculateDuration(currentPosition, targetPosition)
    
    setMovementPath({
      start: currentPosition,
      end: targetPosition,
      duration,
      easing: 'easeInOut'
    })
    
    setIsAnimating(true)
    
    // Update agent status
    if (onPositionUpdate) {
      onPositionUpdate(agent.id, targetPosition)
    }
  }, [currentPosition, isAnimating, agent.id, onPositionUpdate, calculateDuration])

  // Auto-movement behavior
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!isAnimating && Math.random() < 0.3) { // 30% chance to move
        const target = Math.random() < 0.7 
          ? generateTeamTarget() // 70% chance to move within team area
          : generateRandomTarget() // 30% chance to move to random area
        
        startMovement(target)
      }
    }, 3000 + Math.random() * 4000) // Every 3-7 seconds

    return () => clearInterval(moveInterval)
  }, [isAnimating, generateTeamTarget, generateRandomTarget, startMovement])

  // Handle movement completion
  const handleMovementComplete = () => {
    if (movementPath) {
      setCurrentPosition(movementPath.end)
      setIsAnimating(false)
      
      if (onMovementComplete) {
        onMovementComplete(agent.id)
      }
      
      // Chance to start a conversation after movement
      if (Math.random() < 0.2 && onConversationStart) { // 20% chance
        setTimeout(() => {
          onConversationStart(agent.id)
        }, 1000)
      }
    }
    
    setMovementPath(null)
  }

  // Movement variants for framer-motion
  const movementVariants = {
    idle: {
      x: currentPosition.x,
      y: currentPosition.y,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    },
    moving: movementPath ? {
      x: movementPath.end.x,
      y: movementPath.end.y,
      transition: {
        duration: movementPath.duration,
        ease: 'easeInOut'
      }
    } : {}
  }

  // Conversation animation (gentle bob)
  const conversationVariants = {
    idle: {
      y: 0,
      transition: {
        repeat: 0
      }
    },
    talking: {
      y: [-2, 2, -2],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: -20, // Center the avatar
        top: -60   // Account for label height
      }}
      initial="idle"
      animate={isAnimating ? 'moving' : 'idle'}
      variants={movementVariants}
      onAnimationComplete={handleMovementComplete}
    >
      <motion.div
        variants={conversationVariants}
        animate={agent.isInConversation ? 'talking' : 'idle'}
      >
        <AgentAvatar
          agent={{
            ...agent,
            isMoving: isAnimating,
            position: currentPosition
          }}
          size={40}
          showLabel={true}
          showStatus={true}
          onClick={() => {
            // Manual movement trigger on click
            if (!isAnimating) {
              const target = generateRandomTarget()
              startMovement(target)
            }
          }}
        />
        
        {/* Movement trail effect */}
        {isAnimating && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          >
            <div 
              className="w-8 h-8 rounded-full border-2"
              style={{ borderColor: agent.avatarColor }}
            />
          </motion.div>
        )}
        
        {/* Status indicators */}
        {agent.status === 'meeting' && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
              📅 Meeting
            </div>
          </motion.div>
        )}
        
        {agent.status === 'break' && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
              ☕ Break
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default MovingAgent