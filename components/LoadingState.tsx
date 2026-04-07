'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingStateProps {
  message?: string
  className?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading office map...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <motion.div
          className="inline-flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="text-lg font-semibold text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.span>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingState