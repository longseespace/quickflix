import React, { PropTypes } from 'react'

export default class Image extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    speed: PropTypes.number,
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func
  };

  static defaultProps = {
    style: {},
    speed: 1,
    src: '',
    onLoad: () => {}
  };

  constructor () {
    super()
    this.state = {
      opacity: 0
    }
    this.onLoad = this.onLoad.bind(this)
  }

  onLoad () {
    this.setState({
      ...this.state,
      opacity: 1
    })
    const { onLoad } = this.props
    onLoad()
  }

  getClientWidth = () => {
    const img = this.refs.img
    return img.clientWidth
  }

  getClientHeight = () => {
    const img = this.refs.img
    return img.clientHeight
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
        ref='img'
        {...this.props}
        style={newStyle}
        onLoad={this.onLoad}
      />
    )
  }
}
