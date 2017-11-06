import { expect } from 'chai';
import { spy } from 'sinon';

import Choices from './choices';

describe('choices', () => {
  let instance;
  let passedElement;

  describe('public methods', () => {
    describe('init', () => {
      const callbackOnInitSpy = spy();

      beforeEach(() => {
        passedElement = document.createElement('input');
        passedElement.type = 'text';
        passedElement.className = 'js-choices';
        document.body.appendChild(passedElement);

        instance = new Choices(passedElement, {
          callbackOnInit: callbackOnInitSpy,
        });
      });

      describe('already initalised', () => {
        beforeEach(() => {
          instance.initialised = true;
          instance.init();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(false);
        });
      });

      describe('not already initalised', () => {
        let createTemplatesSpy;
        let createInputSpy;
        let storeSubscribeSpy;
        let renderSpy;
        let addEventListenersSpy;

        beforeEach(() => {
          createTemplatesSpy = spy(instance, '_createTemplates');
          createInputSpy = spy(instance, '_createInput');
          storeSubscribeSpy = spy(instance.store, 'subscribe');
          renderSpy = spy(instance, 'render');
          addEventListenersSpy = spy(instance, '_addEventListeners');

          instance.initialised = false;
          instance.init();
        });

        it('sets initialise flag', () => {
          expect(instance.initialised).to.equal(true);
        });

        it('creates templates', () => {
          expect(createTemplatesSpy.called).to.equal(true);
        });

        it('creates input', () => {
          expect(createInputSpy.called).to.equal(true);
        });

        it('subscribes to store', () => {
          expect(storeSubscribeSpy.called).to.equal(true);
        });

        it('fires initial render', () => {
          expect(renderSpy.called).to.equal(true);
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy.called).to.equal(true);
        });

        it('fires callback', () => {
          expect(callbackOnInitSpy.called).to.equal(true);
        });
      });
    });

    describe('destroy', () => {
      beforeEach(() => {
        passedElement = document.createElement('input');
        passedElement.type = 'text';
        passedElement.className = 'js-choices';
        document.body.appendChild(passedElement);

        instance = new Choices(passedElement);
      });

      describe('not already initalised', () => {
        beforeEach(() => {
          instance.initialised = false;
          instance.destroy();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(true);
        });
      });

      describe('already initalised', () => {
        let removeEventListenersSpy;
        let passedElementRevealSpy;
        let containerOuterRevertSpy;
        let clearStoreSpy;

        beforeEach(() => {
          removeEventListenersSpy = spy(instance, '_removeEventListeners');
          passedElementRevealSpy = spy(instance.passedElement, 'reveal');
          containerOuterRevertSpy = spy(instance.containerOuter, 'revert');
          clearStoreSpy = spy(instance, 'clearStore');

          instance.initialised = true;
          instance.destroy();
        });


        it('removes event listeners', () => {
          expect(removeEventListenersSpy.called).to.equal(true);
        });

        it('reveals passed element', () => {
          expect(passedElementRevealSpy.called).to.equal(true);
        });

        it('reverts outer container', () => {
          expect(containerOuterRevertSpy.called).to.equal(true);
        });

        it('clears store', () => {
          expect(clearStoreSpy.called).to.equal(true);
        });

        it('nullifys templates config', () => {
          expect(instance.config.templates).to.equal(null);
        });

        it('resets initialise flag', () => {
          expect(instance.initialised).to.equal(false);
        });
      });
    });

    describe('renderGroups', () => {});
    describe('renderChoices', () => {});
    describe('renderItems', () => {});
    describe('render', () => {});
    describe('highlightItem', () => {});
    describe('unhighlightItem', () => {});
    describe('highlightAll', () => {});
    describe('unhighlightAll', () => {});
    describe('removeItemsByValue', () => {});
    describe('removeActiveItems', () => {});
    describe('removeHighlightedItems', () => {});
    describe('showDropdown', () => {});
    describe('hideDropdown', () => {});
    describe('toggleDropdown', () => {});
    describe('getValue', () => {});
    describe('setValue', () => {});
    describe('setValueByChoice', () => {});
    describe('setChoices', () => {});
    describe('clearStore', () => {});
    describe('clearInput', () => {});
    describe('disable', () => {});
  });

  describe('private methods', () => {
    describe('_triggerChange', () => {});
    describe('_selectPlaceholderChoice', () => {});
    describe('_handleButtonAction', () => {});
    describe('_handleItemAction', () => {});
    describe('_handleChoiceAction', () => {});
    describe('_handleBackspace', () => {});
    describe('_handleLoadingState', () => {});
    describe('_canAddItem', () => {});
    describe('_ajaxCallback', () => {});
    describe('_searchChoices', () => {});
    describe('_handleSearch', () => {});
    describe('_addEventListeners', () => {});
    describe('_removeEventListeners', () => {});
    describe('_onKeyDown', () => {});
    describe('_onTouchMove', () => {});
    describe('_onTouchEnd', () => {});
    describe('_onMouseDown', () => {});
    describe('_onMouseOver', () => {});
    describe('_onClick', () => {});
    describe('_onFocus', () => {});
    describe('_onBlur', () => {});
    describe('_scrollToChoice', () => {});
    describe('_highlightChoice', () => {});
    describe('_addItem', () => {});
    describe('_removeItem', () => {});
    describe('_addChoice', () => {});
    describe('_clearChoices', () => {});
    describe('_addGroup', () => {});
    describe('_getTemplate', () => {});
    describe('_createTemplates', () => {});
    describe('_createInput', () => {});
  });
});
