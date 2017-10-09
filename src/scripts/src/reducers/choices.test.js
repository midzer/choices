import { expect } from 'chai';
import choices, { defaultState } from './choices';

describe('choices reducer', () => {
  it('should return same state when no action matches', () => {
    expect(choices(defaultState, {})).to.equal(defaultState);
  });

  describe('when choices do not exist', () => {
    describe('ADD_CHOICE', () => {
      it('adds choice', () => {
        const value = 'test';
        const label = 'test';
        const id = 'test';
        const groupId = 'test';
        const disabled = false;
        const elementId = 'test';
        const customProperties = 'test';
        const placeholder = 'test';

        const actualResponse = choices(undefined, {
          type: 'ADD_CHOICE',
          value,
          label,
          id,
          groupId,
          disabled,
          elementId,
          customProperties,
          placeholder,
        });

        const expectedResponse = [
          {
            value,
            label,
            id,
            groupId,
            disabled,
            elementId,
            customProperties,
            placeholder,
            selected: false,
            active: true,
            score: 9999,
            keyCode: null,
          },
        ];

        expect(actualResponse).to.eql(expectedResponse);
      });
    });
  });

  describe('when choices exist', () => {
    let state;

    beforeEach(() => {
      state = [
        {
          id: 1,
          elementId: 'choices-test-1',
          groupId: -1,
          value: 'Choice 1',
          label: 'Choice 1',
          disabled: false,
          selected: false,
          active: false,
          score: 9999,
          customProperties: null,
          placeholder: false,
          keyCode: null,
        },
        {
          id: 2,
          elementId: 'choices-test-2',
          groupId: -1,
          value: 'Choice 2',
          label: 'Choice 2',
          disabled: false,
          selected: true,
          active: false,
          score: 9999,
          customProperties: null,
          placeholder: false,
          keyCode: null,
        },
      ];
    });

    describe('FILTER_CHOICES', () => {
      it('sets active flag based on whether choice is in passed results', () => {
        const id = 1;
        const score = 10;
        const actualResponse = choices([...state], {
          type: 'FILTER_CHOICES',
          results: [{
            item: {
              id,
            },
            score,
          }],
        });

        const expectedResponse = state.map((choice) => {
          const clonedChoice = choice;
          if (clonedChoice.id === id) {
            clonedChoice.active = true;
            clonedChoice.score = 10;
          }
          return clonedChoice;
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('ACTIVATE_CHOICES', () => {
      it('sets active flag to passed value', () => {
        const actualResponse = choices([...state], {
          type: 'ACTIVATE_CHOICES',
          active: true,
        });

        const expectedResponse = state.map((choice) => {
          const clonedChoice = choice;
          clonedChoice.active = true;
          return clonedChoice;
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('CLEAR_CHOICES', () => {
      it('restores to defaultState', () => {
        const actualResponse = choices([...state], {
          type: 'CLEAR_CHOICES',
        });

        const expectedResponse = defaultState;

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('ADD_ITEM', () => {
      it('disables choice if action has choice id', () => {
        const id = 2;
        const actualResponse = choices(state, {
          type: 'ADD_ITEM',
          choiceId: id,
        });

        const expectedResponse = state.map((choice) => {
          const clonedChoice = choice;
          if (clonedChoice.id === id) {
            clonedChoice.selected = false;
          }
          return clonedChoice;
        });

        expect(actualResponse).to.eql(expectedResponse);
      });

      it('activates all choices if activateOptions flag passed', () => {
        const actualResponse = choices(state, {
          type: 'ADD_ITEM',
          activateOptions: true,
          active: true,
        });

        expect(actualResponse[0].active).to.equal(true);
        expect(actualResponse[1].active).to.equal(true);
      });
    });

    describe('REMOVE_ITEM', () => {
      it('selects choice by passed id', () => {
        const id = 2;
        const actualResponse = choices([...state], {
          type: 'REMOVE_ITEM',
          choiceId: id,
        });

        const expectedResponse = state.map((choice) => {
          const clonedChoice = choice;
          if (clonedChoice.id === id) {
            clonedChoice.selected = false;
          }
          return clonedChoice;
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });
  });
});
