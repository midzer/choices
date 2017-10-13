import { expect } from 'chai';
import WrappedElement from './wrapped-element';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('WrappedElement', () => {
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
    instance = new WrappedElement(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });
});
