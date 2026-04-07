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

// Enhanced Activity Interface with more details
export interface DetailedActivity extends Activity {
  agentName?: string
  agentRole?: string
  locationId?: string
  locationName?: string
  priority?: 'low' | 'normal' | 'high'
  category?: 'system' | 'user' | 'auto'
}

// Real-time Event types for WebSocket/polling
export interface ActivityEvent {
  type: 'activity_created' | 'activity_updated' | 'agent_moved' | 'conversation_started' | 'conversation_ended'
  timestamp: number
  data: Activity | Agent | ConversationGroup
}

// UI State interfaces
export interface UIState {
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  isOnline: boolean
  showDebugInfo: boolean
  showActivityPanel: boolean
  selectedAgent: Agent | null
}

// Component Props interfaces
export interface ActivityPanelProps {
  className?: string
  maxItems?: number
  pollingInterval?: number
  showTimestamps?: boolean
  groupByAgent?: boolean
}

export interface RealTimeAgentManagerProps {
  officeWidth: number
  officeHeight: number
  showActivities?: boolean
  showConversations?: boolean
  pollingInterval?: number
  onAgentClick?: (agent: Agent) => void
  onError?: (error: Error) => void
}

export interface OfficeLayoutProps {
  width: number
  height: number
  showLabels?: boolean
  showGrid?: boolean
  zones?: OfficeZone[]
  className?: string
}

// Animation and Motion types
export interface AnimationConfig {
  duration: number
  delay?: number
  ease?: string | number[]
  repeat?: number
  repeatType?: 'loop' | 'reverse' | 'mirror'
}

export interface MovementPath {
  from: Position
  to: Position
  duration: number
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  waypoints?: Position[]
}

// Error handling types
export interface AppError {
  code: string
  message: string
  timestamp: number
  context?: Record<string, any>
  retryable?: boolean
}

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number
  apiResponseTime: number
  animationFps: number
  memoryUsage?: number
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string
  pollingInterval: number
  animationSpeed: number
  maxActivities: number
  debugMode: boolean
  theme: 'light' | 'dark' | 'auto'
}