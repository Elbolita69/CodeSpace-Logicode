"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Award,
  BookOpen,
  Code,
  Cpu,
  FileCode2,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, Challenge } from "@/lib/types"
import { getChallenges } from "@/lib/data-service"
import ChallengeCard from "@/components/challenge-card"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

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

      // Load challenges
      const allChallenges = getChallenges()
      setChallenges(allChallenges)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleChallengeClick = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Calculate user stats
  const completedChallenges = user.completedChallenges?.length || 0
  const totalChallenges = challenges.length
  const completionPercentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0

  // Get user level based on XP
  const level = Math.floor(user.xp / 100) + 1
  const xpForNextLevel = level * 100
  const xpProgress = user.xp % 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-black/30 backdrop-blur-md border-r border-purple-800/30">
          <div className="p-4 flex items-center gap-2 border-b border-purple-800/30">
            <Code className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              LogiCode
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-purple-200 bg-purple-800/40">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={() => router.push("/challenges")}
            >
              <FileCode2 className="mr-2 h-5 w-5" />
              Desafíos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={() => router.push("/learning-path")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Ruta de Aprendizaje
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={() => router.push("/leaderboard")}
            >
              <Trophy className="mr-2 h-5 w-5" />
              Ranking
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={() => router.push("/achievements")}
            >
              <Award className="mr-2 h-5 w-5" />
              Logros
            </Button>
          </nav>

          <div className="p-4 border-t border-purple-800/30">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-purple-700">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-purple-400">Nivel {level}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Configuración
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-800/40"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <header className="bg-black/30 backdrop-blur-md p-4 border-b border-purple-800/30 flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-700">
                <Flame className="mr-1 h-4 w-4 text-orange-400" />
                Racha: {user.streak} días
              </Badge>
              <Avatar className="h-8 w-8 md:hidden">
                <AvatarFallback className="bg-purple-700">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-200">Nivel Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between mb-2">
                      <div className="text-3xl font-bold">{level}</div>
                      <div className="text-sm text-purple-400">
                        {user.xp} XP / {xpForNextLevel} XP
                      </div>
                    </div>
                    <Progress
                      value={xpProgress}
                      className="h-2 bg-purple-950"
                      indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-200">Progreso General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between mb-2">
                      <div className="text-3xl font-bold">
                        {completedChallenges}/{totalChallenges}
                      </div>
                      <div className="text-sm text-purple-400">Desafíos completados</div>
                    </div>
                    <Progress
                      value={completionPercentage}
                      className="h-2 bg-purple-950"
                      indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-200">Logros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between mb-2">
                      <div className="text-3xl font-bold">{user.achievements?.length || 0}</div>
                      <div className="text-sm text-purple-400">Insignias desbloqueadas</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {user.achievements?.slice(0, 3).map((achievement, index) => (
                        <Badge key={index} className="bg-purple-700 hover:bg-purple-600">
                          {achievement}
                        </Badge>
                      ))}
                      {(user.achievements?.length || 0) > 3 && (
                        <Badge className="bg-purple-800 hover:bg-purple-700">
                          +{(user.achievements?.length || 0) - 3} más
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Tabs defaultValue="recommended" className="mb-8">
                <TabsList className="bg-purple-900/30 border border-purple-800/50">
                  <TabsTrigger
                    value="recommended"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    Recomendados
                  </TabsTrigger>
                  <TabsTrigger
                    value="inProgress"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    En Progreso
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    Completados
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recommended" className="mt-4">
                  <h2 className="text-xl font-bold mb-4">Desafíos Recomendados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges
                      .filter((challenge) => !user.completedChallenges?.includes(challenge.id))
                      .slice(0, 6)
                      .map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          onClick={() => handleChallengeClick(challenge.id)}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="inProgress" className="mt-4">
                  <h2 className="text-xl font-bold mb-4">Desafíos En Progreso</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges
                      .filter((challenge) => user.inProgressChallenges?.includes(challenge.id))
                      .map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          onClick={() => handleChallengeClick(challenge.id)}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <h2 className="text-xl font-bold mb-4">Desafíos Completados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges
                      .filter((challenge) => user.completedChallenges?.includes(challenge.id))
                      .map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          onClick={() => handleChallengeClick(challenge.id)}
                          completed
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2">
                <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-200">Ruta de Aprendizaje</CardTitle>
                    <CardDescription className="text-purple-400">
                      Tu progreso en el camino del aprendizaje
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-700 rounded-full p-2">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Fundamentos de Programación</span>
                            <span className="text-sm text-purple-400">100%</span>
                          </div>
                          <Progress
                            value={100}
                            className="h-2 bg-purple-950"
                            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-purple-700 rounded-full p-2">
                          <Code className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Estructuras de Control</span>
                            <span className="text-sm text-purple-400">75%</span>
                          </div>
                          <Progress
                            value={75}
                            className="h-2 bg-purple-950"
                            indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-purple-700 rounded-full p-2">
                          <FileCode2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Algoritmos Avanzados</span>
                            <span className="text-sm text-purple-400">30%</span>
                          </div>
                          <Progress
                            value={30}
                            className="h-2 bg-purple-950"
                            indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-purple-700 rounded-full p-2">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Proyectos Prácticos</span>
                            <span className="text-sm text-purple-400">10%</span>
                          </div>
                          <Progress
                            value={10}
                            className="h-2 bg-purple-950"
                            indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-purple-900/30 border-purple-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-200">Top Estudiantes</CardTitle>
                    <CardDescription className="text-purple-400">Ranking de la semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          1
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-700">M</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">María López</p>
                          <p className="text-sm text-purple-400">Nivel 8 • 2,450 XP</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gray-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          2
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-700">J</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">Juan Pérez</p>
                          <p className="text-sm text-purple-400">Nivel 7 • 2,120 XP</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-amber-700 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          3
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-700">A</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">Ana García</p>
                          <p className="text-sm text-purple-400">Nivel 7 • 1,980 XP</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-purple-700 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {user.rank || 4}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-700">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-purple-400">
                            Nivel {level} • {user.xp} XP
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
