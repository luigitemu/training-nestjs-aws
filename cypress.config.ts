import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      // implement environment variables here
      email: 'cypressUser@mail.com',
      userComment: 'cypressUserComment@mail.com',
      userFile: 'cypressUserFiles@mail.com',
      superUser: 'cypressSuperUser@mail.com',
      password: 'Password123',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
