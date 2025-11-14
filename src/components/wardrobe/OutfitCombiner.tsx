'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Plus, Trash2, Star, Edit3, Save, X, Shuffle, Heart, Share2, Crown, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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

interface Outfit {
  id: string
  name: string
  items: ClothingItem[]
  createdAt: string
  rating?: number
  notes?: string
}

interface OutfitCombinerProps {
  clothingItems: ClothingItem[]
  outfits: Outfit[]
  onAddOutfit: (outfit: Omit<Outfit, 'id' | 'createdAt'>) => void
  onRemoveOutfit: (id: string) => void
  userPlan: 'free' | 'premium'
  outfitsCreated: number
}

export default function OutfitCombiner({ 
  clothingItems, 
  outfits, 
  onAddOutfit, 
  onRemoveOutfit,
  userPlan,
  outfitsCreated
}: OutfitCombinerProps) {
  const router = useRouter()
  const [isCreatingOutfit, setIsCreatingOutfit] = useState(false)
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([])
  const [outfitName, setOutfitName] = useState('')
  const [outfitNotes, setOutfitNotes] = useState('')
  const [outfitRating, setOutfitRating] = useState<number>(0)
  const [filterSeason, setFilterSeason] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showLimitWarning, setShowLimitWarning] = useState(false)

  const categories = [
    { key: 'tops' as const, label: 'Blusas/Camisas', icon: '👕' },
    { key: 'bottoms' as const, label: 'Calças/Saias', icon: '👖' },
    { key: 'shoes' as const, label: 'Sapatos', icon: '👟' },
    { key: 'accessories' as const, label: 'Acessórios', icon: '👜' }
  ]

  const seasons = ['Verão', 'Outono', 'Inverno', 'Primavera']

  const toggleItemSelection = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === item.id)
      if (isSelected) {
        return prev.filter(i => i.id !== item.id)
      } else {
        // Remover item da mesma categoria se já existir
        const filtered = prev.filter(i => i.category !== item.category)
        return [...filtered, item]
      }
    })
  }

  const generateRandomOutfit = () => {
    const randomItems: ClothingItem[] = []
    
    categories.forEach(category => {
      const categoryItems = clothingItems.filter(item => item.category === category.key)
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)]
        randomItems.push(randomItem)
      }
    })
    
    setSelectedItems(randomItems)
  }

  const handleCreateOutfitClick = () => {
    const canCreate = authService.canCreateOutfit()
    if (!canCreate.allowed) {
      setShowLimitWarning(true)
      return
    }
    setIsCreatingOutfit(true)
  }

  const createOutfit = () => {
    const canCreate = authService.canCreateOutfit()
    if (!canCreate.allowed) {
      setShowLimitWarning(true)
      setIsCreatingOutfit(false)
      return
    }

    if (outfitName && selectedItems.length > 0) {
      onAddOutfit({
        name: outfitName,
        items: selectedItems,
        rating: outfitRating,
        notes: outfitNotes
      })
      
      // Reset form
      setOutfitName('')
      setOutfitNotes('')
      setOutfitRating(0)
      setSelectedItems([])
      setIsCreatingOutfit(false)
    }
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Filtrar e ordenar outfits
  const filteredOutfits = outfits
    .filter(outfit => {
      if (filterSeason === 'all') return true
      return outfit.items.some(item => item.season.includes(filterSeason))
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const remainingOutfits = userPlan === 'free' ? Math.max(0, 3 - outfitsCreated) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            Combinações de Looks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">
                <Eye className="w-3 h-3 mr-1" />
                {outfits.length} looks salvos
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                <Heart className="w-3 h-3 mr-1" />
                {outfits.filter(o => (o.rating || 0) >= 4).length} favoritos
              </Badge>
              {userPlan === 'free' && (
                <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-400">
                  {remainingOutfits} restantes
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateRandomOutfit}
                disabled={clothingItems.length === 0}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Aleatório
              </Button>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={handleCreateOutfitClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Look
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de aviso de limite */}
      <Dialog open={showLimitWarning} onOpenChange={setShowLimitWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Limite de Looks Atingido
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Você atingiu o limite de 3 looks do plano gratuito. 
              Faça upgrade para o Premium e crie looks ilimitados!
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Crown className="w-4 h-4 text-purple-600" />
                Benefícios Premium
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✨ Looks ilimitados</li>
                <li>🚫 Sem anúncios</li>
                <li>⚡ Suporte prioritário</li>
                <li>🎨 Recursos exclusivos</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLimitWarning(false)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => router.push('/plans')}
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de criação de outfit */}
      <Dialog open={isCreatingOutfit} onOpenChange={setIsCreatingOutfit}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Look</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seleção de itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Selecionar Peças</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomOutfit}
                  >
                    <Shuffle className="w-4 h-4 mr-1" />
                    Aleatório
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    disabled={selectedItems.length === 0}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                </div>
              </div>
              
              {categories.map(category => {
                const categoryItems = clothingItems.filter(item => item.category === category.key)
                const selectedItem = selectedItems.find(item => item.category === category.key)
                
                return (
                  <div key={category.key} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </Label>
                    
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                      {categoryItems.map(item => (
                        <div
                          key={item.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedItem?.id === item.id
                              ? 'border-pink-500 ring-2 ring-pink-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleItemSelection(item)}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {selectedItem?.id === item.id && (
                            <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                              <div className="bg-pink-500 text-white rounded-full p-1">
                                <Eye className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {categoryItems.length === 0 && (
                      <div className="text-sm text-muted-foreground italic">
                        Nenhuma peça desta categoria
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Preview e detalhes */}
            <div className="space-y-4">
              <h3 className="font-medium">Preview do Look</h3>
              
              {/* Preview visual */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 min-h-[200px]">
                {selectedItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItems.map(item => (
                      <div key={item.id} className="text-center">
                        <div className="aspect-square bg-white rounded-lg overflow-hidden mb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Selecione peças para ver o preview</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Detalhes do look */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="outfit-name">Nome do Look</Label>
                  <Input
                    id="outfit-name"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="Ex: Look casual de verão"
                  />
                </div>
                
                <div>
                  <Label>Avaliação</Label>
                  <div className="mt-1">
                    {renderStars(outfitRating, true, setOutfitRating)}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="outfit-notes">Notas (opcional)</Label>
                  <Textarea
                    id="outfit-notes"
                    value={outfitNotes}
                    onChange={(e) => setOutfitNotes(e.target.value)}
                    placeholder="Ocasião, combinações, observações..."
                    rows={3}
                  />
                </div>
                
                <Button
                  onClick={createOutfit}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  disabled={!outfitName || selectedItems.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Look
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterSeason} onValueChange={setFilterSeason}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por estação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as estações</SelectItem>
            {seasons.map(season => (
              <SelectItem key={season} value={season}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="oldest">Mais antigos</SelectItem>
            <SelectItem value="rating">Melhor avaliados</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de outfits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOutfits.map(outfit => (
          <Card key={outfit.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{outfit.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(outfit.rating || 0)}
                    <Badge variant="secondary" className="text-xs">
                      {outfit.items.length} peças
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0"
                  onClick={() => onRemoveOutfit(outfit.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Preview das peças */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {outfit.items.slice(0, 4).map(item => (
                  <div key={item.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              
              {/* Informações */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {outfit.items.map(item => (
                    <Badge key={item.id} variant="outline" className="text-xs">
                      {categories.find(c => c.key === item.category)?.icon} {item.color}
                    </Badge>
                  ))}
                </div>
                
                {outfit.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {outfit.notes}
                  </p>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Criado em {new Date(outfit.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOutfits.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-lg font-medium mb-2">Nenhum look encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {outfits.length === 0 
                ? 'Comece criando suas primeiras combinações de looks!'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {outfits.length === 0 && (
              <Button 
                onClick={handleCreateOutfitClick}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={clothingItems.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                {clothingItems.length === 0 ? 'Adicione peças primeiro' : 'Criar Primeiro Look'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
