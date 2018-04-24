import { expect } from 'chai';
import sinon from 'sinon';
import Store from './store';

describe('reducers/store', () => {
  let instance;
  let subscribeStub;
  let dispatchStub;
  let getStateStub;

  beforeEach(() => {
    instance = new Store();
    subscribeStub = sinon.stub(instance.store, 'subscribe');
    dispatchStub = sinon.stub(instance.store, 'dispatch');
    getStateStub = sinon.stub(instance.store, 'getState');
  });

  afterEach(() => {
    subscribeStub.restore();
    dispatchStub.restore();
    getStateStub.restore();
  });


  describe('constructor', () => {
    it('creates redux store', () => {
      expect(instance.store).to.contain.keys([
        'subscribe',
        'dispatch',
        'getState',
      ]);
    });
  });


  describe('subscribe', () => {
    it('wraps redux subscribe method', () => {
      const onChange = () => {};
      expect(subscribeStub.callCount).to.equal(0);
      instance.subscribe(onChange);
      expect(subscribeStub.callCount).to.equal(1);
      expect(subscribeStub.firstCall.args[0]).to.equal(onChange);
    });
  });

  describe('dispatch', () => {
    it('wraps redux dispatch method', () => {
      const action = 'TEST_ACTION';
      expect(dispatchStub.callCount).to.equal(0);
      instance.dispatch(action);
      expect(dispatchStub.callCount).to.equal(1);
      expect(dispatchStub.firstCall.args[0]).to.equal(action);
    });
  });

  describe('state getter', () => {
    it('returns state', () => {
      const state = {
        items: [],
      };
      getStateStub.returns(state);

      expect(instance.state).to.equal(state);
    });
  });

  describe('store selectors', () => {
    let state;

    beforeEach(() => {
      state = {
        items: [
          {
            id: 1,
            choiceId: 1,
            groupId: -1,
            value: 'Item one',
            label: 'Item one',
            active: false,
            highlighted: false,
            customProperties: null,
            placeholder: false,
            keyCode: null,
          },
          {
            id: 2,
            choiceId: 2,
            groupId: -1,
            value: 'Item two',
            label: 'Item two',
            active: true,
            highlighted: false,
            customProperties: null,
            placeholder: false,
            keyCode: null,
          },
          {
            id: 3,
            choiceId: 3,
            groupId: -1,
            value: 'Item three',
            label: 'Item three',
            active: true,
            highlighted: true,
            customProperties: null,
            placeholder: false,
            keyCode: null,
          },
        ],
        choices: [
          {
            id: 1,
            elementId: 'choices-test-1',
            groupId: -1,
            value: 'Choice 1',
            label: 'Choice 1',
            disabled: false,
            selected: false,
            active: true,
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
        ],
        groups: [
          {
            id: 1,
            value: 'Group one',
            active: true,
            disabled: false,
          },
          {
            id: 2,
            value: 'Group two',
            active: true,
            disabled: false,
          },
        ],
      };

      getStateStub.returns(state);
    });

    describe('items getter', () => {
      it('returns items', () => {
        const expectedResponse = state.items;
        expect(instance.items).to.eql(expectedResponse);
      });
    });

    describe('getItemsFilteredByActive', () => {
      it('returns items that are active', () => {
        const expectedResponse = state.items.filter((item => item.active));
        const actualResponse = instance.getItemsFilteredByActive();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getItemsFilteredByHighlighted', () => {
      it('returns items that are active and highlighted', () => {
        const expectedResponse = state.items.filter((item => item.highlighted && item.active));
        const actualResponse = instance.getItemsFilteredByHighlighted();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getChoices', () => {
      it('returns choices', () => {
        const expectedResponse = state.choices;
        const actualResponse = instance.getChoices();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getChoicesFilteredByActive', () => {
      it('returns choices that are active', () => {
        const expectedResponse = state.choices.filter((choice => choice.active));
        const actualResponse = instance.getChoicesFilteredByActive();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getChoicesFilteredBySelectable', () => {
      it('returns choices that are not disabled', () => {
        const expectedResponse = state.choices.filter((choice => !choice.disabled));
        const actualResponse = instance.getChoicesFilteredBySelectable();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getSearchableChoices', () => {
      it('returns choices that are not placeholders and are selectable', () => {
        const expectedResponse = state.choices.filter((choice => !choice.disabled && !choice.placeholder));
        const actualResponse = instance.getSearchableChoices();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getChoiceById', () => {
      describe('passing id', () => {
        it('returns active choice by passed id', () => {
          const id = '1';
          const expectedResponse = state.choices.find((choice => choice.id === parseInt(id, 10)));
          const actualResponse = instance.getChoiceById(id);
          expect(actualResponse).to.eql(expectedResponse);
        });
      });

      describe('passing no id', () => {
        it('returns false', () => {
          const actualResponse = instance.getChoiceById();
          expect(actualResponse).to.equal(false);
        });
      });
    });

    describe('getPlaceholderChoice', () => {
      it('returns placeholder choice', () => {
        const expectedResponse = state.choices.reverse().find(choice => choice.placeholder);
        const actualResponse = instance.getPlaceholderChoice();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getGroups', () => {
      it('returns groups', () => {
        const expectedResponse = state.groups;
        const actualResponse = instance.getGroups();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getGroupsFilteredByActive', () => {
      it('returns active groups', () => {
        const expectedResponse = state.groups.filter(group => group.active);
        const actualResponse = instance.getGroupsFilteredByActive();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('getGroupById', () => {
      it('returns group by id', () => {
        const id = '1';
        const expectedResponse = state.groups.find((group => group.id === parseInt(id, 10)));
        const actualResponse = instance.getGroupById(id);
        expect(actualResponse).to.eql(expectedResponse);
      });
    });
  });
});
