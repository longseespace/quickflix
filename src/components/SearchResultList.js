import React, { PropTypes } from 'react';
import truncate from 'lodash.truncate';

export default class SearchResultList extends React.Component {
  static propTypes = {
    searchResults: PropTypes.array,
  };

  static defaultProps = {
    searchResults: [],
  };

  render() {
    const { searchResults } = this.props;
    let items;
    if (searchResults.length > 0) {
      items = searchResults.map((item, key) => {
        const plot = truncate(item.plot.vi, {
          length: 200,
          separator: ' ',
        });
        return (
          <div key={key} className="col s3 m3">
            <div className="card hoverable medium">
              <div className="card-image">
                <img src={item.backdrop} />
                <span className="card-title">{item.name}</span>
              </div>
              <div className="card-content">
                <p>{plot}</p>
              </div>
              <div className="card-action">
                <a href="#">Detail Page</a><span className="activator" style={{ width: 48, height: 48, cursor: 'pointer' }}><i className="material-icons right">expand_less</i></span>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{item.name}<i className="material-icons right">close</i></span>
                <p>{item.plot.vi}</p>
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="row">
        {items}
      </div>
    );
  }
}
