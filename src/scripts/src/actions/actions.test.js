import { expect } from 'chai';
import * as actions from './actions';

describe('actions', () => {
  describe('addItem action', () => {
    it('returns ADD_ITEM action', () => {
      const value = 'test';
      const label = 'test';
      const id = '1234';
      const choiceId = '1234';
      const groupId = 'test';
      const customProperties = 'test';
      const placeholder = 'test';
      const keyCode = 10;

      const expectedAction = {
        type: 'ADD_ITEM',
        value,
        label,
        id,
        choiceId,
        groupId,
        customProperties,
        placeholder,
        keyCode,
      };

      expect(actions.addItem(
        value,
        label,
        id,
        choiceId,
        groupId,
        customProperties,
        placeholder,
        keyCode,
      )).to.eql(expectedAction);
    });
  });

  describe('removeItem action', () => {
    it('returns REMOVE_ITEM action', () => {
      const id = '1234';
      const choiceId = '1';
      const expectedAction = {
        type: 'REMOVE_ITEM',
        id,
        choiceId,
      };

      expect(actions.removeItem(id, choiceId)).to.eql(expectedAction);
    });
  });

  describe('highlightItem action', () => {
    it('returns HIGHLIGHT_ITEM action', () => {
      const id = '1234';
      const highlighted = true;

      const expectedAction = {
        type: 'HIGHLIGHT_ITEM',
        id,
        highlighted,
      };

      expect(actions.highlightItem(id, highlighted)).to.eql(expectedAction);
    });
  });

  describe('addChoice action', () => {
    it('returns ADD_CHOICE action', () => {
      const value = 'test';
      const label = 'test';
      const id = 'test';
      const groupId = 'test';
      const disabled = false;
      const elementId = 'test';
      const customProperties = 'test';
      const placeholder = 'test';
      const keyCode = 10;

      const expectedAction = {
        type: 'ADD_CHOICE',
        value,
        label,
        id,
        groupId,
        disabled,
        elementId,
        customProperties,
        placeholder,
        keyCode,
      };

      expect(actions.addChoice(
        value,
        label,
        id,
        groupId,
        disabled,
        elementId,
        customProperties,
        placeholder,
        keyCode,
      )).to.eql(expectedAction);
    });
  });

  describe('filterChoices action', () => {
    it('returns FILTER_CHOICES action', () => {
      const results = Array(10);
      const expectedAction = {
        type: 'FILTER_CHOICES',
        results,
      };

      expect(actions.filterChoices(results)).to.eql(expectedAction);
    });
  });

  describe('activateChoices action', () => {
    it('returns ACTIVATE_CHOICES action', () => {
      const active = true;
      const expectedAction = {
        type: 'ACTIVATE_CHOICES',
        active,
      };

      expect(actions.activateChoices(active)).to.eql(expectedAction);
    });
  });

  describe('clearChoices action', () => {
    it('returns CLEAR_CHOICES action', () => {
      const expectedAction = {
        type: 'CLEAR_CHOICES',
      };

      expect(actions.clearChoices()).to.eql(expectedAction);
    });
  });

  describe('addGroup action', () => {
    it('returns ADD_GROUP action', () => {
      const value = 'test';
      const id = 'test';
      const active = true;
      const disabled = false;
      const expectedAction = {
        type: 'ADD_GROUP',
        value,
        id,
        active,
        disabled,
      };

      expect(actions.addGroup(
        value,
        id,
        active,
        disabled,
      )).to.eql(expectedAction);
    });
  });

  describe('clearAll action', () => {
    it('returns CLEAR_ALL action', () => {
      const expectedAction = {
        type: 'CLEAR_ALL',
      };

      expect(actions.clearAll()).to.eql(expectedAction);
    });
  });
});
