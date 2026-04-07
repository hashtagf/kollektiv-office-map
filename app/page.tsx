'use client'

import { useState } from 'react'
import { OfficeMap, Agent } from '@/components/office'

// Mock data for 16 AI agents from the team
const mockAgents: Agent[] = [
  // Engineering Department
  { id: 'sam-rivera', name: 'Sam Rivera', role: 'cto', title: 'Chief Technology Officer', department: 'engineering', x: 300, y: 120, status: 'working', currentActivity: 'Reviewing system architecture' },
  { id: 'maya-chen', name: 'Maya Chen', role: 'product-owner', title: 'Product Manager', department: 'engineering', x: 400, y: 120, status: 'meeting', currentActivity: 'Sprint planning meeting' },
  { id: 'kai-tanaka', name: 'Kai Tanaka', role: 'scrum-master', title: 'Scrum Master', department: 'engineering', x: 500, y: 120, status: 'working', currentActivity: 'Updating sprint board' },
  { id: 'alex-park', name: 'Alex Park', role: 'backend', title: 'Backend Engineer', department: 'engineering', x: 200, y: 180, status: 'working', currentActivity: 'Implementing API endpoints' },
  { id: 'sarah-kim', name: 'Sarah Kim', role: 'frontend', title: 'Frontend Engineer', department: 'engineering', x: 300, y: 180, status: 'working', currentActivity: 'Building UI components' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'qa', title: 'QA Engineer', department: 'engineering', x: 400, y: 180, status: 'working', currentActivity: 'Testing new features' },
  { id: 'riku-honda', name: 'Riku Honda', role: 'devops', title: 'DevOps Engineer', department: 'engineering', x: 500, y: 180, status: 'available' },
  { id: 'jordan-wu', name: 'Jordan Wu', role: 'solution-engineer', title: 'Solution Engineer', department: 'engineering', x: 400, y: 260, status: 'working', currentActivity: 'Client integration support' },
  
  // Business Department
  { id: 'luna-park', name: 'Luna Park', role: 'content-creator', title: 'Content Creator', department: 'business', x: 620, y: 120, status: 'working', currentActivity: 'Writing blog posts' },
  { id: 'sora-tanaka', name: 'Sora Tanaka', role: 'marketing', title: 'Marketing Manager', department: 'business', x: 720, y: 120, status: 'meeting', currentActivity: 'Campaign strategy session' },
  { id: 'daniel-oh', name: 'Daniel Oh', role: 'sales', title: 'Sales & BD Manager', department: 'business', x: 820, y: 120, status: 'working', currentActivity: 'Client calls' },
  { id: 'ava-chen', name: 'Ava Chen', role: 'support', title: 'Customer Support Lead', department: 'business', x: 620, y: 180, status: 'working', currentActivity: 'Handling support tickets' },
  { id: 'nara-kim', name: 'Nara Kim', role: 'personal-assistant', title: 'Personal Assistant', department: 'business', x: 720, y: 180, status: 'available' },
  
  // Operations Department
  { id: 'jamie-lee', name: 'Jamie Lee', role: 'hr', title: 'HR Manager', department: 'operations', x: 480, y: 500, status: 'working', currentActivity: 'Reviewing job applications' },
  { id: 'mei-tanaka', name: 'Mei Tanaka', role: 'finance', title: 'Finance Manager', department: 'operations', x: 580, y: 500, status: 'working', currentActivity: 'Monthly financial review' },
  { id: 'leo-park', name: 'Leo Park', role: 'legal', title: 'Legal Counsel', department: 'operations', x: 680, y: 500, status: 'break', currentActivity: 'Coffee break ☕' },
]

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)
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
            Live 2D animated office map showing 16 AI agents working together
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
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
              Available
            </span>
          </div>
        </div>
        
        {/* Office Map */}
        <div className="mb-8">
          <OfficeMap
            agents={mockAgents}
            selectedAgent={selectedAgent}
            onAgentClick={handleAgentClick}
            className="w-full max-w-6xl mx-auto"
          />
        </div>
        
        {/* Agent Details Panel */}
        {selectedAgent && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-lg font-bold"
                style={{ 
                  backgroundColor: selectedAgent.department === 'engineering' ? '#3b82f6' : 
                                   selectedAgent.department === 'business' ? '#10b981' : '#f59e0b'
                }}
              >
                {selectedAgent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedAgent.name}</h3>
                <p className="text-gray-600 mb-2">{selectedAgent.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full capitalize">
                    {selectedAgent.department}
                  </span>
                  <span className={`px-3 py-1 rounded-full capitalize ${
                    selectedAgent.status === 'working' ? 'bg-green-100 text-green-700' :
                    selectedAgent.status === 'meeting' ? 'bg-blue-100 text-blue-700' :
                    selectedAgent.status === 'break' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedAgent.status}
                  </span>
                </div>
                {selectedAgent.currentActivity && (
                  <p className="mt-3 text-gray-700 font-medium">
                    🎯 {selectedAgent.currentActivity}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Engineering</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">5</div>
            <div className="text-sm text-gray-600">Business</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">3</div>
            <div className="text-sm text-gray-600">Operations</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockAgents.filter(a => a.status === 'working').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
      </div>
    </main>
  )
}
