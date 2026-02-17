describe('Chat Error Test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows a friendly error when the backend returns 500', () => {
    cy.get('.kalibry-chat-launcher').click()

    cy.intercept('POST', '/api/chat-widget', (req) => {
      req.reply({
        statusCode: 500,
        headers: { 'content-type': 'text/plain' },
        body: 'Internal Server Error'
      })
    }).as('chatAPI500')

    cy.get('.kalibry-chat-input-field').type('Hello{enter}')
    cy.wait('@chatAPI500')

    cy.contains('.kalibry-chat-message-bubble', 'Sorry, something went wrong. Please try again.', { timeout: 10000 })
      .should('be.visible')
  })

  it('shows a friendly error when the network fails', () => {
    cy.get('.kalibry-chat-launcher').click()

    cy.intercept('POST', '/api/chat-widget', (req) => {
      req.reply({ forceNetworkError: true })
    }).as('chatAPINetworkFail')

    cy.get('.kalibry-chat-input-field').type('Hello{enter}')
    cy.wait('@chatAPINetworkFail')

    cy.contains('.kalibry-chat-message-bubble', 'Sorry, something went wrong. Please try again.', { timeout: 10000 })
      .should('be.visible')
  })
})