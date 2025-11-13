'use client'

import { useState } from 'react'
import { Search, ShoppingBag, Plus, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

interface SheinProduct {
  id: string
  name: string
  image: string
  price: string
  url: string
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories'
}

interface SheinSearchProps {
  onAddToWardrobe: (item: {
    name: string
    category: 'tops' | 'bottoms' | 'shoes' | 'accessories'
    image: string
    color: string
    season: string[]
    tags: string[]
  }) => void
}

export default function SheinSearch({ onAddToWardrobe }: SheinSearchProps) {
  const t = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SheinProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tops' | 'bottoms' | 'shoes' | 'accessories'>('all')

  // Simulação de busca na SHEIN (em produção, seria uma API real)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Produtos mockados para demonstração
    const mockProducts: SheinProduct[] = [
      {
        id: '1',
        name: 'Camiseta Básica Oversized',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        price: 'R$ 49,90',
        url: 'https://br.shein.com',
        category: 'tops'
      },
      {
        id: '2',
        name: 'Calça Jeans Skinny',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        price: 'R$ 89,90',
        url: 'https://br.shein.com',
        category: 'bottoms'
      },
      {
        id: '3',
        name: 'Tênis Casual Branco',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        price: 'R$ 129,90',
        url: 'https://br.shein.com',
        category: 'shoes'
      },
      {
        id: '4',
        name: 'Bolsa Transversal Preta',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 'R$ 69,90',
        url: 'https://br.shein.com',
        category: 'accessories'
      },
      {
        id: '5',
        name: 'Blusa Cropped Listrada',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        price: 'R$ 59,90',
        url: 'https://br.shein.com',
        category: 'tops'
      },
      {
        id: '6',
        name: 'Shorts Jeans Destroyed',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
        price: 'R$ 79,90',
        url: 'https://br.shein.com',
        category: 'bottoms'
      },
      {
        id: '7',
        name: 'Óculos de Sol Aviador',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        price: 'R$ 39,90',
        url: 'https://br.shein.com',
        category: 'accessories'
      },
      {
        id: '8',
        name: 'Sandália Plataforma',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        price: 'R$ 99,90',
        url: 'https://br.shein.com',
        category: 'shoes'
      }
    ]

    // Filtrar por categoria se selecionada
    const filtered = selectedCategory === 'all' 
      ? mockProducts 
      : mockProducts.filter(p => p.category === selectedCategory)

    setSearchResults(filtered)
    setIsSearching(false)
  }

  const handleAddToWardrobe = (product: SheinProduct) => {
    onAddToWardrobe({
      name: product.name,
      category: product.category,
      image: product.image,
      color: 'Variado',
      season: ['Primavera', 'Verão', 'Outono', 'Inverno'],
      tags: ['SHEIN', product.category]
    })
  }

  const categories = [
    { value: 'all', label: 'Todos', icon: ShoppingBag },
    { value: 'tops', label: 'Blusas', icon: ShoppingBag },
    { value: 'bottoms', label: 'Calças', icon: ShoppingBag },
    { value: 'shoes', label: 'Calçados', icon: ShoppingBag },
    { value: 'accessories', label: 'Acessórios', icon: ShoppingBag }
  ]

  return (
    <div className="space-y-6">
      <Card className="border-purple-200/50 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            Buscar na SHEIN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de busca */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar roupas e acessórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Filtros de categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value as any)}
                className={selectedCategory === cat.value ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-purple-500">
                  SHEIN
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-purple-600 mt-1">{product.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => handleAddToWardrobe(product)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {searchResults.length === 0 && !isSearching && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Busque produtos na SHEIN</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Pesquise por roupas e acessórios para adicionar ao seu guarda-roupa e criar looks incríveis!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
