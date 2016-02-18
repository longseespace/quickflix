import React, { PropTypes } from 'react'

export default class Image extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    speed: PropTypes.number,
    src: PropTypes.string.isRequired
  };

  static defaultProps = {
    style: {},
    speed: 1,
    src: ''
  };

  constructor () {
    super()
    this.state = {
      opacity: 0
    }
    this.fadeIn = this.fadeIn.bind(this)
  }

  fadeIn () {
    this.setState({ opacity: 1 })
  }

  render () {
    const { style, speed } = this.props
    const newStyle = {
      ...style,
      transition: `opacity ${speed}s`,
      opacity: this.state.opacity
    }
    return (
      <img
        {...this.props}
        style={newStyle}
        onLoad={this.fadeIn}
      />
    )
  }
}
