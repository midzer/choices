describe('Choices (text input)', () => {
  context('Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001');
    });

    it('cy.screenshot() - take a screenshot', () => {
      // https://on.cypress.io/screenshot
      cy.screenshot('my-image');
    });
  });
});
