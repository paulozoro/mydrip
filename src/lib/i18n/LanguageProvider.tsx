'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SupportedLanguage, Translation } from './types'
import { translations, detectLanguage, saveLanguage, supportedLanguages } from './index'

interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: Translation
  availableLanguages: typeof supportedLanguages
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>('pt')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Detectar idioma automaticamente na primeira carga
    const detectedLanguage = detectLanguage()
    setLanguageState(detectedLanguage)
    setIsLoading(false)
  }, [])

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage)
    saveLanguage(newLanguage)
    
    // Atualizar o atributo lang do HTML
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage === 'pt' ? 'pt-BR' : 
                                      newLanguage === 'en' ? 'en-US' :
                                      newLanguage === 'es' ? 'es-ES' :
                                      newLanguage === 'fr' ? 'fr-FR' : 'pt-BR'
    }
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    availableLanguages: supportedLanguages,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook para tradução rápida
export function useTranslation() {
  const { t } = useLanguage()
  return t
}