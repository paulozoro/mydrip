'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Shirt, User, Palette, Settings, Plus, Grid3X3, Eye, Crown, LogOut, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import WardrobeManager from '@/components/wardrobe/WardrobeManager'
import VirtualMannequinAdvanced from '@/components/wardrobe/VirtualMannequinAdvanced'
import OutfitCombiner from '@/components/wardrobe/OutfitCombiner'
import UserProfile from '@/components/wardrobe/UserProfile'
import SheinSearch from '@/components/wardrobe/SheinSearch'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { useTranslation } from '@/lib/i18n/LanguageProvider'
import { authService } from '@/lib/auth'

interface ClothingItem {
  id: string
  name: string
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories'
  image: string
  color: string
  season: string[]
  tags: string[]
  createdAt: string
}

interface UserMeasurements {
  height: number
  chest: number
  waist: number
  hips: number
  shoulderWidth: number
  armLength: number
  legLength: number
  shoeSize: number
}

interface Outfit {
  id: string
  name: string
  items: ClothingItem[]
  createdAt: string
  rating?: number
  notes?: string
}

export default function MyDripApp() {
  const router = useRouter()
  const t = useTranslation()
  const [user, setUser] = useState(authService.getCurrentUser())
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [userMeasurements, setUserMeasurements] = useState<UserMeasurements>({
    height: 170,
    chest: 90,
    waist: 75,
    hips: 95,
    shoulderWidth: 40,
    armLength: 60,
    legLength: 100,
    shoeSize: 40
  })
  const [activeView, setActiveView] = useState('wardrobe')

  // Verificar autenticação
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  // Carregar dados do localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('mydrip-items')
    const savedOutfits = localStorage.getItem('mydrip-outfits')
    const savedMeasurements = localStorage.getItem('mydrip-measurements')

    if (savedItems) {
      setClothingItems(JSON.parse(savedItems))
    }
    if (savedOutfits) {
      setOutfits(JSON.parse(savedOutfits))
    }
    if (savedMeasurements) {
      setUserMeasurements(JSON.parse(savedMeasurements))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('mydrip-items', JSON.stringify(clothingItems))
  }, [clothingItems])

  useEffect(() => {
    localStorage.setItem('mydrip-outfits', JSON.stringify(outfits))
  }, [outfits])

  useEffect(() => {
    localStorage.setItem('mydrip-measurements', JSON.stringify(userMeasurements))
  }, [userMeasurements])

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const addClothingItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setClothingItems(prev => [...prev, newItem])
  }

  const removeClothingItem = (id: string) => {
    setClothingItems(prev => prev.filter(item => item.id !== id))
  }

  const addOutfit = (outfit: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setOutfits(prev => [...prev, newOutfit])
    
    // Incrementar contador de looks do usuário
    authService.incrementOutfitCount()
    setUser(authService.getCurrentUser())
  }

  const removeOutfit = (id: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== id))
  }

  const updateUserMeasurements = (measurements: UserMeasurements) => {
    setUserMeasurements(measurements)
  }

  const stats = {
    totalItems: clothingItems.length,
    totalOutfits: outfits.length,
    categories: {
      tops: clothingItems.filter(item => item.category === 'tops').length,
      bottoms: clothingItems.filter(item => item.category === 'bottoms').length,
      shoes: clothingItems.filter(item => item.category === 'shoes').length,
      accessories: clothingItems.filter(item => item.category === 'accessories').length
    }
  }

  if (!user) {
    return null // Redirecionando...
  }

  const remainingOutfits = user.plan === 'free' ? Math.max(0, 3 - user.outfitsCreated) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7b689a1a-24e9-4c37-bcf7-68129a226809.jpg" 
                alt="MyDrip Logo" 
                className="h-12 w-12 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <p className="text-sm text-muted-foreground">{t.appDescription}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  <Shirt className="w-3 h-3 mr-1" />
                  {stats.totalItems} {t.pieces}
                </Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">
                  <Palette className="w-3 h-3 mr-1" />
                  {stats.totalOutfits} {t.looks}
                </Badge>
                {user.plan === 'free' && (
                  <Badge 
                    variant="outline" 
                    className="border-orange-500 text-orange-700 dark:text-orange-400 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    onClick={() => router.push('/plans')}
                  >
                    {remainingOutfits} looks restantes
                  </Badge>
                )}
                {user.plan === 'premium' && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Info do usuário mobile */}
          <div className="sm:hidden mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
              {user.plan === 'premium' && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            {user.plan === 'free' && (
              <Badge 
                variant="outline" 
                className="border-orange-500 text-orange-700 cursor-pointer"
                onClick={() => router.push('/plans')}
              >
                {remainingOutfits} looks restantes
              </Badge>
            )}
          </div>

          {/* Navegação por botões */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeView === 'wardrobe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('wardrobe')}
              className={activeView === 'wardrobe' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              {t.wardrobe}
            </Button>
            <Button
              variant={activeView === 'shein' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('shein')}
              className={activeView === 'shein' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              SHEIN
            </Button>
            <Button
              variant={activeView === 'mannequin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('mannequin')}
              className={activeView === 'mannequin' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <User className="w-4 h-4 mr-2" />
              {t.mannequin}
            </Button>
            <Button
              variant={activeView === 'outfits' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('outfits')}
              className={activeView === 'outfits' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.outfits}
            </Button>
            <Button
              variant={activeView === 'profile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('profile')}
              className={activeView === 'profile' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <Settings className="w-4 h-4 mr-2" />
              {t.profile}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeView === 'wardrobe' && (
          <WardrobeManager
            clothingItems={clothingItems}
            onAddItem={addClothingItem}
            onRemoveItem={removeClothingItem}
          />
        )}

        {activeView === 'shein' && (
          <SheinSearch
            onAddToWardrobe={addClothingItem}
          />
        )}

        {activeView === 'mannequin' && (
          <VirtualMannequinAdvanced
            measurements={userMeasurements}
            clothingItems={clothingItems}
            onMeasurementsChange={updateUserMeasurements}
          />
        )}

        {activeView === 'outfits' && (
          <OutfitCombiner
            clothingItems={clothingItems}
            outfits={outfits}
            onAddOutfit={addOutfit}
            onRemoveOutfit={removeOutfit}
            userPlan={user.plan}
            outfitsCreated={user.outfitsCreated}
          />
        )}

        {activeView === 'profile' && (
          <div className="space-y-6">
            <UserProfile
              measurements={userMeasurements}
              onMeasurementsChange={updateUserMeasurements}
              stats={stats}
            />
            
            {/* Card de upgrade para plano gratuito */}
            {user.plan === 'free' && (
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    Upgrade para Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Desbloqueie looks ilimitados e tenha acesso a recursos exclusivos!
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Looks ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Sem anúncios
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Suporte prioritário
                    </li>
                  </ul>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">R$ 9,99</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => router.push('/plans')}
                  >
                    Assinar Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
