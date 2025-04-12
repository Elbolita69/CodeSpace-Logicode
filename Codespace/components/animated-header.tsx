"use client"

import { motion } from "framer-motion"
import { Code2 } from "lucide-react"

export default function AnimatedHeader() {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Code2 className="h-16 w-16 text-blue-600" />
        </motion.div>
      </div>
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Bienvenido a LogiCode
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        El portal para programadores donde puedes encontrar respuestas a tus dudas y compartir tu conocimiento.
      </motion.p>
    </motion.div>
  )
}
