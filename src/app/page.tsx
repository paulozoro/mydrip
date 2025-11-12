'use client'

import { useState, useEffect } from 'react'
import { Camera, Shirt, User, Palette, Settings, Plus, Grid3X3, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import WardrobeManager from '@/components/wardrobe/WardrobeManager'
import VirtualMannequin from '@/components/wardrobe/VirtualMannequin'
import OutfitCombiner from '@/components/wardrobe/OutfitCombiner'
import UserProfile from '@/components/wardrobe/UserProfile'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

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
  const t = useTranslation()
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
  const [activeTab, setActiveTab] = useState('wardrobe')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Shirt className="w-6 h-6 text-white" />
              </div>
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
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="wardrobe" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.wardrobe}</span>
            </TabsTrigger>
            <TabsTrigger value="mannequin" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t.mannequin}</span>
            </TabsTrigger>
            <TabsTrigger value="outfits" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{t.outfits}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{t.profile}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wardrobe" className="space-y-6">
            <WardrobeManager
              clothingItems={clothingItems}
              onAddItem={addClothingItem}
              onRemoveItem={removeClothingItem}
            />
          </TabsContent>

          <TabsContent value="mannequin" className="space-y-6">
            <VirtualMannequin
              measurements={userMeasurements}
              clothingItems={clothingItems}
              onMeasurementsChange={updateUserMeasurements}
            />
          </TabsContent>

          <TabsContent value="outfits" className="space-y-6">
            <OutfitCombiner
              clothingItems={clothingItems}
              outfits={outfits}
              onAddOutfit={addOutfit}
              onRemoveOutfit={removeOutfit}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile
              measurements={userMeasurements}
              onMeasurementsChange={updateUserMeasurements}
              stats={stats}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}