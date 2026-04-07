/**
 * Office Map Constants
 */

// Office dimensions (in pixels)
export const OFFICE_WIDTH = 1200
export const OFFICE_HEIGHT = 800

// Agent configuration
export const AGENT_SIZE = 40
export const AGENT_SPEED = 2 // pixels per frame

// Animation durations (in seconds)
export const WALK_DURATION = 3
export const IDLE_DURATION = 5
export const CONVERSATION_DURATION = 8

// Office zones and areas
export const OFFICE_ZONES = {
  ENGINEERING: { x: 100, y: 100, width: 400, height: 250 },
  BUSINESS: { x: 600, y: 100, width: 400, height: 250 },
  OPERATIONS: { x: 350, y: 400, width: 300, height: 200 },
  MEETING_ROOM: { x: 750, y: 400, width: 200, height: 150 },
  COMMON_AREA: { x: 100, y: 650, width: 500, height: 100 },
  KITCHEN: { x: 700, y: 650, width: 200, height: 100 }
} as const

// Agent team data
export const TEAM_DATA = [
  { id: 'sam-rivera', name: 'Sam Rivera', role: 'cto', title: 'Chief Technology Officer', team: 'engineering' },
  { id: 'maya-chen', name: 'Maya Chen', role: 'product-owner', title: 'Product Manager', team: 'engineering' },
  { id: 'kai-tanaka', name: 'Kai Tanaka', role: 'scrum-master', title: 'Scrum Master', team: 'engineering' },
  { id: 'alex-park', name: 'Alex Park', role: 'backend', title: 'Backend Engineer', team: 'engineering' },
  { id: 'sarah-kim', name: 'Sarah Kim', role: 'frontend', title: 'Frontend Engineer', team: 'engineering' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'qa', title: 'QA Engineer', team: 'engineering' },
  { id: 'riku-honda', name: 'Riku Honda', role: 'devops', title: 'DevOps Engineer', team: 'engineering' },
  { id: 'jordan-wu', name: 'Jordan Wu', role: 'solution-engineer', title: 'Solution Engineer', team: 'engineering' },
  { id: 'luna-park', name: 'Luna Park', role: 'content-creator', title: 'Content Creator', team: 'business' },
  { id: 'sora-tanaka', name: 'Sora Tanaka', role: 'marketing', title: 'Marketing Manager', team: 'business' },
  { id: 'daniel-oh', name: 'Daniel Oh', role: 'sales', title: 'Sales & BD Manager', team: 'business' },
  { id: 'ava-chen', name: 'Ava Chen', role: 'support', title: 'Customer Support Lead', team: 'business' },
  { id: 'nara-kim', name: 'Nara Kim', role: 'personal-assistant', title: 'Personal Assistant', team: 'business' },
  { id: 'jamie-lee', name: 'Jamie Lee', role: 'hr', title: 'HR Manager', team: 'operations' },
  { id: 'mei-tanaka', name: 'Mei Tanaka', role: 'finance', title: 'Finance Manager', team: 'operations' },
  { id: 'leo-park', name: 'Leo Park', role: 'legal', title: 'Legal Counsel', team: 'operations' }
] as const