import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import MovieCard from './MovieCard';
import Movie from 'models/Movie';

export default class MovieGrid extends Component {
  static propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape(Movie.propTypes)),
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func
  };

  static defaultProps = {
    movies: [],
    onScrollTop: () => {},
    onScrollBottom: () => {}
  };

  constructor (props) {
    super(props);
    this.state = {
      cardSize: 'm3'
    };
  }

  onScroll = () => {
    const { onScrollTop, onScrollBottom } = this.props;
    const $ = window.$;
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
      onScrollBottom();
    }
    if ($(window).scrollTop() === 0) {
      onScrollTop();
    }
  };

  onResize = () => {
    const $ = window.$;
    const ww = $(window).width();
    if (ww >= 1200) {
      this.setState({
        ...this.state,
        cardSize: 'm3'
      });
    } else if (ww > 900) {
      this.setState({
        ...this.state,
        cardSize: 'm4'
      });
    } else {
      this.setState({
        ...this.state,
        cardSize: 'm6'
      });
    }

    this.onScroll();
  };

  componentDidMount () {
    const $ = window.$;
    $(window).on('scroll', this.onScroll);
    $(window).on('resize', this.onResize);
    this.onResize();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount () {
    const $ = window.$;
    $(window).off('scroll', this.onScroll);
    $(window).off('resize', this.onResize);
  }

  render () {
    const { movies } = this.props;
    const { cardSize } = this.state;
    let cards;
    if (movies.length > 0) {
      cards = movies.map((movie, key) => {
        return (
          <div key={key} className={`col s12 ${cardSize}`}>
            <MovieCard
              movie={movie}
            />
          </div>
        );
      });
    }
    return (
      <div className='row movie-collection'>
        {cards}
      </div>
    );
  }
}
