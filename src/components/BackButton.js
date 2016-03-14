import React, { Component, PropTypes } from 'react'

export default class BackButton extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  onClick = (e) => {
    e.preventDefault()
    const { goBack, disabled } = this.props
    if (!disabled) {
      goBack()
    }
  }

  render () {
    const { disabled } = this.props
    return (
      <a
        style={{
          cursor: disabled ? 'default' : 'pointer',
          color: disabled ? '#bdbdbd' : 'auto'
        }}
        onClick={this.onClick}>
        <i className='material-icons'>chevron_left</i>
      </a>
    )
  }
}
