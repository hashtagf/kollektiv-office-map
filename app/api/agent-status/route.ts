import { NextRequest, NextResponse } from 'next/server'
import type { Agent } from '@/types/agent'

// Team data based on company knowledge
const TEAM_DATA = [
  { id: 'sam-rivera', name: 'Sam Rivera', role: 'cto', title: 'Chief Technology Officer', team: 'engineering', color: '#8B5CF6', emoji: '👨‍💼' },
  { id: 'maya-chen', name: 'Maya Chen', role: 'product-owner', title: 'Product Manager', team: 'engineering', color: '#06B6D4', emoji: '👩‍💼' },
  { id: 'kai-tanaka', name: 'Kai Tanaka', role: 'scrum-master', title: 'Scrum Master', team: 'engineering', color: '#10B981', emoji: '🎯' },
  { id: 'alex-park', name: 'Alex Park', role: 'backend', title: 'Backend Engineer', team: 'engineering', color: '#F59E0B', emoji: '⚙️' },
  { id: 'sarah-kim', name: 'Sarah Kim', role: 'frontend', title: 'Frontend Engineer', team: 'engineering', color: '#EF4444', emoji: '💻' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'qa', title: 'QA Engineer', team: 'engineering', color: '#8B5CF6', emoji: '🧪' },
  { id: 'riku-honda', name: 'Riku Honda', role: 'devops', title: 'DevOps Engineer', team: 'engineering', color: '#6366F1', emoji: '🚀' },
  { id: 'jordan-wu', name: 'Jordan Wu', role: 'solution-engineer', title: 'Solution Engineer', team: 'engineering', color: '#06B6D4', emoji: '🔧' },
  { id: 'luna-park', name: 'Luna Park', role: 'content-creator', title: 'Content Creator', team: 'business', color: '#EC4899', emoji: '✨' },
  { id: 'sora-tanaka', name: 'Sora Tanaka', role: 'marketing', title: 'Marketing Manager', team: 'business', color: '#F97316', emoji: '📈' },
  { id: 'daniel-oh', name: 'Daniel Oh', role: 'sales', title: 'Sales & BD Manager', team: 'business', color: '#84CC16', emoji: '💼' },
  { id: 'ava-chen', name: 'Ava Chen', role: 'support', title: 'Customer Support Lead', team: 'business', color: '#06B6D4', emoji: '💬' },
  { id: 'nara-kim', name: 'Nara Kim', role: 'personal-assistant', title: 'Personal Assistant', team: 'business', color: '#A855F7', emoji: '📅' },
  { id: 'jamie-lee', name: 'Jamie Lee', role: 'hr', title: 'HR Manager', team: 'operations', color: '#EF4444', emoji: '👥' },
  { id: 'mei-tanaka', name: 'Mei Tanaka', role: 'finance', title: 'Finance Manager', team: 'operations', color: '#10B981', emoji: '💰' },
  { id: 'leo-park', name: 'Leo Park', role: 'legal', title: 'Legal Counsel', team: 'operations', color: '#6B7280', emoji: '⚖️' }
]

// Office layout positions (800x600 office)
const OFFICE_POSITIONS = {
  // Engineering team area (left side)
  'sam-rivera': { x: 120, y: 100 },
  'alex-park': { x: 80, y: 180 },
  'sarah-kim': { x: 160, y: 180 },
  'priya-sharma': { x: 120, y: 260 },
  'riku-honda': { x: 80, y: 340 },
  'jordan-wu': { x: 160, y: 340 },
  
  // Product team (center)
  'maya-chen': { x: 300, y: 140 },
  'kai-tanaka': { x: 300, y: 220 },
  
  // Business team (right side)
  'luna-park': { x: 520, y: 100 },
  'sora-tanaka': { x: 600, y: 100 },
  'daniel-oh': { x: 520, y: 180 },
  'ava-chen': { x: 600, y: 180 },
  
  // Operations (bottom)
  'jamie-lee': { x: 300, y: 450 },
  'mei-tanaka': { x: 380, y: 450 },
  'leo-park': { x: 460, y: 450 },
  'nara-kim': { x: 220, y: 450 }
}

