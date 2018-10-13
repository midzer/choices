describe('Choices - text element', () => {
  beforeEach(() => {
    cy.visit('/select-multiple.html');
  });

  describe('configs', () => {
    describe('basic', () => {
      describe('selecting choices', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .focus();
        });

        describe('focusing on text input', () => {
          const selectedChoiceText = 'Dropdown item 1';

          it('displays a dropdown of choices', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible');

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 4)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(
                  `Dropdown item ${index + 1}`,
                );
              });
          });

          it('allows me select choices from a dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          describe('selecting all available choices', () => {
            beforeEach(() => {
              for (let index = 0; index <= 4; index++) {
                cy.get('[data-test-hook=basic]')
                  .find('.choices__input--cloned')
                  .focus();

                cy.get('[data-test-hook=basic]')
                  .find('.choices__list--dropdown .choices__list')
                  .children()
                  .first()
                  .click();
              }
            });

            it('displays dropdown prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No choices to choose from');
                });
            });
          });

          it('removes selected choice from dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .each($choice => {
                expect($choice.text().trim()).to.not.equal(selectedChoiceText);
              });
          });

          describe('pressing escape', () => {
            beforeEach(() => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('{esc}');
            });

            it('closes the dropdown', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('not.be.visible');
            });

            describe('typing more into the input', () => {
              it('re-opens the dropdown', () => {
                cy.get('[data-test-hook=basic]')
                  .find('.choices__input--cloned')
                  .type('test');

                cy.get('[data-test-hook=basic]')
                  .find('.choices__list--dropdown')
                  .should('be.visible');
              });
            });
          });
        });
      });

      describe('removing choices', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .last()
            .click();
        });

        describe('pressing backspace', () => {
          it('removes last choice', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type('{backspace}');

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple')
              .children()
              .should('have.length', 0);
          });
        });

        describe('remove button', () => {
          it('removes last choice', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .find('.choices__button')
              .focus()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple')
              .children()
              .should('have.length', 0);
          });
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .click();
        });

        it('does not select choice', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--multiple .choices__item')
            .should('have.length', 0);
        });

        it('keeps choice dropdown open', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('be.visible');
        });
      });
    });
  });
});
