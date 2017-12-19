import { expect } from 'chai';
import { stub } from 'sinon';
import WrappedElement from './wrapped-element';
import WrappedSelect from './wrapped-select';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/wrappedSelect', () => {
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

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('inherited methods', () => {
    ['getElement', 'conceal', 'reveal', 'enable', 'disable'].forEach((method) => {
      describe(method, () => {
        it(`calls super.${method}`, () => {
          stub(WrappedElement.prototype, method);
          instance[method]();
          expect(WrappedElement.prototype[method].called).to.equal(true);
        });
      });
    });
  });

  // describe('getPlaceholderOption', () => {

  // });

  // describe('getOptions', () => {

  // });

  // describe('getOptionGroups', () => {

  // });

  // describe('setOptions', () => {

  // });

  // describe('appendDocFragment', () => {

  // });
});
