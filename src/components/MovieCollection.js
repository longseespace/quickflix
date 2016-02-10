import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
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
    const { onScrollTop, onScrollBottom } = this.props;
    const $ = window.$;
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        onScrollBottom();
      }
      if ($(window.scrollTop) === 0) {
        onScrollTop();
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const $ = window.$;
    $(window).off('scroll');
  }

  render() {
    const { movies } = this.props;
    let cards;
    if (movies.length > 0) {
      cards = movies.map((item, key) => {
        const { id, plot, backdrop, name } = item;
        return (
          <div key={key} className="col s12 m3">
            <MovieCard id={id} plot={plot.vi} backdrop={backdrop} name={name.vi} />
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
