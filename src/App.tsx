import './App.css'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Routes, Route } from 'react-router-dom'
import { memorySeedData, importMemorySeedData, ensureMemorySeedData } from './test-data/memorySeed'

type Category = {
  id: string
  name: string
  description?: string
}

type Theme = {
  id: string
  categoryId: string
  title: string
  description?: string
  levelCount?: number
  newPerDay?: number
}

type Card = {
  id: string
  themeId: string
  front: string
  back: string
  emoji?: string
  level?: number
}

const STORAGE_KEYS = {
  categories: 'memory.categories',
  themes: 'memory.themes',
  cards: 'memory.cards',
} as const

function loadArray<T>(key: string): T[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function saveArray<T>(key: string, items: T[]) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function HomePage() {
  return (
    <>
      <section aria-labelledby="intro-title">
        <h2 id="intro-title">Bienvenue</h2>
        <p>
          Point de départ : la structure de navigation et les fonctionnalités hors-ligne sont en place. Les écrans
          détaillés (catégories, thèmes, cartes, révision) pourront consommer les données stockées localement.
        </p>
        <p>
          Commencez par aller sur la page <Link to="/categories">Catégories</Link> pour créer votre première
          organisation.
        </p>
      </section>

      <section aria-labelledby="seed-data-title">
        <h2 id="seed-data-title">Données de test</h2>
        <p>
          Vous pouvez réinitialiser le jeu de données de test (catégories, thèmes, cartes) dans le{' '}
          <code>localStorage</code> pour repartir d&apos;une base propre.
        </p>
        <button type="button" onClick={importMemorySeedData}>
          Actualiser les données de test
        </button>
        <p>
          Ce jeu comprend{' '}
          <strong>
            {memorySeedData.categories.length} catégorie(s), {memorySeedData.themes.length} thème(s) et{' '}
            {memorySeedData.cards.length} carte(s)
          </strong>
          .
        </p>
      </section>
    </>
  )
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  useEffect(() => {
    setCategories(loadArray<Category>(STORAGE_KEYS.categories))
  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    if (editingCategoryId) {
      const updated = categories.map((category) =>
        category.id === editingCategoryId
          ? {
              ...category,
              name: trimmedName,
              description: description.trim() || undefined,
            }
          : category,
      )
      setCategories(updated)
      saveArray(STORAGE_KEYS.categories, updated)
      setEditingCategoryId(null)
      setName('')
      setDescription('')
      return
    }

    const next: Category = {
      id: createId(),
      name: trimmedName,
      description: description.trim() || undefined,
    }

    const updated = [...categories, next]
    setCategories(updated)
    saveArray(STORAGE_KEYS.categories, updated)
    setName('')
    setDescription('')
  }

  function handleDeleteCategory(id: string) {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Supprimer cette catégorie ?')
    if (!confirmed) return

    const updated = categories.filter((category) => category.id !== id)
    setCategories(updated)
    saveArray(STORAGE_KEYS.categories, updated)
  }

  function handleEditCategory(category: Category) {
    setEditingCategoryId(category.id)
    setName(category.name)
    setDescription(category.description ?? '')
    setShowForm(true)
  }

  return (
    <section aria-labelledby="categories-title">
      <div className="section-header">
        <div>
          <h2 id="categories-title">Catégories</h2>
          <p>Créez et consultez vos catégories de thèmes.</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? 'Fermer' : 'Créer une catégorie'}
        </button>
      </div>

      <div className="section-layout">
        <div className="section-main">
          <h3>Catégories existantes</h3>
          {categories.length === 0 ? (
            <p>Aucune catégorie pour le moment.</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="list-item">
                  <div>
                    <strong>{category.name}</strong>
                    {category.description ? <span> – {category.description}</span> : null}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleEditCategory(category)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="ghost-button danger"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showForm && (
          <aside className="section-side" aria-label="Créer une catégorie">
            <h3>{editingCategoryId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="category-name">Nom de la catégorie</label>
                <input
                  id="category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="category-description">Description (optionnelle)</label>
                <textarea
                  id="category-description"
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <button type="submit">
                {editingCategoryId ? 'Enregistrer les modifications' : 'Ajouter la catégorie'}
              </button>
            </form>
          </aside>
        )}
      </div>
    </section>
  )
}

function ThemesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [themes, setThemes] = useState<Theme[]>([])

  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [levelCount, setLevelCount] = useState(3)
  const [newPerDay, setNewPerDay] = useState(5)
  const [showForm, setShowForm] = useState(false)
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null)

  useEffect(() => {
    setCategories(loadArray<Category>(STORAGE_KEYS.categories))
    setThemes(loadArray<Theme>(STORAGE_KEYS.themes))
  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!categoryId) return
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    if (editingThemeId) {
      const updated = themes.map((theme) =>
        theme.id === editingThemeId
          ? {
              ...theme,
              categoryId,
              title: trimmedTitle,
              description: description.trim() || undefined,
              levelCount,
              newPerDay,
            }
          : theme,
      )
      setThemes(updated)
      saveArray(STORAGE_KEYS.themes, updated)
      setEditingThemeId(null)
      return
    }

    const next: Theme = {
      id: createId(),
      categoryId,
      title: trimmedTitle,
      description: description.trim() || undefined,
      levelCount,
      newPerDay,
    }

    const updated = [...themes, next]
    setThemes(updated)
    saveArray(STORAGE_KEYS.themes, updated)
    setTitle('')
    setDescription('')
  }

  function handleDeleteTheme(id: string) {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Supprimer ce thème ?')
    if (!confirmed) return

    const updated = themes.filter((theme) => theme.id !== id)
    setThemes(updated)
    saveArray(STORAGE_KEYS.themes, updated)
  }

  function handleEditTheme(theme: Theme) {
    setEditingThemeId(theme.id)
    setCategoryId(theme.categoryId)
    setTitle(theme.title)
    setDescription(theme.description ?? '')
    setLevelCount(theme.levelCount ?? 3)
    setNewPerDay(theme.newPerDay ?? 5)
    setShowForm(true)
  }

  return (
    <section aria-labelledby="themes-title">
      <div className="section-header">
        <div>
          <h2 id="themes-title">Thèmes</h2>
          <p>Créez des thèmes rattachés à vos catégories.</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setShowForm((value) => !value)}
          disabled={categories.length === 0}
        >
          {categories.length === 0 ? 'Ajoutez une catégorie avant' : showForm ? 'Fermer' : 'Créer un thème'}
        </button>
      </div>

      <div className="section-layout">
        <div className="section-main">
          <h3>Thèmes existants</h3>
          {themes.length === 0 ? (
            <p>Aucun thème pour le moment.</p>
          ) : (
            <ul>
              {themes.map((theme) => (
                <li key={theme.id} className="list-item">
                  <div>
                    <strong>{theme.title}</strong>
                    {theme.description ? <span> – {theme.description}</span> : null}
                    <div>
                      Catégorie :{' '}
                      {categories.find((category) => category.id === theme.categoryId)?.name ?? 'Inconnue'}
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      Niveaux : {theme.levelCount ?? 3} • Nouvelles cartes / jour : {theme.newPerDay ?? 5}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleEditTheme(theme)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="ghost-button danger"
                      onClick={() => handleDeleteTheme(theme.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showForm && categories.length > 0 && (
          <aside className="section-side" aria-label="Créer un thème">
            <h3>{editingThemeId ? 'Modifier le thème' : 'Nouveau thème'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="theme-category">Catégorie</label>
                <select
                  id="theme-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                >
                  <option value="">Choisir une catégorie…</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="theme-title">Titre du thème</label>
                <input
                  id="theme-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="theme-description">Description (optionnelle)</label>
                <textarea
                  id="theme-description"
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="theme-levels">Nombre de niveaux</label>
                <input
                  id="theme-levels"
                  type="number"
                  min={1}
                  max={10}
                  value={levelCount}
                  onChange={(event) => setLevelCount(Number(event.target.value) || 1)}
                />
              </div>
              <div>
                <label htmlFor="theme-new-per-day">Nouvelles cartes / jour</label>
                <input
                  id="theme-new-per-day"
                  type="number"
                  min={1}
                  max={50}
                  value={newPerDay}
                  onChange={(event) => setNewPerDay(Number(event.target.value) || 1)}
                />
              </div>
              <button type="submit">
                {editingThemeId ? 'Enregistrer les modifications' : 'Ajouter le thème'}
              </button>
            </form>
          </aside>
        )}
      </div>
    </section>
  )
}

function ReviewPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    setThemes(loadArray<Theme>(STORAGE_KEYS.themes))
    setCards(loadArray<Card>(STORAGE_KEYS.cards))
  }, [])

  const selectedTheme = themes.find((theme) => theme.id === selectedThemeId)
  const levelLimit = selectedTheme?.levelCount ?? 3
  const newPerDay = selectedTheme?.newPerDay ?? 5

  const cardsForTheme = cards.filter((card) => card.themeId === selectedThemeId)
  const sortedCards = [...cardsForTheme].sort(
    (a, b) => (b.level ?? 1) - (a.level ?? 1),
  )
  const sessionCards = sortedCards.slice(0, newPerDay)
  const currentCard = sessionCards[currentIndex] ?? null

  function handleNextCard() {
    if (!currentCard) return

    // Met à jour le niveau de la carte (simple système de niveaux)
    const updatedCards = cards.map((card) =>
      card.id === currentCard.id
        ? {
            ...card,
            level: Math.min(levelLimit, (card.level ?? 1) + 1),
          }
        : card,
    )
    setCards(updatedCards)
    saveArray(STORAGE_KEYS.cards, updatedCards)

    if (sessionCards.length === 0) return
    setCurrentIndex((index) => (index + 1) % sessionCards.length)
    setShowBack(false)
  }

  function toggleFlip() {
    if (!currentCard) return
    setShowBack((value) => !value)
  }

  return (
    <section aria-labelledby="review-title">
      <div className="section-header">
        <div>
          <h2 id="review-title">Révision</h2>
          <p>Sélectionnez un thème puis révisez les cartes une par une.</p>
        </div>
      </div>

      {themes.length === 0 ? (
        <p>
          Aucun thème trouvé. Créez d&apos;abord une catégorie et un thème, ou utilisez le bouton d&apos;import des
          données de test sur la page d&apos;accueil.
        </p>
      ) : (
        <>
          <div className="review-controls">
            <div>
              <label htmlFor="review-theme">Thème à réviser</label>
              <select
                id="review-theme"
                value={selectedThemeId}
                onChange={(event) => {
                  setSelectedThemeId(event.target.value)
                  setCurrentIndex(0)
                  setShowBack(false)
                }}
              >
                <option value="">Choisir un thème…</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedThemeId === '' ? (
            <p>Choisissez un thème pour commencer la révision.</p>
          ) : sessionCards.length === 0 ? (
            <p>Aucune carte pour ce thème pour le moment.</p>
          ) : (
            <div className="review-card">
              <p>
                Carte {currentIndex + 1} sur {sessionCards.length}
              </p>

              <p className="review-hint">Cliquez sur la carte pour la retourner.</p>

              <button
                type="button"
                className={`flashcard-button ${showBack ? 'is-flipped' : ''}`}
                onClick={toggleFlip}
                aria-label={showBack ? 'Afficher le recto' : 'Afficher le verso'}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-face flashcard-front">
                    <h3>Recto</h3>
                    {currentCard?.emoji && <div className="flashcard-emoji">{currentCard.emoji}</div>}
                    <p>{currentCard?.front}</p>
                  </div>
                  <div className="flashcard-face flashcard-back">
                    <h3>Verso</h3>
                    {currentCard?.emoji && <div className="flashcard-emoji">{currentCard.emoji}</div>}
                    <p>{currentCard?.back}</p>
                  </div>
                </div>
              </button>

              {sessionCards.length > 1 && (
                <button type="button" className="ghost-button" onClick={handleNextCard}>
                  Carte suivante
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function CardsPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState('')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [emoji, setEmoji] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setThemes(loadArray<Theme>(STORAGE_KEYS.themes))
    setCards(loadArray<Card>(STORAGE_KEYS.cards))
  }, [])

  const filteredCards = selectedThemeId
    ? cards.filter((card) => card.themeId === selectedThemeId)
    : cards

  function resetForm() {
    setFront('')
    setBack('')
    setEmoji('')
    setEditingId(null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!selectedThemeId) return
    const trimmedFront = front.trim()
    const trimmedBack = back.trim()
    if (!trimmedFront || !trimmedBack) return

    if (editingId) {
      const updated = cards.map((card) =>
        card.id === editingId
          ? {
              ...card,
              front: trimmedFront,
              back: trimmedBack,
              emoji: emoji.trim() || undefined,
            }
          : card,
      )
      setCards(updated)
      saveArray(STORAGE_KEYS.cards, updated)
      resetForm()
      return
    }

    const next: Card = {
      id: createId(),
      themeId: selectedThemeId,
      front: trimmedFront,
      back: trimmedBack,
      emoji: emoji.trim() || undefined,
    }

    const updated = [...cards, next]
    setCards(updated)
    saveArray(STORAGE_KEYS.cards, updated)
    resetForm()
  }

  function handleDeleteCard(id: string) {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Supprimer cette carte ?')
    if (!confirmed) return

    const updated = cards.filter((card) => card.id !== id)
    setCards(updated)
    saveArray(STORAGE_KEYS.cards, updated)
  }

  function handleEditCard(card: Card) {
    setEditingId(card.id)
    setSelectedThemeId(card.themeId)
    setFront(card.front)
    setBack(card.back)
    setEmoji(card.emoji ?? '')
    setShowForm(true)
  }

  return (
    <section aria-labelledby="cards-title">
      <div className="section-header">
        <div>
          <h2 id="cards-title">Cartes</h2>
          <p>Consultez, créez, modifiez et supprimez les cartes de vos thèmes.</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setShowForm((value) => !value)}
          disabled={themes.length === 0}
        >
          {themes.length === 0 ? 'Ajoutez un thème avant' : showForm ? 'Fermer le panneau' : 'Créer une carte'}
        </button>
      </div>

      <div className="section-layout">
        <div className="section-main">
          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="cards-theme-filter">Filtrer par thème</label>
            <select
              id="cards-theme-filter"
              value={selectedThemeId}
              onChange={(event) => {
                setSelectedThemeId(event.target.value)
                setEditingId(null)
              }}
            >
              <option value="">Tous les thèmes</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
          </div>

          <h3>Cartes existantes</h3>
          {filteredCards.length === 0 ? (
            <p>Aucune carte pour l’instant.</p>
          ) : (
            <ul>
              {filteredCards.map((card) => {
                const theme = themes.find((t) => t.id === card.themeId)
                return (
                  <li key={card.id} className="list-item">
                    <div>
                      <div>
                        <strong>{card.front}</strong> → {card.back}{' '}
                        {card.emoji ? <span aria-hidden="true">{card.emoji}</span> : null}
                      </div>
                      {theme ? <div style={{ fontSize: '0.85rem' }}>Thème : {theme.title}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleEditCard(card)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {showForm && themes.length > 0 && (
          <aside className="section-side" aria-label="Créer ou modifier une carte">
            <h3>{editingId ? 'Modifier la carte' : 'Nouvelle carte'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="card-theme">Thème</label>
                <select
                  id="card-theme"
                  value={selectedThemeId}
                  onChange={(event) => setSelectedThemeId(event.target.value)}
                  required
                >
                  <option value="">Choisir un thème…</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="card-front">Recto (mot ou phrase)</label>
                <input
                  id="card-front"
                  value={front}
                  onChange={(event) => setFront(event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="card-back">Verso (traduction)</label>
                <input
                  id="card-back"
                  value={back}
                  onChange={(event) => setBack(event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="card-emoji">Emoji (optionnel)</label>
                <input
                  id="card-emoji"
                  value={emoji}
                  onChange={(event) => setEmoji(event.target.value)}
                  placeholder="🐶"
                />
              </div>
              <button type="submit">{editingId ? 'Enregistrer les modifications' : 'Créer la carte'}</button>
            </form>
          </aside>
        )}
      </div>
    </section>
  )
}

function App() {
  useEffect(() => {
    ensureMemorySeedData()
  }, [])

  return (
    <div className="app-root app-shell">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <header className="app-header">
        <div>
          <h1>Projet Memory</h1>
          <p aria-label="Description de l’application">
            Révisez vos cartes avec la répétition espacée.
          </p>
        </div>
        <nav className="app-nav" aria-label="Navigation principale">
          <ul>
            <li>
              <NavLink to="/" aria-label="Tableau de bord">
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories">Catégories</NavLink>
            </li>
            <li>
              <NavLink to="/themes">Thèmes</NavLink>
            </li>
            <li>
              <NavLink to="/cards">Cartes</NavLink>
            </li>
            <li>
              <NavLink to="/review">Révision</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/themes" element={<ThemesPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </main>
      <footer className="app-footer" aria-label="Pied de page">
        <span>Projet Memory – démonstration de répétition espacée.</span>
      </footer>
    </div>
  )
}

export default App
