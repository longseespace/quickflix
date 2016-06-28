import React, { Component, PropTypes } from 'react';

export default class ForwardButton extends Component {
  static propTypes = {
    goForward: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  onClick = (e) => {
    e.preventDefault();
    const { goForward, disabled } = this.props;
    if (!disabled) {
      goForward();
    }
  }

  render () {
    const { disabled } = this.props;
    return (
      <a
        style={{
          cursor: disabled ? 'default' : 'pointer',
          color: disabled ? '#bdbdbd' : 'auto'
        }}
        onClick={this.onClick}>
        <i className='material-icons'>chevron_right</i>
      </a>
    );
  }
}
