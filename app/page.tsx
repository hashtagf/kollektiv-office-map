'use client'

import React, { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OfficeLayout } from '@/components/OfficeLayout'
import { RealTimeAgentManager } from '@/components/RealTimeAgentManager'
import ActivityPanel from '@/components/ActivityPanel'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import useAgentStatus from '@/hooks/useAgentStatus'

export default function Home() {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [selectedView, setSelectedView] = useState<'desktop' | 'mobile'>('desktop')
  const { agents, loading, error, lastUpdate, isPolling, refetch } = useAgentStatus(5000, true)

  const handleAgentClick = (agentId: string) => {
    console.log('Agent clicked:', agentId)
  }

  const handleRetry = () => {
    refetch()
  }

  if (error && agents.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <ErrorState error={error} onRetry={handleRetry} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            <span className="text-5xl md:text-6xl mr-3">🏢</span>
            Kollektiv AI Office
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Live 2D animated office map with real-time polling and AI agent interactions
          </p>
          
          {/* Status Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="flex items-center gap-2">
              <motion.div 
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              Working
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              In Meeting
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              On Break
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              Idle
            </span>
          </motion.div>
          
          {/* Control Panel */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                showDebugInfo 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              {showDebugInfo ? 'Hide' : 'Show'} Debug Info
            </button>
            
            <button
              onClick={() => setSelectedView(selectedView === 'desktop' ? 'mobile' : 'desktop')}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {selectedView === 'desktop' ? '📱 Mobile View' : '🖥️ Desktop View'}
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
              <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isPolling ? 'Live' : 'Offline'}
              </span>
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  • {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Main Content - Responsive Layout */}
        <motion.div 
          className={`grid gap-6 ${
            selectedView === 'desktop' 
              ? 'lg:grid-cols-3 lg:gap-8' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Office Map */}
          <div className={`${selectedView === 'desktop' ? 'lg:col-span-2' : 'order-2'}`}>
            <Suspense fallback={<LoadingState message="Loading office map..." />}>
              <motion.div 
                className="relative bg-white rounded-xl shadow-xl border border-gray-200 p-4 md:p-6 overflow-hidden"
                whileHover={{ scale: selectedView === 'mobile' ? 1 : 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    Office Map
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{agents.length} agents</span>
                    {loading && <span className="text-blue-600">• Updating...</span>}
                  </div>
                </div>
                
                <div 
                  className="relative overflow-hidden rounded-lg bg-gray-50 border border-gray-100"
                  style={{ 
                    width: '100%',
                    height: selectedView === 'desktop' ? '500px' : '400px',
                    maxWidth: selectedView === 'desktop' ? '1000px' : '100%'
                  }}
                >
                  {/* Office Layout Background */}
                  <OfficeLayout 
                    width={selectedView === 'desktop' ? 1000 : 800}
                    height={selectedView === 'desktop' ? 500 : 400}
                    showLabels={true}
                  />
                  
                  {/* Real-time Animated Agents */}
                  <RealTimeAgentManager
                    officeWidth={selectedView === 'desktop' ? 1000 : 800}
                    officeHeight={selectedView === 'desktop' ? 500 : 400}
                    showActivities={true}
                    showConversations={true}
                    pollingInterval={5000}
                  />
                </div>
                
                {/* Office Map Controls */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>🖱️ Click agents to interact</span>
                    <span>👥 {agents.filter(a => a.isInConversation).length} conversations</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Updates every 5 seconds
                  </div>
                </div>
              </motion.div>
            </Suspense>
          </div>

          {/* Activity Panel */}
          <div className={`${selectedView === 'desktop' ? '' : 'order-1'}`}>
            <Suspense fallback={<LoadingState message="Loading activities..." className="h-96" />}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <ActivityPanel 
                  className="h-full" 
                  pollingInterval={5000}
                />
              </motion.div>
            </Suspense>
          </div>
        </motion.div>

        {/* Debug Information */}
        <AnimatePresence>
          {showDebugInfo && (
            <motion.div 
              className="mt-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm overflow-hidden">
                <h3 className="text-white font-bold mb-4 text-lg">🔧 Debug Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div>
                    <div className="text-green-300 mb-2 font-semibold">Real-time Features:</div>
                    <div className="space-y-1">
                      <div>✅ Agent polling every 5 seconds</div>
                      <div>✅ Activity feed polling</div>
                      <div>✅ Framer Motion animations</div>
                      <div>✅ Speech bubbles with context</div>
                      <div>✅ Automatic movement system</div>
                      <div>✅ Conversation detection</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-green-300 mb-2 font-semibold">Animation Features:</div>
                    <div className="space-y-1">
                      <div>✅ Smooth pathfinding</div>
                      <div>✅ Movement trails</div>
                      <div>✅ Status indicators</div>
                      <div>✅ Conversation animations</div>
                      <div>✅ Layout-based positioning</div>
                      <div>✅ Performance optimized</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-green-300 mb-2 font-semibold">System Status:</div>
                    <div className="space-y-1">
                      <div>📊 Agents: {agents.length}</div>
                      <div>🔄 Polling: {isPolling ? 'Active' : 'Inactive'}</div>
                      <div>⏰ Last Update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}</div>
                      <div>📱 View: {selectedView}</div>
                      <div>❌ Errors: {error ? 'Yes' : 'None'}</div>
                      <div>⚡ Loading: {loading ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Feature Highlights */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Real-time Polling</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fetches agent data and activities from APIs every 5 seconds using fetch. 
              Updates positions, status, and tasks automatically with error handling.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Smooth Animations</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Framer Motion powered animations with pathfinding, movement trails, 
              conversation bubbles, and React Suspense loading states.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Responsive Design</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fully responsive layout with Tailwind CSS grid/flexbox. 
              Optimized for desktop and mobile with toggle views and proper state management.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Instructions */}
        <motion.div 
          className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="font-bold text-blue-900 mb-3 text-xl">🎮 Interactive Office Experience</h3>
          <p className="text-blue-700 mb-4 leading-relaxed">
            Watch as AI agents move around the office in real-time, have conversations, and update their status. 
            The activity panel shows live updates of all team activities with timestamps and context.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
            <div className="space-y-2">
              <div>• 📊 Real-time activity feed with polling</div>
              <div>• 🔄 Data updates automatically every 5 seconds</div>
              <div>• 🎯 Error handling with retry functionality</div>
            </div>
            <div className="space-y-2">
              <div>• 🎬 Smooth Framer Motion transitions</div>
              <div>• 📱 Fully responsive design</div>
              <div>• ⚡ React Suspense loading states</div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}