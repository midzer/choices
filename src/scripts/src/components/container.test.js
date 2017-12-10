import { expect } from 'chai';
import { stub } from 'sinon';
import Container from './container';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/container', () => {
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
    instance = new Container(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  describe('constructor', () => {
    it('assigns choices instance to class', () => {
      expect(instance.parentInstance).to.eql(choicesInstance);
    });

    it('assigns choices element to class', () => {
      expect(instance.element).to.eql(choicesElement);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
    });
  });

  describe('getElement', () => {
    it('returns DOM reference of element', () => {
      expect(instance.getElement()).to.eql(choicesElement);
    });
  });

  describe('addEventListeners', () => {
    let addEventListenerStub;

    beforeEach(() => {
      addEventListenerStub = stub(instance.element, 'addEventListener');
    });

    afterEach(() => {
      addEventListenerStub.restore();
    });

    it('adds event listeners', () => {
      instance.addEventListeners();
      expect(addEventListenerStub.callCount).to.equal(2);
      expect(addEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(addEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('removeEventListeners', () => {
    let removeEventListenerStub;

    beforeEach(() => {
      removeEventListenerStub = stub(instance.element, 'removeEventListener');
    });

    afterEach(() => {
      removeEventListenerStub.restore();
    });

    it('removes event listeners', () => {
      instance.removeEventListeners();
      expect(removeEventListenerStub.callCount).to.equal(2);
      expect(removeEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(removeEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('onFocus', () => {
    it('sets isFocussed flag to true', () => {
      expect(instance.isFocussed).to.equal(false);
      instance.onFocus();
      expect(instance.isFocussed).to.equal(true);
    });
  });

  describe('onBlur', () => {
    it('sets isFocussed flag to false', () => {
      instance.isFocussed = true;
      instance.onBlur();
      expect(instance.isFocussed).to.equal(false);
    });
  });

  describe('shouldFlip', () => {
    describe('not passing dropdownPos', () => {
      it('returns false', () => {
        expect(instance.shouldFlip()).to.equal(false);
      });
    });

    describe('passing dropdownPos', () => {
      describe('position config option set to "auto"', () => {
        beforeEach(() => {
          instance.config.position = 'auto';
        });

        describe('dropdownPos is greater than window height', () => {
          it('returns false', () => {
            expect(instance.shouldFlip(100, 1000)).to.equal(false);
          });
        });

        describe('dropdownPos is less than window height', () => {
          it('returns true', () => {
            expect(instance.shouldFlip(100, 50)).to.equal(true);
          });
        });
      });

      describe('position config option set to "top"', () => {
        beforeEach(() => {
          instance.config.position = 'top';
        });

        it('returns true', () => {
          expect(instance.shouldFlip(100)).to.equal(true);
        });
      });
    });
  });

  describe('setActiveDescendant', () => {
    it('sets element\'s aria-activedescendant attribute with passed descendant ID', () => {
      const activeDescendantID = '1234';
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
      instance.setActiveDescendant(activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
    });
  });

  describe('removeActiveDescendant', () => {
    it('remove elememnt\'s aria-activedescendant attribute', () => {
      const activeDescendantID = '1234';
      instance.element.setAttribute('aria-activedescendant', activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
      instance.removeActiveDescendant();
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
    });
  });

  describe('open', () => {
    beforeEach(() => {
      instance.open();
    });

    it('adds open state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.openState)).to.equal(true);
    });

    it('sets aria-expanded attribute to true', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets isOpen flag to true', () => {
      expect(instance.isOpen).to.equal(true);
    });

    describe('flipping dropdown', () => {
      let shouldFlipStub;
      beforeEach(() => {
        shouldFlipStub = stub().returns(true);

        instance.shouldFlip = shouldFlipStub;
        instance.open();
      });

      afterEach(() => {
        instance.shouldFlip.reset();
      });

      it('adds adds flipped state class', () => {
        expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.flippedState)).to.equal(true);
      });

      it('sets isFlipped flag to true', () => {
        expect(instance.isFlipped).to.equal(true);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      instance.close();
    });

    it('adds open state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.openState)).to.equal(false);
    });

    it('sets aria-expanded attribute to true', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets isOpen flag to true', () => {
      expect(instance.isOpen).to.equal(false);
    });

    describe('flipped dropdown', () => {
      beforeEach(() => {
        instance.isFlipped = true;
        instance.close();
      });

      it('removes adds flipped state class', () => {
        expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.flippedState)).to.equal(false);
      });

      it('sets isFlipped flag to false', () => {
        expect(instance.isFlipped).to.equal(false);
      });
    });
  });

  describe('focus', () => {
    let focusStub;

    beforeEach(() => {
      focusStub = stub(instance.element, 'focus');
    });

    afterEach(() => {
      focusStub.restore();
    });

    it('focuses element if isFocussed flag is set to false', () => {
      instance.isFocussed = false;
      instance.focus();
      expect(focusStub.callCount).to.equal(1);
    });
  });

  describe('addFocusState', () => {
    beforeEach(() => {
      instance.removeLoadingState();
    });

    it('adds focus state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState)).to.equal(false);
      instance.addFocusState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState)).to.equal(true);
    });
  });

  describe('removeFocusState', () => {
    beforeEach(() => {
      instance.addFocusState();
    });

    it('removes focus state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState)).to.equal(true);
      instance.removeFocusState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState)).to.equal(false);
    });
  });

  // describe('enable', () => {
  //   it('removes disabled state class', () => {});
  //   it('removes aria-disabled attribute', () => { });
  //   it('sets isDisabled flag to true', () => {});
  // });

  // describe('disable', () => {
  //   it('adds disabled state class', () => {});
  //   it('adds aria-disabled attribute', () => { });
  //   it('sets isDisabled flag to false', () => { });
  // });

  describe('addLoadingState', () => {
    beforeEach(() => {
      instance.removeLoadingState();
    });

    it('adds loading state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(false);
      instance.addLoadingState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(true);
    });

    it('sets aria-busy attribute to true', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
      instance.addLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
    });

    it('sets isLoading flag to false', () => {
      expect(instance.isLoading).to.equal(false);
      instance.addLoadingState();
      expect(instance.isLoading).to.equal(true);
    });
  });

  describe('removeLoadingState', () => {
    beforeEach(() => {
      instance.addLoadingState();
    });

    it('removes loading state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(true);
      instance.removeLoadingState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(false);
    });

    it('removes aria-busy attribute', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
      instance.removeLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
    });

    it('sets isLoading flag to true', () => {
      expect(instance.isLoading).to.equal(true);
      instance.removeLoadingState();
      expect(instance.isLoading).to.equal(false);
    });
  });
});
