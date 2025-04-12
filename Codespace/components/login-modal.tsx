"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/types"

interface LoginModalProps {
  onClose: () => void
  onRegisterClick: () => void
  onSuccess: () => void
  initialEmail?: string
}

export default function LoginModal({ onClose, onRegisterClick, onSuccess, initialEmail = "" }: LoginModalProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate inputs
    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // Check if user exists in localStorage
        const storedUsers = localStorage.getItem("users")
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const user = users.find((u: User) => u.email === email)

          if (user && user.password === password) {
            // Set current user in localStorage
            localStorage.setItem("currentUser", JSON.stringify(user))
            onSuccess()
          } else {
            setError("Email o contraseña incorrectos.")
          }
        } else {
          setError("No hay usuarios registrados.")
        }
      } catch (error) {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl border border-purple-700/50 shadow-xl w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-purple-400 hover:text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Iniciar Sesión</h2>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-purple-900/50 border-purple-700 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-purple-300">
            ¿No tienes una cuenta?{" "}
            <button className="text-purple-400 hover:text-white hover:underline" onClick={onRegisterClick}>
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
