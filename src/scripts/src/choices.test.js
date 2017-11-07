import { expect } from 'chai';
import { spy, stub } from 'sinon';

import Choices from './choices';
import { EVENTS } from './constants';

describe.only('choices', () => {
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

      describe('already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          instance.init();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(false);
        });
      });

      describe('not already initialised', () => {
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

        afterEach(() => {
          createTemplatesSpy.restore();
          createInputSpy.restore();
          storeSubscribeSpy.restore();
          renderSpy.restore();
          addEventListenersSpy.restore();
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

        it('subscribes to store with render method', () => {
          expect(storeSubscribeSpy.called).to.equal(true);
          expect(storeSubscribeSpy.lastCall.args[0]).to.equal(instance.render);
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

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          instance.destroy();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(true);
        });
      });

      describe('already initialised', () => {
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

        afterEach(() => {
          removeEventListenersSpy.restore();
          passedElementRevealSpy.restore();
          containerOuterRevertSpy.restore();
          clearStoreSpy.restore();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy.called).to.equal(true);
        });

        it('reveals passed element', () => {
          expect(passedElementRevealSpy.called).to.equal(true);
        });

        it('reverts outer container', () => {
          expect(containerOuterRevertSpy.called).to.equal(true);
          expect(containerOuterRevertSpy.lastCall.args[0]).to.equal(instance.passedElement.element);
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

    describe('enable', () => {
      let passedElementEnableSpy;
      let addEventListenersSpy;
      let containerOuterEnableSpy;
      let inputEnableSpy;

      beforeEach(() => {
        addEventListenersSpy = spy(instance, '_addEventListeners');
        passedElementEnableSpy = spy(instance.passedElement, 'enable');
        containerOuterEnableSpy = spy(instance.containerOuter, 'enable');
        inputEnableSpy = spy(instance.input, 'enable');
      });


      afterEach(() => {
        addEventListenersSpy.restore();
        passedElementEnableSpy.restore();
        containerOuterEnableSpy.restore();
        inputEnableSpy.restore();
      });

      describe('not already initialised', () => {
        let response;

        beforeEach(() => {
          instance.initialised = false;
          response = instance.enable();
        });

        it('returns instance', () => {
          expect(response).to.equal(instance);
        });

        it('returns early', () => {
          expect(passedElementEnableSpy.called).to.equal(false);
          expect(addEventListenersSpy.called).to.equal(false);
          expect(inputEnableSpy.called).to.equal(false);
          expect(containerOuterEnableSpy.called).to.equal(false);
        });
      });

      describe('already initialised', () => {
        let response;

        describe('containerOuter enabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            response = instance.enable();
          });

          it('returns instance', () => {
            expect(response).to.equal(instance);
          });

          it('enables passedElement', () => {
            expect(passedElementEnableSpy.called).to.equal(true);
          });
        });

        describe('containerOuter disabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = true;
            instance.enable();
          });

          it('adds event listeners', () => {
            expect(addEventListenersSpy.called).to.equal(true);
          });

          it('enables input', () => {
            expect(inputEnableSpy.called).to.equal(true);
          });

          it('enables containerOuter', () => {
            expect(containerOuterEnableSpy.called).to.equal(true);
          });
        });
      });
    });

    describe('disable', () => {
      let removeEventListenersSpy;
      let passedElementDisableSpy;
      let containerOuterDisableSpy;
      let inputDisableSpy;

      beforeEach(() => {
        removeEventListenersSpy = spy(instance, '_removeEventListeners');
        passedElementDisableSpy = spy(instance.passedElement, 'disable');
        containerOuterDisableSpy = spy(instance.containerOuter, 'disable');
        inputDisableSpy = spy(instance.input, 'disable');
      });


      afterEach(() => {
        removeEventListenersSpy.restore();
        passedElementDisableSpy.restore();
        containerOuterDisableSpy.restore();
        inputDisableSpy.restore();
      });

      describe('not already initialised', () => {
        let response;

        beforeEach(() => {
          instance.initialised = false;
          response = instance.disable();
        });

        it('returns instance', () => {
          expect(response).to.equal(instance);
        });

        it('returns early', () => {
          expect(removeEventListenersSpy.called).to.equal(false);
          expect(passedElementDisableSpy.called).to.equal(false);
          expect(containerOuterDisableSpy.called).to.equal(false);
          expect(inputDisableSpy.called).to.equal(false);
        });
      });

      describe('already initialised', () => {
        let response;

        describe('containerOuter disabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = true;
            response = instance.disable();
          });

          it('returns instance', () => {
            expect(response).to.equal(instance);
          });

          it('disables passedElement', () => {
            expect(passedElementDisableSpy.called).to.equal(true);
          });
        });

        describe('containerOuter enabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = false;
            instance.disable();
          });

          it('removes event listeners', () => {
            expect(removeEventListenersSpy.called).to.equal(true);
          });

          it('disables input', () => {
            expect(inputDisableSpy.called).to.equal(true);
          });

          it('enables containerOuter', () => {
            expect(containerOuterDisableSpy.called).to.equal(true);
          });
        });
      });
    });

    describe('showDropdown', () => {
      let containerOuterOpenSpy;
      let dropdownShowSpy;
      let inputActivateSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterOpenSpy = spy(instance.containerOuter, 'open');
        dropdownShowSpy = spy(instance.dropdown, 'show');
        inputActivateSpy = spy(instance.input, 'activate');
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterOpenSpy.restore();
        dropdownShowSpy.restore();
        inputActivateSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown active', () => {
        let response;

        beforeEach(() => {
          instance.dropdown.isActive = true;
          response = instance.showDropdown();
        });

        it('returns this', () => {
          expect(response).to.eql(instance);
        });

        it('returns early', () => {
          expect(containerOuterOpenSpy.called).to.equal(false);
          expect(dropdownShowSpy.called).to.equal(false);
          expect(inputActivateSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown inactive', () => {
        let response;
        beforeEach(() => {
          instance.dropdown.isActive = false;
          response = instance.showDropdown();
        });

        it('returns this', () => {
          expect(response).to.eql(instance);
        });

        it('opens containerOuter', () => {
          expect(containerOuterOpenSpy.called).to.equal(true);
        });

        it('shows dropdown with blurInput flag', () => {
          expect(dropdownShowSpy.called).to.equal(true);
        });

        it('activates input', () => {
          expect(inputActivateSpy.called).to.equal(true);
        });

        it('triggers event on passedElement', () => {
          expect(passedElementTriggerEventStub.called).to.equal(true);
          expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(EVENTS.showDropdown);
          expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
        });
      });
    });

    describe('hideDropdown', () => {
      let containerOuterCloseSpy;
      let dropdownHideSpy;
      let inputDeactivateSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterCloseSpy = spy(instance.containerOuter, 'close');
        dropdownHideSpy = spy(instance.dropdown, 'hide');
        inputDeactivateSpy = spy(instance.input, 'deactivate');
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterCloseSpy.restore();
        dropdownHideSpy.restore();
        inputDeactivateSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown inactive', () => {
        let response;

        beforeEach(() => {
          instance.dropdown.isActive = false;
          response = instance.hideDropdown();
        });

        it('returns this', () => {
          expect(response).to.eql(instance);
        });

        it('returns early', () => {
          expect(containerOuterCloseSpy.called).to.equal(false);
          expect(dropdownHideSpy.called).to.equal(false);
          expect(inputDeactivateSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown active', () => {
        let response;
        beforeEach(() => {
          instance.dropdown.isActive = true;
          response = instance.hideDropdown();
        });

        it('returns this', () => {
          expect(response).to.eql(instance);
        });

        it('closes containerOuter', () => {
          expect(containerOuterCloseSpy.called).to.equal(true);
        });

        it('hides dropdown with blurInput flag', () => {
          expect(dropdownHideSpy.called).to.equal(true);
        });

        it('deactivates input', () => {
          expect(inputDeactivateSpy.called).to.equal(true);
        });

        it('triggers event on passedElement', () => {
          expect(passedElementTriggerEventStub.called).to.equal(true);
          expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(EVENTS.hideDropdown);
          expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
        });
      });
    });

    describe('toggleDropdown', () => {
      let response;
      let hideDropdownSpy;
      let showDropdownSpy;

      beforeEach(() => {
        hideDropdownSpy = spy(instance, 'hideDropdown');
        showDropdownSpy = spy(instance, 'showDropdown');
      });

      afterEach(() => {
        hideDropdownSpy.restore();
        showDropdownSpy.restore();
      });

      describe('dropdown active', () => {
        beforeEach(() => {
          instance.dropdown.isActive = true;
          response = instance.toggleDropdown();
        });

        it('hides dropdown', () => {
          expect(hideDropdownSpy.called).to.equal(true);
        });

        it('returns instance', () => {
          expect(response).to.eql(instance);
        });
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          response = instance.toggleDropdown();
        });

        it('shows dropdown', () => {
          expect(showDropdownSpy.called).to.equal(true);
        });

        it('returns instance', () => {
          expect(response).to.eql(instance);
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
    describe('getValue', () => {});
    describe('setValue', () => {});
    describe('setValueByChoice', () => {});
    describe('setChoices', () => {});
    describe('clearStore', () => {});
    describe('clearInput', () => {});
  });

  describe.skip('private methods', () => {
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
