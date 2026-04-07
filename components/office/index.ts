// Office components exports
export { default as OfficeMap } from './OfficeMap'
export { default as AgentAvatar } from './AgentAvatar'
export { default as SpeechBubble, CompactSpeechBubble } from './SpeechBubble'

// Type definitions
export interface Agent {
  id: string
  name: string
  role: string
  title: string
  department: 'engineering' | 'business' | 'operations'
  x: number
  y: number
  status: 'working' | 'meeting' | 'break' | 'available'
  currentActivity?: string
}

export interface OfficeMapProps {
  agents: Agent[]
  onAgentClick?: (agent: Agent) => void
  selectedAgent?: Agent | null
  className?: string
}

export interface AgentAvatarProps {
  agent: Agent
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export interface SpeechBubbleProps {
  message: string
  agentX: number
  agentY: number
  duration?: number
  className?: string
}