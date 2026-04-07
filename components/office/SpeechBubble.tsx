'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SpeechBubbleProps {
  message: string
  agentX: number
  agentY: number
  duration?: number
  className?: string
}

export default function SpeechBubble({ 
  message, 
  agentX, 
  agentY, 
  duration = 5000,
  className = '' 
}: SpeechBubbleProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, message])
  
  // Reset visibility when message changes
  useEffect(() => {
    setIsVisible(true)
  }, [message])
  
  // Calculate position to avoid going off-screen
  const bubbleX = Math.min(Math.max(agentX - 60, 10), window?.innerWidth - 130 || 1070)
  const bubbleY = Math.max(agentY - 70, 10)
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && message && (
        <motion.div
          className={`absolute z-40 pointer-events-none ${className}`}
          style={{
            left: `${bubbleX}px`,
            top: `${bubbleY}px`,
          }}
          initial={{ 
            scale: 0, 
            opacity: 0, 
            y: 20,
            rotateZ: -5 
          }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            rotateZ: 0
          }}
          exit={{ 
            scale: 0.8, 
            opacity: 0, 
            y: -10,
            transition: { duration: 0.2 }
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4
          }}
        >
          {/* Speech Bubble Container */}
          <div className="relative max-w-[200px]">
            {/* Bubble Background */}
            <div className="relative">
              {/* Main Bubble */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl px-3 py-2 shadow-lg backdrop-blur-sm relative">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-60" />
                
                {/* Content */}
                <div className="relative z-10">
                  <p className="text-xs text-gray-800 font-medium leading-relaxed">
                    {message}
                  </p>
                </div>
                
                {/* Tail using SVG */}
                <svg
                  className="absolute top-full left-8 transform -translate-x-1/2"
                  width="16"
                  height="8"
                  viewBox="0 0 16 8"
                  fill="none"
                >
                  <path
                    d="M8 8L12 0H4L8 8Z"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-blue-200 rounded-2xl blur-sm opacity-20 -z-10" />
            </div>
            
            {/* Animated dots for thinking/typing effect */}
            <motion.div
              className="absolute -bottom-1 -right-1 flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Floating animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -2, 0],
              rotateZ: [0, 1, 0, -1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Alternative compact speech bubble for mobile or dense layouts
export function CompactSpeechBubble({ 
  message, 
  agentX, 
  agentY, 
  className = '' 
}: Omit<SpeechBubbleProps, 'duration'>) {
  return (
    <motion.div
      className={`absolute z-40 pointer-events-none ${className}`}
      style={{
        left: `${agentX - 30}px`,
        top: `${agentY - 35}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-lg shadow-md max-w-[100px] truncate">
        {message}
      </div>
      {/* Simple tail */}
      <div 
        className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
        style={{ transform: 'translateX(-50%)' }}
      />
    </motion.div>
  )
}