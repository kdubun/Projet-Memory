## Projet Memory – Application de mémorisation par répétition espacée

Application web React + TypeScript + Vite illustrant une application de répétition espacée.

### 1. Déploiement

- **Prérequis**:
  - Node.js LTS
  - npm
- **Installation des dépendances**:
  - `npm install`
- **Lancement en développement**:
  - `npm run dev`

### 2. Fonctionnalités implémentées

- **Shell d’application**:
  - Layout responsive avec en-tête, navigation principale, contenu et pied de page.
  - Navigation accessible vers les sections clés (Accueil, Catégories, Thèmes, Révision).
- **Fonctionnement hors-ligne (PWA)**:
  - Manifest PWA configuré (`public/manifest.webmanifest`).
  - Plugin `vite-plugin-pwa` configuré dans `vite.config.ts`.
- **Accessibilité**:
  - Lien d’évitement (« Aller au contenu principal »).
  - Navigation principale avec `aria-label`.
  - Focus visible et contrasté sur les boutons.
- **Données de test**:
  - Jeu de données de test pour catégories, thèmes et cartes, chargé automatiquement au premier démarrage et ré-initialisable via un bouton dédié sur la page d’accueil.

### 3. Architecture et organisation du code

- **Structure principale**:
  - `src/main.tsx`: point d’entrée React, montage de l’application.
  - `src/App.tsx`: shell principal (layout + navigation + section d’import des données de test).
  - `src/index.css`: styles globaux, layout et styles d’accessibilité.
  - `src/test-data/memorySeed.ts`: données de test + fonction d’import dans `localStorage`.
- **Outils et configuration**:
  - `vite.config.ts`: configuration Vite + plugin React + PWA.
  - `.storybook/`: configuration Storybook générée.
  - `cypress.config.ts` et `cypress/e2e/basic-flow.cy.ts`: configuration et premier test E2E.

### 4. Tests et qualité

- **Tests unitaires / d’intégration**:
  - Framework: `vitest` + `@testing-library/react`.
  - Exemple: `src/App.test.tsx` (vérifie la présence du titre principal et de la navigation).
  - Commandes:
    - `npm test` pour lancer les tests.
    - `npm test -- --coverage` pour générer un rapport de couverture (dossier `coverage/`).
- **Storybook**:
  - Framework: Storybook pour React + Vite.
  - Exemple: `src/App.stories.tsx` documente le shell de l’application.
  - Commandes:
    - `npm run storybook` pour lancer Storybook.
    - `npm run build-storybook` pour générer la version statique.
- **Tests E2E**:
  - Outil: Cypress.
  - Exemple: `cypress/e2e/basic-flow.cy.ts` (vérifie la page d’accueil et la navigation).
  - Commandes:
    - `npm run cy:open` pour l’UI Cypress.
    - `npm run cy:run` pour exécuter les tests en ligne de commande (captures dans `cypress/screenshots/`, vidéos éventuelles dans `cypress/videos/`).

### 5. Accessibilité et performance

- **Accessibilité**:
  - Structure sémantique (`header`, `nav`, `main`, `footer`).
  - Focus visible sur les éléments interactifs.
  - Navigation au clavier (Tab/Shift+Tab).
  - Storybook est configuré avec l’addon `@storybook/addon-a11y` pour aider aux audits.
  - **Rapport d’accessibilité (WAVE) :**
    - Page testée : page d’accueil.
    - Résultats WAVE :
     <img width="959" height="470" alt="Capture d’écran 2026-03-02 à 17 06 28" src="https://github.com/user-attachments/assets/078bac83-1c3a-4367-b179-dd5ebf0980f5" />

- **Performance**:
  - Vite + React pour un chargement rapide.
  - PWA configurée pour mise en cache des assets.
  - **Rapport Lighthouse :**
  - Page testée : page d’accueil.
  - Résultats WAVE :
   <img width="959" height="470" alt="Capture d’écran 2026-03-02 à 17 04 39" src="https://github.com/user-attachments/assets/53137639-18a9-4bff-a9ce-e3a40233604e" />

### 6. Données de test

- **Fichier de données**:
  - `src/test-data/memorySeed.ts` contient:
    - 2 catégories (« Langues », « Maths »),
    - 2 thèmes de base (par ex. « Anglais – vocabulaire de base », « Anglais – animaux »),
    - un ensemble réduit de cartes avec des emojis illustratifs.
- **Import des données de test**:
  - Au premier chargement, les données de test sont injectées automatiquement dans le `localStorage` si aucune donnée n’est présente.
  - Sur la page d’accueil, section « Données de test », cliquer sur le bouton **« Actualiser les données de test »** permet de ré-initialiser les données.
  - Les données sont stockées dans les clés:
    - `memory.categories`
    - `memory.themes`
    - `memory.cards`
  - Ces données peuvent ensuite être consommées par les écrans de gestion (catégories, thèmes, cartes) et de révision.
