import { NextRequest, NextResponse } from 'next/server'
import type { Agent } from '@/lib/types'

// Team data based on company knowledge
const TEAM_DATA = [
  { id: 'sam-rivera', name: 'Sam Rivera', role: 'cto', title: 'Chief Technology Officer', team: 'Engineering', color: '#8B5CF6' },
  { id: 'maya-chen', name: 'Maya Chen', role: 'product-owner', title: 'Product Manager', team: 'Engineering', color: '#06B6D4' },
  { id: 'kai-tanaka', name: 'Kai Tanaka', role: 'scrum-master', title: 'Scrum Master', team: 'Engineering', color: '#10B981' },
  { id: 'alex-park', name: 'Alex Park', role: 'backend', title: 'Backend Engineer', team: 'Engineering', color: '#F59E0B' },
  { id: 'sarah-kim', name: 'Sarah Kim', role: 'frontend', title: 'Frontend Engineer', team: 'Engineering', color: '#EF4444' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'qa', title: 'QA Engineer', team: 'Engineering', color: '#8B5CF6' },
  { id: 'riku-honda', name: 'Riku Honda', role: 'devops', title: 'DevOps Engineer', team: 'Engineering', color: '#6366F1' },
  { id: 'jordan-wu', name: 'Jordan Wu', role: 'solution-engineer', title: 'Solution Engineer', team: 'Engineering', color: '#06B6D4' },
  { id: 'luna-park', name: 'Luna Park', role: 'content-creator', title: 'Content Creator', team: 'Business', color: '#EC4899' },
  { id: 'sora-tanaka', name: 'Sora Tanaka', role: 'marketing', title: 'Marketing Manager', team: 'Business', color: '#F97316' },
  { id: 'daniel-oh', name: 'Daniel Oh', role: 'sales', title: 'Sales & BD Manager', team: 'Business', color: '#84CC16' },
  { id: 'ava-chen', name: 'Ava Chen', role: 'support', title: 'Customer Support Lead', team: 'Business', color: '#06B6D4' },
  { id: 'nara-kim', name: 'Nara Kim', role: 'personal-assistant', title: 'Personal Assistant', team: 'Business', color: '#A855F7' },
  { id: 'jamie-lee', name: 'Jamie Lee', role: 'hr', title: 'HR Manager', team: 'Operations', color: '#EF4444' },
  { id: 'mei-tanaka', name: 'Mei Tanaka', role: 'finance', title: 'Finance Manager', team: 'Operations', color: '#10B981' },
  { id: 'leo-park', name: 'Leo Park', role: 'legal', title: 'Legal Counsel', team: 'Operations', color: '#6B7280' }
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
  'cto': ['Reviewing architecture decisions', 'Planning technical roadmap', 'Code review session'],
  'product-owner': ['Writing user stories', 'Stakeholder meeting', 'Product planning'],
  'scrum-master': ['Daily standup', 'Sprint planning', 'Removing blockers'],
  'backend': ['API development', 'Database optimization', 'Server maintenance'],
  'frontend': ['UI implementation', 'Component testing', 'Design review'],
  'qa': ['Test case writing', 'Bug verification', 'Automated testing'],
  'devops': ['Pipeline optimization', 'Infrastructure monitoring', 'Deployment'],
  'solution-engineer': ['Client integration', 'Technical documentation', 'Solution design'],
  'content-creator': ['Blog writing', 'Social media content', 'Video editing'],
  'marketing': ['Campaign planning', 'Analytics review', 'Market research'],
  'sales': ['Client calls', 'Proposal writing', 'Lead qualification'],
  'support': ['Ticket resolution', 'Customer onboarding', 'Documentation'],
  'personal-assistant': ['Schedule management', 'Meeting coordination', 'Task organization'],
  'hr': ['Recruiting', 'Employee onboarding', 'Policy updates'],
  'finance': ['Budget analysis', 'Financial reporting', 'Invoice processing'],
  'legal': ['Contract review', 'Compliance check', 'Legal consultation']
}

function generateMockAgents(): Agent[] {
  const statuses: Array<'working' | 'idle' | 'meeting'> = ['working', 'idle', 'meeting']
  
  return TEAM_DATA.map((member) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const tasks = TASKS_BY_ROLE[member.role as keyof typeof TASKS_BY_ROLE] || ['Working']
    const currentTask = status === 'working' ? tasks[Math.floor(Math.random() * tasks.length)] : null
    
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      title: member.title,
      team: member.team,
      status,
      currentTask,
      position: OFFICE_POSITIONS[member.id as keyof typeof OFFICE_POSITIONS] || { x: 400, y: 300 },
      targetPosition: undefined,
      isMoving: Math.random() < 0.3,
      isInConversation: Math.random() < 0.2,
      conversationPartner: undefined,
      lastActivity: new Date().toISOString(),
      avatarColor: member.color
    } as Agent & { avatarColor: string }
  })
}

export async function GET(request: NextRequest) {
  try {
    const agents = generateMockAgents()
    
    return NextResponse.json({
      success: true,
      data: agents,
      timestamp: new Date().toISOString(),
      count: agents.length
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  return new Response(null, { status: 200 })
}