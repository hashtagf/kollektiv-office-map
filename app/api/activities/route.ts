import { NextRequest, NextResponse } from 'next/server'
import type { Activity } from '@/lib/types'

// Team data for activity generation
const AGENTS = [
  'Sam Rivera', 'Maya Chen', 'Kai Tanaka', 'Alex Park', 'Sarah Kim', 'Priya Sharma',
  'Riku Honda', 'Jordan Wu', 'Luna Park', 'Sora Tanaka', 'Daniel Oh', 'Ava Chen',
  'Nara Kim', 'Jamie Lee', 'Mei Tanaka', 'Leo Park'
]

const ACTIVITY_TEMPLATES = {
  movement: [
    'moved to the coffee machine',
    'walked to meeting room',
    'returned to desk',
    'headed to the break area',
    'went to the printer',
    'moved to collaboration zone',
    'walked to the kitchen',
    'stepped out for fresh air'
  ],
  conversation: [
    'started a discussion about project timeline',
    'joined a brainstorming session',
    'had a quick sync with team',
    'reviewed code together',
    'discussed design mockups',
    'shared project updates',
    'planned next sprint',
    'resolved a technical blocker'
  ],
  work: [
    'began coding a new feature',
    'started reviewing pull requests',
    'opened documentation editor',
    'launched testing suite',
    'started database migration',
    'began writing blog post',
    'started design mockups',
    'opened analytics dashboard'
  ],
  break: [
    'took a coffee break',
    'stepped away for lunch',
    'took a short walk',
    'grabbed some water',
    'had a quick snack',
    'took a mental break',
    'stretched and relaxed',
    'checked personal messages'
  ]
}

let activityCounter = 0

function generateRecentActivities(): Activity[] {
  const activities: Activity[] = []
  const now = Date.now()
  const maxActivities = 20
  
  // Generate activities for the last 10 minutes
  for (let i = 0; i < maxActivities; i++) {
    const activityType = ['movement', 'conversation', 'work', 'break'][Math.floor(Math.random() * 4)] as keyof typeof ACTIVITY_TEMPLATES
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)]
    const templates = ACTIVITY_TEMPLATES[activityType]
    const description = templates[Math.floor(Math.random() * templates.length)]
    
    // Activities spread over the last 10 minutes
    const timestamp = now - (Math.random() * 10 * 60 * 1000)
    
    activities.push({
      id: `activity_${++activityCounter}_${timestamp}`,
      agentId: agent.toLowerCase().replace(' ', '-'),
      type: activityType,
      description: `${agent} ${description}`,
      timestamp,
      duration: activityType === 'conversation' ? Math.floor(Math.random() * 300) + 60 : undefined,
      participants: activityType === 'conversation' ? [
        agent,
        AGENTS[Math.floor(Math.random() * AGENTS.length)]
      ] : undefined
    })
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp - a.timestamp)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const since = searchParams.get('since') // timestamp
    
    let activities = generateRecentActivities()
    
    // Filter by timestamp if 'since' parameter is provided
    if (since) {
      const sinceTimestamp = parseInt(since)
      activities = activities.filter(activity => activity.timestamp > sinceTimestamp)
    }
    
    // Apply limit
    activities = activities.slice(0, limit)
    
    return NextResponse.json({
      success: true,
      data: activities,
      timestamp: new Date().toISOString(),
      count: activities.length
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  return new Response(null, { status: 200 })
}