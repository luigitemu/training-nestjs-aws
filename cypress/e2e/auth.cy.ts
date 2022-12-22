import { CreateUserResponse } from './interfaces/interfaces';

let newUser: CreateUserResponse['body'];
context('Testing Auth', () => {
  const email = `cypressUser${Math.floor(Math.random() * 1000)}@mail.com`;
  const password = 'Password123';
  it('should create a user', () => {
    cy.request('POST', 'http://localhost:3000/auth/register', {
      email,
      password,
      fullName: 'Test User',
      roles: ['0', '1', '2', '3'],
    }).as('createUser');
    cy.get<CreateUserResponse>('@createUser').then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('token');

      newUser = response.body;
    });
  });

  it('should login a user', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/login',
      body: {
        email,
        password: 'wrongPassword',
      },
      failOnStatusCode: false,
    }).as('loginUserFail');
    cy.get<{
      status: number;
    }>('@loginUserFail').then((response) => {
      expect(response.status).to.eq(401);
    });

    cy.request('POST', 'http://localhost:3000/auth/login', {
      email,
      password,
    }).as('loginUser');

    cy.get<{
      status: number;
      body: {
        token: string;
      };
    }>('@loginUser').then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('token');
    });
  });
});
