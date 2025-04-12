"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CodeBlock from "@/components/code-block"
import type { Answer } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface AnswerCardProps {
  answer: Answer
  onVote: (answerId: string) => void
}

export default function AnswerCard({ answer, onVote }: AnswerCardProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [votes, setVotes] = useState(answer.votes)

  const handleVote = () => {
    if (!hasVoted) {
      onVote(answer.id)
      setHasVoted(true)
      setVotes(votes + 1)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{answer.author.name}</span>
            </div>
            <span className="text-sm text-gray-500">{formatDate(answer.createdAt)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{answer.content}</p>
          {answer.code && <CodeBlock code={answer.code} />}
        </CardContent>
        <CardFooter>
          <Button
            variant={hasVoted ? "secondary" : "outline"}
            size="sm"
            className={`flex items-center gap-1 ${hasVoted ? "bg-blue-100 text-blue-700" : ""}`}
            onClick={handleVote}
          >
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-blue-700" : ""}`} />
            <AnimatePresence mode="wait">
              <motion.span
                key={votes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {votes}
              </motion.span>
            </AnimatePresence>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
