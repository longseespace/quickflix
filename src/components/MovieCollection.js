import React, { PropTypes } from 'react';
import MovieCard from './MovieCard';

export default class MovieCollection extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    page: PropTypes.number,
    limit: PropTypes.number,
    fetch: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    page: 1,
    limit: 20,
    fetch: () => {},
  };

  componentDidMount() {
    const $ = window.$;
    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        console.log('bottom');
      }
    });
  }

  render() {
    const { items } = this.props;
    let cards;
    if (items.length > 0) {
      cards = items.map((item, key) => {
        const { plot, backdrop, name } = item;
        return (
          <div key={key} className="col s4 m3">
            <MovieCard plot={plot.vi} backdrop={backdrop} name={name.vi} />
          </div>
        );
      });
    }
    return (
      <div className="row movie-collection">
        {cards}
      </div>
    );
  }
}
