import React, { PropTypes } from 'react';
import MovieCard from './MovieCard';

export default class MovieCollection extends React.Component {
  static propTypes = {
    movies: PropTypes.array,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func,
  };

  static defaultProps = {
    movies: [],
    onScrollTop: () => {},
    onScrollBottom: () => {},
  };

  componentDidMount() {
    const $ = window.$;
    const { onScrollTop, onScrollBottom } = this.props;
    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        onScrollBottom();
      }
      if ($(window.scrollTop) === 0) {
        onScrollTop();
      }
    });
  }

  render() {
    const { movies } = this.props;
    let cards;
    if (movies.length > 0) {
      cards = movies.map((item, key) => {
        const { plot, backdrop, name } = item;
        return (
          <div key={key} className="col s12 m3">
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
