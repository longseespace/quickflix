import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Tooltip from 'react-tooltip'

import { actions as favoriteActions } from '../../redux/modules/favorite'
import classes from './FavoriteView.scss'

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView'

import MovieGrid from 'components/MovieGrid'
import Preloader from 'components/Preloader'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  context: state.favorite,
  auth: state.auth
})
export class FavoriteView extends AuthenticatedView {
  static propTypes = {
    getMovies: PropTypes.func,
    context: PropTypes.object,
    itemsPerPage: PropTypes.number
  };

  static defaultProps = {
    getMovies: () => {},
    context: {},
    itemsPerPage: 20
  };

  componentDidMount () {
    const { getMovies, context } = this.props
    if (context.movies.length === 0) {
      getMovies()
    }
  }

  loadMore = () => {
    const { getMovies, context } = this.props
    if (context.status !== 'fullyloaded') {
      getMovies()
    }
  };

  render () {
    const { context } = this.props
    const isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    let tooltipNode
    if (!isOnMobile) {
      tooltipNode = (<Tooltip effect='solid' />)
      Tooltip.rebuild()
    }

    const notfound = (context.movies.length === 0) && (context.status !== 'loading')
    const messageNode = notfound ? (
      <div>Không có phim nào</div>
    ) : null

    return (
      <DocumentTitle title='Quickflix'>
        <div>
          <div className={classes.content}>
            <MovieGrid
              movies={context.movies}
              onScrollBottom={this.loadMore}
            />
            <div className='valign-wrapper'>
              <div className={classes.preloader}>
                <Preloader show={context.status === 'loading'} />
              </div>
            </div>
            <div className='valign-wrapper'>
              <div className={classes.preloader}>
                {messageNode}
              </div>
            </div>
          </div>
          {tooltipNode}
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, favoriteActions)(FavoriteView)
