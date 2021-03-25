// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
	it('Visits the app root url', () => {
		cy.visit(`${Cypress.env('HOST') || 'localhost'}:8080`);
		cy.contains('h1', 'Welcome to Your Vue.js App');
	});
});
