"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle,
  Code2,
  FileQuestion,
  LayoutDashboard,
  LogOut,
  Settings,
  Trash2,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Question, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import CodeBlock from "@/components/code-block"

export default function AdminPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    users: 0,
  })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is admin
    try {
      const loggedInUser = localStorage.getItem("currentUser")
      if (loggedInUser) {
        const user = JSON.parse(loggedInUser)
        if (user.role !== "admin") {
          router.push("/")
          return
        }
        setCurrentUser(user)
      } else {
        router.push("/")
        return
      }

      // Load questions from localStorage
      loadData()
    } catch (error) {
      console.error("Error in admin page initialization:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const loadData = () => {
    try {
      // Load questions from localStorage
      const storedQuestions = localStorage.getItem("questions")
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions)
        setQuestions(parsedQuestions)

        // Calculate stats
        const pending = parsedQuestions.filter((q: Question) => q.status === "pending").length
        const approved = parsedQuestions.filter((q: Question) => q.status === "approved").length
        const rejected = parsedQuestions.filter((q: Question) => q.status === "rejected").length

        // Load users from localStorage
        const storedUsers = localStorage.getItem("users")
        let userCount = 0
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          setUsers(parsedUsers)
          userCount = parsedUsers.length
        }

        setStats({
          pending,
          approved,
          rejected,
          users: userCount,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleApproveQuestion = (questionId: string) => {
    try {
      const updatedQuestions = questions.map((q) => (q.id === questionId ? { ...q, status: "approved" } : q))

      localStorage.setItem("questions", JSON.stringify(updatedQuestions))
      setQuestions(updatedQuestions)

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }))
    } catch (error) {
      console.error("Error approving question:", error)
    }
  }

  const handleRejectQuestion = (questionId: string) => {
    try {
      const updatedQuestions = questions.map((q) => (q.id === questionId ? { ...q, status: "rejected" } : q))

      localStorage.setItem("questions", JSON.stringify(updatedQuestions))
      setQuestions(updatedQuestions)

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }))
    } catch (error) {
      console.error("Error rejecting question:", error)
    }
  }

  const handleDeleteQuestion = (questionId: string) => {
    try {
      const questionToDelete = questions.find((q) => q.id === questionId)
      if (!questionToDelete) return

      const updatedQuestions = questions.filter((q) => q.id !== questionId)

      localStorage.setItem("questions", JSON.stringify(updatedQuestions))
      setQuestions(updatedQuestions)

      // Update stats
      setStats((prev) => {
        if (questionToDelete.status === "pending") {
          return { ...prev, pending: prev.pending - 1 }
        } else if (questionToDelete.status === "approved") {
          return { ...prev, approved: prev.approved - 1 }
        } else {
          return { ...prev, rejected: prev.rejected - 1 }
        }
      })
    } catch (error) {
      console.error("Error deleting question:", error)
    }
  }

  const handleDeleteUser = (userId: string) => {
    try {
      // Don't allow deleting the current user
      if (currentUser?.id === userId) return

      const updatedUsers = users.filter((u) => u.id !== userId)

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      setUsers(updatedUsers)

      // Update stats
      setStats((prev) => ({
        ...prev,
        users: prev.users - 1,
      }))
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const pendingQuestions = questions.filter((q) => q.status === "pending")
  const approvedQuestions = questions.filter((q) => q.status === "approved")
  const rejectedQuestions = questions.filter((q) => q.status === "rejected")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando panel de administrador...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md p-4">
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">LogiCode</h1>
            </Link>
          </div>

          <nav className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "pending" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <FileQuestion className="h-5 w-5 mr-2" />
              Preguntas Pendientes
              {stats.pending > 0 && <Badge className="ml-auto">{stats.pending}</Badge>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "approved" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Preguntas Aprobadas
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "rejected" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("rejected")}
            >
              <XCircle className="h-5 w-5 mr-2" />
              Preguntas Rechazadas
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "users" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-5 w-5 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mr-2" />
              Configuración
            </Button>
          </nav>

          <div className="mt-8">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Panel de Administrador</h1>
            <div className="flex items-center space-x-4">
              {currentUser && <span className="text-sm text-gray-600">Hola, {currentUser.name}</span>}
            </div>
          </div>

          {activeTab === "dashboard" && (
            <section id="dashboard" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Preguntas Pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.pending}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Preguntas Aprobadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Preguntas Rechazadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Usuarios Registrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{stats.users}</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === "pending" && (
            <section id="pending" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Preguntas Pendientes ({pendingQuestions.length})</h2>
              {pendingQuestions.length === 0 ? (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-gray-500">No hay preguntas pendientes.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pendingQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{question.title}</CardTitle>
                          <Badge>Pendiente</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Enviado por: {question.author.name} • {formatDate(question.createdAt)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <CodeBlock code={question.code} />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveQuestion(question.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleRejectQuestion(question.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "approved" && (
            <section id="approved" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Preguntas Aprobadas ({approvedQuestions.length})</h2>
              {approvedQuestions.length === 0 ? (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-gray-500">No hay preguntas aprobadas.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {approvedQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{question.title}</CardTitle>
                          <Badge className="bg-green-600">Aprobada</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Enviado por: {question.author.name} • {formatDate(question.createdAt)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <CodeBlock code={question.code} />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "rejected" && (
            <section id="rejected" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Preguntas Rechazadas ({rejectedQuestions.length})</h2>
              {rejectedQuestions.length === 0 ? (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-gray-500">No hay preguntas rechazadas.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {rejectedQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{question.title}</CardTitle>
                          <Badge variant="destructive">Rechazada</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Enviado por: {question.author.name} • {formatDate(question.createdAt)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <CodeBlock code={question.code} />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveQuestion(question.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "users" && (
            <section id="users" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Gestionar Usuarios</h2>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Nombre</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Rol</th>
                        <th className="text-left p-4">Fecha de Registro</th>
                        <th className="text-left p-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-4">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            <Badge variant={user.role === "admin" ? "default" : "outline"}>
                              {user.role === "admin" ? "Administrador" : "Usuario"}
                            </Badge>
                          </td>
                          <td className="p-4">{formatDate(user.createdAt)}</td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "settings" && (
            <section id="settings" className="mb-12">
              <h2 className="text-xl font-bold mb-6">Configuración</h2>
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-gray-500">Configuración del sistema.</p>
                  <div className="mt-4 flex justify-center">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        if (
                          confirm("¿Estás seguro de que quieres reiniciar los datos? Esta acción no se puede deshacer.")
                        ) {
                          localStorage.clear()
                          window.location.href = "/"
                        }
                      }}
                    >
                      Reiniciar datos del sistema
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 LogiCode - Portal para Programadores</p>
        </div>
      </footer>
    </div>
  )
}
