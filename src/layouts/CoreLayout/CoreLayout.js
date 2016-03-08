import React, { PropTypes } from 'react'
import '../../styles/core.scss'

import WebFont from 'webfontloader'
WebFont.load({
  google: {
    families: ['Roboto:400,300,700:latin,vietnamese', 'Material Icons']
  }
})

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children, main, nav }) {
  if (nav && main) {
    return (
      <div>
        {nav}
        {main}
      </div>
    )
  }
  return (
    <div>
      {children}
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element,
  main: PropTypes.element,
  nav: PropTypes.element
}

export default CoreLayout
