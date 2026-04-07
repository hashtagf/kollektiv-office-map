'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  className?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div 
      className={`flex items-center justify-center p-8 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ⚠️
        </motion.div>
        
        <motion.h3
          className="text-xl font-semibold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Something went wrong
        </motion.h3>
        
        <motion.p
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {error}
        </motion.p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default ErrorState