'use client'

import { useState } from 'react'
import { User, Settings, Ruler, BarChart3, TrendingUp, Calendar, Download, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

interface Stats {
  totalItems: number
  totalOutfits: number
  categories: {
    tops: number
    bottoms: number
    shoes: number
    accessories: number
  }
}

interface UserProfileProps {
  measurements: UserMeasurements
  onMeasurementsChange: (measurements: UserMeasurements) => void
  stats: Stats
}

export default function UserProfile({ measurements, onMeasurementsChange, stats }: UserProfileProps) {
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false)
  const [tempMeasurements, setTempMeasurements] = useState(measurements)
  const [showExportSuccess, setShowExportSuccess] = useState(false)

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

  const exportData = () => {
    const data = {
      measurements,
      stats,
      exportDate: new Date().toISOString(),
      wardrobeItems: JSON.parse(localStorage.getItem('wardrobe-items') || '[]'),
      outfits: JSON.parse(localStorage.getItem('wardrobe-outfits') || '[]')
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guarda-roupa-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 3000)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.measurements) {
          onMeasurementsChange(data.measurements)
          setTempMeasurements(data.measurements)
        }
        
        if (data.wardrobeItems) {
          localStorage.setItem('wardrobe-items', JSON.stringify(data.wardrobeItems))
        }
        
        if (data.outfits) {
          localStorage.setItem('wardrobe-outfits', JSON.stringify(data.outfits))
        }
        
        // Recarregar a página para aplicar os dados importados
        window.location.reload()
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('wardrobe-items')
      localStorage.removeItem('wardrobe-outfits')
      localStorage.removeItem('user-measurements')
      window.location.reload()
    }
  }

  const categoryData = [
    { key: 'tops', label: 'Blusas/Camisas', icon: '👕', count: stats.categories.tops, color: 'bg-blue-500' },
    { key: 'bottoms', label: 'Calças/Saias', icon: '👖', count: stats.categories.bottoms, color: 'bg-green-500' },
    { key: 'shoes', label: 'Sapatos', icon: '👟', count: stats.categories.shoes, color: 'bg-yellow-500' },
    { key: 'accessories', label: 'Acessórios', icon: '👜', count: stats.categories.accessories, color: 'bg-purple-500' }
  ]

  const maxCategoryCount = Math.max(...Object.values(stats.categories))

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-indigo-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalItems}</div>
              <div className="text-sm text-muted-foreground">Total de Peças</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalOutfits}</div>
              <div className="text-sm text-muted-foreground">Looks Criados</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{measurements.height}</div>
              <div className="text-sm text-muted-foreground">Altura (cm)</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{measurements.shoeSize}</div>
              <div className="text-sm text-muted-foreground">Nº do Sapato</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medidas Corporais */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Medidas Corporais
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditingMeasurements ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingMeasurements ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label>Altura (cm)</Label>
                    <Slider
                      value={[tempMeasurements.height]}
                      onValueChange={([value]) => handleMeasurementChange('height', value)}
                      min={140}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.height}cm</div>
                  </div>
                  
                  <div>
                    <Label>Peito (cm)</Label>
                    <Slider
                      value={[tempMeasurements.chest]}
                      onValueChange={([value]) => handleMeasurementChange('chest', value)}
                      min={70}
                      max={130}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.chest}cm</div>
                  </div>
                  
                  <div>
                    <Label>Cintura (cm)</Label>
                    <Slider
                      value={[tempMeasurements.waist]}
                      onValueChange={([value]) => handleMeasurementChange('waist', value)}
                      min={60}
                      max={120}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.waist}cm</div>
                  </div>
                  
                  <div>
                    <Label>Quadril (cm)</Label>
                    <Slider
                      value={[tempMeasurements.hips]}
                      onValueChange={([value]) => handleMeasurementChange('hips', value)}
                      min={70}
                      max={130}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.hips}cm</div>
                  </div>
                  
                  <div>
                    <Label>Largura dos Ombros (cm)</Label>
                    <Slider
                      value={[tempMeasurements.shoulderWidth]}
                      onValueChange={([value]) => handleMeasurementChange('shoulderWidth', value)}
                      min={30}
                      max={60}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">{tempMeasurements.shoulderWidth}cm</div>
                  </div>
                  
                  <div>
                    <Label>Número do Sapato</Label>
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
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={resetMeasurements} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Altura:</span>
                    <span className="font-medium">{measurements.height}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peito:</span>
                    <span className="font-medium">{measurements.chest}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cintura:</span>
                    <span className="font-medium">{measurements.waist}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quadril:</span>
                    <span className="font-medium">{measurements.hips}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ombros:</span>
                    <span className="font-medium">{measurements.shoulderWidth}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sapato:</span>
                    <span className="font-medium">{measurements.shoeSize}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas do Guarda-roupa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estatísticas do Guarda-roupa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map(category => (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
                <Progress 
                  value={maxCategoryCount > 0 ? (category.count / maxCategoryCount) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Progresso</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.totalItems > 0 && stats.totalOutfits > 0 ? (
                  `Você tem uma média de ${(stats.totalItems / Math.max(stats.totalOutfits, 1)).toFixed(1)} peças por look!`
                ) : stats.totalItems > 0 ? (
                  'Comece criando looks com suas peças!'
                ) : (
                  'Adicione suas primeiras peças ao guarda-roupa!'
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup e Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Backup e Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showExportSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                Backup exportado com sucesso! O arquivo foi baixado para seu dispositivo.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Exportar Dados</h4>
              <p className="text-sm text-muted-foreground">
                Faça backup de todas as suas peças, looks e medidas.
              </p>
              <Button onClick={exportData} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Backup
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Importar Dados</h4>
              <p className="text-sm text-muted-foreground">
                Restaure seus dados de um backup anterior.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Backup
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Limpar Dados</h4>
              <p className="text-sm text-muted-foreground">
                Remove todos os dados salvos permanentemente.
              </p>
              <Button 
                onClick={clearAllData} 
                variant="destructive" 
                className="w-full"
                disabled={stats.totalItems === 0 && stats.totalOutfits === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Tudo
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Todos os dados são salvos localmente no seu dispositivo.</p>
            <p>Faça backups regulares para não perder suas informações.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}