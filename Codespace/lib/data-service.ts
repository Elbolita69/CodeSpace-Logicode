import type { Challenge } from "./types"

export function getChallenges(): Challenge[] {
  try {
    const storedChallenges = localStorage.getItem("challenges")
    if (storedChallenges) {
      return JSON.parse(storedChallenges)
    }
  } catch (error) {
    console.error("Error loading challenges:", error)
  }
  return []
}

export function getChallengeById(id: string): Challenge | null {
  try {
    const challenges = getChallenges()
    return challenges.find((challenge) => challenge.id === id) || null
  } catch (error) {
    console.error(`Error loading challenge with id ${id}:`, error)
    return null
  }
}

export function updateChallenge(updatedChallenge: Challenge): boolean {
  try {
    const challenges = getChallenges()
    const index = challenges.findIndex((challenge) => challenge.id === updatedChallenge.id)

    if (index !== -1) {
      challenges[index] = updatedChallenge
      localStorage.setItem("challenges", JSON.stringify(challenges))
      return true
    }
    return false
  } catch (error) {
    console.error(`Error updating challenge:`, error)
    return false
  }
}

export function updateUserProgress(userId: string, challengeId: string, isCompleted: boolean): boolean {
  try {
    const storedUsers = localStorage.getItem("users")
    if (!storedUsers) return false

    const users = JSON.parse(storedUsers)
    const userIndex = users.findIndex((u: any) => u.id === userId)

    if (userIndex === -1) return false

    const user = users[userIndex]

    if (isCompleted) {
      // Add to completed challenges if not already there
      if (!user.completedChallenges.includes(challengeId)) {
        user.completedChallenges.push(challengeId)
      }

      // Remove from in progress if it's there
      const inProgressIndex = user.inProgressChallenges.indexOf(challengeId)
      if (inProgressIndex !== -1) {
        user.inProgressChallenges.splice(inProgressIndex, 1)
      }
    } else {
      // Add to in progress if not already there and not completed
      if (!user.inProgressChallenges.includes(challengeId) && !user.completedChallenges.includes(challengeId)) {
        user.inProgressChallenges.push(challengeId)
      }
    }

    users[userIndex] = user
    localStorage.setItem("users", JSON.stringify(users))
    return true
  } catch (error) {
    console.error(`Error updating user progress:`, error)
    return false
  }
}
