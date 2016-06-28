import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { Nav } from 'views/Nav/Nav'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()
  renderer.render(component)
  return renderer.getRenderOutput()
}

describe('(View) Nav', () => {
})