const TASKS_BY_ROLE = {
  'cto': ['Reviewing architecture decisions', 'Planning technical roadmap', 'Code review session', 'Team leadership meeting'],
  'product-owner': ['Writing user stories', 'Stakeholder meeting', 'Product planning', 'Requirements gathering'],
  'scrum-master': ['Daily standup', 'Sprint planning', 'Removing blockers', 'Team retrospective'],
  'backend': ['API development', 'Database optimization', 'Server maintenance', 'Code refactoring'],
  'frontend': ['UI implementation', 'Component testing', 'Design review', 'Performance optimization'],
  'qa': ['Test case writing', 'Bug verification', 'Automated testing', 'Quality assurance review'],
  'devops': ['Pipeline optimization', 'Infrastructure monitoring', 'Deployment', 'Security updates'],
  'solution-engineer': ['Client integration', 'Technical documentation', 'Solution design', 'API consulting'],
  'content-creator': ['Blog writing', 'Social media content', 'Video editing', 'Content strategy'],
  'marketing': ['Campaign planning', 'Analytics review', 'Market research', 'Brand development'],
  'sales': ['Client calls', 'Proposal writing', 'Lead qualification', 'Deal closing'],
  'support': ['Ticket resolution', 'Customer onboarding', 'Documentation', 'User training'],
  'personal-assistant': ['Schedule management', 'Meeting coordination', 'Task organization', 'Travel planning'],
  'hr': ['Recruiting', 'Employee onboarding', 'Policy updates', 'Performance reviews'],
  'finance': ['Budget analysis', 'Financial reporting', 'Invoice processing', 'Cost optimization'],
  'legal': ['Contract review', 'Compliance check', 'Legal consultation', 'Risk assessment']
}

// Generate random movement targets within office bounds
function generateMovementTarget(): { x: number; y: number } {
  return {
    x: Math.floor(Math.random() * 700) + 50, // 50-750 range
    y: Math.floor(Math.random() * 500) + 50  // 50-550 range
  }
}

// Simulate agent conversations
function generateConversations(agents: Agent[]): void {
  const availableAgents = agents.filter(a => !a.isInConversation && a.status !== 'break')
  
  // Create random conversations (10% chance)
  for (let i = 0; i < availableAgents.length - 1; i++) {
    if (Math.random() < 0.1) {
      const agent1 = availableAgents[i]
      const agent2 = availableAgents[i + 1]
      
      agent1.isInConversation = true
      agent1.conversationPartner = agent2.id
      agent1.status = 'meeting'
      
      agent2.isInConversation = true
      agent2.conversationPartner = agent1.id
      agent2.status = 'meeting'
    }
  }
}

function generateMockAgents(): Agent[] {
  const statuses: Array<'working' | 'meeting' | 'break' | 'idle'> = ['working', 'meeting', 'break', 'idle']
  
  const agents = TEAM_DATA.map((member) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const tasks = TASKS_BY_ROLE[member.role as keyof typeof TASKS_BY_ROLE] || ['Working']
    const currentTask = status === 'working' ? tasks[Math.floor(Math.random() * tasks.length)] : null
    
    // Generate random movement
    const isMoving = Math.random() < 0.4
    const currentPosition = OFFICE_POSITIONS[member.id as keyof typeof OFFICE_POSITIONS] || { x: 400, y: 300 }
    const targetPosition = isMoving ? generateMovementTarget() : undefined
    
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      title: member.title,
      team: member.team as 'engineering' | 'business' | 'operations',
      status,
      currentTask,
      position: currentPosition,
      targetPosition,
      isMoving,
      isInConversation: false,
      conversationPartner: undefined,
      lastActivity: new Date(Date.now() - Math.random() * 300000).toISOString(), // Last 5 minutes
      avatarColor: member.color,
      emoji: member.emoji
    } as Agent
  })
  
  // Generate conversations
  generateConversations(agents)
  
  return agents
}

export async function GET(request: NextRequest) {
  try {
    const agents = generateMockAgents()
    
    // Add some randomization to make it feel more dynamic
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      success: true,
      data: agents,
      timestamp,
      count: agents.length,
      office: {
        width: 800,
        height: 600
      }
    })
  } catch (error) {
    console.error('Error fetching agent status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent status' },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  return new Response(null, { status: 200 })
}