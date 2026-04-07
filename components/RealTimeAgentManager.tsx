'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedAgent } from './AnimatedAgent'
import { useAgentPolling, useAgentConversations, useActivityFeed } from '@/lib/hooks'
import type { Agent, Position } from '@/types/agent'

interface RealTimeAgentManagerProps {
  officeWidth?: number
  officeHeight?: number
  showActivities?: boolean
  showConversations?: boolean
  pollingInterval?: number
}

const OFFICE_ZONES = {
  engineering: { x: 80, y: 100, width: 200, height: 300 },
  business: { x: 520, y: 100, width: 200, height: 300 },
  operations: { x: 300, y: 420, width: 200, height: 120 },
  meeting_room: { x: 750, y: 300, width: 150, height: 100 },
  kitchen: { x: 750, y: 450, width: 150, height: 100 },
  lobby: { x: 300, y: 100, width: 150, height: 120 }
}

export const RealTimeAgentManager: React.FC<RealTimeAgentManagerProps> = ({
  officeWidth = 1000,
  officeHeight = 600,
  showActivities = true,
  showConversations = true,
  pollingInterval = 5000
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [agentMovementQueue, setAgentMovementQueue] = useState<Map<string, Position>>(new Map())

  // Real-time polling hook
  const {
    agents,
    isLoading,
    error,
    lastUpdated,
    updateAgent
  } = useAgentPolling({
    interval: pollingInterval,
    enabled: true,
    onUpdate: (newAgents) => {
      setConnectionStatus('connected')
      addActivity('Data updated from server', 'status')
    },
    onError: (error) => {
      setConnectionStatus('error')
      addActivity(`Connection error: ${error.message}`, 'status')
    }
  })

  // Conversation management
  const {
    conversations,
    startConversation,
    endConversation,
    getActiveConversations
  } = useAgentConversations()

  // Activity feed
  const {
    activities,
    addActivity,
    clearActivities
  } = useActivityFeed(15)

  // Generate random movement for agent
  const generateMovement = useCallback((agent: Agent): Position => {
    const zones = Object.values(OFFICE_ZONES)
    let targetZone
    
    // 60% chance to stay in team zone, 40% chance to go elsewhere
    if (Math.random() < 0.6) {
      const teamMap: Record<string, keyof typeof OFFICE_ZONES> = {
        engineering: 'engineering',
        business: 'business',
        operations: 'operations'
      }
      targetZone = OFFICE_ZONES[teamMap[agent.team] || 'lobby']
    } else {
      // Go to meeting room, kitchen, or lobby
      const randomZones = ['meeting_room', 'kitchen', 'lobby'] as const
      targetZone = OFFICE_ZONES[randomZones[Math.floor(Math.random() * randomZones.length)]]
    }
    
    return {
      x: targetZone.x + Math.random() * targetZone.width,
      y: targetZone.y + Math.random() * targetZone.height
    }
  }, [])

  // Handle agent position updates
  const handlePositionUpdate = useCallback((agentId: string, position: Position) => {
    updateAgent(agentId, { 
      targetPosition: position, 
      isMoving: true,
      lastActivity: new Date().toISOString()
    })
    
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      addActivity(`${agent.name} is moving to new location`, 'movement', agentId)
    }
  }, [updateAgent, agents, addActivity])

  // Handle movement completion
  const handleMovementComplete = useCallback((agentId: string) => {
    updateAgent(agentId, { 
      isMoving: false, 
      targetPosition: undefined,
      lastActivity: new Date().toISOString()
    })
    
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      addActivity(`${agent.name} arrived at destination`, 'movement', agentId)
      
      // Chance to start a conversation after movement
      if (Math.random() < 0.25) { // 25% chance
        setTimeout(() => handleConversationStart(agentId), 1000 + Math.random() * 2000)
      }
    }
  }, [updateAgent, agents, addActivity])

  // Handle conversation start
  const handleConversationStart = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent || agent.isInConversation) return
    
    // Find nearby agents for conversation
    const nearbyAgents = agents.filter(a => {
      if (a.id === agentId || a.isInConversation) return false
      
      const distance = Math.sqrt(
        Math.pow(a.position.x - agent.position.x, 2) + 
        Math.pow(a.position.y - agent.position.y, 2)
      )
      
      return distance < 80 // Within 80 pixels
    })
    
    if (nearbyAgents.length === 0) return
    
    const partner = nearbyAgents[Math.floor(Math.random() * nearbyAgents.length)]
    
    const conversationTopics = [
      'Discussing project requirements',
      'Code review session',
      'Planning next sprint',
      'Brainstorming ideas',
      'Technical discussion',
      'Daily standup',
      'Coffee break chat',
      'Status update'
    ]
    
    const topic = conversationTopics[Math.floor(Math.random() * conversationTopics.length)]
    const conversation = startConversation([agentId, partner.id], topic)
    
    // Mark agents as in conversation
    updateAgent(agentId, { 
      isInConversation: true, 
      conversationPartner: partner.id,
      lastActivity: new Date().toISOString()
    })
    updateAgent(partner.id, { 
      isInConversation: true, 
      conversationPartner: agentId,
      lastActivity: new Date().toISOString()
    })
    
    addActivity(`${agent.name} and ${partner.name} started ${topic.toLowerCase()}`, 'conversation')
    
    // End conversation automatically
    setTimeout(() => {
      updateAgent(agentId, { 
        isInConversation: false, 
        conversationPartner: undefined,
        lastActivity: new Date().toISOString()
      })
      updateAgent(partner.id, { 
        isInConversation: false, 
        conversationPartner: undefined,
        lastActivity: new Date().toISOString()
      })
      
      endConversation(conversation.id)
      addActivity(`${agent.name} and ${partner.name} finished their conversation`, 'conversation')
    }, conversation.duration)
    
  }, [agents, startConversation, updateAgent, addActivity, endConversation])

  // Handle agent clicks
  const handleAgentClick = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent || agent.isMoving) return
    
    const newPosition = generateMovement(agent)
    handlePositionUpdate(agentId, newPosition)
  }, [agents, generateMovement, handlePositionUpdate])

  // Auto-movement system
  useEffect(() => {
    const moveInterval = setInterval(() => {
      // Only move agents that aren't already moving or in conversation
      const availableAgents = agents.filter(a => !a.isMoving && !a.isInConversation)
      
      if (availableAgents.length > 0) {
        // Move 1-3 random agents
        const agentsToMove = Math.min(
          Math.floor(Math.random() * 3) + 1,
          availableAgents.length
        )
        
        const shuffled = [...availableAgents].sort(() => 0.5 - Math.random())
        const selectedAgents = shuffled.slice(0, agentsToMove)
        
        selectedAgents.forEach(agent => {
          if (Math.random() < 0.4) { // 40% chance each agent moves
            const newPosition = generateMovement(agent)
            handlePositionUpdate(agent.id, newPosition)
          }
        })
      }
    }, 8000 + Math.random() * 7000) // Every 8-15 seconds

    return () => clearInterval(moveInterval)
  }, [agents, generateMovement, handlePositionUpdate])

  // Connection status indicator
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live'
      case 'connecting': return 'Connecting...'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  if (isLoading && agents.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Loading office data...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Error indicator */}
      {error && (
        <div className="absolute top-4 left-4 mt-12 z-30">
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-sm">
            <div className="text-sm text-red-800">
              <strong>Connection Error:</strong> {error.message}
            </div>
          </div>
        </div>
      )}

      {/* Render all animated agents */}
      <AnimatePresence>
        {agents.map(agent => (
          <AnimatedAgent
            key={agent.id}
            agent={agent}
            onPositionUpdate={handlePositionUpdate}
            onMovementComplete={handleMovementComplete}
            onConversationStart={handleConversationStart}
            onClick={handleAgentClick}
          />
        ))}
      </AnimatePresence>
      
      {/* Conversation visualization */}
      {showConversations && (
        <AnimatePresence>
          {conversations.map(conv => {
            const participants = conv.participants
              .map(id => agents.find(a => a.id === id))
              .filter(Boolean) as Agent[]
            
            if (participants.length < 2) return null
            
            const centerX = participants.reduce((sum, p) => sum + p.position.x, 0) / participants.length
            const centerY = participants.reduce((sum, p) => sum + p.position.y, 0) / participants.length
            
            return (
              <motion.div
                key={conv.id}
                className="absolute pointer-events-none z-10"
                style={{
                  left: centerX - 60,
                  top: centerY - 100,
                  width: 120
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
              >
                <div className="bg-blue-50/95 backdrop-blur-sm border border-blue-200 rounded-lg p-3 text-xs text-blue-800 text-center shadow-lg">
                  <div className="font-medium mb-1">💬 Conversation</div>
                  <div className="text-blue-600">{conv.topic}</div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
      
      {/* Activity feed */}
      {showActivities && activities.length > 0 && (
        <div className="absolute top-4 right-4 w-80 max-h-96 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border z-30">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Live Activity Feed</h3>
              <button
                onClick={clearActivities}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className={`p-3 border-b border-gray-100 text-sm ${
                    activity.type === 'status' ? 'bg-blue-50' : 
                    activity.type === 'conversation' ? 'bg-green-50' : 
                    'bg-gray-50'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="text-gray-700">{activity.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Agent count indicator */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border">
          <div className="text-sm font-medium text-gray-700">
            {agents.length} Agents Online
          </div>
          <div className="text-xs text-gray-500">
            {agents.filter(a => a.isMoving).length} moving • {agents.filter(a => a.isInConversation).length} in conversation
          </div>
        </div>
      </div>
    </>
  )
}

export default RealTimeAgentManager