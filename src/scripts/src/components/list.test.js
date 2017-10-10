import { expect } from 'chai';
import List from './list';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('List', () => {
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
    instance = new List(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  it('assigns choices instance to class', () => {
    expect(instance.instance).to.eql(choicesInstance);
  });

  it('assigns choices element to class', () => {
    expect(instance.element).to.eql(choicesElement);
  });

  it('assigns classnames to class', () => {
    expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
  });
});
