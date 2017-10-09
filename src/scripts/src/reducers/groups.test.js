import { expect } from 'chai';
// import * as actions from '../actions/actions';
import groups, { defaultState } from './groups';

describe('groups reducer', () => {
  it('should return same state when no action matches', () => {
    expect(groups(defaultState, {})).to.equal(defaultState);
  });
});
