import { expect } from 'chai';
import sinon from 'sinon';
import Store from './store';

describe('Store', () => {
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

  it('creates redux store on construction', () => {
    expect(instance.store).to.contain.keys([
      'subscribe',
      'dispatch',
      'getState',
    ]);
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

  describe('getState', () => {
    it('wraps redux getState method', () => {
      expect(getStateStub.callCount).to.equal(0);
      instance.getState();
      expect(getStateStub.callCount).to.equal(1);
    });
  });

  describe('store selectors', () => {
    let state;

    beforeEach(() => {
      state = {
        items: [
          { id: 1 },
          { id: 2 },
        ],
        choices: [
          { id: 1 },
          { id: 2 },
        ],
        groups: [
          { id: 1 },
          { id: 2 },
        ],
      };

      getStateStub.returns(state);
    });

    describe('getItems', () => {
      it('returns items', () => {
        const expectedResponse = state.items;
        const actualResponse = instance.getItems();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    // describe('getItemsFilteredByActive', () => { });
    // describe('getItemsReducedToValues', () => { });

    describe('getChoices', () => {
      it('returns choices', () => {
        const expectedResponse = state.choices;
        const actualResponse = instance.getChoices();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    // describe('getChoicesFilteredByActive', () => { });
    // describe('getChoicesFilteredBySelectable', () => { });
    // describe('getSearchableChoices', () => { });
    // describe('getChoiceById', () => { });

    describe('getGroups', () => {
      it('returns groups', () => {
        const expectedResponse = state.groups;
        const actualResponse = instance.getGroups();
        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    // describe('getGroupsFilteredByActive', () => { });
    // describe('getGroupById', () => { });
    // describe('getPlaceholderChoice', () => { });
  });
});
