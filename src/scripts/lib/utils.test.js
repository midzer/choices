import { expect } from 'chai';
import { reduceToValues } from './utils';

describe('utils', () => {
  describe('reduceToValues', () => {
    const items = [
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
    ];

    it('returns an array of item values', () => {
      const expectedResponse = [
        items[0].value,
        items[1].value,
        items[2].value,
      ];

      const actualResponse = reduceToValues(items);
      expect(actualResponse).to.eql(expectedResponse);
    });
  });
});
