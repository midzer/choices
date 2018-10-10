describe('Choices', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('text element', () => {
    describe('adding choices', () => {
      const textInput = 'testing';

      it('shows a dropdown prompt when inputting data', () => {
        cy.get('.choices')
          .first()
          .find('.choices__input--cloned')
          .type(textInput);

        cy.get('.choices')
          .first()
          .find('.choices__list--dropdown')
          .should('be.visible')
          .should($dropdown => {
            const dropdownText = $dropdown.text().trim();
            expect(dropdownText).to.equal(`Press Enter to add "${textInput}"`);
          });
      });

      it('allows me to input choices', () => {
        cy.get('.choices')
          .first()
          .find('.choices__input--cloned')
          .type(textInput)
          .type('{enter}');

        cy.get('.choices')
          .first()
          .find('.choices__list .choices__item')
          .last()
          .should($el => {
            expect($el).to.contain(textInput);
          });
      });

      describe('input limit', () => {
        it('does not let me input more than 5 choices', () => {
          for (let index = 0; index < 6; index++) {
            cy.get('.choices')
              .first()
              .find('.choices__input--cloned')
              .type(`${textInput} + ${index}`)
              .type('{enter}');
          }

          cy.get('.choices')
            .first()
            .find('.choices__list')
            .first()
            .children()
            .should($items => {
              expect($items.length).to.equal(5);
            });
        });
      });

      describe.skip('unique values', () => {
        it('only allows me to input unique values', () => {
          cy.get('.choices')
            .eq(1) // second choices instance
            .find('.choices__list .choices__item')
            .should($choices => {
              expect($choices.length).to.equal(0);
            });
        });
      });
    });

    describe('removing choices', () => {
      it('allows me to remove inputted choices', () => {
        cy.get('.choices')
          .first()
          .find('.choices__list')
          .first()
          .children()
          .should($items => {
            expect($items.length).to.equal(2);
          });

        cy.get('.choices')
          .first()
          .find('.choices__list .choices__item')
          .last()
          .find('.choices__button')
          .focus()
          .click();

        cy.get('.choices')
          .first()
          .find('.choices__list')
          .first()
          .should($items => {
            expect($items.length).to.equal(1);
          });
      });
    });
  });

  describe('select-one element', () => {});

  describe('select-multiple element', () => {});
});
