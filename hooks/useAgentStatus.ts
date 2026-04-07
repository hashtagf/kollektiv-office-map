'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Agent } from '@/types/agent'

interface AgentStatusResponse {
  success: boolean
  data: Agent[]
  timestamp: string
  count: number
  office: {
    width: number
    height: number
  }
}

interface UseAgentStatusReturn {
  agents: Agent[]
  loading: boolean
  error: string | null
  lastUpdate: string | null
  officeLayout: { width: number; height: number } | null
  refetch: () => Promise<void>
  isPolling: boolean
  startPolling: () => void
  stopPolling: () => void
}

export function useAgentStatus(
  pollingInterval: number = 3000, // 3 seconds default
  autoStart: boolean = true
): UseAgentStatusReturn {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [officeLayout, setOfficeLayout] = useState<{ width: number; height: number } | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch agent status from API
  const fetchAgentStatus = useCallback(async () => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      setError(null)
      
      const response = await fetch('/api/agent-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AgentStatusResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch agent status')
      }

      setAgents(data.data)
      setLastUpdate(data.timestamp)
      setOfficeLayout(data.office)
      setLoading(false)
      
    } catch (err) {
      // Don't set error for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      console.error('Error fetching agent status:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setLoading(false)
    }
  }, [])

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsPolling(true)
    
    // Immediate fetch
    fetchAgentStatus()
    
    // Set up interval
    intervalRef.current = setInterval(() => {
      fetchAgentStatus()
    }, pollingInterval)
  }, [fetchAgentStatus, pollingInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    setIsPolling(false)
  }, [])

  // Manual refetch
  const refetch = useCallback(async () => {
    await fetchAgentStatus()
  }, [fetchAgentStatus])

  // Auto start polling on mount
  useEffect(() => {
    if (autoStart) {
      startPolling()
    }

    // Cleanup on unmount
    return () => {
      stopPolling()
    }
  }, [autoStart, startPolling, stopPolling])

  // Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, stop polling to save resources
        if (isPolling) {
          stopPolling()
        }
      } else {
        // Page is visible, resume polling if it was active
        if (autoStart) {
          startPolling()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [autoStart, isPolling, startPolling, stopPolling])

  return {
    agents,
    loading,
    error,
    lastUpdate,
    officeLayout,
    refetch,
    isPolling,
    startPolling,
    stopPolling
  }
}

export default useAgentStatus