import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Tooltip from 'react-tooltip'

import { actions as homeActions } from '../../redux/modules/home'
import classes from './HomeView.scss'

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView'

import MovieCollection from 'components/MovieCollection'
import Preloader from 'components/Preloader'
import TopNav from '../TopNav/TopNav'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  context: state.home,
  auth: state.auth
})
export class HomeView extends AuthenticatedView {
  static propTypes = {
    getHomeMovies: PropTypes.func,
    context: PropTypes.object,
    itemsPerPage: PropTypes.number
  };

  static defaultProps = {
    getHomeMovies: () => {},
    context: {},
    itemsPerPage: 20
  };

  componentDidMount () {
    const { getHomeMovies, context } = this.props
    if (context.movies.length === 0) {
      getHomeMovies()
    }
  }

  loadMore = () => {
    const { getHomeMovies } = this.props
    getHomeMovies()
  };

  render () {
    const { context } = this.props
    Tooltip.rebuild()
    return (
      <DocumentTitle title='Quickflix'>
        <div>
          <TopNav/>
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
          <Tooltip effect='solid' />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, homeActions)(HomeView)
