'use client'

import { useState } from 'react'
import { OfficeLayout } from '@/components/OfficeLayout'
import { RealTimeAgentManager } from '@/components/RealTimeAgentManager'
import type { Agent } from '@/types/agent'

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  
  const handleAgentClick = (agentId: string) => {
    // This will be handled by the RealTimeAgentManager
    console.log('Agent clicked:', agentId)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏢 Kollektiv AI Office
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Live 2D animated office map with real-time polling and AI agent interactions
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
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
          </div>
          
          {/* Control Panel */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showDebugInfo ? 'Hide' : 'Show'} Debug Info
            </button>
          </div>
        </div>
        
        {/* Office Map Container */}
        <div className="mb-8 flex justify-center">
          <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div 
              className="relative overflow-hidden rounded-lg bg-gray-50"
              style={{ width: 1000, height: 600 }}
            >
              {/* Office Layout Background */}
              <OfficeLayout 
                width={1000}
                height={600}
                showLabels={true}
              />
              
              {/* Real-time Animated Agents */}
              <RealTimeAgentManager
                officeWidth={1000}
                officeHeight={600}
                showActivities={true}
                showConversations={true}
                pollingInterval={5000}
              />
            </div>
          </div>
        </div>
        
        {/* Debug Information */}
        {showDebugInfo && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <h3 className="text-white font-bold mb-2">🔧 Debug Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-300 mb-1">Real-time Features:</div>
                  <div>✅ Agent polling every 5 seconds</div>
                  <div>✅ Framer Motion animations</div>
                  <div>✅ Speech bubbles with context</div>
                  <div>✅ Automatic movement system</div>
                  <div>✅ Conversation detection</div>
                  <div>✅ Activity feed tracking</div>
                </div>
                <div>
                  <div className="text-green-300 mb-1">Animation Features:</div>
                  <div>✅ Smooth pathfinding</div>
                  <div>✅ Movement trails</div>
                  <div>✅ Status indicators</div>
                  <div>✅ Conversation animations</div>
                  <div>✅ Layout-based positioning</div>
                  <div>✅ Performance optimized</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Polling</h3>
            <p className="text-gray-600 text-sm">
              Fetches agent data from /api/agents every 5 seconds using fetch API. 
              Updates positions, status, and tasks automatically.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smooth Animations</h3>
            <p className="text-gray-600 text-sm">
              Framer Motion powered animations with pathfinding, movement trails, 
              and conversation bubbles. Performance optimized with layout animations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Interactions</h3>
            <p className="text-gray-600 text-sm">
              Agents automatically move between office zones, start conversations, 
              and display context-aware speech bubbles based on their current activity.
            </p>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 max-w-2xl mx-auto bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">🎮 Interactive Office Map</h3>
          <p className="text-blue-700 text-sm mb-3">
            Watch as AI agents move around the office in real-time, have conversations, and change their status. 
            Click on any agent to trigger manual movement!
          </p>
          <div className="text-xs text-blue-600 space-y-1">
            <div>• Data updates automatically from the API every 5 seconds</div>
            <div>• Agents move between engineering, business, operations, meeting rooms, and kitchen areas</div>
            <div>• Speech bubbles show current tasks and conversation topics</div>
            <div>• Conversations start automatically when agents are near each other</div>
          </div>
        </div>
      </div>
    </main>
  )
}