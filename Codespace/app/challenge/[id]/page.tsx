"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Code, HelpCircle, Info, Play, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { User, Challenge } from "@/lib/types"
import { getChallengeById } from "@/lib/data-service"
import CodeEditor from "@/components/code-editor"
import VisualSimulation from "@/components/visual-simulation"
import ChatbotHelp from "@/components/chatbot-help"
import SuccessModal from "@/components/success-modal"

export default function ChallengePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      // Load challenge
      const challengeData = getChallengeById(params.id)
      if (!challengeData) {
        router.push("/dashboard")
        return
      }

      setChallenge(challengeData)
      setCode(challengeData.starterCode || "// Escribe tu código aquí\n\n")

      // Mark challenge as in progress if not already completed
      if (userData.completedChallenges?.includes(params.id)) {
        // Challenge already completed
      } else if (!userData.inProgressChallenges?.includes(params.id)) {
        const updatedUser = {
          ...userData,
          inProgressChallenges: [...(userData.inProgressChallenges || []), params.id],
        }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Error loading challenge data:", error)
      setError("Error al cargar el desafío. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  const runCode = () => {
    setIsRunning(true)
    setOutput("")

    // Simulate code execution
    setTimeout(() => {
      try {
        // This is a simplified simulation of code execution
        // In a real app, you would have a proper code execution engine
        let result = ""

        // Check if code contains expected solution patterns
        const containsExpectedSolution = challenge?.expectedSolution.some((pattern) => code.includes(pattern))

        if (containsExpectedSolution) {
          result = challenge?.expectedOutput || "Ejecución exitosa"

          // If this is the first time completing the challenge
          if (user && !user.completedChallenges?.includes(challenge?.id || "")) {
            const updatedUser = {
              ...user,
              completedChallenges: [...(user.completedChallenges || []), challenge?.id || ""],
              xp: user.xp + (challenge?.xpReward || 0),
              streak: user.streak + 1,
            }

            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            setUser(updatedUser)
            setShowSuccess(true)
          }
        } else {
          // Simulate error output
          result =
            "Error: La solución no cumple con los requisitos esperados.\n" +
            "Revisa la lógica de tu algoritmo y asegúrate de que resuelve el problema planteado."
        }

        setOutput(result)
      } catch (err) {
        setOutput(`Error de ejecución: ${err}`)
      } finally {
        setIsRunning(false)

        // Scroll to output
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }
    }, 1500)
  }

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.starterCode || "// Escribe tu código aquí\n\n")
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Optionally navigate back to dashboard
    // router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando desafío...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white flex items-center justify-center">
        <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-200 mb-4">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!challenge) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white">
      <header className="bg-black/30 backdrop-blur-md p-4 border-b border-purple-800/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-300 hover:text-white hover:bg-purple-800/40"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{challenge.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-700">{challenge.category}</Badge>
          <Badge className="bg-purple-800">Nivel {challenge.difficulty}</Badge>
          <Badge className="bg-pink-700">{challenge.xpReward} XP</Badge>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge description */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">Descripción del Desafío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-200">{challenge.description}</p>

                  {challenge.objectives && (
                    <div>
                      <h3 className="font-medium mb-2">Objetivos:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-purple-300">
                        {challenge.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {showHint && challenge.hints && (
                    <Alert className="bg-purple-800/50 border-purple-600">
                      <Info className="h-4 w-4 text-purple-300" />
                      <AlertTitle>Pista</AlertTitle>
                      <AlertDescription className="text-purple-300">{challenge.hints}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-300 hover:bg-purple-800/50"
                      onClick={() => setShowHint(!showHint)}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      {showHint ? "Ocultar Pista" : "Mostrar Pista"}
                    </Button>

                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-300 hover:bg-purple-800/50"
                      onClick={() => setActiveTab("simulation")}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Ver Simulación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Code editor and output */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="bg-purple-900/30 border border-purple-800/50">
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Código
                  </TabsTrigger>
                  <TabsTrigger
                    value="simulation"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Simulación
                  </TabsTrigger>
                  <TabsTrigger
                    value="help"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ayuda
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="mt-4">
                  <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-purple-200">Editor de Código</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-300 hover:bg-purple-800/50"
                            onClick={resetCode}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reiniciar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={runCode}
                            disabled={isRunning}
                          >
                            {isRunning ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                Ejecutando...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Ejecutar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeEditor value={code} onChange={setCode} language={challenge.language || "javascript"} />

                      {output && (
                        <div ref={outputRef}>
                          <Separator className="my-4 bg-purple-800/50" />
                          <h3 className="font-medium mb-2 flex items-center">
                            <Terminal className="mr-2 h-4 w-4" />
                            Resultado:
                          </h3>
                          <div className="bg-black/50 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                            {output}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="simulation" className="mt-4">
                  <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-200">Simulación Visual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <VisualSimulation challenge={challenge} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="help" className="mt-4">
                  <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-200">Asistente de Ayuda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChatbotHelp challenge={challenge} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      {showSuccess && (
        <SuccessModal challenge={challenge} xpEarned={challenge.xpReward || 0} onClose={handleSuccessClose} />
      )}
    </div>
  )
}
