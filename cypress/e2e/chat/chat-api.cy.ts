describe('Chat API Test', () => {
  it('should return a response from the API', () => {
    cy.request({
      method: 'POST',
      url: '/api/chat-widget',
      body: {
        chat_history: [
          { role: 'user', text: 'Hello' }
        ],
        language: 'en'
      },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.equal(200)

      if (typeof resp.body === 'string') {
        expect(resp.body).to.contain('user testing')
        return
      }

      const candidate =
        resp.body?.response?.content ||
        resp.body?.content ||
        resp.body?.message ||
        resp.body

      expect(candidate).to.satisfy((val: any) => typeof val === 'string' && val.length > 0)
    })
  })
})