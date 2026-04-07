/**
 * Type definitions for the Office Map application
 */

export interface Position {
  x: number
  y: number
}

export interface Agent {
  id: string
  name: string
  role: string
  title: string
  team: string
  position: Position
  targetPosition?: Position
  isMoving: boolean
  isInConversation: boolean
  conversationPartner?: string
  lastActivity: string
  status: 'working' | 'meeting' | 'break' | 'idle'
  currentTask?: string | null
  avatarColor?: string
}

export interface OfficeZone {
  x: number
  y: number
  width: number
  height: number
  label?: string
  type?: 'desk' | 'meeting' | 'common' | 'kitchen'
}

export interface Activity {
  id: string
  agentId: string
  type: 'movement' | 'conversation' | 'work' | 'break'
  description: string
  timestamp: number
  duration?: number
  participants?: string[]
}

export interface ConversationGroup {
  id: string
  participants: string[]
  topic: string
  startTime: number
  duration: number
  position: Position
}

export interface OfficeMapProps {
  width?: number
  height?: number
  showLabels?: boolean
  showActivities?: boolean
  realTime?: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  count?: number
}

export interface AgentsResponse extends ApiResponse<Agent[]> {}
export interface ActivitiesResponse extends ApiResponse<Activity[]> {}