import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('affiche le titre principal et la navigation', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(screen.getByRole('heading', { name: /projet memory/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /navigation principale/i })).toBeInTheDocument()
  })
})

