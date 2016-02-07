import React, { PropTypes } from 'react';
import MovieCard from './MovieCard';

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
        const { plot, backdrop, name } = item;
        return (
          <div key={key} className="col s4 m3">
            <MovieCard plot={plot.vi} backdrop={backdrop} name={name.vi} />
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
