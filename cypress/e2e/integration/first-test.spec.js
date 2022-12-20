context('My First Test', () => {
  beforeEach(() => {
    cy.visit('https://localhost:3000/api');
  });

  it('should have a title', () => {
    cy.title().should('include', 'Swagger UI');
  });
});
