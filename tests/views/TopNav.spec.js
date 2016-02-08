import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { TopNav } from 'views/TopNav/TopNav';

function shallowRender(component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps(props = {}) {
  return TestUtils.renderIntoDocument(<TopNav {...props} />);
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<TopNav {...props} />);
}

describe('(View) TopNav', () => {
  let _component;

  beforeEach(() => {
    _component = shallowRenderWithProps();
    renderWithProps({});
  });

  it('Should render as a <div>.', () => {
    expect(_component.type).to.equal('div');
  });
});
