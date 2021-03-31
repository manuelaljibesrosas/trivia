describe('main', () => {
  before(() => {
    cy.visit('http://127.0.0.1:8080');
    cy.waitForReact(2000, '#root');
  });
  it('should render', () => {
    cy.react('App').should('be.visible');
  });
  it('should play the game', () => {
    cy.react('Intro').click();
    cy.wait(3000);

    for (let i = 1; i <= 10; i++) {
      cy.wait(2000);
      cy.react('QuestionOption', { props: { label: 'True' } }).click();
    }

    cy.wait(4000);
    cy.react('Results').should('be.visible');
  });
  it(
    'should restart the game if the user taps the "Play Again" button',
    () => {
      cy.react('PlayAgainButton').click();

      cy.wait(3000);
      cy.react('Trivia').should('be.visible');
    },
  );
});
