import React, { PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import MovieCard from './MovieCard'

export default class MovieCollection extends React.Component {
  static propTypes = {
    movies: PropTypes.array,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func
  };

  static defaultProps = {
    movies: [],
    onScrollTop: () => {},
    onScrollBottom: () => {}
  };

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    const { onScrollTop, onScrollBottom } = this.props
    const windowScrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
    const windowHeight = window.outerHeight
    const documentHeight = document.body.clientHeight
    if (windowScrollTop + windowHeight === documentHeight) {
      onScrollBottom()
    }
    if (windowScrollTop === 0) {
      onScrollTop()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  render () {
    const { movies } = this.props
    let cards
    if (movies.length > 0) {
      cards = movies.map((item, key) => {
        const { id, plot, backdrop, name, bitrate, season, episode, sequence, imdbRating } = item
        return (
          <div key={key} className='col s12 m3'>
            <MovieCard
              bitrate={bitrate}
              id={id}
              plot={plot.vi}
              backdrop={backdrop}
              name={name.en}
              season={season}
              episode={episode}
              sequence={sequence}
              imdbRating={imdbRating}
            />
          </div>
        )
      })
    }
    return (
      <div className='row movie-collection'>
        {cards}
      </div>
    )
  }
}
