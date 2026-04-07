'use client'

import { useState, useEffect } from 'react'
import OfficeLayout from '@/components/OfficeLayout'
import { motion } from 'framer-motion'

interface Agent {
  id: string
  name: string
  role: string
  color: string
  x: number
  y: number
  status: 'working' | 'meeting' | 'break' | 'available'
  currentActivity?: string
}

// Mock data for 16 AI agents from company knowledge
const INITIAL_AGENTS: Agent[] = [
  { id: 'sam-rivera', name: 'Sam Rivera', role: 'CTO', color: '#2563eb', x: 180, y: 150, status: 'working' },
  { id: 'maya-chen', name: 'Maya Chen', role: 'Product Manager', color: '#7c3aed', x: 350, y: 120, status: 'meeting' },
  { id: 'kai-tanaka', name: 'Kai Tanaka', role: 'Scrum Master', color: '#059669', x: 520, y: 150, status: 'working' },
  { id: 'alex-park', name: 'Alex Park', role: 'Backend Engineer', color: '#ea580c', x: 180, y: 250, status: 'working' },
  { id: 'sarah-kim', name: 'Sarah Kim', role: 'Frontend Engineer', color: '#db2777', x: 350, y: 250, status: 'working' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'QA Engineer', color: '#0891b2', x: 520, y: 250, status: 'working' },
  { id: 'riku-honda', name: 'Riku Honda', role: 'DevOps Engineer', color: '#65a30d', x: 180, y: 350, status: 'available' },
  { id: 'jordan-wu', name: 'Jordan Wu', role: 'Solution Engineer', color: '#dc2626', x: 350, y: 350, status: 'working' },
  { id: 'luna-park', name: 'Luna Park', role: 'Content Creator', color: '#7c2d12', x: 720, y: 150, status: 'working' },
  { id: 'sora-tanaka', name: 'Sora Tanaka', role: 'Marketing Manager', color: '#be185d', x: 720, y: 250, status: 'meeting' },
  { id: 'daniel-oh', name: 'Daniel Oh', role: 'Sales & BD Manager', color: '#0c4a6e', x: 720, y: 350, status: 'working' },
  { id: 'ava-chen', name: 'Ava Chen', role: 'Customer Support', color: '#166534', x: 890, y: 150, status: 'available' },
  { id: 'nara-kim', name: 'Nara Kim', role: 'Personal Assistant', color: '#92400e', x: 890, y: 250, status: 'working' },
  { id: 'jamie-lee', name: 'Jamie Lee', role: 'HR Manager', color: '#831843', x: 890, y: 350, status: 'break' },
  { id: 'mei-tanaka', name: 'Mei Tanaka', role: 'Finance Manager', color: '#1e40af', x: 520, y: 450, status: 'working' },
  { id: 'leo-park', name: 'Leo Park', role: 'Legal Counsel', color: '#059669', x: 350, y: 450, status: 'available' },
]

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate agent movement and status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          // Add slight random movement within desk area
          x: agent.x + (Math.random() - 0.5) * 10,
          y: agent.y + (Math.random() - 0.5) * 10,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Kollektiv Office</h1>
              <span className="ml-3 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {agents.filter(a => a.status === 'working').length} agents working
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Office Map */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <OfficeLayout 
              agents={agents} 
              onAgentClick={handleAgentClick}
              selectedAgent={selectedAgent}
            />
          </motion.div>
        </main>

        {/* Side Panel */}
        <aside className="w-80 bg-white shadow-lg p-6">
          <div className="space-y-6">
            {/* Agent Status Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Status</h3>
              <div className="space-y-2">
                {['working', 'meeting', 'break', 'available'].map(status => {
                  const count = agents.filter(a => a.status === status).length
                  const color = {
                    working: 'bg-green-500',
                    meeting: 'bg-blue-500', 
                    break: 'bg-yellow-500',
                    available: 'bg-gray-500'
                  }[status]
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                        <span className="capitalize text-sm text-gray-600">{status}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Agent Details */}
            {selectedAgent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t pt-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full mr-3"
                      style={{ backgroundColor: selectedAgent.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedAgent.name}</p>
                      <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status: </span>
                    <span className={`text-sm capitalize ${
                      selectedAgent.status === 'working' ? 'text-green-600' :
                      selectedAgent.status === 'meeting' ? 'text-blue-600' :
                      selectedAgent.status === 'break' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {selectedAgent.status}
                    </span>
                  </div>
                  {selectedAgent.currentActivity && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Activity: </span>
                      <span className="text-sm text-gray-900">{selectedAgent.currentActivity}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recent Activities */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600">2 minutes ago</p>
                  <p className="text-gray-900">Maya Chen started sprint planning meeting</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">5 minutes ago</p>
                  <p className="text-gray-900">Alex Park deployed kollektiv-office-map</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">12 minutes ago</p>
                  <p className="text-gray-900">Sarah Kim completed UI components</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}