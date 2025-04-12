"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Code, Lightbulb, Trophy, Zap } from "lucide-react"
import Image from "next/image"
import LoginModal from "@/components/login-modal"
import RegisterModal from "@/components/register-modal"
import { initializeData } from "@/lib/data-initializer"

export default function LandingPage() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Initialize demo data
    initializeData()

    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const handleGetStarted = () => {
    if (email) {
      setShowRegisterModal(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLoginSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            LogiCode
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-purple-200 hover:text-white hover:bg-purple-800"
            onClick={() => setShowLoginModal(true)}
          >
            Iniciar Sesión
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowRegisterModal(true)}>
            Registrarse
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Potencia tu pensamiento <span className="text-purple-400">lógico-algorítmico</span>
          </motion.h2>
          <motion.p
            className="text-lg text-purple-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Plataforma interactiva diseñada para estudiantes de mantenimiento de sistemas informáticos. Aprende
            programación mediante simulaciones visuales, desafíos gamificados y retroalimentación en tiempo real.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
              onClick={handleGetStarted}
            >
              Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-purple-700/50 shadow-2xl shadow-purple-900/30">
            <Image
              src="/placeholder.svg?height=720&width=1280"
              alt="LogiCode Platform Preview"
              width={1280}
              height={720}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div className="flex gap-3">
                <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">Simulaciones</div>
                <div className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full">Desafíos</div>
                <div className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">Gamificación</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Diseñado específicamente para mejorar tus habilidades de programación con un enfoque práctico y divertido.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lightbulb className="h-10 w-10 text-purple-400" />}
            title="Simulaciones Visuales"
            description="Visualiza conceptos complejos de programación con simulaciones interactivas que te ayudan a entender el funcionamiento interno de los algoritmos."
          />
          <FeatureCard
            icon={<Trophy className="h-10 w-10 text-purple-400" />}
            title="Sistema de Gamificación"
            description="Gana insignias, sube de nivel y compite en rankings mientras aprendes. La gamificación hace que el aprendizaje sea más motivador y divertido."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-purple-400" />}
            title="Retroalimentación Inteligente"
            description="Recibe feedback instantáneo sobre tu código con explicaciones paso a paso que te ayudan a identificar y corregir errores."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-purple-400">
          <p>© 2025 LogiCode. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false)
            setShowRegisterModal(true)
          }}
          onSuccess={handleLoginSuccess}
          initialEmail={email}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onLoginClick={() => {
            setShowRegisterModal(false)
            setShowLoginModal(true)
          }}
          onSuccess={handleLoginSuccess}
          initialEmail={email}
        />
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="bg-purple-900/30 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6 hover:bg-purple-800/30 transition-colors"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-purple-300">{description}</p>
    </motion.div>
  )
}
