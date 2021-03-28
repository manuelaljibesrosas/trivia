import React from 'react';
import { mount } from '@cypress/react';
// components
import App from 'screens/App';

describe('integration', () => {
  it('renders', () => {
    mount(<App />);

    // wait for the title to show up
    cy.wait(4000).then(() => {
      cy.contains(/super trivia app/i).should('be.visible');
    });
  });
  it('plays the game');
  it('handles network delays');
  it('handles network failures');
  it('allows the user to recover after a network error');
  it('can replay');
});
