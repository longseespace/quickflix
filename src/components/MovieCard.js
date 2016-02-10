import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import truncate from 'lodash.truncate';
import LazyLoad from 'react-lazy-load';
import Image from './Image';

export default class MovieCard extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    plot: PropTypes.string,
    backdrop: PropTypes.string,
    lazyload: PropTypes.bool,
  };

  static defaultProps = {
    id: 0,
    name: '',
    lazyload: true,
  };

  componentDidMount() {
    // const $ = window.jQuery;
    // $('.tooltipped').tooltip({ delay: 50 });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { plot, backdrop, name } = this.props;
    const truncatedPlot = truncate(plot, {
      length: 200,
      separator: ' ',
    });
    return (
      <div className="card hoverable medium">
        <div className="card-image">
          <LazyLoad height={189}>
            <Image src={backdrop} />
          </LazyLoad>
          <span className="card-title">{name}</span>
        </div>
        <div className="card-content">
          <p>{truncatedPlot}</p>
        </div>
        <div className="card-action">
          <a href="#">Detail Page</a>
          <span className="activator" style={{ width: 48, height: 48, cursor: 'pointer' }}>
            <i className="material-icons right tooltipped" data-position="top" data-tooltip="Show full plot">expand_less</i>
          </span>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{name}<i className="material-icons right">close</i></span>
          <p>{plot}</p>
        </div>
      </div>
    );
  }
}
