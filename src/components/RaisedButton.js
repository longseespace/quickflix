import React, { PropTypes } from 'react';

export default class RaisedButton extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    disabled: false
  };

  render () {
    const { children, className, disabled } = this.props;
    let newClassName = className;
    if (disabled) {
      newClassName = `${newClassName} disabled`;
    }
    return (
      <button {...this.props} className={`btn waves-effect waves-light ${newClassName}`}>{children}</button>
    );
  }
}
