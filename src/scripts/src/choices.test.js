import { expect } from 'chai';
import { spy, stub } from 'sinon';

import Choices from './choices';
import { EVENTS, ACTION_TYPES } from './constants';

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

    describe('highlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance.store, 'dispatch');

        instance.store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance.store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        let output;
        beforeEach(() => {
          output = instance.highlightItem();
        });

        it('returns instance', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        let output;

        const item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, true);
          });

          it('returns instance', () => {
            expect(output).to.eql(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: true,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.highlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            instance.highlightItem(item, false);
          });

          it('doesn\'t trigger event', () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          it('returns instance', () => {
            expect(output).to.eql(instance);
          });
        });
      });
    });

    describe('unhighlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance.store, 'dispatch');

        instance.store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance.store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        let output;
        beforeEach(() => {
          output = instance.unhighlightItem();
        });

        it('returns instance', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        let output;

        const item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, true);
          });

          it('returns instance', () => {
            expect(output).to.eql(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: false,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.unhighlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            instance.highlightItem(item, false);
          });

          it('doesn\'t trigger event', () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          it('returns instance', () => {
            expect(output).to.eql(instance);
          });
        });
      });
    });

    describe('highlightAll', () => {
      let storeGetItemsStub;
      let highlightItemSpy;
      let output;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub().returns(items);
        highlightItemSpy = spy(instance, 'highlightItem');

        instance.store.getItems = storeGetItemsStub;

        output = instance.highlightAll();
      });

      afterEach(() => {
        highlightItemSpy.restore();
        instance.store.getItems.reset();
      });

      it('returns instance', () => {
        expect(output).to.eql(instance);
      });

      it('highlights each item in store', () => {
        expect(highlightItemSpy.callCount).to.equal(items.length);
        expect(highlightItemSpy.firstCall.args[0]).to.equal(items[0]);
        expect(highlightItemSpy.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('unhighlightAll', () => {
      let storeGetItemsStub;
      let unhighlightItemSpy;
      let output;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub().returns(items);
        unhighlightItemSpy = spy(instance, 'unhighlightItem');

        instance.store.getItems = storeGetItemsStub;

        output = instance.unhighlightAll();
      });

      afterEach(() => {
        unhighlightItemSpy.restore();
        instance.store.getItems.reset();
      });

      it('returns instance', () => {
        expect(output).to.eql(instance);
      });

      it('unhighlights each item in store', () => {
        expect(unhighlightItemSpy.callCount).to.equal(items.length);
        expect(unhighlightItemSpy.firstCall.args[0]).to.equal(items[0]);
        expect(unhighlightItemSpy.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('clearStore', () => {
      let storeDispatchStub;
      let output;

      beforeEach(() => {
        storeDispatchStub = stub();
        instance.store.dispatch = storeDispatchStub;

        output = instance.clearStore();
      });

      afterEach(() => {
        instance.store.dispatch.reset();
      });

      it('returns instance', () => {
        expect(output).to.eql(instance);
      });

      it('dispatches clearAll action', () => {
        expect(storeDispatchStub.lastCall.args[0]).to.eql({
          type: ACTION_TYPES.CLEAR_ALL,
        });
      });
    });

    describe('clearInput', () => {
      let output;
      let inputClearSpy;
      let storeDispatchStub;

      beforeEach(() => {
        inputClearSpy = spy(instance.input, 'clear');
        storeDispatchStub = stub();
        instance.store.dispatch = storeDispatchStub;
      });

      afterEach(() => {
        inputClearSpy.restore();
        instance.store.dispatch.reset();
      });

      it('returns instance', () => {
        output = instance.clearInput();
        expect(output).to.eql(instance);
      });

      describe('text element', () => {
        beforeEach(() => {
          instance.isSelectOneElement = false;
          instance.isTextElement = false;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(true);
        });
      });

      describe('select element with search enabled', () => {
        beforeEach(() => {
          instance.isSelectOneElement = true;
          instance.isTextElement = false;
          instance.config.searchEnabled = true;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(false);
        });

        it('resets search flag', () => {
          expect(instance.isSearching).to.equal(false);
        });

        it('dispatches activateChoices action', () => {
          expect(storeDispatchStub.called).to.equal(true);
          expect(storeDispatchStub.lastCall.args[0]).to.eql({
            type: ACTION_TYPES.ACTIVATE_CHOICES,
            active: true,
          });
        });
      });
    });

    describe('ajax', () => {
      const callbackResponse = 'worked';
      let output;
      let handleLoadingStateStub;
      let ajaxCallbackStub;

      const unhappyPath = () => {
        it('returns instance', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(handleLoadingStateStub.called).to.equal(false);
          expect(ajaxCallbackStub.called).to.equal(false);
        });
      };

      beforeEach(() => {
        handleLoadingStateStub = stub();
        ajaxCallbackStub = stub().returns(callbackResponse);

        instance._ajaxCallback = ajaxCallbackStub;
        instance._handleLoadingState = handleLoadingStateStub;
      });

      afterEach(() => {
        instance._ajaxCallback.reset();
        instance._handleLoadingState.reset();
      });

      describe('not initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.ajax(() => {});
        });

        unhappyPath();
      });

      describe('text element', () => {
        beforeEach(() => {
          instance.isSelectElement = false;
          output = instance.ajax(() => {});
        });

        unhappyPath();
      });

      describe('passing invalid function', () => {
        beforeEach(() => {
          output = instance.ajax(null);
        });

        unhappyPath();
      });

      describe('select element', () => {
        let callback;

        beforeEach(() => {
          instance.initialised = true;
          instance.isSelectElement = true;
          ajaxCallbackStub = stub();
          callback = stub();
          output = instance.ajax(callback);
        });

        it('sets loading state', () => {
          requestAnimationFrame(() => {
            expect(handleLoadingStateStub.called).to.equal(true);
          });
        });

        it('calls passed function with ajax callback', () => {
          expect(callback.called).to.equal(true);
          expect(callback.lastCall.args[0]).to.eql(callbackResponse);
        });

        it('returns instance', () => {
          expect(output).to.eql(instance);
        });
      });
    });

    describe('renderGroups', () => {});
    describe('renderChoices', () => {});
    describe('renderItems', () => {});
    describe('render', () => {});
    describe('removeItemsByValue', () => {});
    describe('removeActiveItems', () => {});
    describe('removeHighlightedItems', () => {});
    describe('getValue', () => {});
    describe('setValue', () => {});
    describe('setValueByChoice', () => {});
    describe('setChoices', () => {});
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
