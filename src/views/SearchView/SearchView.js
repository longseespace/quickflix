import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as topnavAction } from '../../redux/modules/topnav'
import { actions as searchActions } from '../../redux/modules/search'
import classes from '../HomeView/HomeView.scss'

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView'

import TopNav from '../TopNav/TopNav'
import Preloader from 'components/Preloader'
import MovieCollection from 'components/MovieCollection'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  topnav: state.topnav,
  context: state.search,
  router: state.router,
  auth: state.auth
})
export class SearchView extends AuthenticatedView {
  static propTypes = {
    searchMovies: PropTypes.func,
    invalidateSuggestions: PropTypes.func,
    context: PropTypes.object,
    topnav: PropTypes.object,
    params: PropTypes.object,
    itemsPerPage: PropTypes.number
  };

  static defaultProps = {
    searchMovies: () => {},
    invalidateSuggestions: () => {},
    context: {},
    topnav: {},
    params: { keyword: '' },
    itemsPerPage: 20
  };

  componentDidMount () {
    const { searchMovies, params, context } = this.props
    if (context.movies.length === 0) {
      searchMovies(params.keyword)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { searchMovies, params, context } = nextProps
    if (context.movies.length === 0 || params.keyword !== this.props.params.keyword) {
      searchMovies(params.keyword)
    }
  }

  loadMore = () => {
    const { searchMovies, params } = this.props
    searchMovies(params.keyword)
  };

  render () {
    const { context } = this.props
    if (context.error) {
      // TODO: handle error
    }
    return (
      <div>
        <TopNav />
        <div className={classes.content}>
          <MovieCollection
            movies={context.movies}
            onScrollBottom={this.loadMore}
          />
          <div className='valign-wrapper'>
            <div className={classes.preloader}>
              <Preloader show={context.isFetching} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, { ...topnavAction, ...searchActions })(SearchView)
