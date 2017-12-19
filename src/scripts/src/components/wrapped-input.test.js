import { expect } from 'chai';
import WrappedInput from './wrapped-input';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/wrappedInput', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };
    choicesElement = document.createElement('input');
    instance = new WrappedInput(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('setValue', () => {
    const data = [
      {
        id: 'ID 1',
        value: 'Value 1',
      },
      {
        id: 'ID 2',
        value: 'Value 2',
      },
      {
        id: 'ID 3',
        value: 'Value 3',
      },
    ];

    it('sets delimited value of element based on passed data', () => {
      expect(instance.element.value).to.equal('');
      instance.setValue(data);
      expect(instance.element.value).to.equal('Value 1,Value 2,Value 3');
    });
  });
});
