import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      // implement environment variables here
      email: 'cypressUser@mail.com',
      password: 'Password123',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
