context('My First Test', () => {
  // beforeEach(() => {
  //   cy.visit('http://localhost:3000/api');
  // });

  // it('should have a title', () => {
  //   cy.title().should('include', 'Swagger UI');
  // });

  // describe('Auth Api', () => {
  it('should create a user', () => {
    cy.request('POST', 'http://localhost:3000/auth/register', {
      Email: 'testingCypress@email.com',
      Password: 'Password123',
      FullName: 'Test User',
      Roles: ['0', '1', '2', '3'],
    }).as('createUser');
    cy.get<{
      status: number;
      body: {
        token: string;
      };
    }>('@createUser').then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('token');
    });
  });
  // });
});
