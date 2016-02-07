import React, { PropTypes } from 'react';
import truncate from 'lodash.truncate';

export default class SearchResultList extends React.Component {
  static propTypes = {
    plot: PropTypes.string,
    name: PropTypes.string.isRequired,
    backdrop: PropTypes.string,
  };

  render() {
    const { plot, backdrop, name } = this.props;
    const truncatedPlot = truncate(plot, {
      length: 200,
      separator: ' ',
    });
    return (
      <div className="card hoverable medium">
        <div className="card-image">
          <img src={backdrop} />
          <span className="card-title">{name}</span>
        </div>
        <div className="card-content">
          <p>{truncatedPlot}</p>
        </div>
        <div className="card-action">
          <a href="#">Detail Page</a><span className="activator" style={{ width: 48, height: 48, cursor: 'pointer' }}><i className="material-icons right">expand_less</i></span>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{name}<i className="material-icons right">close</i></span>
          <p>{plot}</p>
        </div>
      </div>
    );
  }
}
