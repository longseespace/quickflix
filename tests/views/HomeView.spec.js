import React from 'react';
import TestUtils from 'react-addons-test-utils';
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
  // let _component;
  //
  // beforeEach(() => {
  //   _component = shallowRenderWithProps();
  //   renderWithProps({});
  // });
  //
  // it('Should render as a <div>.', () => {
  //   expect(_component.type).to.equal('div');
  // });
});
