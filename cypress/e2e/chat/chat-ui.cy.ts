describe('Frontend Chat Widget Test', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('should open the chat widget when the button is clicked', () => {
    cy.get('.kalibry-chat-launcher').click()
    cy.get('.kalibry-chat-popup').should('be.visible')
  })

  it('should close the chat widget when the close button is clicked', () => {
    cy.get('.kalibry-chat-launcher').click()
    cy.get('.kalibry-chat-header-button').click()
    cy.get('.kalibry-chat-popup').should('not.exist')
  })

  it('should not close the chat widget when clicking outside', () => {
    cy.get('.kalibry-chat-launcher').click()
    cy.get('body').click(0, 0)
    cy.get('.kalibry-chat-popup').should('be.visible')
  })

 it('should display a response when a message is sent', () => {
    cy.get('.kalibry-chat-launcher').click()

    cy.intercept('POST', '/api/chat-widget', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-type': 'text/plain' },
        body: 'user testing'
      })
    }).as('chatAPI')

    cy.get('.kalibry-chat-input-field').type('Hello{enter}')

    cy.get('.kalibry-chat-message-bubble').last().should('contain.text', 'user testing')
  })

})


