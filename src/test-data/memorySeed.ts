export interface SeedCategory {
  id: string
  name: string
  description?: string
}

export interface SeedTheme {
  id: string
  categoryId: string
  title: string
  description?: string
  levelCount?: number
  newPerDay?: number
}

export interface SeedCard {
  id: string
  themeId: string
  front: string
  back: string
  emoji?: string
}

export interface MemorySeedData {
  categories: SeedCategory[]
  themes: SeedTheme[]
  cards: SeedCard[]
}

const theme1Words: Array<{ id: string; front: string; back: string; emoji: string }> = [
  { id: 'card-hello', front: 'Hello', back: 'Bonjour', emoji: '👋' },
  { id: 'card-goodbye', front: 'Goodbye', back: 'Au revoir', emoji: '👋' },
  { id: 'card-please', front: 'Please', back: 'S’il vous plaît', emoji: '🙏' },
  { id: 'card-thank-you', front: 'Thank you', back: 'Merci', emoji: '😊' },
  { id: 'card-house', front: 'House', back: 'Maison', emoji: '🏠' },
  { id: 'card-car', front: 'Car', back: 'Voiture', emoji: '🚗' },
  { id: 'card-water', front: 'Water', back: 'Eau', emoji: '💧' },
  { id: 'card-bread', front: 'Bread', back: 'Pain', emoji: '🍞' },
  { id: 'card-school', front: 'School', back: 'École', emoji: '🏫' },
  { id: 'card-book', front: 'Book', back: 'Livre', emoji: '📚' },
]

const theme2Words: Array<{ id: string; front: string; back: string; emoji: string }> = [
  { id: 'card-dog2', front: 'Big dog', back: 'Gros chien', emoji: '🐶' },
  { id: 'card-cat2', front: 'Little cat', back: 'Petit chat', emoji: '🐱' },
  { id: 'card-horse', front: 'Horse', back: 'Cheval', emoji: '🐴' },
  { id: 'card-cow', front: 'Cow', back: 'Vache', emoji: '🐮' },
  { id: 'card-sheep', front: 'Sheep', back: 'Mouton', emoji: '🐑' },
  { id: 'card-pig', front: 'Pig', back: 'Cochon', emoji: '🐷' },
  { id: 'card-chicken', front: 'Chicken', back: 'Poulet', emoji: '🐔' },
  { id: 'card-duck', front: 'Duck', back: 'Canard', emoji: '🦆' },
  { id: 'card-fish', front: 'Fish', back: 'Poisson', emoji: '🐟' },
  { id: 'card-shark', front: 'Shark', back: 'Requin', emoji: '🦈' },
]

export const memorySeedData: MemorySeedData = {
  categories: [
    {
      id: 'cat-langues',
      name: 'Langues',
      description: 'Apprentissage des langues étrangères',
    },
    {
      id: 'cat-maths',
      name: 'Maths',
      description: 'Révision de notions de mathématiques',
    },
  ],
  themes: [
    {
      id: 'theme-anglais-debutant',
      categoryId: 'cat-langues',
      title: 'Anglais - vocabulaire de base',
      description: 'Mots du quotidien en anglais',
      levelCount: 3,
      newPerDay: 5,
    },
    {
      id: 'theme-anglais-animaux',
      categoryId: 'cat-langues',
      title: 'Anglais - animaux',
      description: 'Animaux en anglais',
      levelCount: 3,
      newPerDay: 5,
    },
  ],
  cards: [
    ...theme1Words.map<SeedCard>((word) => ({
      id: word.id,
      themeId: 'theme-anglais-debutant',
      front: word.front,
      back: word.back,
      emoji: word.emoji,
    })),
    ...theme2Words.map<SeedCard>((word) => ({
      id: word.id,
      themeId: 'theme-anglais-animaux',
      front: word.front,
      back: word.back,
      emoji: word.emoji,
    })),
  ],
}

export function importMemorySeedData() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }

  window.localStorage.setItem('memory.categories', JSON.stringify(memorySeedData.categories))
  window.localStorage.setItem('memory.themes', JSON.stringify(memorySeedData.themes))
  window.localStorage.setItem('memory.cards', JSON.stringify(memorySeedData.cards))
}

export function ensureMemorySeedData() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }

  try {
    const rawCategories = window.localStorage.getItem('memory.categories')
    const parsedCategories = rawCategories ? (JSON.parse(rawCategories) as unknown[]) : []
    if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
      importMemorySeedData()
    }
  } catch {
    importMemorySeedData()
  }
}

