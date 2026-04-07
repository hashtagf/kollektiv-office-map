'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { MovingAgent } from './MovingAgent'
import type { Agent, Position } from '../types/agent'
import { MOCK_AGENTS } from '../utils/agentData'

interface AgentManagerProps {
  officeWidth?: number
  officeHeight?: number
  showActivities?: boolean
}

interface ConversationGroup {
  id: string
  participants: string[]
  startTime: number
  duration: number
  topic: string
}

export const AgentManager: React.FC<AgentManagerProps> = ({
  officeWidth = 1200,
  officeHeight = 800,
  showActivities = true
}) => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS)
  const [conversations, setConversations] = useState<ConversationGroup[]>([])
  const [activities, setActivities] = useState<string[]>([])

  // Update agent position
  const handlePositionUpdate = useCallback((agentId: string, position: Position) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, position, targetPosition: position, isMoving: true }
        : agent
    ))
  }, [])

  // Handle movement completion
  const handleMovementComplete = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, isMoving: false, targetPosition: undefined }
        : agent
    ))
    
    if (showActivities) {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        setActivities(prev => [
          `${agent.name} moved to new location`,
          ...prev.slice(0, 9) // Keep last 10 activities
        ])
      }
    }
  }, [agents, showActivities])

  // Start a conversation
  const handleConversationStart = useCallback((agentId: string, partnerId?: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return
    
    // Find nearby agents for conversation
    const nearbyAgents = agents.filter(a => {
      if (a.id === agentId || a.isInConversation) return false
      
      const distance = Math.sqrt(
        Math.pow(a.position.x - agent.position.x, 2) + 
        Math.pow(a.position.y - agent.position.y, 2)
      )
      
      return distance < 100 // Within 100 pixels
    })
    
    if (nearbyAgents.length === 0) return
    
    const partner = partnerId 
      ? agents.find(a => a.id === partnerId)
      : nearbyAgents[Math.floor(Math.random() * nearbyAgents.length)]
    
    if (!partner) return
    
    const conversationTopics = [
      'Discussing project requirements',
      'Planning next sprint',
      'Code review session',
      'Brainstorming ideas',
      'Team sync meeting',
      'Technical architecture',
      'User feedback analysis',
      'Coffee break chat'
    ]
    
    const topic = conversationTopics[Math.floor(Math.random() * conversationTopics.length)]
    
    const conversation: ConversationGroup = {
      id: `conv-${Date.now()}`,
      participants: [agentId, partner.id],
      startTime: Date.now(),
      duration: 15000 + Math.random() * 20000, // 15-35 seconds
      topic
    }
    
    setConversations(prev => [...prev, conversation])
    
    // Mark agents as in conversation
    setAgents(prev => prev.map(agent => ({
      ...agent,
      isInConversation: conversation.participants.includes(agent.id),
      conversationPartner: conversation.participants.includes(agent.id) 
        ? conversation.participants.find(p => p !== agent.id)
        : agent.conversationPartner
    })))
    
    if (showActivities) {
      setActivities(prev => [
        `${agent.name} and ${partner.name} started ${topic.toLowerCase()}`,
        ...prev.slice(0, 9)
      ])
    }
    
    // End conversation after duration
    setTimeout(() => {
      setConversations(prev => prev.filter(c => c.id !== conversation.id))
      setAgents(prev => prev.map(agent => 
        conversation.participants.includes(agent.id)
          ? { ...agent, isInConversation: false, conversationPartner: undefined }
          : agent
      ))
      
      if (showActivities) {
        setActivities(prev => [
          `${agent.name} and ${partner.name} finished their conversation`,
          ...prev.slice(0, 9)
        ])
      }
    }, conversation.duration)
  }, [agents, showActivities])

  // Periodic status updates
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (Math.random() < 0.1) { // 10% chance to change status
          const statuses: Agent['status'][] = ['working', 'meeting', 'break', 'idle']
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          return { ...agent, status: newStatus }
        }
        return agent
      }))
    }, 10000) // Every 10 seconds

    return () => clearInterval(statusInterval)
  }, [])

  return (
    <>
      {/* Render all moving agents */}
      {agents.map(agent => (
        <MovingAgent
          key={agent.id}
          agent={agent}
          onPositionUpdate={handlePositionUpdate}
          onMovementComplete={handleMovementComplete}
          onConversationStart={handleConversationStart}
          officeWidth={officeWidth}
          officeHeight={officeHeight}
        />
      ))}
      
      {/* Conversation visualization */}
      {conversations.map(conv => {
        const participants = conv.participants
          .map(id => agents.find(a => a.id === id))
          .filter(Boolean) as Agent[]
        
        if (participants.length < 2) return null
        
        const centerX = participants.reduce((sum, p) => sum + p.position.x, 0) / participants.length
        const centerY = participants.reduce((sum, p) => sum + p.position.y, 0) / participants.length
        
        return (
          <div
            key={conv.id}
            className="absolute pointer-events-none z-5"
            style={{
              left: centerX - 50,
              top: centerY - 80,
              width: 100
            }}
          >
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-xs text-blue-800 text-center shadow-sm">
              💬 {conv.topic}
            </div>
          </div>
        )
      })}
      
      {/* Activity feed */}
      {showActivities && activities.length > 0 && (
        <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activities</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded border-l-2 border-blue-300"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default AgentManager