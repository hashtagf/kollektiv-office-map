'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ActivitiesResponse } from '@/lib/types'

interface ActivityPanelProps {
  className?: string
  pollingInterval?: number
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ 
  className = '', 
  pollingInterval = 5000 
}) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  // Fetch activities from API
  const fetchActivities = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch('/api/activities?limit=15', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ActivitiesResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch activities')
      }

      setActivities(data.data || [])
      setLastUpdate(data.timestamp)
      setLoading(false)
      
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setLoading(false)
    }
  }, [])

  // Start polling
  const startPolling = useCallback(() => {
    setIsPolling(true)
    fetchActivities() // Initial fetch
    
    const intervalId = setInterval(() => {
      fetchActivities()
    }, pollingInterval)

    return () => {
      clearInterval(intervalId)
      setIsPolling(false)
    }
  }, [fetchActivities, pollingInterval])

  // Initialize polling on mount
  useEffect(() => {
    const cleanup = startPolling()
    return cleanup
  }, [startPolling])

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    return new Date(timestamp).toLocaleDateString()
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'work': return '💻'
      case 'conversation': return '💬'
      case 'movement': return '🚶'
      case 'break': return '☕'
      default: return '📋'
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'work': return 'border-l-green-400 bg-green-50 hover:bg-green-100'
      case 'conversation': return 'border-l-blue-400 bg-blue-50 hover:bg-blue-100'
      case 'movement': return 'border-l-purple-400 bg-purple-50 hover:bg-purple-100'
      case 'break': return 'border-l-orange-400 bg-orange-50 hover:bg-orange-100'
      default: return 'border-l-gray-400 bg-gray-50 hover:bg-gray-100'
    }
  }

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'work': return 'text-green-600 bg-green-100'
      case 'conversation': return 'text-blue-600 bg-blue-100'
      case 'movement': return 'text-purple-600 bg-purple-100'
      case 'break': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading && activities.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">📈</span>
              Activity Feed
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Real-time updates from all AI agents
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {error ? (
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-sm">❌</span>
                <span className="text-xs">Error</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <span className="text-xs font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchActivities()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Activities List */}
      {!error && (
        <>
          <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">😴</div>
                <h3 className="font-medium text-gray-700 mb-2">All Quiet</h3>
                <p className="text-sm">No recent activity from the team</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${getActivityColor(activity.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(activity.type)}`}>
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-800 font-medium mb-1">
                            {activity.description}
                          </p>
                          
                          {activity.participants && activity.participants.length > 1 && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs text-gray-500">with:</span>
                              <div className="flex gap-1">
                                {activity.participants.slice(1).map((participant, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                    {participant}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {activity.duration && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs text-gray-500">Duration:</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {activities.length} recent activities
              </span>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {lastUpdate && (
                  <span>
                    Updated: {new Date(lastUpdate).toLocaleTimeString()}
                  </span>
                )}
                <span>Polling every {pollingInterval / 1000}s</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ActivityPanel