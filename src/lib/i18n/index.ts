import { SupportedLanguage, LanguageInfo } from './types'
import { pt } from './translations/pt'
import { en } from './translations/en'
import { es } from './translations/es'
import { fr } from './translations/fr'

export const translations = {
  pt,
  en,
  es,
  fr
}

export const supportedLanguages: LanguageInfo[] = [
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    regions: ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL']
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    regions: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'IN']
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    regions: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ']
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    regions: ['FR', 'CA', 'BE', 'CH', 'LU', 'MC', 'SN', 'CI', 'ML', 'BF', 'NE', 'TD', 'MG', 'CM', 'CD', 'CG', 'GA', 'CF', 'DJ', 'KM', 'VU', 'NC', 'PF']
  }
]

// Função para detectar idioma baseado na região/navegador
export function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'pt' // SSR fallback
  
  // 1. Verificar localStorage primeiro
  const savedLanguage = localStorage.getItem('mydrip-language') as SupportedLanguage
  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage
  }
  
  // 2. Detectar pelo navegador
  const browserLanguages = navigator.languages || [navigator.language]
  
  for (const browserLang of browserLanguages) {
    // Extrair código do idioma (ex: 'pt-BR' -> 'pt')
    const langCode = browserLang.split('-')[0].toLowerCase() as SupportedLanguage
    
    if (translations[langCode]) {
      return langCode
    }
    
    // Verificar por região específica
    const region = browserLang.split('-')[1]?.toUpperCase()
    if (region) {
      const languageByRegion = supportedLanguages.find(lang => 
        lang.regions.includes(region)
      )
      if (languageByRegion) {
        return languageByRegion.code
      }
    }
  }
  
  // 3. Fallback para português (idioma padrão do app)
  return 'pt'
}

// Função para salvar idioma selecionado
export function saveLanguage(language: SupportedLanguage) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mydrip-language', language)
  }
}

// Função para obter informações do idioma
export function getLanguageInfo(code: SupportedLanguage): LanguageInfo | undefined {
  return supportedLanguages.find(lang => lang.code === code)
}