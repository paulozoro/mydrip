'use client'

import { useState } from 'react'
import { Camera, Upload, X, Ruler, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
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

interface VirtualMannequinProps {
  measurements: {
    height: number
    chest: number
    waist: number
    hips: number
    shoulderWidth: number
    armLength: number
    legLength: number
    shoeSize: number
  }
  clothingItems: ClothingItem[]
  onMeasurementsChange: (measurements: any) => void
}

type Size = 'P' | 'M' | 'G' | 'GG' | 'XG'

const sizePresets: Record<Size, {
  height: number
  chest: number
  waist: number
  hips: number
  shoulderWidth: number
  armLength: number
  legLength: number
}> = {
  P: { height: 160, chest: 85, waist: 68, hips: 90, shoulderWidth: 38, armLength: 58, legLength: 95 },
  M: { height: 170, chest: 90, waist: 75, hips: 95, shoulderWidth: 40, armLength: 60, legLength: 100 },
  G: { height: 175, chest: 95, waist: 82, hips: 100, shoulderWidth: 42, armLength: 62, legLength: 105 },
  GG: { height: 180, chest: 100, waist: 90, hips: 105, shoulderWidth: 44, armLength: 64, legLength: 110 },
  XG: { height: 185, chest: 105, waist: 98, hips: 110, shoulderWidth: 46, armLength: 66, legLength: 115 }
}

export default function VirtualMannequinAdvanced({ measurements, clothingItems, onMeasurementsChange }: VirtualMannequinProps) {
  const t = useTranslation()
  const [selectedSize, setSelectedSize] = useState<Size>('M')
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null)
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null)
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const tops = clothingItems.filter(item => item.category === 'tops')
  const bottoms = clothingItems.filter(item => item.category === 'bottoms')
  const shoes = clothingItems.filter(item => item.category === 'shoes')

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size)
    const preset = sizePresets[size]
    onMeasurementsChange({
      ...measurements,
      ...preset
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessing(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setTimeout(() => setIsProcessing(false), 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // Simular captura de câmera
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e: any) => handleImageUpload(e)
    input.click()
  }

  const getMannequinScale = () => {
    const baseHeight = 170
    return measurements.height / baseHeight
  }

  const scale = getMannequinScale()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5" />
            Manequim Virtual com Ajuste de Tamanho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seletor de Tamanho */}
          <div>
            <label className="text-sm font-medium mb-3 block">Selecione o Tamanho</label>
            <div className="flex gap-2 flex-wrap">
              {(['P', 'M', 'G', 'GG', 'XG'] as Size[]).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => handleSizeChange(size)}
                  className={selectedSize === size ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                >
                  {size}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Altura: {measurements.height}cm | Busto: {measurements.chest}cm | Cintura: {measurements.waist}cm | Quadril: {measurements.hips}cm
            </p>
          </div>

          {/* Upload de Foto */}
          <div>
            <label className="text-sm font-medium mb-3 block">Digitalizar Roupa</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleCameraCapture}
                className="h-24 flex-col gap-2"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs">Tirar Foto</span>
              </Button>
              <label className="cursor-pointer">
                <div className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {isProcessing && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  🔄 Processando imagem e ajustando ao manequim...
                </p>
              </div>
            )}
            {uploadedImage && !isProcessing && (
              <div className="mt-3 relative">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setUploadedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-2 left-2 bg-green-500">
                  ✓ Digitalizada
                </Badge>
              </div>
            )}
          </div>

          {/* Visualização do Manequim */}
          <div className="bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 min-h-[500px] flex items-center justify-center">
            <div 
              className="relative transition-all duration-500"
              style={{ 
                transform: `scale(${scale})`,
                transformOrigin: 'center'
              }}
            >
              {/* Cabeça */}
              <div className="w-16 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto mb-2" />
              
              {/* Corpo Superior */}
              <div 
                className="relative mx-auto rounded-t-3xl overflow-hidden"
                style={{ 
                  width: `${measurements.shoulderWidth * 2}px`,
                  height: `${measurements.chest * 1.5}px`
                }}
              >
                {selectedTop ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={selectedTop.image} 
                      alt={selectedTop.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-purple-500">
                      {selectedTop.name}
                    </Badge>
                  </div>
                ) : uploadedImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded clothing"
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      Foto Digitalizada
                    </Badge>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Selecione uma peça</span>
                  </div>
                )}
              </div>

              {/* Cintura */}
              <div 
                className="mx-auto bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900"
                style={{ 
                  width: `${measurements.waist * 1.2}px`,
                  height: '30px'
                }}
              />

              {/* Corpo Inferior */}
              <div 
                className="relative mx-auto overflow-hidden"
                style={{ 
                  width: `${measurements.hips * 1.2}px`,
                  height: `${measurements.legLength * 1.2}px`
                }}
              >
                {selectedBottom ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={selectedBottom.image} 
                      alt={selectedBottom.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-pink-500">
                      {selectedBottom.name}
                    </Badge>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Selecione uma peça</span>
                  </div>
                )}
              </div>

              {/* Pés */}
              <div className="flex gap-4 justify-center mt-2">
                <div className="w-12 h-8 bg-gray-600 dark:bg-gray-400 rounded-lg" />
                <div className="w-12 h-8 bg-gray-600 dark:bg-gray-400 rounded-lg" />
              </div>

              {/* Badge de Tamanho */}
              <Badge className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                Tamanho {selectedSize}
              </Badge>
            </div>
          </div>

          {/* Seleção de Peças */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Parte Superior</label>
              <div className="grid grid-cols-4 gap-2">
                {tops.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTop(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedTop?.id === item.id 
                        ? 'border-purple-500 ring-2 ring-purple-500' 
                        : 'border-transparent hover:border-purple-300'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Parte Inferior</label>
              <div className="grid grid-cols-4 gap-2">
                {bottoms.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedBottom(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBottom?.id === item.id 
                        ? 'border-pink-500 ring-2 ring-pink-500' 
                        : 'border-transparent hover:border-pink-300'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ajustes Finos */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Ajustes Personalizados</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Altura: {measurements.height}cm</label>
                <Slider
                  value={[measurements.height]}
                  onValueChange={([value]) => onMeasurementsChange({ ...measurements, height: value })}
                  min={150}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Busto: {measurements.chest}cm</label>
                <Slider
                  value={[measurements.chest]}
                  onValueChange={([value]) => onMeasurementsChange({ ...measurements, chest: value })}
                  min={70}
                  max={120}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
