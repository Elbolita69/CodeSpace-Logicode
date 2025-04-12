"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import type { Question } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/question/${question.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col" onClick={handleClick}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-600">{question.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="bg-gray-100 rounded-md p-4 mb-4 overflow-hidden max-h-40">
            <pre className="text-sm overflow-hidden">
              <code>{question.code.length > 200 ? `${question.code.substring(0, 200)}...` : question.code}</code>
            </pre>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>
              {question.author.name} • {formatDate(question.createdAt)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
