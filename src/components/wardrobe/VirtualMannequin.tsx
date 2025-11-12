'use client'

import { useState, useEffect } from 'react'
import { User, Ruler, RotateCcw, Save, Shirt, Palette, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

interface VirtualMannequinProps {
  measurements: UserMeasurements
  clothingItems: ClothingItem[]
  onMeasurementsChange: (measurements: UserMeasurements) => void
}

interface CurrentOutfit {
  tops?: ClothingItem
  bottoms?: ClothingItem
  shoes?: ClothingItem
  accessories?: ClothingItem
}

export default function VirtualMannequin({ measurements, clothingItems, onMeasurementsChange }: VirtualMannequinProps) {
  const t = useTranslation()
  const [currentOutfit, setCurrentOutfit] = useState<CurrentOutfit>({})
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false)
  const [tempMeasurements, setTempMeasurements] = useState(measurements)

  useEffect(() => {
    setTempMeasurements(measurements)
  }, [measurements])

  const handleMeasurementChange = (key: keyof UserMeasurements, value: number) => {
    setTempMeasurements(prev => ({ ...prev, [key]: value }))
  }

  const saveMeasurements = () => {
    onMeasurementsChange(tempMeasurements)
    setIsEditingMeasurements(false)
  }

  const resetMeasurements = () => {
    setTempMeasurements(measurements)
    setIsEditingMeasurements(false)
  }

  const addItemToOutfit = (item: ClothingItem) => {
    setCurrentOutfit(prev => ({
      ...prev,
      [item.category]: item
    }))
  }

  const removeItemFromOutfit = (category: ClothingItem['category']) => {
    setCurrentOutfit(prev => {
      const newOutfit = { ...prev }
      delete newOutfit[category]
      return newOutfit
    })
  }

  const clearOutfit = () => {
    setCurrentOutfit({})
  }

  // Calcular proporções do manequim baseado nas medidas
  const mannequinStyle = {
    height: `${Math.max(200, measurements.height * 1.5)}px`,
    '--chest-width': `${measurements.chest * 1.2}px`,
    '--waist-width': `${measurements.waist * 1.2}px`,
    '--hip-width': `${measurements.hips * 1.2}px`,
    '--shoulder-width': `${measurements.shoulderWidth * 2}px`,
  } as React.CSSProperties

  const categories = [
    { key: 'tops' as const, label: t.tops, icon: '👕' },
    { key: 'bottoms' as const, label: t.bottoms, icon: '👖' },
    { key: 'shoes' as const, label: t.shoes, icon: '👟' },
    { key: 'accessories' as const, label: t.accessories, icon: '👜' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            {t.virtualMannequin}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <Ruler className="w-3 h-3 mr-1" />
                {measurements.height}{t.cm}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                <Shirt className="w-3 h-3 mr-1" />
                {Object.keys(currentOutfit).length} {t.pieces}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
              >
                <Ruler className="w-4 h-4 mr-2" />
                {isEditingMeasurements ? t.cancel : t.updateMeasurements}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearOutfit}
                disabled={Object.keys(currentOutfit).length === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Medidas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t.myMeasurements}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingMeasurements ? (
              <>
                <div className="space-y-3">
                  <div>
                    <Label>{t.height} ({t.cm})</Label>
                    <Slider
                      value={[tempMeasurements.height]}
                      onValueChange={([value]) => handleMeasurementChange('height', value)}
                      min={140}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.height}{t.cm}</div>
                  </div>
                  
                  <div>
                    <Label>{t.chest} ({t.cm})</Label>
                    <Slider
                      value={[tempMeasurements.chest]}
                      onValueChange={([value]) => handleMeasurementChange('chest', value)}
                      min={70}
                      max={130}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.chest}{t.cm}</div>
                  </div>
                  
                  <div>
                    <Label>{t.waist} ({t.cm})</Label>
                    <Slider
                      value={[tempMeasurements.waist]}
                      onValueChange={([value]) => handleMeasurementChange('waist', value)}
                      min={60}
                      max={120}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.waist}{t.cm}</div>
                  </div>
                  
                  <div>
                    <Label>{t.hips} ({t.cm})</Label>
                    <Slider
                      value={[tempMeasurements.hips]}
                      onValueChange={([value]) => handleMeasurementChange('hips', value)}
                      min={70}
                      max={130}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.hips}{t.cm}</div>
                  </div>
                  
                  <div>
                    <Label>{t.shoulderWidth} ({t.cm})</Label>
                    <Slider
                      value={[tempMeasurements.shoulderWidth]}
                      onValueChange={([value]) => handleMeasurementChange('shoulderWidth', value)}
                      min={30}
                      max={60}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.shoulderWidth}{t.cm}</div>
                  </div>
                  
                  <div>
                    <Label>{t.shoeSize}</Label>
                    <Slider
                      value={[tempMeasurements.shoeSize]}
                      onValueChange={([value]) => handleMeasurementChange('shoeSize', value)}
                      min={30}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.shoeSize}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button onClick={saveMeasurements} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {t.save}
                  </Button>
                  <Button variant="outline" onClick={resetMeasurements} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t.cancel}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.height}:</span>
                  <span className="font-medium">{measurements.height}{t.cm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.chest}:</span>
                  <span className="font-medium">{measurements.chest}{t.cm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.waist}:</span>
                  <span className="font-medium">{measurements.waist}{t.cm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.hips}:</span>
                  <span className="font-medium">{measurements.hips}{t.cm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.shoulderWidth}:</span>
                  <span className="font-medium">{measurements.shoulderWidth}{t.cm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t.shoeSize}:</span>
                  <span className="font-medium">{measurements.shoeSize}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manequim Virtual */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t.tryOnClothes}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
              {/* Manequim SVG simplificado */}
              <div className="relative" style={mannequinStyle}>
                <svg
                  width="120"
                  height="300"
                  viewBox="0 0 120 300"
                  className="text-gray-400 dark:text-gray-600"
                >
                  {/* Cabeça */}
                  <circle cx="60" cy="30" r="20" fill="currentColor" opacity="0.3" />
                  
                  {/* Corpo */}
                  <path
                    d={`M 40 50 
                        L ${40 + measurements.shoulderWidth * 0.4} 50
                        L ${50 + measurements.chest * 0.3} 100
                        L ${50 + measurements.waist * 0.3} 150
                        L ${50 + measurements.hips * 0.3} 200
                        L ${50 + measurements.hips * 0.3} 250
                        L ${70 - measurements.hips * 0.3} 250
                        L ${70 - measurements.hips * 0.3} 200
                        L ${70 - measurements.waist * 0.3} 150
                        L ${70 - measurements.chest * 0.3} 100
                        L ${80 - measurements.shoulderWidth * 0.4} 50
                        Z`}
                    fill="currentColor"
                    opacity="0.3"
                  />
                  
                  {/* Braços */}
                  <rect x="20" y="60" width="8" height="80" fill="currentColor" opacity="0.3" />
                  <rect x="92" y="60" width="8" height="80" fill="currentColor" opacity="0.3" />
                  
                  {/* Pernas */}
                  <rect x="45" y="250" width="12" height="40" fill="currentColor" opacity="0.3" />
                  <rect x="63" y="250" width="12" height="40" fill="currentColor" opacity="0.3" />
                </svg>

                {/* Roupas sobrepostas */}
                {currentOutfit.tops && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={currentOutfit.tops.image}
                      alt={currentOutfit.tops.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}
                
                {currentOutfit.bottoms && (
                  <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={currentOutfit.bottoms.image}
                      alt={currentOutfit.bottoms.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}
                
                {currentOutfit.shoes && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={currentOutfit.shoes.image}
                      alt={currentOutfit.shoes.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}
                
                {currentOutfit.accessories && (
                  <div className="absolute top-8 right-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={currentOutfit.accessories.image}
                      alt={currentOutfit.accessories.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seletor de Roupas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t.selectPieces}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map(category => {
              const items = clothingItems.filter(item => item.category === category.key)
              const currentItem = currentOutfit[category.key]
              
              return (
                <div key={category.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.label}
                  </Label>
                  
                  {currentItem ? (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{currentItem.name}</div>
                        <div className="text-xs text-muted-foreground">{currentItem.color}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItemFromOutfit(category.key)}
                      >
                        {t.delete}
                      </Button>
                    </div>
                  ) : (
                    <Select onValueChange={(itemId) => {
                      const item = items.find(i => i.id === itemId)
                      if (item) addItemToOutfit(item)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder={`${t.selectPieces} ${category.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-6 h-6 object-cover rounded"
                              />
                              <span>{item.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {items.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">
                      {t.noPiecesFound}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}