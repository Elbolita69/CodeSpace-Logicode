"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Challenge } from "@/lib/types"

interface ChatbotHelpProps {
  challenge: Challenge
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotHelp({ challenge }: ChatbotHelpProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `¡Hola! Soy tu asistente para el desafío "${challenge.title}". ¿En qué puedo ayudarte?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(input, challenge)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
            >
              <Avatar className={`h-8 w-8 ${message.sender === "user" ? "bg-purple-700" : "bg-pink-700"}`}>
                <AvatarFallback>
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-purple-700 text-white"
                    : "bg-purple-900/50 border border-purple-800/50 text-purple-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row items-start gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-pink-700">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-purple-900/50 border border-purple-800/50 text-purple-100">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-purple-800/30 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe tu pregunta aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-400"
          />
          <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <SuggestionButton
            text="¿Cómo empiezo?"
            onClick={() => {
              setInput("¿Cómo empiezo este desafío?")
              setTimeout(handleSendMessage, 100)
            }}
          />
          <SuggestionButton
            text="Pista adicional"
            onClick={() => {
              setInput("¿Puedes darme una pista adicional?")
              setTimeout(handleSendMessage, 100)
            }}
          />
          <SuggestionButton
            text="Conceptos clave"
            onClick={() => {
              setInput("¿Cuáles son los conceptos clave para resolver este problema?")
              setTimeout(handleSendMessage, 100)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-purple-700 text-purple-300 hover:bg-purple-800/50 text-xs"
      onClick={onClick}
    >
      <Lightbulb className="h-3 w-3 mr-1" />
      {text}
    </Button>
  )
}

// Helper function to generate bot responses based on user input and challenge
function generateBotResponse(input: string, challenge: Challenge): string {
  const inputLower = input.toLowerCase()

  // Check for common questions and provide appropriate responses
  if (inputLower.includes("cómo empiezo") || inputLower.includes("por dónde empezar")) {
    return `Para empezar con el desafío "${challenge.title}", te recomiendo que primero leas detenidamente la descripción y los objetivos. Luego, analiza el código inicial proporcionado y piensa en cómo puedes implementar la solución paso a paso. Recuerda que puedes usar la simulación visual para entender mejor el problema.`
  }

  if (inputLower.includes("pista") || inputLower.includes("ayuda")) {
    return (
      challenge.hints ||
      `Una buena estrategia para este desafío es dividir el problema en partes más pequeñas. Primero, identifica las entradas y salidas esperadas. Luego, piensa en los pasos intermedios necesarios para transformar las entradas en las salidas deseadas. No olvides considerar casos especiales o límites.`
    )
  }

  if (inputLower.includes("conceptos") || inputLower.includes("teoría")) {
    if (challenge.category === "Algoritmos") {
      return `Los conceptos clave para este desafío incluyen: algoritmos de ordenamiento, complejidad temporal y espacial, y técnicas de iteración. Recuerda que un buen algoritmo no solo debe funcionar correctamente, sino también ser eficiente en términos de tiempo y memoria.`
    } else if (challenge.category === "Estructuras de Datos") {
      return `Para este desafío, es importante entender las estructuras de datos como arrays, listas enlazadas, pilas, colas o árboles. Cada estructura tiene sus propias ventajas y desventajas en términos de operaciones como inserción, eliminación y búsqueda. Elige la estructura más adecuada para el problema.`
    } else {
      return `Los conceptos fundamentales para este desafío incluyen variables, condicionales, bucles y funciones. Asegúrate de entender cómo manipular datos y controlar el flujo de ejecución de tu programa.`
    }
  }

  if (inputLower.includes("error") || inputLower.includes("no funciona")) {
    return `Si estás experimentando errores, te sugiero revisar lo siguiente:\n\n1. Verifica la sintaxis de tu código\n2. Asegúrate de que las variables estén correctamente inicializadas\n3. Comprueba las condiciones de tus bucles y condicionales\n4. Usa console.log() para depurar y ver el valor de las variables en diferentes puntos de tu código\n\nSi me proporcionas el error específico, podré ayudarte mejor.`
  }

  // Default response
  return `Gracias por tu pregunta. Para el desafío "${challenge.title}", te recomiendo enfocarte en entender el problema antes de empezar a codificar. Si tienes alguna duda específica sobre algún concepto o parte del código, no dudes en preguntar.`
}
