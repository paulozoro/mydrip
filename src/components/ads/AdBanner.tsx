'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar'
  className?: string
}

export default function AdBanner({ position = 'bottom', className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [adContent, setAdContent] = useState<{ title: string; description: string; cta: string }>({
    title: '',
    description: '',
    cta: ''
  })

  useEffect(() => {
    // Simular diferentes anúncios
    const ads = [
      {
        title: '🎨 Descubra novas tendências!',
        description: 'Explore as últimas coleções de moda e encontre seu estilo único.',
        cta: 'Ver Mais'
      },
      {
        title: '👗 Roupas em promoção!',
        description: 'Até 50% de desconto em peças selecionadas. Aproveite!',
        cta: 'Comprar Agora'
      },
      {
        title: '✨ Upgrade para Premium',
        description: 'Remova anúncios e crie looks ilimitados por apenas R$ 19,90/mês',
        cta: 'Fazer Upgrade'
      },
      {
        title: '🛍️ Novidades da semana',
        description: 'Confira os lançamentos mais quentes da moda.',
        cta: 'Explorar'
      }
    ]

    const randomAd = ads[Math.floor(Math.random() * ads.length)]
    setAdContent(randomAd)
  }, [])

  if (!isVisible) return null

  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    sidebar: ''
  }

  return (
    <Card 
      className={`
        ${position !== 'sidebar' ? 'fixed z-40' : ''} 
        ${positionClasses[position]} 
        ${className}
        bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 
        border-purple-200 dark:border-purple-800
        shadow-lg
      `}
    >
      <div className="relative p-4">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-8">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{adContent.title}</h3>
            <p className="text-xs text-muted-foreground">{adContent.description}</p>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {adContent.cta}
          </Button>
        </div>

        <div className="absolute bottom-1 right-4 text-[10px] text-muted-foreground">
          Anúncio
        </div>
      </div>
    </Card>
  )
}
