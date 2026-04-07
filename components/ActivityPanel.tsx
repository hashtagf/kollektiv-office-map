'use client'

import React, { useMemo } from 'react'
import { Agent } from '@/types/agent'

interface Activity {
  id: string
  agentName: string
  agentRole: string
  action: string
  timestamp: Date
  type: 'work' | 'movement' | 'conversation' | 'status'
  avatarColor: string
  emoji: string
}

interface ActivityPanelProps {
  agents: Agent[]
  className?: string
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ agents, className = '' }) => {
  const activities = useMemo(() => {
    const activityList: Activity[] = []
    
    agents.forEach((agent) => {
      // Add current task activities
      if (agent.currentTask && agent.status === 'working') {
        activityList.push({
          id: `${agent.id}-work-${Date.now()}`,
          agentName: agent.name,
          agentRole: agent.role,
          action: agent.currentTask,
          timestamp: new Date(agent.lastActivity),
          type: 'work',
          avatarColor: agent.avatarColor,
          emoji: agent.emoji
        })
      }
      
      // Add conversation activities
      if (agent.isInConversation && agent.conversationPartner) {
        const partner = agents.find(a => a.id === agent.conversationPartner)
        if (partner) {
          activityList.push({
            id: `${agent.id}-conversation-${Date.now()}`,
            agentName: agent.name,
            agentRole: agent.role,
            action: `In meeting with ${partner.name}`,
            timestamp: new Date(agent.lastActivity),
            type: 'conversation',
            avatarColor: agent.avatarColor,
            emoji: agent.emoji
          })
        }
      }
      
      // Add movement activities
      if (agent.isMoving && agent.targetPosition) {
        activityList.push({
          id: `${agent.id}-movement-${Date.now()}`,
          agentName: agent.name,
          agentRole: agent.role,
          action: `Moving around the office`,
          timestamp: new Date(agent.lastActivity),
          type: 'movement',
          avatarColor: agent.avatarColor,
          emoji: agent.emoji
        })
      }
      
      // Add status change activities
      if (agent.status === 'break') {
        activityList.push({
          id: `${agent.id}-break-${Date.now()}`,
          agentName: agent.name,
          agentRole: agent.role,
          action: `Taking a break`,
          timestamp: new Date(agent.lastActivity),
          type: 'status',
          avatarColor: agent.avatarColor,
          emoji: agent.emoji
        })
      }
    })
    
    // Sort by timestamp (newest first)
    return activityList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [agents])

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'work': return '💻'
      case 'conversation': return '💬'
      case 'movement': return '🚶'
      case 'status': return '⏸️'
      default: return '📋'
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'work': return 'border-green-200 bg-green-50'
      case 'conversation': return 'border-blue-200 bg-blue-50'
      case 'movement': return 'border-purple-200 bg-purple-50'
      case 'status': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-blue-500">📊</span>
          Live Activity Feed
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Real-time updates from all {agents.length} AI agents
        </p>
      </div>
      
      <div className="h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">😴</div>
            <p>All agents are idle</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className={`p-3 rounded-lg border transition-all hover:shadow-md ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: activity.avatarColor }}
                  >
                    {activity.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 truncate">
                        {activity.agentName}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {activity.agentRole}
                      </span>
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {activity.action}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTime(activity.timestamp)}
                      </span>
                      
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'work' ? 'bg-green-500' :
                        activity.type === 'conversation' ? 'bg-blue-500' :
                        activity.type === 'movement' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{activities.length} recent activities</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityPanel