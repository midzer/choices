describe('Choices - text element', () => {
  beforeEach(() => {
    cy.visit('/text.html');
  });

  describe('configs', () => {
    const textInput = 'testing';

    describe('basic', () => {
      describe('adding choices', () => {
        it('allows me to input choices', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should($el => {
              expect($el).to.contain(textInput);
            });
        });

        it('updates the value of the original input', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__input.is-hidden')
            .should('have.value', textInput);
        });

        describe('inputting data', () => {
          it('shows a dropdown prompt', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type(textInput);

            cy.get('[data-test-hook=basic]')
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
      });

      describe('removing choices', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(`${textInput}`)
            .type('{enter}')
            .type(`${textInput}`)
            .type('{enter}');
        });

        it('allows me to remove inputted choices', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple')
            .children()
            .should($items => {
              expect($items.length).to.equal(2);
            });

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple')
            .first()
            .should($items => {
              expect($items.length).to.equal(1);
            });
        });
      });
    });

    describe('unique values only', () => {
      describe('unique values', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__input--cloned')
            .type(`${textInput}`)
            .type('{enter}')
            .type(`${textInput}`)
            .type('{enter}');
        });

        it('only allows me to input unique values', () => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__list--multiple')
            .first()
            .children()
            .should($items => {
              expect($items.length).to.equal(1);
            });
        });

        describe('inputting a non-unique value', () => {
          it('displays dropdown prompt', () => {
            cy.get('[data-test-hook=unique-values]')
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

    describe('input limit', () => {
      beforeEach(() => {
        for (let index = 0; index < 6; index++) {
          cy.get('[data-test-hook=input-limit]')
            .find('.choices__input--cloned')
            .type(`${textInput} + ${index}`)
            .type('{enter}');
        }
      });

      it('does not let me input more than 5 choices', () => {
        cy.get('[data-test-hook=input-limit]')
          .find('.choices__list--multiple')
          .first()
          .children()
          .should($items => {
            expect($items.length).to.equal(5);
          });
      });

      it('hides dropdown prompt once limit has been reached', () => {
        cy.get('[data-test-hook=input-limit]')
          .find('.choices__list--dropdown')
          .should('not.be.visible');
      });
    });

    describe('regex filter', () => {
      describe('a valid that satisfies regex', () => {
        const input = 'joe@bloggs.com';

        it('allows me to add choice', () => {
          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__input--cloned')
            .type(input)
            .type('{enter}');

          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__list .choices__item')
            .last()
            .should($choice => {
              expect($choice).to.contain(input);
            });
        });
      });

      describe('inputting a value that does not satisfy the regex', () => {
        it('displays dropdown prompt', () => {
          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__input--cloned')
            .type(`this is not an email address`)
            .type('{enter}');

          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('prepend/append', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .type(textInput)
          .type('{enter}');
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(`before-${textInput}-after`);
          });
      });
    });

    describe('disabled', () => {
      it('does not allow me to input data', () => {
        cy.get('[data-test-hook=disabled]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });
    });
  });
});
