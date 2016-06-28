import React, { PropTypes } from 'react';
import '../../styles/core.scss';

import WebFont from 'webfontloader';
WebFont.load({
  google: {
    families: ['Roboto:400,300,700:latin,vietnamese', 'Material Icons']
  }
});

import Tooltip from 'react-tooltip';

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
  const isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  let tooltipNode;
  if (!isOnMobile) {
    tooltipNode = (<Tooltip effect='solid' />);
    Tooltip.rebuild();
  }
  if (nav && main) {
    return (
      <div>
        {nav}
        {main}
        {tooltipNode}
      </div>
    );
  }
  return (
    <div>
      {children}
      {tooltipNode}
    </div>
  );
}

CoreLayout.propTypes = {
  children: PropTypes.element,
  main: PropTypes.element,
  nav: PropTypes.element
};

export default CoreLayout;
