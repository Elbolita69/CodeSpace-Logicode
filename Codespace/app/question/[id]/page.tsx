"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import type { Question, Answer, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import CodeBlock from "@/components/code-block"
import LoginModal from "@/components/login-modal"
import AnswerCard from "@/components/answer-card"

export default function QuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Check if user is logged in
      const loggedInUser = localStorage.getItem("currentUser")
      if (loggedInUser) {
        setCurrentUser(JSON.parse(loggedInUser))
      }

      // Load question from localStorage
      const storedQuestions = localStorage.getItem("questions")
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions)
        const foundQuestion = parsedQuestions.find((q: Question) => q.id === params.id)

        if (foundQuestion) {
          setQuestion(foundQuestion)
        } else {
          router.push("/")
        }
      }

      // Load answers from localStorage
      const storedAnswers = localStorage.getItem("answers")
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers)
        const questionAnswers = parsedAnswers.filter((a: Answer) => a.questionId === params.id)
        setAnswers(questionAnswers)
      }
    } catch (error) {
      console.error("Error loading question data:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router])

  const handleVote = (answerId: string) => {
    if (!currentUser) {
      setShowLoginModal(true)
      return
    }

    try {
      const storedAnswers = localStorage.getItem("answers")
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers)
        const updatedAnswers = parsedAnswers.map((a: Answer) => {
          if (a.id === answerId) {
            return { ...a, votes: a.votes + 1 }
          }
          return a
        })

        localStorage.setItem("answers", JSON.stringify(updatedAnswers))

        // Update state
        const questionAnswers = updatedAnswers.filter((a: Answer) => a.questionId === params.id)
        setAnswers(questionAnswers)
      }
    } catch (error) {
      console.error("Error voting for answer:", error)
    }
  }

  const handleSubmitAnswer = () => {
    if (!currentUser) {
      setShowLoginModal(true)
      return
    }

    if (!newAnswer.trim()) return

    try {
      const answer: Answer = {
        id: Date.now().toString(),
        questionId: params.id,
        content: newAnswer,
        code: "",
        author: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        createdAt: new Date().toISOString(),
        votes: 0,
      }

      // Save to localStorage
      const storedAnswers = localStorage.getItem("answers")
      let updatedAnswers = []

      if (storedAnswers) {
        updatedAnswers = [...JSON.parse(storedAnswers), answer]
      } else {
        updatedAnswers = [answer]
      }

      localStorage.setItem("answers", JSON.stringify(updatedAnswers))

      // Update state
      setAnswers([...answers, answer])
      setNewAnswer("")
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando pregunta...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Pregunta no encontrada.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto py-8 px-4">
        <Button
          variant="secondary"
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la página principal
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-blue-600">{question.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>
                  {question.author.name} • {formatDate(question.createdAt)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <CodeBlock code={question.code} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Respuestas ({answers.length})
          </h2>

          {answers.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-gray-500">No hay respuestas todavía. ¡Sé el primero en responder!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {answers
                .sort((a, b) => b.votes - a.votes)
                .map((answer) => (
                  <AnswerCard key={answer.id} answer={answer} onVote={handleVote} />
                ))}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tu Respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[150px] mb-4"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitAnswer}>
              Publicar Respuesta
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 LogiCode - Portal para Programadores</p>
        </div>
      </footer>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false)
            // We would show register modal here
          }}
          onSuccess={(user) => {
            setCurrentUser(user)
            setShowLoginModal(false)
          }}
        />
      )}
    </div>
  )
}
