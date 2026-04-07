/**
 * Mock agent data with 16 unique AI agents
 */

import type { Agent } from '../types/agent'

// Unique avatar colors for each agent
const AVATAR_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9F43', // Orange
  '#10AC84', // Dark Green
  '#EE5A24', // Red Orange
  '#0984E3', // Dark Blue
  '#6C5CE7', // Lavender
  '#FD79A8', // Rose
  '#FDCB6E'  // Light Orange
]

// Role-specific emojis
const ROLE_EMOJIS: Record<string, string> = {
  'cto': '👨‍💻',
  'product-owner': '👩‍💼',
  'scrum-master': '📋',
  'backend': '⚙️',
  'frontend': '🎨',
  'qa': '🔍',
  'devops': '☁️',
  'solution-engineer': '🔧',
  'content-creator': '✍️',
  'marketing': '📢',
  'sales': '💼',
  'support': '🎧',
  'personal-assistant': '📅',
  'hr': '👥',
  'finance': '💰',
  'legal': '⚖️'
}

// Generate random positions within office zones
const getRandomPosition = (team: string): { x: number; y: number } => {
  const zones = {
    engineering: { x: 100, y: 100, width: 400, height: 250 },
    business: { x: 600, y: 100, width: 400, height: 250 },
    operations: { x: 350, y: 400, width: 300, height: 200 }
  }
  
  const zone = zones[team as keyof typeof zones] || zones.engineering
  return {
    x: zone.x + Math.random() * zone.width,
    y: zone.y + Math.random() * zone.height
  }
}

// Mock 16 AI agents data
export const MOCK_AGENTS: Agent[] = [
  {
    id: 'sam-rivera',
    name: 'Sam Rivera',
    role: 'cto',
    title: 'Chief Technology Officer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Reviewing system architecture',
    status: 'working',
    avatarColor: AVATAR_COLORS[0],
    emoji: ROLE_EMOJIS['cto']
  },
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'product-owner',
    title: 'Product Manager',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Planning sprint backlog',
    status: 'working',
    avatarColor: AVATAR_COLORS[1],
    emoji: ROLE_EMOJIS['product-owner']
  },
  {
    id: 'kai-tanaka',
    name: 'Kai Tanaka',
    role: 'scrum-master',
    title: 'Scrum Master',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Facilitating daily standup',
    status: 'meeting',
    avatarColor: AVATAR_COLORS[2],
    emoji: ROLE_EMOJIS['scrum-master']
  },
  {
    id: 'alex-park',
    name: 'Alex Park',
    role: 'backend',
    title: 'Backend Engineer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Implementing API endpoints',
    status: 'working',
    avatarColor: AVATAR_COLORS[3],
    emoji: ROLE_EMOJIS['backend']
  },
  {
    id: 'sarah-kim',
    name: 'Sarah Kim',
    role: 'frontend',
    title: 'Frontend Engineer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Building React components',
    status: 'working',
    avatarColor: AVATAR_COLORS[4],
    emoji: ROLE_EMOJIS['frontend']
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    role: 'qa',
    title: 'QA Engineer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Testing user workflows',
    status: 'working',
    avatarColor: AVATAR_COLORS[5],
    emoji: ROLE_EMOJIS['qa']
  },
  {
    id: 'riku-honda',
    name: 'Riku Honda',
    role: 'devops',
    title: 'DevOps Engineer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Deploying to production',
    status: 'working',
    avatarColor: AVATAR_COLORS[6],
    emoji: ROLE_EMOJIS['devops']
  },
  {
    id: 'jordan-wu',
    name: 'Jordan Wu',
    role: 'solution-engineer',
    title: 'Solution Engineer',
    team: 'engineering',
    position: getRandomPosition('engineering'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Designing system solutions',
    status: 'working',
    avatarColor: AVATAR_COLORS[7],
    emoji: ROLE_EMOJIS['solution-engineer']
  },
  {
    id: 'luna-park',
    name: 'Luna Park',
    role: 'content-creator',
    title: 'Content Creator',
    team: 'business',
    position: getRandomPosition('business'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Creating marketing content',
    status: 'working',
    avatarColor: AVATAR_COLORS[8],
    emoji: ROLE_EMOJIS['content-creator']
  },
  {
    id: 'sora-tanaka',
    name: 'Sora Tanaka',
    role: 'marketing',
    title: 'Marketing Manager',
    team: 'business',
    position: getRandomPosition('business'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Planning campaign strategy',
    status: 'meeting',
    avatarColor: AVATAR_COLORS[9],
    emoji: ROLE_EMOJIS['marketing']
  },
  {
    id: 'daniel-oh',
    name: 'Daniel Oh',
    role: 'sales',
    title: 'Sales & BD Manager',
    team: 'business',
    position: getRandomPosition('business'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Client presentation',
    status: 'meeting',
    avatarColor: AVATAR_COLORS[10],
    emoji: ROLE_EMOJIS['sales']
  },
  {
    id: 'ava-chen',
    name: 'Ava Chen',
    role: 'support',
    title: 'Customer Support Lead',
    team: 'business',
    position: getRandomPosition('business'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Helping customers',
    status: 'working',
    avatarColor: AVATAR_COLORS[11],
    emoji: ROLE_EMOJIS['support']
  },
  {
    id: 'nara-kim',
    name: 'Nara Kim',
    role: 'personal-assistant',
    title: 'Personal Assistant',
    team: 'business',
    position: getRandomPosition('business'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Managing schedules',
    status: 'working',
    avatarColor: AVATAR_COLORS[12],
    emoji: ROLE_EMOJIS['personal-assistant']
  },
  {
    id: 'jamie-lee',
    name: 'Jamie Lee',
    role: 'hr',
    title: 'HR Manager',
    team: 'operations',
    position: getRandomPosition('operations'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Reviewing team performance',
    status: 'working',
    avatarColor: AVATAR_COLORS[13],
    emoji: ROLE_EMOJIS['hr']
  },
  {
    id: 'mei-tanaka',
    name: 'Mei Tanaka',
    role: 'finance',
    title: 'Finance Manager',
    team: 'operations',
    position: getRandomPosition('operations'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Budget planning',
    status: 'working',
    avatarColor: AVATAR_COLORS[14],
    emoji: ROLE_EMOJIS['finance']
  },
  {
    id: 'leo-park',
    name: 'Leo Park',
    role: 'legal',
    title: 'Legal Counsel',
    team: 'operations',
    position: getRandomPosition('operations'),
    isMoving: false,
    isInConversation: false,
    lastActivity: 'Contract review',
    status: 'working',
    avatarColor: AVATAR_COLORS[15],
    emoji: ROLE_EMOJIS['legal']
  }
]

// Utility functions
export const getAgentById = (id: string): Agent | undefined => {
  return MOCK_AGENTS.find(agent => agent.id === id)
}

export const getAgentsByTeam = (team: string): Agent[] => {
  return MOCK_AGENTS.filter(agent => agent.team === team)
}

export const getRandomAgent = (): Agent => {
  return MOCK_AGENTS[Math.floor(Math.random() * MOCK_AGENTS.length)]
}