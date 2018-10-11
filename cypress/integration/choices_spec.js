describe('Choices', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  describe('text element', () => {
    const textInput = 'testing';

    describe('choices enabled', () => {
      describe('adding choices', () => {
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

        describe('inputting data', () => {
          it('shows a dropdown prompt', () => {
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
                expect(dropdownText).to.equal(
                  `Press Enter to add "${textInput}"`,
                );
              });
          });
        });

        describe('input limit', () => {
          beforeEach(() => {
            for (let index = 0; index < 6; index++) {
              cy.get('.choices')
                .first()
                .find('.choices__input--cloned')
                .type(`${textInput} + ${index}`)
                .type('{enter}');
            }
          });

          it('does not let me input more than 5 choices', () => {
            cy.get('.choices')
              .first()
              .find('.choices__list--multiple')
              .first()
              .children()
              .should($items => {
                expect($items.length).to.equal(5);
              });
          });

          it('hides dropdown prompt once limit has been reached', () => {
            cy.get('.choices')
              .first()
              .find('.choices__list--dropdown')
              .should('not.be.visible');
          });
        });

        describe('unique values', () => {
          beforeEach(() => {
            cy.get('.choices')
              .eq(1) // second choices instance
              .find('.choices__input--cloned')
              .type(`${textInput}`)
              .type('{enter}')
              .type(`${textInput}`)
              .type('{enter}');
          });

          it('only allows me to input unique values', () => {
            cy.get('.choices')
              .eq(1)
              .find('.choices__list--multiple')
              .first()
              .children()
              .should($items => {
                expect($items.length).to.equal(1);
              });
          });

          describe('inputting a non-unique value', () => {
            it('displays dropdown prompt', () => {
              cy.get('.choices')
                .eq(1)
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal(
                    'Only unique values can be added.',
                  );
                });
            });
          });
        });
      });

      describe('removing choices', () => {
        beforeEach(() => {
          cy.get('.choices')
            .first() // second choices instance
            .find('.choices__input--cloned')
            .type(`${textInput}`)
            .type('{enter}')
            .type(`${textInput}`)
            .type('{enter}');
        });

        it('allows me to remove inputted choices', () => {
          cy.get('.choices')
            .first()
            .find('.choices__list--multiple')
            .first()
            .children()
            .should($items => {
              expect($items.length).to.equal(2);
            });

          cy.get('.choices')
            .first()
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('.choices')
            .first()
            .find('.choices__list--multiple')
            .first()
            .should($items => {
              expect($items.length).to.equal(1);
            });
        });
      });
    });

    describe('choices disabled', () => {
      it('does not allow me to input data', () => {
        cy.get('.choices')
          .eq(3)
          .find('.choices__input--cloned')
          .should('be.disabled');
      });
    });
  });

  describe('select-one element', () => {});

  describe('select-multiple element', () => {});
});
