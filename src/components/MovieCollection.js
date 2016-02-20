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

  constructor (props) {
    super(props)
    this.state = {
      cardSize: 'm3'
    }
  }

  onScroll = () => {
    const { onScrollTop, onScrollBottom } = this.props
    const $ = window.$
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
      onScrollBottom()
    }
    if ($(window).scrollTop() === 0) {
      onScrollTop()
    }
  };

  onResize = () => {
    const $ = window.$
    const ww = $(window).width()
    if (ww >= 1200) {
      this.setState({
        ...this.state,
        cardSize: 'm3'
      })
    } else if (ww > 900) {
      this.setState({
        ...this.state,
        cardSize: 'm4'
      })
    } else {
      this.setState({
        ...this.state,
        cardSize: 'm6'
      })
    }

    this.onScroll()
  };

  componentDidMount () {
    const $ = window.$
    $(window).on('scroll', this.onScroll)
    $(window).on('resize', this.onResize)
    this.onResize()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount () {
    const $ = window.$
    $(window).off('scroll', this.onScroll)
    $(window).off('resize', this.onResize)
  }

  render () {
    const { movies } = this.props
    const { cardSize } = this.state
    let cards
    if (movies.length > 0) {
      cards = movies.map((item, key) => {
        const { id, plot, backdrop, name, bitrate, season, episode, sequence, imdbRating } = item
        return (
          <div key={key} className={`col s12 ${cardSize}`}>
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
