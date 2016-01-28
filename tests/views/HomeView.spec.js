import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import { HomeView } from 'views/HomeView/HomeView';

function shallowRender(component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps(props = {}) {
  return TestUtils.renderIntoDocument(<HomeView {...props} />);
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<HomeView {...props} />);
}

describe('(View) Home', () => {
  let _component;
  let _props;
  let _spies;

  beforeEach(() => {
    _spies = {};
    _props = {
      counter: 0,
      ...bindActionCreators({
        doubleAsync: (_spies.doubleAsync = sinon.spy()),
        increment: (_spies.increment = sinon.spy()),
      }, _spies.dispatch = sinon.spy()),
    };

    _component = shallowRenderWithProps(_props);
    renderWithProps(_props);
  });

  it('Should render as a <div>.', () => {
    expect(_component.type).to.equal('div');
  });
});
