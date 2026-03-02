describe('Parcours de base Projet Memory', () => {
  it('affiche la page d’accueil et la navigation', () => {
    cy.visit('/')
    cy.contains('h1', /projet memory/i).should('be.visible')
    cy.get('nav[aria-label="Navigation principale"]').within(() => {
      cy.contains('Accueil').should('be.visible')
      cy.contains('Catégories').should('be.visible')
      cy.contains('Thèmes').should('be.visible')
      cy.contains('Révision').should('be.visible')
    })
  })
})

