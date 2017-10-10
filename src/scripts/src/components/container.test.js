import { expect } from 'chai';
import Container from './container';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('Container', () => {
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
