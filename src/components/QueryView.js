import React, { Component, PropTypes } from 'react'
import isEqual from 'lodash.isequal'

import Query from 'models/Query'
import Movie from 'models/Movie'
import MovieGrid from 'components/MovieGrid'
import Preloader from 'components/Preloader'

import classes from './QueryView.scss'

export default class QueryView extends Component {
  static propTypes = {
    getMovies: PropTypes.func,
    clear: PropTypes.func,
    status: PropTypes.oneOf(['init', 'loading', 'loaded', 'fullyloaded', 'error']),
    query: PropTypes.shape(Query.propTypes),
    movies: PropTypes.arrayOf(PropTypes.shape(Movie.propTypes))
  };

  static defaultProps = {
    getMovies: () => {},
    clear: () => {},
    status: 'init',
    query: Query.defaultProps,
    movies: []
  };

  componentWillReceiveProps (nextProps) {
    const { getMovies, status, query, clear } = nextProps
    const currentQuery = this.props.query
    const sameType = query.type === currentQuery.type
    const sameKeyword = query.keyword === currentQuery.keyword
    const sameFilters = isEqual(query.filters, currentQuery.filters)

    if (!sameType || (query.type === 'keyword' && !sameKeyword) || (query.type === 'filter' && !sameFilters)) {
      clear()
    }
    if (status === 'init') {
      getMovies(query)
    }
  }

  componentDidMount () {
    const { clear } = this.props
    clear()
  }

  loadMore = () => {
    const { getMovies, status, query } = this.props
    if (status !== 'fullyloaded' && status !== 'loading') {
      if (status !== 'error') {
        getMovies({
          ...query,
          page: query.page + 1
        })
      } else {
        getMovies(query)
      }
    }
  };

  render () {
    const { status, movies } = this.props
    if (status === 'init') {
      return (
        <div></div>
      )
    }
    return (
      <div className={classes.content}>
        <MovieGrid
          movies={movies}
          onScrollBottom={this.loadMore}
        />
        <div className='valign-wrapper'>
          <div style={{ margin: '0 auto 20px auto' }}>
            <Preloader show={status === 'loading'} />
          </div>
        </div>
      </div>
    )
  }
}
