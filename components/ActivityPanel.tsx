'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ApiResponse } from '@/lib/types'
import { Clock, User, MessageCircle, Move, Coffee, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface ActivityPanelProps {
  className?: string
}

const ACTIVITY_ICONS = {
  movement: Move,
  conversation: MessageCircle,
  work: User,
  break: Coffee
} as const

const ACTIVITY_COLORS = {
  movement: 'text-blue-500 bg-blue-50',
  conversation: 'text-green-500 bg-green-50',
  work: 'text-purple-500 bg-purple-50',
  break: 'text-orange-500 bg-orange-50'
} as const

export function ActivityPanel({ className = '' }: ActivityPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      setError(null)
      const response = await fetch('/api/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data: ApiResponse<Activity[]> = await response.json()
      
      if (data.success && data.data) {
        setActivities(data.data)
        setIsOnline(true)
        setLastUpdate(new Date())
      } else {
        throw new Error(data.error || 'Failed to fetch activities')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to fetch activities:', errorMessage)
      setError(errorMessage)
      setIsOnline(false)
    } finally {
      setLoading(false)
    }
  }

  // Set up polling every 5 seconds
  useEffect(() => {
    // Initial fetch
    fetchActivities()
    
    // Set up interval
    const interval = setInterval(fetchActivities, 5000)
    
    // Cleanup
    return () => clearInterval(interval)
  }, [])

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    return `${hours}h ago`
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Activity Feed</h3>
            <p className="text-xs text-gray-500">
              {lastUpdate ? `Updated ${formatRelativeTime(lastUpdate.getTime())}` : 'Loading...'}
            </p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-96 overflow-y-auto">
        {loading && activities.length === 0 ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm">Loading activities...</p>
          </div>
        ) : error && activities.length === 0 ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm text-center mb-3">Failed to load activities</p>
            <p className="text-xs text-gray-500 text-center mb-4">{error}</p>
            <button
              onClick={fetchActivities}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <Clock className="w-8 h-8 mb-3" />
            <p className="text-sm">No activities yet</p>
            <p className="text-xs text-center">Agent activities will appear here as they happen</p>
          </div>
        ) : (
          /* Activity List */
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {activities
                .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
                .slice(0, 50) // Limit to 50 recent activities
                .map((activity, index) => {
                  const IconComponent = ACTIVITY_ICONS[activity.type] || User
                  const colorClass = ACTIVITY_COLORS[activity.type] || 'text-gray-500 bg-gray-50'
                  
                  return (
                    <motion.div
                      key={`${activity.id}-${activity.timestamp}`}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      layout
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-1.5 rounded-md ${colorClass} flex-shrink-0`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-900 truncate">
                              {activity.agentId}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 break-words">
                            {activity.description}
                          </p>
                          
                          {/* Additional Info */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize ${colorClass}`}>
                              {activity.type}
                            </span>
                            
                            {activity.duration && (
                              <span className="text-xs text-gray-400">
                                {activity.duration}s
                              </span>
                            )}
                            
                            {activity.participants && activity.participants.length > 0 && (
                              <span className="text-xs text-gray-400">
                                +{activity.participants.length} others
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Footer */}
      {activities.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Showing {Math.min(activities.length, 50)} activities</span>
            <span>Updates every 5 seconds</span>
          </div>
        </div>
      )}
    </div>
  )
}