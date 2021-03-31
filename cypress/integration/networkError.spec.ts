describe('network error', () => {
  it('should handle network failures', () => {
    cy.intercept('api.php*', { forceNetworkError: true }).as('questions-request');
    
    cy.visit('http://127.0.0.1:8080');
    cy.waitForReact(2000, '#root');

    cy.react('Intro').click();

    cy.wait('@questions-request');
    cy.react('NetworkErrorIndicator').should('be.visible');
  });
  it('should handle network delays', () => {
    cy.intercept('api.php*', (req) => {
      req.reply((res) => {
        res.delay(3000);
      });
    }).as('questions-request');

    cy.visit('http://127.0.0.1:8080');
    cy.waitForReact(2000, '#root');

    cy.react('Intro').click();

    cy.wait(2000);
    cy.react('LoadingIndicator', { root: '#root' }).should('be.visible');
  });
  it('should allow the user to recover after a network error');
});
