'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OfficeLayout } from '@/components/OfficeLayout'
import { RealTimeAgentManager } from '@/components/RealTimeAgentManager'
import { ActivityPanel } from '@/components/ActivityPanel'
import { Eye, EyeOff, BarChart3, Users, Activity } from 'lucide-react'
import type { Agent } from '@/lib/types'

// Loading component for Suspense
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

// Error boundary fallback
function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-red-500">
      <p className="text-sm mb-4">Something went wrong: {error.message}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [showActivityPanel, setShowActivityPanel] = useState(true)
  const [retryKey, setRetryKey] = useState(0)
  
  const handleAgentClick = (agentId: string) => {
    console.log('Agent clicked:', agentId)
  }

  const handleRetry = () => {
    setRetryKey(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🏢 Kollektiv AI Office
                <span className="text-sm font-normal text-gray-500">Live Map</span>
              </h1>
              <p className="text-sm text-gray-600">
                Real-time 2D animated office with AI agent interactions
              </p>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowActivityPanel(!showActivityPanel)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  showActivityPanel 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                {showActivityPanel ? 'Hide' : 'Show'} Activities
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  showDebugInfo 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showDebugInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                Debug
              </motion.button>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Break</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Idle</span>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 transition-all duration-500 ease-in-out ${
          showActivityPanel 
            ? 'lg:grid-cols-4 xl:grid-cols-5' 
            : 'lg:grid-cols-1'
        }`}>
          
          {/* Office Map - Main Area */}
          <motion.div 
            layout
            className={`${showActivityPanel ? 'lg:col-span-3 xl:col-span-4' : 'lg:col-span-1'}`}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Office Floor Plan</h2>
                    <p className="text-sm text-gray-500">Live agent tracking and animations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
              
              {/* Office Map Container */}
              <div className="relative mx-auto" style={{ maxWidth: '1000px' }}>
                <div 
                  className="relative overflow-hidden rounded-lg bg-gray-50 mx-auto"
                  style={{ 
                    width: '100%', 
                    maxWidth: '1000px',
                    aspectRatio: '1000/600',
                    minHeight: '400px'
                  }}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <OfficeLayout 
                      width={1000}
                      height={600}
                      showLabels={true}
                    />
                    
                    <RealTimeAgentManager
                      key={retryKey}
                      officeWidth={1000}
                      officeHeight={600}
                      showActivities={true}
                      showConversations={true}
                      pollingInterval={5000}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Activity Panel - Sidebar */}
          <AnimatePresence>
            {showActivityPanel && (
              <motion.div
                key="activity-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                layout
                className="lg:col-span-1"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <ActivityPanel className="h-fit sticky top-24" />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Debug Information */}
        <AnimatePresence>
          {showDebugInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-white font-bold text-base">🔧 Debug Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div>
                    <div className="text-green-300 mb-2 font-semibold">Real-time Features:</div>
                    <div className="space-y-1">
                      <div>✅ Agent polling every 5 seconds</div>
                      <div>✅ Activity polling every 5 seconds</div>
                      <div>✅ Framer Motion animations</div>
                      <div>✅ Speech bubbles with context</div>
                      <div>✅ Automatic movement system</div>
                      <div>✅ Conversation detection</div>
                      <div>✅ Error boundaries & retry</div>
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
                      <div>✅ Responsive design</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-green-300 mb-2 font-semibold">UI Components:</div>
                    <div className="space-y-1">
                      <div>✅ OfficeLayout with zones</div>
                      <div>✅ RealTimeAgentManager</div>
                      <div>✅ ActivityPanel with polling</div>
                      <div>✅ React Suspense loading</div>
                      <div>✅ Error handling</div>
                      <div>✅ Responsive grid layout</div>
                      <div>✅ TypeScript interfaces</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600 text-sm">
              Live agent and activity data from APIs every 5 seconds. 
              Automatic reconnection and error handling included.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smooth Animations</h3>
            <p className="text-gray-600 text-sm">
              Framer Motion powered with pathfinding, movement trails, 
              and conversation bubbles. Optimized for 60fps performance.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600 text-sm">
              Works perfectly on desktop, tablet, and mobile. 
              Activity panel adapts to screen size automatically.
            </p>
          </div>
        </motion.div>
        
        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-4xl mx-auto bg-blue-50 rounded-xl p-6 text-center border border-blue-200"
        >
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            🎮 Interactive Office Experience
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            Watch 16 AI agents move around the office in real-time, have conversations, and update their status. 
            The activity panel shows a live feed of all interactions and movements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-600">
            <div className="space-y-1 text-left">
              <div>• Live data updates from API every 5 seconds</div>
              <div>• Agents move between engineering, business, operations zones</div>
              <div>• Speech bubbles show current tasks and conversations</div>
            </div>
            <div className="space-y-1 text-left">
              <div>• Activity panel tracks all movements and interactions</div>
              <div>• Responsive design works on all screen sizes</div>
              <div>• Error handling with automatic retry functionality</div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}