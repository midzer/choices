import { expect } from 'chai';
// import * as actions from '../actions/actions';
import items, { defaultState } from './items';

describe('items reducer', () => {
  it('should return same state when no action matches', () => {
    expect(items(defaultState, {})).to.equal(defaultState);
  });
});
