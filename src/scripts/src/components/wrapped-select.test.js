import { expect } from 'chai';
import { stub } from 'sinon';
import WrappedElement from './wrapped-element';
import WrappedSelect from './wrapped-select';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/wrappedSelect', () => {
  let instance;
  let choicesInstance;
  let selectElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };

    selectElement = document.createElement('select');
    selectElement.id = 'target';
    for (let i = 1; i <= 4; i++) {
      const option = document.createElement('option');

      option.value = `Value ${i}`;
      option.innerHTML = `Label ${i}`;

      if (i === 1) {
        option.setAttribute('placeholder', '');
      }

      selectElement.appendChild(option);
    }
    document.body.appendChild(selectElement);

    instance = new WrappedSelect(choicesInstance, document.getElementById('target'), DEFAULT_CLASSNAMES);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('inherited methods', () => {
    ['getElement', 'conceal', 'reveal', 'enable', 'disable'].forEach((method) => {
      beforeEach(() => {
        stub(WrappedElement.prototype, method);
      });

      afterEach(() => {
        WrappedElement.prototype[method].restore();
      });

      describe(method, () => {
        it(`calls super.${method}`, () => {
          expect(WrappedElement.prototype[method].called).to.equal(false);
          instance[method]();
          expect(WrappedElement.prototype[method].called).to.equal(true);
        });
      });
    });
  });

  describe('getPlaceholderOption', () => {
    it('returns option element with placeholder attribute', () => {
      const output = instance.getPlaceholderOption();
      expect(output).to.be.instanceOf(HTMLOptionElement);
    });
  });

  describe('getOptions', () => {
    it('returns all option elements', () => {
      const output = instance.getOptions();
      expect(output).to.be.an('array');
      output.forEach((option) => {
        expect(option).to.be.instanceOf(HTMLOptionElement);
      });
    });
  });

  // describe('getOptionGroups', () => {
  //   it('returns all option groups', () => {

  //   });
  // });

  // describe('setOptions', () => {

  // });

  describe('appendDocFragment', () => {
    it('empties contents of element', () => {
      expect(instance.element.getElementsByTagName('option').length).to.equal(4);
      instance.appendDocFragment(document.createDocumentFragment());
      expect(instance.element.getElementsByTagName('option').length).to.equal(0);
    });

    it('appends passed fragment to element', () => {
      const fragment = document.createDocumentFragment();
      const elementToAppend = document.createElement('div');
      elementToAppend.id = 'fragment-target';
      fragment.appendChild(elementToAppend);
      expect(instance.element.querySelector('#fragment-target')).to.equal(null);
      instance.appendDocFragment(fragment);
      expect(instance.element.querySelector('#fragment-target')).to.eql(elementToAppend);
    });
  });
});
