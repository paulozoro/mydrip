'use client'

import { useState, useRef } from 'react'
import { Camera, Plus, Trash2, Filter, Search, Upload, Tag, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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

interface WardrobeManagerProps {
  clothingItems: ClothingItem[]
  onAddItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void
  onRemoveItem: (id: string) => void
}

export default function WardrobeManager({ clothingItems, onAddItem, onRemoveItem }: WardrobeManagerProps) {
  const t = useTranslation()
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSeason, setFilterSeason] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'tops' as ClothingItem['category'],
    image: '',
    color: '',
    season: [] as string[],
    tags: [] as string[]
  })

  const categories = [
    { value: 'tops', label: t.tops, icon: '👕' },
    { value: 'bottoms', label: t.bottoms, icon: '👖' },
    { value: 'shoes', label: t.shoes, icon: '👟' },
    { value: 'accessories', label: t.accessories, icon: '👜' }
  ]

  const seasons = [t.summer, t.autumn, t.winter, t.spring]
  const colors = [t.black, t.white, t.blue, t.red, t.green, t.yellow, t.pink, t.purple, t.brown, t.gray]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isCamera: boolean = false) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewItem(prev => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.image && newItem.color) {
      onAddItem(newItem)
      setNewItem({
        name: '',
        category: 'tops',
        image: '',
        color: '',
        season: [],
        tags: []
      })
      setIsAddingItem(false)
    }
  }

  const handleSeasonChange = (season: string, checked: boolean) => {
    setNewItem(prev => ({
      ...prev,
      season: checked 
        ? [...prev.season, season]
        : prev.season.filter(s => s !== season)
    }))
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    setNewItem(prev => ({ ...prev, tags }))
  }

  // Filtrar itens
  const filteredItems = clothingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSeason = filterSeason === 'all' || item.season.includes(filterSeason)
    
    return matchesSearch && matchesCategory && matchesSeason
  })

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            {t.myWardrobe}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const count = clothingItems.filter(item => item.category === category.value).length
              return (
                <div key={category.value} className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="font-semibold text-lg">{count}</div>
                  <div className="text-sm text-muted-foreground">{category.label}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSeason} onValueChange={setFilterSeason}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Estação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allSeasons}</SelectItem>
              {seasons.map(season => (
                <SelectItem key={season} value={season}>{season}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              {t.addPiece}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.addNewPiece}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Upload de imagem */}
              <div className="space-y-3">
                <Label>{t.piecePhoto}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t.gallery}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t.camera}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                />
                {newItem.image && (
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={newItem.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">{t.pieceName}</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t.pieceNamePlaceholder}
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label>{t.category}</Label>
                <Select value={newItem.category} onValueChange={(value: ClothingItem['category']) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <Label>{t.mainColor}</Label>
                <Select value={newItem.color} onValueChange={(value) => setNewItem(prev => ({ ...prev, color: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectColor} />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estações */}
              <div className="space-y-2">
                <Label>{t.appropriateSeasons}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {seasons.map(season => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={season}
                        checked={newItem.season.includes(season)}
                        onCheckedChange={(checked) => handleSeasonChange(season, checked as boolean)}
                      />
                      <Label htmlFor={season} className="text-sm">{season}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newItem.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder={t.tagsPlaceholder}
                />
              </div>

              <Button 
                onClick={handleAddItem} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!newItem.name || !newItem.image || !newItem.color}
              >
                {t.addPiece}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de itens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.value === item.category)?.icon}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.color}
                </Badge>
              </div>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-lg font-medium mb-2">{t.noPiecesFound}</h3>
            <p className="text-muted-foreground mb-4">
              {clothingItems.length === 0 
                ? t.noPiecesDescription
                : t.adjustFilters
              }
            </p>
            {clothingItems.length === 0 && (
              <Button 
                onClick={() => setIsAddingItem(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addFirstPiece}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}