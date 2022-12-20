import { CreateUserResponse } from './interfaces/interfaces';

context('Files', () => {
  let user: CreateUserResponse['body'];
  before(() => {
    cy.request('POST', '/auth/login', {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
    })
      .its('body')
      .then((res) => {
        user = res;
      });
  });

  beforeEach(() => {
    window.localStorage.setItem('token', user.token);
  });
  describe('upload', () => {
    it('should upload a file', () => {
      cy.request({
        method: 'POST',
        url: '/file',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: {
          file: 'test',
        },
        failOnStatusCode: false,
      }).as('uploadFileFail');

      cy.get<{
        status: number;
      }>('@uploadFileFail').then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
