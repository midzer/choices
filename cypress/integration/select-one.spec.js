describe('Choices - select one', () => {
  beforeEach(() => {
    cy.visit('/select-one.html');
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
              .find('.choices__list--single .choices__item')
              .last()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          it('does not remove selected choice from dropdown list', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
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

        describe('remove button', () => {
          it('removes last choice', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--single .choices__item')
              .last()
              .find('.choices__button')
              .focus()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--single')
              .children()
              .should('have.length', 0);
          });
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        let selectedChoiceText;

        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]').click();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .then($choice => {
              selectedChoiceText = $choice.text().trim();
            })
            .click();
        });

        it('does not change selected choice', () => {
          cy.get('[data-test-hook=prepend-append]')
            .find('.choices__list--single .choices__item')
            .last()
            .should($choice => {
              expect($choice.text()).to.not.contain(selectedChoiceText);
            });
        });

        it('closes the dropdown list', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('prepend/append', () => {
      let selectedChoiceText;

      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .then($choice => {
            selectedChoiceText = $choice.text().trim();
          })
          .click();
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(
              `before-${selectedChoiceText}-after`,
            );
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.text()).to.not.contain(
              `before-${selectedChoiceText}-after`,
            );
            expect($choice.text()).to.contain(selectedChoiceText);
          });
      });
    });
  });
});
