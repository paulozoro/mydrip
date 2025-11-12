export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'it' | 'de'

export interface Translation {
  // App general
  appName: string
  appDescription: string
  
  // Navigation
  wardrobe: string
  mannequin: string
  outfits: string
  profile: string
  
  // Header
  pieces: string
  looks: string
  
  // Wardrobe Manager
  myWardrobe: string
  addPiece: string
  searchPlaceholder: string
  allCategories: string
  allSeasons: string
  addNewPiece: string
  piecePhoto: string
  gallery: string
  camera: string
  pieceName: string
  pieceNamePlaceholder: string
  category: string
  mainColor: string
  selectColor: string
  appropriateSeasons: string
  tagsPlaceholder: string
  noPiecesFound: string
  noPiecesDescription: string
  adjustFilters: string
  startAdding: string
  addFirstPiece: string
  
  // Categories
  tops: string
  bottoms: string
  shoes: string
  accessories: string
  
  // Colors
  black: string
  white: string
  blue: string
  red: string
  green: string
  yellow: string
  pink: string
  purple: string
  brown: string
  gray: string
  
  // Seasons
  summer: string
  autumn: string
  winter: string
  spring: string
  
  // Virtual Mannequin
  virtualMannequin: string
  measurements: string
  height: string
  chest: string
  waist: string
  hips: string
  shoulderWidth: string
  armLength: string
  legLength: string
  shoeSize: string
  updateMeasurements: string
  tryOnClothes: string
  selectPieces: string
  
  // Outfit Combiner
  outfitCombiner: string
  createOutfit: string
  myOutfits: string
  outfitName: string
  outfitNamePlaceholder: string
  selectPiecesForOutfit: string
  createNewOutfit: string
  noOutfitsFound: string
  noOutfitsDescription: string
  createFirstOutfit: string
  
  // User Profile
  userProfile: string
  myMeasurements: string
  statistics: string
  totalPieces: string
  totalOutfits: string
  favoriteCategory: string
  recentActivity: string
  
  // Common
  save: string
  cancel: string
  delete: string
  edit: string
  close: string
  loading: string
  error: string
  success: string
  
  // Units
  cm: string
  size: string
}

export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  flag: string
  regions: string[]
}