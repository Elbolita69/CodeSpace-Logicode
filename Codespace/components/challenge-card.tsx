"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, Code, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Challenge } from "@/lib/types"

interface ChallengeCardProps {
  challenge: Challenge
  onClick: () => void
  completed?: boolean
}

export default function ChallengeCard({ challenge, onClick, completed = false }: ChallengeCardProps) {
  // Generate stars based on difficulty
  const stars = Array(5)
    .fill(0)
    .map((_, i) => i < challenge.difficulty)

  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card
        className={`bg-purple-900/30 border-purple-800/50 backdrop-blur-sm cursor-pointer h-full flex flex-col ${
          completed ? "border-green-500/50" : ""
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-purple-200">{challenge.title}</CardTitle>
            {completed && (
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completado
              </Badge>
            )}
          </div>
          <div className="flex items-center mt-1">
            {stars.map((filled, i) => (
              <Star key={i} className={`h-4 w-4 ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-purple-300 text-sm mb-3">{challenge.description.substring(0, 100)}...</p>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-700">
              <Code className="mr-1 h-3 w-3" />
              {challenge.language}
            </Badge>
            <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-700">
              <Clock className="mr-1 h-3 w-3" />
              {challenge.estimatedTime} min
            </Badge>
          </div>

          {challenge.progress && !completed && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-purple-400 mb-1">
                <span>Progreso</span>
                <span>{challenge.progress}%</span>
              </div>
              <Progress
                value={challenge.progress}
                className="h-1.5 bg-purple-950"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t border-purple-800/30">
          <div className="flex justify-between items-center w-full">
            <Badge className="bg-purple-700">{challenge.category}</Badge>
            <span className="text-pink-400 font-medium">{challenge.xpReward} XP</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
