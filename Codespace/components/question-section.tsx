"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import QuestionCard from "@/components/question-card"
import type { Question } from "@/lib/types"

export default function QuestionSection() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load questions from localStorage
    try {
      const storedQuestions = localStorage.getItem("questions")
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions)
        // Only show approved questions
        const approvedQuestions = parsedQuestions.filter((q: Question) => q.status === "approved")
        setQuestions(approvedQuestions)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando preguntas...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay preguntas disponibles. ¡Sé el primero en añadir una!</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </motion.div>
  )
}
