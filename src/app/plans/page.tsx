'use client'

import { useRouter } from 'next/navigation'
import { Check, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/lib/auth'

export default function PlansPage() {
  const router = useRouter()
  const user = authService.getCurrentUser()

  const handleUpgrade = () => {
    authService.upgradeToPremium()
    router.push('/')
  }

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '3 looks salvos',
        'Peças ilimitadas',
        'Manequim virtual',
        'Anúncios exibidos',
        'Suporte por email'
      ],
      current: user?.plan === 'free',
      cta: 'Plano Atual',
      disabled: true
    },
    {
      name: 'Premium',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Para fashionistas de verdade',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Looks ilimitados',
        'Peças ilimitadas',
        'Manequim virtual',
        'Sem anúncios',
        'Suporte prioritário',
        'Recursos exclusivos',
        'Atualizações antecipadas'
      ],
      current: user?.plan === 'premium',
      cta: user?.plan === 'premium' ? 'Plano Atual' : 'Fazer Upgrade',
      disabled: user?.plan === 'premium'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize seu guarda-roupa e crie looks incríveis. Comece grátis ou desbloqueie todo o potencial com o Premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.current ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.current && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} w-fit mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`bg-gradient-to-r ${plan.color} p-1 rounded-full mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.disabled
                        ? 'bg-gray-300 dark:bg-gray-700'
                        : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                    }`}
                    disabled={plan.disabled}
                    onClick={plan.name === 'Premium' && !plan.disabled ? handleUpgrade : undefined}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Por que escolher o Premium?</h3>
              </div>
              <p className="text-muted-foreground">
                Com o plano Premium, você tem liberdade total para criar quantos looks quiser, 
                sem interrupções de anúncios e com acesso prioritário a novos recursos. 
                Perfeito para quem leva moda a sério!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
