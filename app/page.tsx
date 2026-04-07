'use client'

import { useState } from 'react'
import { OfficeLayout } from '@/components/OfficeLayout'
import { AgentManager } from '@/components/AgentManager'
import type { Agent } from '@/types/agent'
import { MOCK_AGENTS, getAgentsByTeam } from '@/utils/agentData'

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)
  }

  const engineeringTeam = getAgentsByTeam('engineering')
  const businessTeam = getAgentsByTeam('business')
  const operationsTeam = getAgentsByTeam('operations')
  const activeAgents = MOCK_AGENTS.filter(a => a.status === 'working').length
  
  return (
    <main className=\"min-h-screen bg-gradient-to-br from-slate-50 to-slate-100\">
      <div className=\"container mx-auto px-4 py-8\">
        {/* Header */}
        <div className=\"mb-8 text-center\">
          <h1 className=\"text-4xl font-bold text-gray-900 mb-2\">
            🏢 Kollektiv AI Office
          </h1>
          <p className=\"text-lg text-gray-600 mb-4\">
            Live 2D animated office map showing 16 AI agents working together
          </p>
          <div className=\"flex justify-center gap-6 text-sm text-gray-500\">
            <span className=\"flex items-center gap-2\">
              <div className=\"w-3 h-3 bg-green-400 rounded-full\"></div>
              Working
            </span>
            <span className=\"flex items-center gap-2\">
              <div className=\"w-3 h-3 bg-blue-400 rounded-full\"></div>
              In Meeting
            </span>
            <span className=\"flex items-center gap-2\">
              <div className=\"w-3 h-3 bg-amber-400 rounded-full\"></div>
              On Break
            </span>
            <span className=\"flex items-center gap-2\">
              <div className=\"w-3 h-3 bg-gray-400 rounded-full\"></div>
              Idle
            </span>
          </div>
        </div>
        
        {/* Office Map Container */}
        <div className=\"mb-8 flex justify-center\">
          <div className=\"relative bg-white rounded-xl shadow-lg border border-gray-200 p-6\">
            <div 
              className=\"relative overflow-hidden rounded-lg\"
              style={{ width: 1200, height: 800 }}
            >
              {/* Office Layout Background */}
              <OfficeLayout 
                width={1200}
                height={800}
                showLabels={true}
              />
              
              {/* Animated Agents */}
              <AgentManager
                officeWidth={1200}
                officeHeight={800}
                showActivities={true}
              />
            </div>
          </div>
        </div>
        
        {/* Agent Details Panel */}
        {selectedAgent && (
          <div className=\"max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8\">
            <div className=\"flex items-start gap-4\">
              <div 
                className=\"w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl\"
                style={{ backgroundColor: selectedAgent.avatarColor }}
              >
                {selectedAgent.emoji}
              </div>
              <div className=\"flex-1\">
                <h3 className=\"text-xl font-bold text-gray-900 mb-1\">{selectedAgent.name}</h3>
                <p className=\"text-gray-600 mb-2\">{selectedAgent.title}</p>
                <div className=\"flex items-center gap-4 text-sm\">
                  <span className={`px-3 py-1 rounded-full capitalize ${\n                    selectedAgent.team === 'engineering' ? 'bg-blue-100 text-blue-700' :\n                    selectedAgent.team === 'business' ? 'bg-green-100 text-green-700' :\n                    'bg-amber-100 text-amber-700'\n                  }`}>
                    {selectedAgent.team}
                  </span>\n                  <span className={`px-3 py-1 rounded-full capitalize ${\n                    selectedAgent.status === 'working' ? 'bg-green-100 text-green-700' :\n                    selectedAgent.status === 'meeting' ? 'bg-blue-100 text-blue-700' :\n                    selectedAgent.status === 'break' ? 'bg-amber-100 text-amber-700' :\n                    'bg-gray-100 text-gray-700'\n                  }`}>
                    {selectedAgent.status}
                  </span>
                </div>
                {selectedAgent.lastActivity && (
                  <p className=\"mt-3 text-gray-700 font-medium\">
                    🎯 {selectedAgent.lastActivity}
                  </p>
                )}
                {selectedAgent.currentTask && (
                  <p className=\"mt-2 text-gray-600\">
                    📋 {selectedAgent.currentTask}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Team Stats */}
        <div className=\"mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto\">
          <div className=\"bg-white rounded-lg shadow p-4 text-center\">
            <div className=\"text-2xl font-bold text-blue-600\">{engineeringTeam.length}</div>
            <div className=\"text-sm text-gray-600\">Engineering</div>
            <div className=\"text-xs text-gray-500 mt-1\">
              {engineeringTeam.filter(a => a.status === 'working').length} active
            </div>
          </div>
          <div className=\"bg-white rounded-lg shadow p-4 text-center\">
            <div className=\"text-2xl font-bold text-emerald-600\">{businessTeam.length}</div>
            <div className=\"text-sm text-gray-600\">Business</div>
            <div className=\"text-xs text-gray-500 mt-1\">
              {businessTeam.filter(a => a.status === 'working').length} active
            </div>
          </div>
          <div className=\"bg-white rounded-lg shadow p-4 text-center\">
            <div className=\"text-2xl font-bold text-amber-600\">{operationsTeam.length}</div>
            <div className=\"text-sm text-gray-600\">Operations</div>
            <div className=\"text-xs text-gray-500 mt-1\">
              {operationsTeam.filter(a => a.status === 'working').length} active
            </div>
          </div>
          <div className=\"bg-white rounded-lg shadow p-4 text-center\">
            <div className=\"text-2xl font-bold text-green-600\">{activeAgents}</div>
            <div className=\"text-sm text-gray-600\">Total Active</div>
            <div className=\"text-xs text-gray-500 mt-1\">
              {MOCK_AGENTS.length} total agents
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className=\"mt-8 max-w-2xl mx-auto bg-blue-50 rounded-lg p-4 text-center\">
          <h3 className=\"font-semibold text-blue-900 mb-2\">🎮 Interactive Office Map</h3>
          <p className=\"text-blue-700 text-sm\">
            Watch as AI agents move around the office, have conversations, and change their status. 
            Click on any agent to trigger movement or hover to see their details!
          </p>
        </div>
      </div>
    </main>
  )
}"