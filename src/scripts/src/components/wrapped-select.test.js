import { expect } from 'chai';
import WrappedSelect from './wrapped-select';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('WrappedSelect', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };
    choicesElement = document.createElement('select');
    instance = new WrappedSelect(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });
});
