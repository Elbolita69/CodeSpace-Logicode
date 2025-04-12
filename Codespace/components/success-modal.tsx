"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, CheckCircle, Star, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/lib/types"

interface SuccessModalProps {
  challenge: Challenge
  xpEarned: number
  onClose: () => void
}

export default function SuccessModal({ challenge, xpEarned, onClose }: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showConfetti && <Confetti />}

      <motion.div
        className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-700/50 shadow-xl w-full max-w-md p-6 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Trophy className="h-24 w-24 text-yellow-400" />
          </motion.div>
        </div>

        <div className="text-center mt-10 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-2xl font-bold text-white mb-2">¡Desafío Completado!</h2>
            <p className="text-purple-300">Has superado el desafío "{challenge.title}"</p>
          </motion.div>
        </div>

        <motion.div
          className="bg-purple-800/30 rounded-lg p-4 mb-6 border border-purple-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-purple-200">Recompensas:</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-yellow-400 font-bold">+{xpEarned} XP</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-purple-200">Pensamiento lógico mejorado</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-purple-200">Habilidad de resolución de problemas</span>
            </div>
            {challenge.difficulty >= 3 && (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-purple-200">Insignia de {challenge.category} desbloqueada</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
            onClick={onClose}
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            top: "-10%",
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: getRandomColor(),
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
          animate={{
            top: "100%",
            rotate: Math.random() * 360,
            x: Math.random() * 100 - 50,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  )
}

function getRandomColor() {
  const colors = [
    "#9333EA", // purple-600
    "#A855F7", // purple-500
    "#C084FC", // purple-400
    "#D946EF", // pink-500
    "#F0ABFC", // pink-300
    "#FECDD3", // pink-200
    "#FEF3C7", // amber-100
    "#FCD34D", // amber-300
    "#FBBF24", // amber-400
    "#60A5FA", // blue-400
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
