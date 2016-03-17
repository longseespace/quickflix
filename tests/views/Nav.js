import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { Nav } from 'views/Nav/Nav'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()
  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<Nav {...props} />)
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<Nav {...props} />)
}

describe('(View) Nav', () => {
})
