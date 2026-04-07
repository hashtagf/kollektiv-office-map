import { useState, useEffect, useCallback, useRef } from 'react'
import type { Agent } from '@/types/agent'

interface ApiResponse {
  success: boolean
  data: Agent[]
  timestamp: string
  count: number
}

interface UseAgentPollingOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
  onUpdate?: (agents: Agent[]) => void
}

export function useAgentPolling(options: UseAgentPollingOptions = {}) {
  const {
    interval = 5000, // 5 seconds
    enabled = true,
    onError,
    onUpdate
  } = options

  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  const fetchAgents = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      const response = await fetch('/api/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      if (!mountedRef.current) return

      // Update agents with smooth position transitions
      const updatedAgents = data.data.map((newAgent: Agent) => {
        const currentAgent = agents.find(a => a.id === newAgent.id)
        
        if (currentAgent) {
          // Preserve current position if agent is moving to prevent jumpiness
          return {
            ...newAgent,
            position: currentAgent.isMoving ? currentAgent.position : newAgent.position,
            targetPosition: newAgent.position,
            // Detect if position changed to trigger movement
            isMoving: currentAgent.isMoving || 
              (currentAgent.position.x !== newAgent.position.x || 
               currentAgent.position.y !== newAgent.position.y)
          }
        }
        
        return newAgent
      })

      setAgents(updatedAgents)
      setLastUpdated(new Date())
      setError(null)
      setIsLoading(false)

      if (onUpdate) {
        onUpdate(updatedAgents)
      }

    } catch (err) {
      if (!mountedRef.current) return

      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      console.error('Failed to fetch agents:', error)
      
      setError(error)
      setIsLoading(false)

      if (onError) {
        onError(error)
      }
    }
  }, [agents, onError, onUpdate])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchAgents()
    }
  }, [enabled]) // Don't include fetchAgents to avoid infinite loop

  // Set up polling interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(fetchAgents, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, interval, fetchAgents])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const refetch = useCallback(() => {
    if (enabled) {
      setIsLoading(true)
      fetchAgents()
    }
  }, [enabled, fetchAgents])

  const updateAgent = useCallback((agentId: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ))
  }, [])

  return {
    agents,
    isLoading,
    error,
    lastUpdated,
    refetch,
    updateAgent
  }
}

// Hook for managing agent conversations
export function useAgentConversations() {
  const [conversations, setConversations] = useState<Array<{
    id: string
    participants: string[]
    topic: string
    startTime: number
    duration: number
  }>>([])

  const startConversation = useCallback((agentIds: string[], topic: string) => {
    const conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      participants: agentIds,
      topic,
      startTime: Date.now(),
      duration: 15000 + Math.random() * 30000 // 15-45 seconds
    }

    setConversations(prev => [...prev, conversation])

    // Auto-remove conversation after duration
    setTimeout(() => {
      setConversations(prev => prev.filter(c => c.id !== conversation.id))
    }, conversation.duration)

    return conversation
  }, [])

  const endConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
  }, [])

  const getActiveConversations = useCallback((agentId: string) => {
    return conversations.filter(c => c.participants.includes(agentId))
  }, [conversations])

  return {
    conversations,
    startConversation,
    endConversation,
    getActiveConversations
  }
}

// Hook for activity tracking
export function useActivityFeed(maxItems = 10) {
  const [activities, setActivities] = useState<Array<{
    id: string
    message: string
    timestamp: Date
    type: 'movement' | 'conversation' | 'status' | 'work'
    agentId?: string
  }>>([])

  const addActivity = useCallback((message: string, type = 'movement', agentId?: string) => {
    const activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      timestamp: new Date(),
      type: type as any,
      agentId
    }

    setActivities(prev => [activity, ...prev.slice(0, maxItems - 1)])
  }, [maxItems])

  const clearActivities = useCallback(() => {
    setActivities([])
  }, [])

  const getActivitiesForAgent = useCallback((agentId: string) => {
    return activities.filter(a => a.agentId === agentId)
  }, [activities])

  return {
    activities,
    addActivity,
    clearActivities,
    getActivitiesForAgent
  }
}