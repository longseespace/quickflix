import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as tagActions } from '../../redux/modules/tag'
import classes from './TagView.scss'

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
  globalState: state,
  auth: state.auth
})
export class TagView extends AuthenticatedView {
  static propTypes = {
    getMoviesByTag: PropTypes.func,
    itemsPerPage: PropTypes.number,
    globalState: PropTypes.object
  };

  static defaultProps = {
    getMoviesByTag: (tag: String) => {},
    globalState: {},
    itemsPerPage: 20
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount () {
    super.componentWillMount()
    this.redirectIfNotFound(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfNotFound(nextProps)

    const { getMoviesByTag, params, globalState } = this.props
    const context = globalState[`tag:${params.tag}`]
    if ((context && context.movies.length === 0) || params.tag !== this.props.params.tag) {
      getMoviesByTag(params.tag)
    }
  }

  redirectIfNotFound = (props) => {
    const { globalState, params } = props
    const context = globalState[`tag:${params.tag}`]
    if (!context) {
      this.context.router.push('/404')
    }
  };

  componentDidMount () {
    const { getMoviesByTag, params, globalState } = this.props
    const context = globalState[`tag:${params.tag}`]
    if (context && context.movies.length === 0) {
      getMoviesByTag(params.tag)
    }
  }

  loadMore = () => {
    const { getMoviesByTag, params } = this.props
    getMoviesByTag(params.tag)
  };

  render () {
    const { params, globalState } = this.props
    const context = globalState[`tag:${params.tag}`]
    if (!context) {
      return (
        <div></div>
      )
    }
    return (
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
      </div>
    )
  }
}

export default connect(mapStateToProps, tagActions)(TagView)
