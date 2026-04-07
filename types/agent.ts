/**
 * Agent type definitions for the Office Map application
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
  team: 'engineering' | 'business' | 'operations'
  position: Position
  targetPosition?: Position
  isMoving: boolean
  isInConversation: boolean
  conversationPartner?: string
  lastActivity: string
  status: 'working' | 'meeting' | 'break' | 'idle'
  currentTask?: string | null
  avatarColor: string
  emoji: string
}

export interface MovementPath {
  start: Position
  end: Position
  duration: number
  easing?: string
}

export interface AgentActivity {
  id: string
  agentId: string
  type: 'movement' | 'conversation' | 'work' | 'break'
  description: string
  timestamp: number
  duration?: number
  participants?: string[]
}