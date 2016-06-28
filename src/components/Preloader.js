import React, { PropTypes } from 'react';

export default class Preloader extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    size: PropTypes.string,
    color: PropTypes.string,
    show: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    size: 'small',
    color: 'red',
    show: true
  };

  render () {
    const { size, color, show } = this.props;
    const display = show ? 'block' : 'none';
    const style = { display, ...this.props.style };
    return (
      <div
        className={`preloader-wrapper ${size} active`}
        style={style}
      >
        <div className={`spinner-layer spinner-${color}-only`}>
          <div className='circle-clipper left'>
            <div className='circle'></div>
          </div><div className='gap-patch'>
            <div className='circle'></div>
          </div><div className='circle-clipper right'>
            <div className='circle'></div>
          </div>
        </div>
      </div>
    );
  }
}
