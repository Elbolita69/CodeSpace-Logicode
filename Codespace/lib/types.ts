export interface User {
  id: string
  name: string
  email: string
  password: string
  xp: number
  level?: number
  streak: number
  rank?: number
  completedChallenges: string[]
  inProgressChallenges: string[]
  achievements: string[]
  createdAt: string
  role?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: number // 1-5
  category: string
  language: string
  xpReward: number
  estimatedTime: number // in minutes
  objectives?: string[]
  hints?: string
  starterCode?: string
  expectedSolution: string[]
  expectedOutput?: string
  progress?: number // 0-100
  simulationData?: any // For visual simulations
}

export interface Question {
  id: string
  title: string
  code: string
  tags: string[]
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export interface Answer {
  id: string
  questionId: string
  content: string
  code: string
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  votes: number
}
