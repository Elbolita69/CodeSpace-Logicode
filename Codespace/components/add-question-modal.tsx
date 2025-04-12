"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Question, User } from "@/lib/types"

interface AddQuestionModalProps {
  onClose: () => void
  currentUser: User
  onSuccess: () => void
}

export default function AddQuestionModal({ onClose, currentUser, onSuccess }: AddQuestionModalProps) {
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("")
  const [tags, setTags] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!title || !code) {
      setError("Por favor, completa los campos obligatorios.")
      return
    }

    // Create new question
    const newQuestion: Question = {
      id: Date.now().toString(),
      title,
      code,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
      createdAt: new Date().toISOString(),
      status: currentUser.role === "admin" ? "approved" : "pending", // Auto-approve if admin
    }

    // Add to questions array in localStorage
    const storedQuestions = localStorage.getItem("questions")
    let questions = []

    if (storedQuestions) {
      questions = JSON.parse(storedQuestions)
    }

    questions.push(newQuestion)
    localStorage.setItem("questions", JSON.stringify(questions))

    // Notify parent component
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Añadir Nueva Pregunta</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la pregunta *</Label>
              <Input
                id="title"
                placeholder="Ej: ¿Cómo crear un arreglo en JavaScript?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Textarea
                id="code"
                placeholder="Escribe aquí tu código..."
                className="font-mono min-h-[200px]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Escribe el código que quieres compartir o sobre el que tienes dudas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
              <Input
                id="tags"
                placeholder="Ej: JavaScript, Arrays, Principiante"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {currentUser.role === "admin" ? "Publicar" : "Enviar para revisión"}
              </Button>
            </div>
          </div>
        </form>

        {currentUser.role !== "admin" && (
          <div className="mt-4 text-sm text-gray-500">
            * Tu pregunta será revisada por un administrador antes de ser publicada.
          </div>
        )}
      </div>
    </div>
  )
}
