// Sistema de autenticação simples com localStorage
export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'premium'
  createdAt: string
  outfitsCreated: number
}

const STORAGE_KEY = 'mydrip-user'

export const authService = {
  // Registrar novo usuário
  register: (email: string, password: string, name: string): User | null => {
    // Verificar se já existe usuário
    const existingUser = localStorage.getItem(STORAGE_KEY)
    if (existingUser) {
      return null
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      plan: 'free',
      createdAt: new Date().toISOString(),
      outfitsCreated: 0
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(`mydrip-password-${email}`, password) // Simplificado para demo
    return user
  },

  // Login
  login: (email: string, password: string): User | null => {
    const storedPassword = localStorage.getItem(`mydrip-password-${email}`)
    if (storedPassword !== password) {
      return null
    }

    const userData = localStorage.getItem(STORAGE_KEY)
    if (!userData) {
      return null
    }

    return JSON.parse(userData)
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEY)
    if (!userData) {
      return null
    }
    return JSON.parse(userData)
  },

  // Atualizar usuário
  updateUser: (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null
  },

  // Upgrade para premium
  upgradeToPremium: () => {
    const user = authService.getCurrentUser()
    if (user) {
      user.plan = 'premium'
      authService.updateUser(user)
      return true
    }
    return false
  },

  // Incrementar contador de looks
  incrementOutfitCount: () => {
    const user = authService.getCurrentUser()
    if (user) {
      user.outfitsCreated++
      authService.updateUser(user)
    }
  },

  // Verificar se pode criar mais looks
  canCreateOutfit: (): { allowed: boolean; reason?: string } => {
    const user = authService.getCurrentUser()
    if (!user) {
      return { allowed: false, reason: 'Usuário não autenticado' }
    }

    if (user.plan === 'premium') {
      return { allowed: true }
    }

    // Plano gratuito: máximo 3 looks
    if (user.outfitsCreated >= 3) {
      return { 
        allowed: false, 
        reason: 'Limite de 3 looks atingido. Faça upgrade para criar looks ilimitados!' 
      }
    }

    return { allowed: true }
  }
}
